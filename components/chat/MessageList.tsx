"use client";

import { useRef, useEffect } from "react";
import MessageBubble, { type Message } from "./MessageBubble";
import EmptyState from "./EmptyState";

interface Props {
  messages: Message[];
  isStreaming: boolean;
  onSendSuggestion: (text: string) => void;
}

export default function MessageList({ messages, isStreaming, onSendSuggestion }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return <EmptyState onSend={onSendSuggestion} />;
  }

  return (
    <div
      className="flex-1 overflow-y-auto flex flex-col gap-[12px] p-[16px] md:p-[16px] max-md:p-[12px]"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "var(--border) transparent",
      }}
      aria-live="polite"
    >
      {messages.map((msg, i) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isStreaming={isStreaming && msg.role === "assistant" && i === messages.length - 1}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
