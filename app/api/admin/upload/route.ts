import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

function checkAuth(request: NextRequest): boolean {
  // Check cookie first (production), then Bearer token (fallback)
  const cookieToken = request.cookies.get("admin_token")?.value;
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const token = cookieToken || bearerToken;
  const adminPassword = process.env.ADMIN_PASSWORD;

  return !!token && !!adminPassword && token === adminPassword;
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";
  if (!ALLOWED_TYPES.some((t) => contentType.startsWith(t))) {
    return NextResponse.json(
      { error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}` },
      { status: 400 }
    );
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large. Max 5MB." },
      { status: 400 }
    );
  }

  const filename = request.nextUrl.searchParams.get("filename");
  if (!filename) {
    return NextResponse.json(
      { error: "Missing filename query parameter" },
      { status: 400 }
    );
  }

  try {
    const body = request.body;
    if (!body) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }

    const blob = await put(`portfolio/${filename}`, body, {
      access: "public",
      contentType,
    });

    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
