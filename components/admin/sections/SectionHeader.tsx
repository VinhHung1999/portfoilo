"use client";

import { Loader2 } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  isDirty: boolean;
  isSaving: boolean;
  saveSuccess: boolean;
  onSave: () => void;
  onUndo: () => void;
}

export default function SectionHeader({
  title,
  subtitle,
  isDirty,
  isSaving,
  saveSuccess,
  onSave,
  onUndo,
}: SectionHeaderProps) {
  return (
    <div
      className="flex items-start justify-between pb-6 mb-6 border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {subtitle}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {isDirty && (
          <button
            onClick={onUndo}
            disabled={isSaving}
            className="px-5 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer disabled:opacity-40"
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
            Undo
          </button>
        )}
        <button
          onClick={onSave}
          disabled={!isDirty || isSaving}
          className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: saveSuccess ? "#22C55E" : "var(--cta)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) => {
            if (isDirty && !isSaving) {
              e.currentTarget.style.backgroundColor = "var(--cta-hover)";
            }
          }}
          onMouseLeave={(e) => {
            if (!saveSuccess) {
              e.currentTarget.style.backgroundColor = "var(--cta)";
            }
          }}
        >
          {isSaving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saveSuccess ? (
            "Saved!"
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
}
