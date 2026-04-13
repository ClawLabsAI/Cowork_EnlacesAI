"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Link2, Search, Layers, FolderOpen, Scale, Calculator,
  Star, BookOpen, Cpu, Bell, Menu, X,
  Wrench, LayoutGrid
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Inicio", icon: LayoutGrid },
  { href: "/categoria/todas", label: "Herramientas", icon: Wrench },
  { href: "/stacks", label: "Stacks", icon: Layers },
  { href: "/proyectos", label: "Proyectos", icon: FolderOpen },
  { href: "/comparativa", label: "Comparativas", icon: Scale },
  { href: "/comparador", label: "Comparador", icon: Search },
  { href: "/calculadora", label: "Calculadora", icon: Calculator },
  { href: "/guias", label: "Guías", icon: BookOpen },
  { href: "/playground", label: "Playground", icon: Cpu },
];

const SECONDARY_ITEMS = [
  { href: "/alertas", label: "Mis alertas", icon: Bell },
  { href: "/reviews", label: "Reviews", icon: Star },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-[var(--c-border)] shrink-0">
        <Link href="/" className="flex items-center gap-2 font-bold text-[15px] text-[var(--c-heading)] tracking-tight" onClick={() => setOpen(false)}>
          <Link2 className="w-5 h-5" />
          <span>
            <em className="not-italic text-[var(--c-accent-text)] font-extrabold">enlaces</em>.ai
          </span>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors ${
                isActive(href)
                  ? "bg-[var(--c-accent-subtle)] text-[var(--c-accent-text)] border border-[var(--c-accent-border)]"
                  : "text-[var(--c-dim)] hover:text-[var(--c-heading)] hover:bg-[var(--c-surface2)]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--c-border)]">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--c-faint)]">
            Comunidad
          </p>
          <div className="space-y-0.5">
            {SECONDARY_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors ${
                  isActive(href)
                    ? "bg-[var(--c-accent-subtle)] text-[var(--c-accent-text)] border border-[var(--c-accent-border)]"
                    : "text-[var(--c-dim)] hover:text-[var(--c-heading)] hover:bg-[var(--c-surface2)]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* CTA */}
      <div className="p-4 border-t border-[var(--c-border)] shrink-0">
        <Link
          href="/enviar"
          onClick={() => setOpen(false)}
          className="block text-center text-[13px] font-semibold px-4 py-2.5 rounded-lg bg-[var(--c-accent)] text-white hover:opacity-90 transition-opacity"
        >
          Enviar herramienta
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-3 left-4 z-[60] md:hidden w-9 h-9 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] flex items-center justify-center text-[var(--c-dim)]"
        aria-label="Menu"
      >
        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-[220px] border-r border-[var(--c-border)] bg-[var(--c-bg)] z-40 flex-col">
        {navContent}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-[var(--c-bg)] flex flex-col shadow-2xl">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
