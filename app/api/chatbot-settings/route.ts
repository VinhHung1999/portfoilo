import { NextResponse } from "next/server";
import { readChatbotSettings } from "@/app/api/admin/chatbot-context/route";

export const dynamic = "force-dynamic";

/** Public endpoint — returns only greeting + suggestedQuestions (no custom instructions) */
export async function GET() {
  const settings = await readChatbotSettings();
  return NextResponse.json({
    greeting: settings.greeting,
    suggestedQuestions: settings.suggestedQuestions,
  });
}
