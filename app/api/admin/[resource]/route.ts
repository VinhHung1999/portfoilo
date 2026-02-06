import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { put, list } from "@vercel/blob";
import path from "path";

const VALID_RESOURCES = [
  "personal",
  "experience",
  "projects",
  "skills",
  "achievements",
] as const;

type Resource = (typeof VALID_RESOURCES)[number];

function isValidResource(resource: string): resource is Resource {
  return VALID_RESOURCES.includes(resource as Resource);
}

function getBlobKey(resource: Resource): string {
  return `content/${resource}.json`;
}

function getLocalPath(resource: Resource): string {
  return path.join(process.cwd(), "content", `${resource}.json`);
}

function checkAuth(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  // Check httpOnly cookie first, then Bearer token fallback
  const cookieToken = request.cookies.get("admin_token")?.value;
  if (cookieToken === adminPassword) return true;

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ") && authHeader.slice(7) === adminPassword) return true;

  return false;
}

/** Read resource data: Blob first, fallback to local JSON file */
async function readResource(resource: Resource): Promise<unknown> {
  // Try Vercel Blob first
  try {
    const blobKey = getBlobKey(resource);
    const { blobs } = await list({ prefix: blobKey });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url);
      if (res.ok) {
        return await res.json();
      }
    }
  } catch {
    // Blob not available (e.g. local dev without token), fall through
  }

  // Fallback to local filesystem
  const filePath = getLocalPath(resource);
  const content = await readFile(filePath, "utf-8");
  return JSON.parse(content);
}

/** Write resource data to Vercel Blob */
async function writeResource(resource: Resource, data: unknown): Promise<void> {
  const blobKey = getBlobKey(resource);
  const json = JSON.stringify(data, null, 2);
  await put(blobKey, json, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;

  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isValidResource(resource)) {
    return NextResponse.json(
      { error: `Invalid resource: ${resource}. Valid: ${VALID_RESOURCES.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const data = await readResource(resource);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to read content" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;

  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isValidResource(resource)) {
    return NextResponse.json(
      { error: `Invalid resource: ${resource}. Valid: ${VALID_RESOURCES.join(", ")}` },
      { status: 400 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  try {
    // Read existing content (from Blob or local fallback)
    const existingData = await readResource(resource);

    // For array resources, replace the entire array
    // For object resources (personal), merge fields
    let updated;
    if (Array.isArray(existingData)) {
      if (!Array.isArray(body)) {
        return NextResponse.json(
          { error: "Expected array body for this resource" },
          { status: 400 }
        );
      }
      updated = body;
    } else {
      updated = { ...existingData as Record<string, unknown>, ...body };
    }

    // Write to Vercel Blob (works on serverless)
    await writeResource(resource, updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}
