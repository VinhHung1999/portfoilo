"use client";

import { Sparkles } from "lucide-react";

const DEFAULT_GREETING = "Hi! I'm Hung's AI assistant.";
const DEFAULT_SUBTITLE = "Ask me about his skills, projects, or experience.";
const DEFAULT_SUGGESTIONS = [
  "What are your skills?",
  "Tell me about your experience",
  "Show me your projects",
];

interface Props {
  onSend: (message: string) => void;
  greeting?: string;
  suggestedQuestions?: string[];
}

export default function EmptyState({ onSend, greeting, suggestedQuestions }: Props) {
  // Split greeting into title (first sentence) and subtitle (rest)
  const greetingText = greeting || DEFAULT_GREETING;
  const parts = greetingText.split(/(?<=\.)\s+/);
  const title = parts[0] || DEFAULT_GREETING;
  const subtitle = parts.slice(1).join(" ") || DEFAULT_SUBTITLE;

  const suggestions = suggestedQuestions && suggestedQuestions.length > 0
    ? suggestedQuestions
    : DEFAULT_SUGGESTIONS;

  return (
    <div className="flex flex-col items-center justify-center h-full px-[16px] py-[24px] gap-[16px]">
      <div className="gradient-bg flex items-center justify-center w-[48px] h-[48px] rounded-full">
        <Sparkles size={24} className="text-white" />
      </div>
      <div className="text-center">
        <p
          className="text-[16px] font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </p>
        <p
          className="text-[14px] mt-[4px]"
          style={{ color: "var(--text-muted)" }}
        >
          {subtitle}
        </p>
      </div>
      <div className="flex flex-col gap-[8px] w-full max-w-[280px]">
        {suggestions.map((text) => (
          <button
            key={text}
            onClick={() => onSend(text)}
            className="px-[16px] py-[8px] text-[13px] rounded-full cursor-pointer transition-colors duration-200"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(37, 99, 235, 0.1)";
              e.currentTarget.style.color = "var(--cta)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
