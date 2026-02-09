import { NextRequest, NextResponse } from "next/server";
import { put, del, list } from "@vercel/blob";

const BLOB_KEY = "chatbot/custom-context.txt";

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

/** Read custom context from Vercel Blob, fallback to empty string */
async function readCustomContext(): Promise<string> {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url, { cache: "no-store" });
      if (res.ok) return await res.text();
    }
  } catch {
    // Blob not available
  }
  return "";
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const context = await readCustomContext();
  return NextResponse.json({ context });
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { context: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.context !== "string") {
    return NextResponse.json(
      { error: "context must be a string" },
      { status: 400 }
    );
  }

  try {
    // Delete existing blob(s)
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length > 0) {
      await del(blobs.map((b) => b.url));
    }
  } catch {
    // Ignore delete errors
  }

  await put(BLOB_KEY, body.context, {
    access: "public",
    contentType: "text/plain; charset=utf-8",
    addRandomSuffix: false,
  });

  return NextResponse.json({ success: true });
}
