import { NextRequest, NextResponse } from "next/server";
import { saveConversation } from "@/lib/conversations";
import type { ConversationMessage } from "@/lib/conversations";
import { rateLimit, tooManyRequests, readJsonBody, MINUTE, DAY } from "@/lib/rateLimit";

// Each call writes a file to disk: cap per visitor and globally
const SAVE_LIMITS = [
  { limit: 30, windowMs: MINUTE },
  { limit: 3000, windowMs: DAY, global: true },
];

export async function POST(request: NextRequest) {
  if (!rateLimit(request, "conversations", SAVE_LIMITS)) return tooManyRequests();

  const body = await readJsonBody<{ conversationId?: string; messages?: ConversationMessage[] }>(
    request,
    300 * 1024
  );
  if (!body) {
    return NextResponse.json({ error: "Invalid or too large request" }, { status: 400 });
  }

  const { conversationId, messages } = body;

  if (!conversationId || !messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "conversationId and messages[] required" },
      { status: 400 }
    );
  }

  // Validate UUID-like format
  if (!/^[a-zA-Z0-9\-]{8,64}$/.test(conversationId)) {
    return NextResponse.json(
      { error: "Invalid conversationId format" },
      { status: 400 }
    );
  }

  try {
    // Store only known fields with bounded sizes; never trust client timestamps
    const now = new Date().toISOString();
    const clean: ConversationMessage[] = messages.slice(-60).map((m) => ({
      role: m?.role === "assistant" ? "assistant" : "user",
      content: String(m?.content ?? "").slice(0, 4000),
      timestamp: typeof m?.timestamp === "string" && m.timestamp.length <= 40 && !isNaN(Date.parse(m.timestamp)) && Date.parse(m.timestamp) <= Date.now() + 60_000 ? m.timestamp : now,
    }));
    const conversation = await saveConversation(conversationId, clean);
    return NextResponse.json({ success: true, id: conversation.id });
  } catch (err) {
    console.error("[conversations] Save error:", err);
    return NextResponse.json(
      { error: "Failed to save conversation" },
      { status: 500 }
    );
  }
}
