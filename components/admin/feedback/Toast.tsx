"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Info, X } from "lucide-react";

export interface ToastData {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

const TOAST_CONFIG = {
  success: { bg: "#22C55E", icon: Check, autoDismiss: 3000 },
  error: { bg: "#EF4444", icon: AlertCircle, autoDismiss: 0 },
  info: { bg: "var(--cta)", icon: Info, autoDismiss: 4000 },
};

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: () => void }) {
  const config = TOAST_CONFIG[toast.type];
  const Icon = config.icon;

  useEffect(() => {
    if (config.autoDismiss > 0) {
      const timer = setTimeout(onDismiss, config.autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [config.autoDismiss, onDismiss]);

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 max-w-[320px] px-4 py-3 rounded-lg text-white text-sm font-medium"
      style={{ backgroundColor: config.bg, boxShadow: "var(--shadow-md)" }}
      role="alert"
    >
      <Icon size={18} className="flex-shrink-0" />
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => onDismiss(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
