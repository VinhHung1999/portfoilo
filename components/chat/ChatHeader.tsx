"use client";

import { X, Minus } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import ChatAvatar from "./ChatAvatar";

interface Props {
  onClose: () => void;
  onMinimize: () => void;
  avatar?: string;
  name?: string;
}

const btnClass =
  "chat-dark-focus flex items-center justify-center w-[44px] h-[44px] rounded-[10px] cursor-pointer border-none bg-transparent text-[#9a9aa0] hover:bg-[#24242a] hover:text-white transition-colors duration-150";

export default function ChatHeader({ onClose, onMinimize, avatar, name }: Props) {
  const isMobile = useIsMobile();

  return (
    <div
      className="flex items-center justify-between px-[16px] py-[12px]"
      style={{ borderBottom: "1px solid #26262a" }}
    >
      <div className="flex items-center gap-[12px] min-w-0">
        <ChatAvatar src={avatar} name={name} size={36} />
        <div className="min-w-0">
          <p
            className="text-[20px] leading-[1.1] truncate"
            style={{
              color: "#f4f4f2",
              fontFamily: '"Newsreader", Georgia, serif',
              fontWeight: 400,
            }}
          >
            {name || "Portfolio AI"}
          </p>
          <p
            className="flex items-start gap-[6px] mt-[4px] text-[11px] uppercase leading-[1.3]"
            style={{
              color: "#9a9aa0",
              letterSpacing: ".1em",
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            }}
          >
            <span
              aria-hidden="true"
              className="shrink-0 mt-[3px] w-[6px] h-[6px] rounded-full"
              style={{ background: "#4ade80" }}
            />
            <span>AI Assistant</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-[4px] shrink-0">
        {!isMobile && (
          <button onClick={onMinimize} className={btnClass} aria-label="Minimize chat">
            <Minus size={20} />
          </button>
        )}
        <button onClick={onClose} className={btnClass} aria-label="Close chat">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
