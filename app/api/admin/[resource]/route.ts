import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
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

/** Read resource data from local JSON file */
async function readResource(resource: Resource): Promise<unknown> {
  const filePath = getLocalPath(resource);
  const content = await readFile(filePath, "utf-8");
  return JSON.parse(content);
}

/** Write resource data to local JSON file */
async function writeResource(resource: Resource, data: unknown): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  await writeFile(getLocalPath(resource), json, "utf-8");
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
    const existingData = await readResource(resource);

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

    await writeResource(resource, updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}
