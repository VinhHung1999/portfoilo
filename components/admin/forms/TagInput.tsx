"use client";

import { useState, useId, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  required?: boolean;
}

export default function TagInput({
  label,
  tags,
  onChange,
  placeholder = "Type and press Enter to add...",
  required,
}: TagInputProps) {
  const [input, setInput] = useState("");
  const id = useId();

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

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
      <div
        className="flex flex-wrap gap-1.5 min-h-[40px] p-1.5 rounded-lg border transition-all duration-150 cursor-text"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border)",
        }}
        onClick={() => document.getElementById(id)?.focus()}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--cta)";
          e.currentTarget.style.boxShadow = "0 0 0 3px var(--cta-glow)";
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }
        }}
      >
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
            }}
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="hover:opacity-100 opacity-60 transition-opacity cursor-pointer"
              style={{ color: "var(--text-muted)" }}
              aria-label={`Remove ${tag}`}
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          id={id}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] h-7 px-1.5 text-sm bg-transparent outline-none"
          style={{ color: "var(--text-primary)" }}
        />
      </div>
    </div>
  );
}
