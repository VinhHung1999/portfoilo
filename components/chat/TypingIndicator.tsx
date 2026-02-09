"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function TypingIndicator() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex items-center gap-[4px] px-[14px] py-[10px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block w-[6px] h-[6px] rounded-full"
          style={{
            backgroundColor: "var(--text-muted)",
            animation: reducedMotion
              ? "typing-dot-reduced 1.4s infinite"
              : "typing-dot 1.4s infinite",
            animationDelay: `${i * 160}ms`,
          }}
        />
      ))}
    </div>
  );
}
