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
      className="flex items-center gap-[8px] px-[12px] py-[10px]"
      style={{ borderTop: "1px solid #26262a" }}
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
        className="chat-dark-input flex-1 h-[44px] px-[14px] text-[14px] rounded-[14px] outline-none"
        style={{
          backgroundColor: "#141416",
          border: "1px solid #2c2c32",
          color: "#f4f4f2",
          fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display","Inter",system-ui,sans-serif',
          fontStyle: disabled ? "italic" : "normal",
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={!canSend}
        className="chat-dark-focus flex items-center justify-center w-[44px] h-[44px] rounded-full border-none cursor-pointer transition-transform duration-200 disabled:cursor-default"
        style={{
          background: "#fff",
          opacity: canSend ? 1 : 0.4,
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
          style={{ color: "#0a0a0b" }}
        />
      </button>
    </div>
  );
}
