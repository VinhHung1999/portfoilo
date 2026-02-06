"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[400px] w-full rounded-2xl p-6"
            style={{
              backgroundColor: "var(--bg-primary)",
              boxShadow: "var(--shadow-lg, 0 25px 50px -12px rgba(0,0,0,0.25))",
            }}
          >
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </h3>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              {message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-5 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer"
                style={{
                  color: "var(--text-secondary)",
                  borderColor: "var(--border)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer"
                style={{ backgroundColor: "#EF4444" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#DC2626";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#EF4444";
                }}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
