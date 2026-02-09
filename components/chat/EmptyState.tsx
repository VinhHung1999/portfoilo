"use client";

import { Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "What are your skills?",
  "Tell me about your experience",
  "Show me your projects",
];

interface Props {
  onSend: (message: string) => void;
}

export default function EmptyState({ onSend }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-[16px] py-[24px] gap-[16px]">
      <div
        className="gradient-bg flex items-center justify-center w-[48px] h-[48px] rounded-full"
      >
        <Sparkles size={24} className="text-white" />
      </div>
      <div className="text-center">
        <p
          className="text-[16px] font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Hi! I&apos;m Hung&apos;s AI assistant.
        </p>
        <p
          className="text-[14px] mt-[4px]"
          style={{ color: "var(--text-muted)" }}
        >
          Ask me about his skills, projects, or experience.
        </p>
      </div>
      <div className="flex flex-col gap-[8px] w-full max-w-[280px]">
        {SUGGESTIONS.map((text) => (
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
