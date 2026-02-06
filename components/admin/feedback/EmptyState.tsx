"use client";

import { Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  addLabel: string;
  onAdd: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  addLabel,
  onAdd,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon
        size={48}
        className="mb-4 opacity-50"
        style={{ color: "var(--text-muted)" }}
      />
      <h3
        className="text-base font-semibold mb-2"
        style={{ color: "var(--text-secondary)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm max-w-[300px] mb-6"
        style={{ color: "var(--text-muted)" }}
      >
        {description}
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border-2 border-dashed transition-all cursor-pointer"
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
        {addLabel}
      </button>
    </div>
  );
}
