"use client";

import { User, Briefcase, FolderOpen, Zap, Award } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AdminSection = "personal" | "experience" | "projects" | "skills" | "achievements";

interface SidebarItem {
  id: AdminSection;
  label: string;
  icon: LucideIcon;
}

export const ADMIN_SECTIONS: SidebarItem[] = [
  { id: "personal", label: "Personal", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "skills", label: "Skills", icon: Zap },
  { id: "achievements", label: "Achievements", icon: Award },
];

interface AdminSidebarProps {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
}

export default function AdminSidebar({ active, onChange }: AdminSidebarProps) {
  return (
    <aside
      className="hidden lg:flex flex-col w-56 fixed top-14 bottom-0 left-0 border-r pt-6"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border)",
      }}
    >
      <p
        className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--text-muted)" }}
      >
        Content
      </p>
      <nav className="flex flex-col gap-0.5 px-2">
        {ADMIN_SECTIONS.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex items-center gap-3 h-11 px-3 text-sm font-medium rounded-r-lg transition-all duration-150 cursor-pointer"
              style={{
                backgroundColor: isActive ? "var(--bg-tertiary)" : "transparent",
                color: isActive ? "var(--cta)" : "var(--text-secondary)",
                borderLeft: isActive ? "3px solid var(--cta)" : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              <Icon
                size={18}
                style={{
                  color: isActive ? "var(--cta)" : "var(--text-muted)",
                }}
              />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
