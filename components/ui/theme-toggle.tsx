"use client";

import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-white/15 bg-slate-100 dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all duration-200 shadow-xs"
      aria-label="Toggle theme"
    >
      <span>{theme === "light" ? "☀️ Light" : "🌙 Dark"}</span>
    </button>
  );
}
