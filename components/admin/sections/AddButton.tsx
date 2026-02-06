"use client";

import { Plus } from "lucide-react";

interface AddButtonProps {
  label: string;
  onClick: () => void;
}

export default function AddButton({ label, onClick }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full h-11 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed text-sm font-medium transition-all cursor-pointer"
      style={{
        borderColor: "var(--border)",
        color: "var(--text-muted)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--cta)";
        e.currentTarget.style.color = "var(--cta)";
        e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = "var(--text-muted)";
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <Plus size={16} />
      {label}
    </button>
  );
}
