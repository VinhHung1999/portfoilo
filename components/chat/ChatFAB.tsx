"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import ChatWindow from "./ChatWindow";

export default function ChatFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  // Pulse animation after 3s on page load (once)
  useEffect(() => {
    if (reducedMotion) return;
    const timer = setTimeout(() => setShowPulse(true), 3000);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    setShowPulse(false);
  };

  const handleClose = () => setIsOpen(false);
  const handleMinimize = () => setIsOpen(false);

  // Hide FAB on mobile when chat is open
  const fabHidden = isMobile && isOpen;

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <ChatWindow onClose={handleClose} onMinimize={handleMinimize} />
        )}
      </AnimatePresence>

      {/* FAB Button */}
      {!fabHidden && (
        <button
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
