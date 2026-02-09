import { NextRequest } from "next/server";
import { ChatXAI } from "@langchain/xai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { getPortfolioContent } from "@/lib/content";
import { readChatbotSettings } from "@/app/api/admin/chatbot-context/route";

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

  const projectsText = projects
    .map(
      (p) =>
        `${p.title}: ${p.shortDescription}\n` +
        `  Tech: ${p.techStack.join(", ")}\n` +
        `  Features: ${p.features.join("; ")}`
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

export async function POST(request: NextRequest) {
  let body: { messages: ChatRequestMessage[] };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
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

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "XAI_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const model = new ChatXAI({
    apiKey,
    model: "grok-3-mini-fast",
    temperature: 0.7,
  });

  const systemPrompt = await buildSystemPrompt();

  const langchainMessages = [
    new SystemMessage(systemPrompt),
    ...body.messages.map((msg) =>
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
