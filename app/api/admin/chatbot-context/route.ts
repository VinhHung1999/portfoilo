import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { put, list } from "@vercel/blob";
import path from "path";

const BLOB_KEY = "chatbot/settings.json";
const LOCAL_PATH = path.join(process.cwd(), "content", "chatbot.json");

interface ChatbotSettings {
  customInstructions: string;
  suggestedTopics: string[];
  greeting: string;
  suggestedQuestions: string[];
}

const DEFAULT_SETTINGS: ChatbotSettings = {
  customInstructions: "",
  suggestedTopics: [],
  greeting: "Hi! I'm Hung's AI assistant. Ask me about his skills, projects, or experience.",
  suggestedQuestions: [
    "What are your main skills?",
    "Tell me about your experience",
    "Show me your projects",
  ],
};

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

/** Read chatbot settings: Blob first → local file fallback → hardcoded defaults */
export async function readChatbotSettings(): Promise<ChatbotSettings> {
  // Try Vercel Blob first
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        return { ...DEFAULT_SETTINGS, ...data };
      }
    }
  } catch {
    // Blob not available (e.g. local dev without token), fall through
  }

  // Fallback to local filesystem
  try {
    const content = await readFile(LOCAL_PATH, "utf-8");
    const data = JSON.parse(content);
    return { ...DEFAULT_SETTINGS, ...data };
  } catch {
    // Local file not available
  }

  return DEFAULT_SETTINGS;
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await readChatbotSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Partial<ChatbotSettings>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Read existing, merge updates
  const existing = await readChatbotSettings();
  const updated: ChatbotSettings = { ...existing, ...body };

  // Validate
  if (updated.customInstructions.length > 2000) {
    return NextResponse.json(
      { error: "customInstructions exceeds 2000 characters" },
      { status: 400 }
    );
  }
  if (updated.suggestedTopics.length > 10) {
    return NextResponse.json(
      { error: "suggestedTopics exceeds 10 items" },
      { status: 400 }
    );
  }
  if (updated.suggestedQuestions.length > 5) {
    return NextResponse.json(
      { error: "suggestedQuestions exceeds 5 items" },
      { status: 400 }
    );
  }

  const json = JSON.stringify(updated, null, 2);

  // Write to Blob (overwrite directly — no delete-then-put to avoid consistency gaps)
  await put(BLOB_KEY, json, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  return NextResponse.json(updated);
}
