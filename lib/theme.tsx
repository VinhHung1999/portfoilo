"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Read initial theme from DOM (set by inline script in layout.tsx)
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document !== "undefined") {
      return (document.documentElement.getAttribute("data-theme") as Theme) || "light";
    }
    return "light";
  });

  useEffect(() => {
    // After hydration, re-apply theme from localStorage (hydration may strip data-theme)
    const saved = localStorage.getItem("theme") as Theme | null;
    const resolved = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", resolved);
    setTheme(resolved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
