import { NextRequest, NextResponse } from "next/server";
import {
  listConversations,
  getConversationStats,
  cleanupOldConversations,
} from "@/lib/conversations";

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

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [conversations, stats] = await Promise.all([
      listConversations(),
      getConversationStats(),
    ]);

    // Lazy cleanup: remove conversations older than 30 days
    cleanupOldConversations(30).catch(() => {});

    return NextResponse.json({ conversations, stats });
  } catch (err) {
    console.error("[admin/conversations] List error:", err);
    return NextResponse.json(
      { error: "Failed to list conversations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { action?: string; maxAgeDays?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.action === "cleanup") {
    try {
      const deleted = await cleanupOldConversations(body.maxAgeDays ?? 30);
      return NextResponse.json({ success: true, deleted });
    } catch (err) {
      console.error("[admin/conversations] Cleanup error:", err);
      return NextResponse.json(
        { error: "Failed to cleanup" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
