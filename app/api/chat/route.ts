import { NextRequest } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { getPortfolioContent } from "@/lib/content";
import { readChatbotSettings } from "@/app/api/admin/chatbot-context/route";
import { rateLimit, tooManyRequests, readJsonBody, MINUTE, DAY } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

async function buildSystemPrompt(): Promise<string> {
  const { personal, experience, projects, skills, achievements } =
    await getPortfolioContent();

  const skillsText = skills
    .map((cat) => `${cat.category}: ${cat.skills.join(", ")}`)
    .join("\n");

  const experienceText = experience
    .map(
      (exp) =>
        `${exp.role} at ${exp.company} (${exp.startDate} – ${exp.endDate ?? "Present"})\n` +
        `  Achievements: ${exp.achievements.join("; ")}\n` +
        `  Tech: ${exp.techStack.join(", ")}`
    )
    .join("\n\n");

  // Feed every project field the page shows, so the bot can answer in depth
  const projectsText = projects
    .map((p) =>
      [
        `${p.title}: ${p.shortDescription}`,
        p.role && `  Role: ${p.role}${p.period ? ` (${p.period})` : ""}`,
        p.fullDescription && `  Details: ${p.fullDescription}`,
        `  Tech: ${p.techStack.join(", ")}`,
        p.features.length > 0 && `  Features: ${p.features.join("; ")}`,
        p.stats?.length &&
          `  Stats: ${p.stats.map((s) => `${s.value}${s.plus ? "+" : ""} ${s.label}`).join("; ")}`,
        p.highlights?.length &&
          `  Highlights:\n${p.highlights.map((h) => `    - ${h.title}: ${h.body}`).join("\n")}`,
        p.workflow &&
          `  How it was built: ${p.workflow.title} ${p.workflow.steps
            .map((s) => `${s.title}: ${s.body}${s.tags?.length ? ` (${s.tags.join(", ")})` : ""}`)
            .join(" | ")}`,
        p.liveUrl && `  Link: ${p.liveUrl}`,
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n\n");

  const achievementsText = achievements
    .map((a) => `${a.title} (${a.date}): ${a.description}`)
    .join("\n");

  const chatbotSettings = await readChatbotSettings();

  const topicsLine = chatbotSettings.suggestedTopics.length > 0
    ? `\n- Focus areas: ${chatbotSettings.suggestedTopics.join(", ")}`
    : "";

  return `You are an AI assistant on ${personal.name}'s portfolio website.

## Instructions
- Answer questions about ${personal.name}'s background, skills, experience, and projects.
- Be friendly, concise, and professional. Keep answers short (2-4 sentences) unless the user asks for detail.
- Detect the language of the user's message and reply in the SAME language. If they write in Vietnamese, reply in Vietnamese. If English, reply in English.
- If asked something unrelated to ${personal.name}'s portfolio (e.g., general knowledge, coding help, personal opinions), politely redirect: "I'm here to help you learn about ${personal.name}. Feel free to ask about skills, projects, or experience!"
- Never make up information not present in the data below. If unsure, say so.
- Use markdown formatting sparingly: bold for emphasis, bullet lists for multiple items.${topicsLine}

## About ${personal.name}
${personal.tagline}
${personal.bio}
Location: ${personal.location}
Status: ${personal.status}
Languages: ${personal.languages}

## Skills
${skillsText}

## Experience
${experienceText}

## Projects
${projectsText}

## Achievements
${achievementsText}${chatbotSettings.customInstructions ? `\n\n## Additional Context\n${chatbotSettings.customInstructions}` : ""}`;
}

interface ChatRequestMessage {
  role: "user" | "assistant";
  content: string;
}

// Every call costs LLM tokens: cap per visitor and set a global daily ceiling
const CHAT_LIMITS = [
  { limit: 8, windowMs: MINUTE },
  { limit: 60, windowMs: DAY },
  { limit: 1500, windowMs: DAY, global: true },
];
const MAX_MESSAGES = 20;
const MAX_CHARS = 1000; // per message
const MAX_BODY_BYTES = 64 * 1024;

export async function POST(request: NextRequest) {
  if (!rateLimit(request, "chat", CHAT_LIMITS)) return tooManyRequests();
  const body = await readJsonBody<{ messages: ChatRequestMessage[] }>(request, MAX_BODY_BYTES);
  if (!body) {
    return new Response(JSON.stringify({ error: "Invalid or too large request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "messages array is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Long assistant replies are trimmed, not rejected, so long chats keep working
  const messages = body.messages.slice(-MAX_MESSAGES).filter(
    (m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
  ).map((m) => (m.role === "assistant" ? { ...m, content: m.content.slice(0, MAX_CHARS * 4) } : m));
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user" || messages.some((m) => m.role === "user" && m.content.length > MAX_CHARS)) {
    return new Response(
      JSON.stringify({ error: `Each message must be at most ${MAX_CHARS} characters` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "OPENROUTER_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const model = new ChatOpenAI({
    apiKey,
    model: "deepseek/deepseek-v4.1-flash",
    configuration: { baseURL: "https://openrouter.ai/api/v1" },
    // OpenRouter: turn off DeepSeek thinking for faster, cheaper replies
    modelKwargs: { reasoning: { enabled: false } },
    maxTokens: 800,
    temperature: 0.7,
  });

  const systemPrompt = await buildSystemPrompt();

  const langchainMessages = [
    new SystemMessage(systemPrompt),
    ...messages.map((msg) =>
      msg.role === "user"
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content)
    ),
  ];

  const stream = await model.stream(langchainMessages);

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text =
            typeof chunk.content === "string" ? chunk.content : "";
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Stream error";
        controller.enqueue(encoder.encode(`\n[Error: ${errorMsg}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
