"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface AdminTopBarProps {
  onLogout: () => void;
}

export default function AdminTopBar({ onLogout }: AdminTopBarProps) {
  return (
    <header
      className="h-14 flex items-center justify-between px-6 border-b fixed top-0 left-0 right-0 z-40"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-medium transition-colors"
        style={{ color: "var(--text-secondary)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--cta)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--text-secondary)";
        }}
      >
        <ArrowLeft size={18} />
        <span className="hidden md:inline">Back to Portfolio</span>
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button
          onClick={onLogout}
          className="text-sm transition-colors cursor-pointer"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
