"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Link2, Moon, Sun } from "lucide-react";

export function Navbar() {
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
    <header className="sticky top-0 z-50 h-14 border-b border-[var(--c-border)] bg-[var(--c-nav-bg)] backdrop-blur-lg">
      <nav className="max-w-[1120px] mx-auto px-6 h-full flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-[15px] text-[var(--c-heading)] tracking-tight">
          <Link2 className="w-5 h-5" />
          <span>
            <em className="not-italic text-[var(--c-accent-text)] font-extrabold">enlaces</em>.ai
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex gap-1.5 flex-1">
          {[
            { href: "/categoria/todas", label: "Herramientas" },
            { href: "#models", label: "Modelos" },
            { href: "/comparativa", label: "Comparativas" },
            { href: "#latam", label: "Hecho en LATAM" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-md text-[13px] font-medium text-[var(--c-dim)] hover:text-[var(--c-heading)] hover:bg-[var(--c-accent-subtle)] transition-colors"
            >
              {label}
            </Link>
          ))}
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
          <Link
            href="/enviar"
            className="text-[13px] font-semibold px-4 py-1.5 rounded-lg bg-accent text-white hover:opacity-90 transition-opacity"
          >
            Enviar herramienta
          </Link>
        </div>
      </nav>
    </header>
  );
}
