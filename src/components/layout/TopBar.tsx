"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { SearchBar } from "@/components/home/SearchBar";

export function TopBar() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setDark(false);
      document.documentElement.classList.add("light");
    }
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("light", !next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-[var(--c-border)] bg-[var(--c-nav-bg)] backdrop-blur-lg">
      <div className="max-w-[960px] mx-auto px-6 h-full flex items-center gap-4">
        {/* Spacer for mobile hamburger */}
        <div className="w-9 md:hidden" />

        {/* Search */}
        <div className="flex-1 max-w-[480px]">
          <SearchBar compact />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2.5 ml-auto">
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] flex items-center justify-center text-[var(--c-dim)] hover:text-[var(--c-heading)] hover:border-[var(--c-border2)] transition-colors"
            aria-label="Cambiar tema"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
