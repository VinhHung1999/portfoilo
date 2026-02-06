"use client";

import { useId } from "react";

interface DateInputProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  required?: boolean;
  showCurrentCheckbox?: boolean;
}

export default function DateInput({
  label,
  value,
  onChange,
  required,
  showCurrentCheckbox,
}: DateInputProps) {
  const id = useId();
  const isCurrent = value === null;

  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="block text-[13px] font-medium mb-1.5"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
        {required && (
          <span className="ml-0.5" style={{ color: "var(--cta)" }}>
            {" "}*
          </span>
        )}
      </label>
      <input
        id={id}
        type="text"
        value={isCurrent ? "" : (value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., Jan 2022"
        disabled={isCurrent}
        className="w-full h-10 px-3 text-sm rounded-lg border outline-none transition-all duration-150 disabled:opacity-50"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border)",
          color: "var(--text-primary)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--cta)";
          e.currentTarget.style.boxShadow = "0 0 0 3px var(--cta-glow)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
      {showCurrentCheckbox && (
        <label className="flex items-center gap-2 mt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isCurrent}
            onChange={(e) => onChange(e.target.checked ? null : "")}
            className="rounded"
          />
          <span
            className="text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            Currently here
          </span>
        </label>
      )}
    </div>
  );
}
