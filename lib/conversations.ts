import { readFile, writeFile, readdir, unlink, mkdir } from "fs/promises";
import path from "path";

// --- Types ---

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string; // ISO string
}

export interface Conversation {
  id: string;
  messages: ConversationMessage[];
  startedAt: string;
  lastMessageAt: string;
  transcriptSent: boolean;
}

export interface ConversationSummary {
  id: string;
  preview: string; // first user message
  messageCount: number;
  startedAt: string;
  lastMessageAt: string;
  durationMinutes: number;
  transcriptSent: boolean;
}

export interface ConversationStats {
  total: number;
  today: number;
  avgMessages: number;
  avgDurationMinutes: number;
}

// --- Storage ---

const CONVERSATIONS_DIR = path.join(process.cwd(), "content", "conversations");

async function ensureDir() {
  await mkdir(CONVERSATIONS_DIR, { recursive: true });
}

function filePath(id: string): string {
  // Sanitize id to prevent path traversal
  const safe = id.replace(/[^a-zA-Z0-9\-]/g, "");
  return path.join(CONVERSATIONS_DIR, `${safe}.json`);
}

// --- CRUD ---

export async function saveConversation(
  id: string,
  messages: ConversationMessage[]
): Promise<Conversation> {
  await ensureDir();

  let existing: Conversation | null = null;
  try {
    existing = await getConversation(id);
  } catch {
    // new conversation
  }

  const now = new Date().toISOString();
  const conversation: Conversation = {
    id,
    messages,
    startedAt: existing?.startedAt ?? messages[0]?.timestamp ?? now,
    lastMessageAt: messages[messages.length - 1]?.timestamp ?? now,
    transcriptSent: existing?.transcriptSent ?? false,
  };

  await writeFile(filePath(id), JSON.stringify(conversation, null, 2), "utf-8");
  return conversation;
}

export async function getConversation(id: string): Promise<Conversation> {
  const content = await readFile(filePath(id), "utf-8");
  return JSON.parse(content);
}

export async function listConversations(): Promise<ConversationSummary[]> {
  await ensureDir();

  const files = await readdir(CONVERSATIONS_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  const summaries: ConversationSummary[] = [];

  for (const file of jsonFiles) {
    try {
      const content = await readFile(
        path.join(CONVERSATIONS_DIR, file),
        "utf-8"
      );
      const conv: Conversation = JSON.parse(content);
      const firstUserMsg = conv.messages.find((m) => m.role === "user");
      const start = new Date(conv.startedAt).getTime();
      const end = new Date(conv.lastMessageAt).getTime();
      const durationMinutes = Math.round((end - start) / 60000);

      summaries.push({
        id: conv.id,
        preview: firstUserMsg?.content ?? "(no messages)",
        messageCount: conv.messages.length,
        startedAt: conv.startedAt,
        lastMessageAt: conv.lastMessageAt,
        durationMinutes: Math.max(0, durationMinutes),
        transcriptSent: conv.transcriptSent,
      });
    } catch {
      // skip corrupt files
    }
  }

  // Sort newest first
  summaries.sort(
    (a, b) =>
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );

  return summaries;
}

export async function getConversationStats(): Promise<ConversationStats> {
  const summaries = await listConversations();

  if (summaries.length === 0) {
    return { total: 0, today: 0, avgMessages: 0, avgDurationMinutes: 0 };
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const today = summaries.filter(
    (s) => new Date(s.startedAt).getTime() >= todayStart.getTime()
  ).length;

  const totalMessages = summaries.reduce((sum, s) => sum + s.messageCount, 0);
  const totalDuration = summaries.reduce(
    (sum, s) => sum + s.durationMinutes,
    0
  );

  return {
    total: summaries.length,
    today,
    avgMessages: Math.round(totalMessages / summaries.length),
    avgDurationMinutes: Math.round(totalDuration / summaries.length),
  };
}

export async function deleteConversation(id: string): Promise<void> {
  await unlink(filePath(id));
}

export async function cleanupOldConversations(
  maxAgeDays: number = 30
): Promise<number> {
  const summaries = await listConversations();
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
  let deleted = 0;

  for (const s of summaries) {
    if (new Date(s.startedAt).getTime() < cutoff) {
      try {
        await deleteConversation(s.id);
        deleted++;
      } catch {
        // skip
      }
    }
  }

  return deleted;
}
