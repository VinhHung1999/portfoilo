import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const SETTINGS_PATH = path.join(process.cwd(), "content", "settings.json");

interface GitHubSettings {
  username: string;
  token: string;
}

interface Settings {
  github: GitHubSettings;
}

const DEFAULT_SETTINGS: Settings = {
  github: { username: "", token: "" },
};

function checkAuth(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const cookieToken = request.cookies.get("admin_token")?.value;
  if (cookieToken === adminPassword) return true;

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ") && authHeader.slice(7) === adminPassword)
    return true;

  return false;
}

/** Read settings from local JSON file */
async function readSettings(): Promise<Settings> {
  try {
    const content = await readFile(SETTINGS_PATH, "utf-8");
    const data = JSON.parse(content);
    return { ...DEFAULT_SETTINGS, ...data };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await readSettings();
  // Mask token for security — only return last 4 chars
  const masked = {
    ...settings.github,
    token: settings.github.token
      ? "ghp_" + "*".repeat(16) + settings.github.token.slice(-4)
      : "",
  };
  return NextResponse.json(masked);
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Partial<GitHubSettings>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const existing = await readSettings();

  // Only update token if a new, non-masked value is provided
  const newToken =
    body.token && !body.token.includes("*")
      ? body.token
      : existing.github.token;

  const updated: Settings = {
    ...existing,
    github: {
      username: body.username ?? existing.github.username,
      token: newToken,
    },
  };

  const json = JSON.stringify(updated, null, 2);
  await writeFile(SETTINGS_PATH, json, "utf-8");

  // Return masked token
  const masked = {
    ...updated.github,
    token: updated.github.token
      ? "ghp_" + "*".repeat(16) + updated.github.token.slice(-4)
      : "",
  };
  return NextResponse.json(masked);
}
