import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { getConversation } from "@/lib/conversations";
import { sendTranscriptEmail } from "@/lib/email";
import { rateLimit, tooManyRequests, readJsonBody, HOUR, DAY } from "@/lib/rateLimit";

// Each call can email Boss: keep it from being used to spam the inbox
const TRANSCRIPT_LIMITS = [
  { limit: 3, windowMs: HOUR },
  { limit: 50, windowMs: DAY, global: true },
];

export async function POST(request: NextRequest) {
  if (!rateLimit(request, "transcript", TRANSCRIPT_LIMITS)) return tooManyRequests();

  const body = await readJsonBody<{ conversationId?: string }>(request, 4 * 1024);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { conversationId } = body;

  if (!conversationId) {
    return NextResponse.json(
      { error: "conversationId required" },
      { status: 400 }
    );
  }

  try {
    const conversation = await getConversation(conversationId);

    if (conversation.transcriptSent) {
      return NextResponse.json({ success: true, alreadySent: true });
    }

    if (!conversation.messages.some((m) => m.role === "user")) {
      return NextResponse.json({ success: true, skipped: "no user messages" });
    }

    const sent = await sendTranscriptEmail(conversation);

    if (sent) {
      // Mark as sent directly on file
      const safe = conversationId.replace(/[^a-zA-Z0-9\-]/g, "");
      const filePath = path.join(
        process.cwd(), "content", "conversations", `${safe}.json`
      );
      const data = JSON.parse(await readFile(filePath, "utf-8"));
      data.transcriptSent = true;
      await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true, emailSent: sent });
  } catch (err) {
    console.error("[send-transcript] Error:", err);
    return NextResponse.json(
      { error: "Failed to send transcript" },
      { status: 500 }
    );
  }
}
