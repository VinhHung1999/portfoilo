import { NextRequest, NextResponse } from "next/server";
import { getConversation, deleteConversation } from "@/lib/conversations";

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const conversation = await getConversation(id);
    return NextResponse.json(conversation);
  } catch {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await deleteConversation(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }
}
