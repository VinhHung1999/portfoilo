"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import ChatWindow from "./ChatWindow";
import type { Message } from "./MessageBubble";

export default function ChatFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const fabRef = useRef<HTMLButtonElement>(null);

  // BUG 2 FIX: Lift messages state to parent so it persists across open/close
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // Sprint 15: Conversation logging — unique ID per session
  const [conversationId] = useState(() => crypto.randomUUID());

  // Sprint 13: Dynamic greeting + suggested questions from admin settings
  const [greeting, setGreeting] = useState<string | undefined>();
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[] | undefined>();

  useEffect(() => {
    fetch("/api/chatbot-settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.greeting) setGreeting(data.greeting);
          if (data.suggestedQuestions?.length) setSuggestedQuestions(data.suggestedQuestions);
        }
      })
      .catch(() => {/* use defaults */});
  }, []);

  // BUG 1 FIX: Track mounted state for SSR-safe animations
  useEffect(() => {
    setMounted(true);
  }, []);

  // Pulse animation after 3s on page load (once)
  useEffect(() => {
    if (reducedMotion) return;
    const timer = setTimeout(() => setShowPulse(true), 3000);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    setShowPulse(false);
  }, []);

  // BUG 3 FIX: Return focus to FAB on close
  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Delay to let animation finish, then focus FAB
    setTimeout(() => fabRef.current?.focus(), 300);
  }, []);

  const handleMinimize = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => fabRef.current?.focus(), 250);
  }, []);

  // Hide FAB on mobile when chat is open (only after mounted to avoid SSR mismatch)
  const fabHidden = mounted && isMobile && isOpen;

  return (
    <>
      {/* BUG 2 FIX: Always render ChatWindow, control visibility via isOpen prop */}
      {/* BUG 1 FIX: Don't render until mounted to avoid SSR animation mismatch */}
      {mounted && (
        <ChatWindow
          isOpen={isOpen}
          onClose={handleClose}
          onMinimize={handleMinimize}
          messages={messages}
          setMessages={setMessages}
          isStreaming={isStreaming}
          setIsStreaming={setIsStreaming}
          greeting={greeting}
          suggestedQuestions={suggestedQuestions}
          conversationId={conversationId}
        />
      )}

      {/* FAB Button */}
      {!fabHidden && (
        <button
          ref={fabRef}
          onClick={handleToggle}
          className="fixed z-40 flex items-center justify-center w-[56px] h-[56px] rounded-full border-none cursor-pointer gradient-bg"
          style={{
            bottom: "24px",
            right: "24px",
            color: "#FFFFFF",
            boxShadow: "var(--shadow-md)",
            transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
        >
          {/* Pulse ring */}
          {showPulse && !isOpen && (
            <span
              className="absolute inset-0 rounded-full"
              style={{ animation: "chat-fab-pulse 2s ease-in-out 1" }}
              onAnimationEnd={() => setShowPulse(false)}
            />
          )}

          {/* Icon swap with rotation */}
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, rotate: -90 }}
                animate={reducedMotion ? { opacity: 1 } : { opacity: 1, rotate: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                <X size={24} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, rotate: -90 }}
                animate={reducedMotion ? { opacity: 1 } : { opacity: 1, rotate: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                <MessageCircle size={24} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      )}
    </>
  );
}
