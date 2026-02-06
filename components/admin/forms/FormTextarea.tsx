"use client";

import { useId } from "react";

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helper?: string;
  rows?: number;
}

export default function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  helper,
  rows = 4,
}: FormTextareaProps) {
  const id = useId();
  const helperId = `${id}-helper`;

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
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        aria-describedby={error || helper ? helperId : undefined}
        aria-invalid={!!error}
        className="w-full min-h-[100px] p-3 text-sm rounded-lg border outline-none transition-all duration-150 resize-y leading-relaxed"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: error ? "#EF4444" : "var(--border)",
          color: "var(--text-primary)",
        }}
        onFocus={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = "var(--cta)";
            e.currentTarget.style.boxShadow = "0 0 0 3px var(--cta-glow)";
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? "#EF4444" : "var(--border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
      {(error || helper) && (
        <p
          id={helperId}
          className="text-xs mt-1.5"
          style={{ color: error ? "#EF4444" : "var(--text-muted)" }}
        >
          {error || helper}
        </p>
      )}
    </div>
  );
}
