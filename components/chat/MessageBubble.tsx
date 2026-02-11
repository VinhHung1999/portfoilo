"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import TypingIndicator from "./TypingIndicator";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string; // ISO string for conversation logging
}

interface Props {
  message: Message;
  isStreaming?: boolean;
}

export default function MessageBubble({ message, isStreaming }: Props) {
  const reducedMotion = useReducedMotion();
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ marginLeft: isUser ? "auto" : undefined, marginRight: isUser ? undefined : "auto" }}
      className={isUser ? "max-w-[75%]" : "max-w-[85%]"}
    >
      <div
        className={`px-[14px] py-[10px] text-[14px] leading-[1.5] ${
          isUser
            ? "gradient-bg text-white rounded-[16px_16px_4px_16px]"
            : "rounded-[16px_16px_16px_4px]"
        }`}
        style={
          isUser
            ? undefined
            : { backgroundColor: "var(--bg-tertiary)", color: "var(--text-primary)" }
        }
      >
        {isUser ? (
          <span>{message.content}</span>
        ) : message.content === "" && isStreaming ? (
          <TypingIndicator />
        ) : (
          <div className="chat-markdown">
            <ReactMarkdown>{message.content}</ReactMarkdown>
            {isStreaming && (
              <span
                className="inline-block w-[2px] h-[14px] ml-[2px] align-middle"
                style={{
                  backgroundColor: "var(--cta)",
                  animation: "cursor-blink 0.8s steps(1) infinite",
                }}
              />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
