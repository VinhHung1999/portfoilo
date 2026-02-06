"use client";

import { useState, useCallback } from "react";
import type { ToastData } from "@/components/admin/feedback/Toast";

let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((type: ToastData["type"], message: string) => {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg: string) => addToast("success", msg), [addToast]);
  const error = useCallback((msg: string) => addToast("error", msg), [addToast]);
  const info = useCallback((msg: string) => addToast("info", msg), [addToast]);

  return { toasts, dismissToast, success, error, info };
}
