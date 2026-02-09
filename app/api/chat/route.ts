import { NextRequest } from "next/server";
import { ChatXAI } from "@langchain/xai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import personalData from "@/content/personal.json";
import skillsData from "@/content/skills.json";
import experienceData from "@/content/experience.json";
import projectsData from "@/content/projects.json";
import achievementsData from "@/content/achievements.json";

export const dynamic = "force-dynamic";

function buildSystemPrompt(): string {
  const skills = skillsData
    .map(
      (cat: { category: string; skills: string[] }) =>
        `${cat.category}: ${cat.skills.join(", ")}`
    )
    .join("\n");

  const experience = experienceData
    .map(
      (exp: {
        company: string;
        role: string;
        startDate: string;
        endDate: string | null;
        achievements: string[];
        techStack: string[];
      }) =>
        `${exp.role} at ${exp.company} (${exp.startDate} – ${exp.endDate ?? "Present"})\n` +
        `  Achievements: ${exp.achievements.join("; ")}\n` +
        `  Tech: ${exp.techStack.join(", ")}`
    )
    .join("\n\n");

  const projects = projectsData
    .map(
      (p: {
        title: string;
        shortDescription: string;
        techStack: string[];
        features: string[];
      }) =>
        `${p.title}: ${p.shortDescription}\n` +
        `  Tech: ${p.techStack.join(", ")}\n` +
        `  Features: ${p.features.join("; ")}`
    )
    .join("\n\n");

  const achievements = achievementsData
    .map(
      (a: { title: string; description: string; date: string }) =>
        `${a.title} (${a.date}): ${a.description}`
    )
    .join("\n");

  return `You are an AI assistant on ${personalData.name}'s portfolio website. You answer questions about ${personalData.name}'s background, skills, experience, and projects.

Be friendly, concise, and professional. If asked something outside the portfolio context, politely redirect to topics about ${personalData.name}.

## About ${personalData.name}
${personalData.tagline}
${personalData.bio}
Location: ${personalData.location}
Status: ${personalData.status}
Languages: ${personalData.languages}

## Skills
${skills}

## Experience
${experience}

## Projects
${projects}

## Achievements
${achievements}`;
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

  const systemPrompt = buildSystemPrompt();

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
            typeof chunk.content === "string"
              ? chunk.content
              : "";
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Stream error";
        controller.enqueue(
          encoder.encode(`\n[Error: ${errorMsg}]`)
        );
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
