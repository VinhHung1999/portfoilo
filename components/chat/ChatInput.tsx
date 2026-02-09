"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div
      className="flex items-center gap-[8px] px-[12px] py-[8px]"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder={disabled ? "Thinking..." : "Ask about my experience..."}
        disabled={disabled}
        className="flex-1 h-[40px] px-[16px] text-[14px] rounded-full border-none outline-none"
        style={{
          backgroundColor: "var(--bg-tertiary)",
          color: "var(--text-primary)",
          fontStyle: disabled ? "italic" : "normal",
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={!canSend}
        className="flex items-center justify-center w-[40px] h-[40px] rounded-full border-none cursor-pointer transition-transform duration-200"
        style={{
          background: canSend
            ? "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))"
            : "var(--bg-tertiary)",
        }}
        onMouseEnter={(e) => {
          if (canSend) e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
        onMouseDown={(e) => {
          if (canSend) e.currentTarget.style.transform = "scale(0.95)";
        }}
        onMouseUp={(e) => {
          if (canSend) e.currentTarget.style.transform = "scale(1.05)";
        }}
        aria-label="Send message"
      >
        <Send
          size={18}
          style={{ color: canSend ? "#FFFFFF" : "var(--text-muted)" }}
        />
      </button>
    </div>
  );
}
