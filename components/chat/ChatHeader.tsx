"use client";

import { X, Minus, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Props {
  onClose: () => void;
  onMinimize: () => void;
}

export default function ChatHeader({ onClose, onMinimize }: Props) {
  const isMobile = useIsMobile();

  return (
    <div>
      {/* Gradient accent top border */}
      <div
        className="h-[2px]"
        style={{
          background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-end))",
        }}
      />
      <div
        className="flex items-center justify-between h-[54px] px-[16px]"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Left: avatar + title */}
        <div className="flex items-center gap-[10px]">
          <div className="gradient-bg flex items-center justify-center w-[32px] h-[32px] rounded-full">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <p
              className="text-[14px] font-semibold leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Portfolio AI
            </p>
            <p
              className="text-[12px] leading-tight"
              style={{ color: "var(--text-muted)" }}
            >
              Ask me anything
            </p>
          </div>
        </div>

        {/* Right: minimize + close */}
        <div className="flex items-center gap-[4px]">
          {!isMobile && (
            <button
              onClick={onMinimize}
              className="flex items-center justify-center w-[32px] h-[32px] rounded-[var(--radius-md)] cursor-pointer border-none transition-colors duration-150"
              style={{ background: "transparent", color: "var(--text-muted)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
              aria-label="Minimize chat"
            >
              <Minus size={20} />
            </button>
          )}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-[32px] h-[32px] rounded-[var(--radius-md)] cursor-pointer border-none transition-colors duration-150"
            style={{ background: "transparent", color: "var(--text-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
