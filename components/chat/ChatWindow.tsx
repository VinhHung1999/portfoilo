"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import type { Message } from "./MessageBubble";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  isStreaming: boolean;
  setIsStreaming: Dispatch<SetStateAction<boolean>>;
}

export default function ChatWindow({
  isOpen,
  onClose,
  onMinimize,
  messages,
  setMessages,
  isStreaming,
  setIsStreaming,
}: Props) {
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // BUG 3 FIX: Focus trap — intercept ALL Tab presses and manually cycle
  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      // Always prevent default Tab — we manage focus manually
      e.preventDefault();

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;

      const currentIndex = focusable.indexOf(
        document.activeElement as HTMLElement
      );

      let nextIndex: number;
      if (e.shiftKey) {
        // Shift+Tab: go backward, wrap to last
        nextIndex =
          currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1;
      } else {
        // Tab: go forward, wrap to first
        nextIndex =
          currentIndex >= focusable.length - 1 ? 0 : currentIndex + 1;
      }

      focusable[nextIndex].focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // BUG 3 FIX: Auto-focus input when chat opens
  useEffect(() => {
    if (!isOpen) return;
    // Small delay to let animation start, then focus first input
    const timer = setTimeout(() => {
      const input = dialogRef.current?.querySelector("input");
      input?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (isStreaming) return;
      setError(null);

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
      };

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: "",
      };

      // BUG 4 FIX: Use functional setState to avoid reading stale `messages` during render
      setMessages((prev) => [...prev, userMsg, aiMsg]);
      setIsStreaming(true);

      // Build message history for API using functional approach
      let apiMessages: { role: string; content: string }[];
      setMessages((prev) => {
        // Read current state inside functional update, but don't mutate
        apiMessages = prev
          .filter((m) => m.id !== aiMsg.id) // exclude the empty placeholder
          .map((m) => ({ role: m.role, content: m.content }));
        return prev; // no change
      });

      // Wait a tick for the functional setState to execute
      await new Promise((r) => setTimeout(r, 0));

      try {
        abortRef.current = new AbortController();
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages! }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          const current = accumulated;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsg.id ? { ...m, content: current } : m
            )
          );
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        const errorText =
          err instanceof Error ? err.message : "Something went wrong";
        setError(errorText);
        // Remove the empty AI message on error
        setMessages((prev) => prev.filter((m) => m.id !== aiMsg.id));
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [isStreaming, setMessages, setIsStreaming]
  );

  const retryLast = useCallback(() => {
    setMessages((prev) => {
      const lastUserMsg = [...prev].reverse().find((m) => m.role === "user");
      if (lastUserMsg) {
        setError(null);
        // Schedule sendMessage outside of this setState
        setTimeout(() => sendMessage(lastUserMsg.content), 0);
      }
      return prev;
    });
  }, [sendMessage, setMessages]);

  // BUG 1 FIX: SSR-safe animation variants
  // isMobile is correct here because ChatWindow is only rendered after mounted=true in ChatFAB
  const desktopVariants = reducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, scale: 0.6, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.6, y: 20 },
      };

  const mobileVariants = reducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { y: "100%" },
        visible: { y: 0 },
        exit: { y: "100%" },
      };

  const variants = isMobile ? mobileVariants : desktopVariants;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-label="Chat with AI assistant"
          aria-modal="true"
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={
            isMobile
              ? { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
              : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
          }
          className={`fixed flex flex-col ${
            isMobile
              ? "inset-0 w-screen z-50"
              : "bottom-[96px] right-[24px] w-[380px] max-h-[520px] min-h-[360px] rounded-[var(--radius-lg)] z-40"
          }`}
          style={{
            backgroundColor: "var(--bg-primary)",
            border: isMobile ? "none" : "1px solid var(--border)",
            boxShadow: isMobile ? "none" : "var(--shadow-lg)",
            height: isMobile ? "100dvh" : undefined,
            transformOrigin: isMobile ? undefined : "bottom right",
          }}
        >
          <ChatHeader onClose={onClose} onMinimize={onMinimize} />

          <MessageList
            messages={messages}
            isStreaming={isStreaming}
            onSendSuggestion={sendMessage}
          />

          {error && (
            <div className="px-[16px] pb-[8px]">
              <div
                className="flex items-center gap-[8px] px-[14px] py-[10px] rounded-[16px_16px_16px_4px] text-[14px]"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                }}
              >
                <AlertCircle
                  size={16}
                  className="shrink-0"
                  style={{ color: "#EF4444" }}
                />
                <span>Oops, something went wrong.</span>
                <button
                  onClick={retryLast}
                  className="font-medium cursor-pointer border-none bg-transparent hover:underline"
                  style={{ color: "var(--cta)" }}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <ChatInput onSend={sendMessage} disabled={isStreaming} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
