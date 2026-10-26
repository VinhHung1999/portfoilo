import { NextRequest } from "next/server";

// In-memory fixed-window limiter. Prod runs as a single PM2 fork process,
// so a process-local Map is enough; counters reset on restart.

interface Window {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Window>();
const MAX_BUCKETS = 50_000; // hard ceiling so rotating IPs can't exhaust memory

function allowed(key: string, limit: number, now: number): boolean {
  const w = buckets.get(key);
  if (!w || now >= w.resetAt) return w !== undefined || buckets.size < MAX_BUCKETS;
  return w.count < limit;
}

function record(key: string, windowMs: number, now: number): void {
  const w = buckets.get(key);
  if (!w || now >= w.resetAt) buckets.set(key, { count: 1, resetAt: now + windowMs });
  else w.count++;
}

// Drop expired windows so the map can't grow without bound
setInterval(() => {
  const now = Date.now();
  for (const [key, w] of buckets) if (now >= w.resetAt) buckets.delete(key);
}, 10 * 60 * 1000).unref?.();

export function clientIp(request: NextRequest): string {
  // Traffic arrives through the Cloudflare tunnel, which sets cf-connecting-ip
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";
  // One IPv6 client usually owns a whole /64, so bucket by that prefix
  return ip.includes(":") ? ip.split(":").slice(0, 4).join(":") + "::/64" : ip;
}

export interface Rule {
  limit: number;
  windowMs: number;
  global?: boolean; // one shared bucket for all clients (cost ceiling)
}

/** Returns true when the request is allowed under every rule. */
export function rateLimit(request: NextRequest, scope: string, rules: Rule[]): boolean {
  const ip = clientIp(request);
  const now = Date.now();
  // Check every rule before counting, so a rejected request neither uses up
  // the global budget nor creates new per-IP entries
  const keys = rules.map((r, i) => `${scope}:${i}:${r.global ? "*" : ip}`);
  if (!rules.every((r, i) => allowed(keys[i], r.limit, now))) return false;
  rules.forEach((r, i) => record(keys[i], r.windowMs, now));
  return true;
}

export const MINUTE = 60 * 1000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export function tooManyRequests(): Response {
  return new Response(
    JSON.stringify({ error: "Too many requests. Please try again later." }),
    { status: 429, headers: { "Content-Type": "application/json" } }
  );
}

/**
 * Read a JSON body with a hard byte cap. Content-Length alone can be skipped
 * with chunked encoding, so count bytes while streaming. Returns null when the
 * body is too large or not valid JSON.
 */
export async function readJsonBody<T>(request: NextRequest, maxBytes: number): Promise<T | null> {
  if (Number(request.headers.get("content-length") ?? 0) > maxBytes) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf-8")) as T;
  } catch {
    return null;
  }
}
