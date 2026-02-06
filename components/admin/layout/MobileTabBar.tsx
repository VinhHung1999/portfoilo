"use client";

import { ADMIN_SECTIONS } from "./AdminSidebar";
import type { AdminSection } from "./AdminSidebar";

interface MobileTabBarProps {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
}

export default function MobileTabBar({ active, onChange }: MobileTabBarProps) {
  return (
    <div
      className="lg:hidden flex overflow-x-auto border-b fixed top-14 left-0 right-0 z-30"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border)",
      }}
    >
      {ADMIN_SECTIONS.map((item) => {
        const isActive = active === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className="flex flex-col items-center gap-1 min-w-[72px] px-4 py-2.5 text-xs font-medium transition-colors flex-shrink-0 cursor-pointer"
            style={{
              color: isActive ? "var(--cta)" : "var(--text-muted)",
              borderBottom: isActive ? "2px solid var(--cta)" : "2px solid transparent",
            }}
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
