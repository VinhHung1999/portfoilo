import { NextRequest, NextResponse } from "next/server";
import { saveConversation } from "@/lib/conversations";
import type { ConversationMessage } from "@/lib/conversations";

export async function POST(request: NextRequest) {
  let body: { conversationId?: string; messages?: ConversationMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
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
    const conversation = await saveConversation(conversationId, messages);
    return NextResponse.json({ success: true, id: conversation.id });
  } catch (err) {
    console.error("[conversations] Save error:", err);
    return NextResponse.json(
      { error: "Failed to save conversation" },
      { status: 500 }
    );
  }
}
