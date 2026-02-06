"use client";

import { useState, useRef, useEffect, useId } from "react";
import { ChevronDown, Check, Bot, Palette, ShoppingBag, Globe, Code, Smartphone, Database, Brain, Rocket, Layout, Trophy, Award, Star, Medal, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_OPTIONS: Record<string, LucideIcon> = {
  Bot, Palette, ShoppingBag, Globe, Code, Smartphone, Database, Brain, Rocket, Layout,
  trophy: Trophy, award: Award, star: Star, medal: Medal, sparkles: Sparkles,
};

interface IconSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  required?: boolean;
}

export default function IconSelect({
  label,
  value,
  onChange,
  options,
  required,
}: IconSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const availableOptions = options || Object.keys(ICON_OPTIONS);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const SelectedIcon = ICON_OPTIONS[value];

  return (
    <div className="mb-5" ref={ref}>
      <label
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
      <button
        type="button"
        id={id}
        onClick={() => setOpen(!open)}
        className="w-full h-10 px-3 flex items-center justify-between rounded-lg border text-sm transition-all duration-150 cursor-pointer"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: open ? "var(--cta)" : "var(--border)",
          color: "var(--text-primary)",
          boxShadow: open ? "0 0 0 3px var(--cta-glow)" : "none",
        }}
      >
        <span className="flex items-center gap-2">
          {SelectedIcon && <SelectedIcon size={18} />}
          {value || "Select..."}
        </span>
        <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />
      </button>

      {open && (
        <div
          className="absolute z-20 mt-1 w-full max-h-[200px] overflow-y-auto rounded-lg border"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {availableOptions.map((option) => {
            const Icon = ICON_OPTIONS[option];
            const isSelected = option === value;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className="w-full px-3 py-2 flex items-center gap-2 text-sm transition-colors cursor-pointer"
                style={{
                  color: isSelected ? "var(--cta)" : "var(--text-primary)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {isSelected && <Check size={14} />}
                {Icon && <Icon size={18} />}
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
