"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import type { Tool } from "@/lib/types";

interface Props {
  tool: Tool;
  featured?: boolean;
}

export function ToolCard({ tool, featured }: Props) {
  const initial = tool.name.charAt(0).toUpperCase();

  return (
    <Link
      href={`/herramienta/${tool.slug}`}
      className="group relative flex flex-col rounded-[14px] border border-[var(--c-border)] bg-[var(--c-surface)] p-5 transition-all hover:border-[var(--c-border2)] hover:shadow-lg hover:-translate-y-0.5"
    >
      {featured && (
        <span className="absolute top-3 right-3 text-[10px] font-semibold tracking-wide text-accent-text bg-accent-subtle border border-accent-border px-2 py-0.5 rounded-md">
          Destacada
        </span>
      )}

      {/* Head */}
      <div className="flex items-start gap-3.5 mb-3">
        <div
          className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white text-[15px] font-bold shrink-0"
          style={{ backgroundColor: tool.logo_color }}
        >
          {tool.logo_url ? (
            <img src={tool.logo_url} alt="" className="w-6 h-6 rounded" />
          ) : (
            initial
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold text-[var(--c-heading)] tracking-tight truncate">
            {tool.name}
          </h3>
          <p className="text-[13px] text-[var(--c-dim)] truncate mt-0.5">
            {tool.tagline_es}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-[13.5px] text-[var(--c-text)] leading-relaxed mb-3 line-clamp-3">
        {tool.description_es}
      </p>

      {/* Tags */}
      {tool.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2 py-0.5 rounded-[5px] bg-[var(--c-surface2)] text-[var(--c-dim)] border border-[var(--c-border)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-[var(--c-border)]">
        <div className="flex gap-1.5">
          {tool.has_free_plan && (
            <Badge color="green">Gratis</Badge>
          )}
          {tool.supports_spanish && (
            <Badge color="blue">Español</Badge>
          )}
          {tool.is_open_source && (
            <Badge color="amber">Open Source</Badge>
          )}
        </div>
        {tool.score && (
          <div className="flex items-center gap-1 text-[13px] font-bold text-[var(--c-heading)]">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            {tool.score.toFixed(1)}
          </div>
        )}
      </div>
    </Link>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: "green" | "blue" | "amber" | "rose" }) {
  const colors = {
    green: "bg-[var(--c-green-bg)] text-[var(--c-green)]",
    blue:  "bg-[var(--c-blue-bg)] text-[var(--c-blue)]",
    amber: "bg-[var(--c-amber-bg)] text-[var(--c-amber)]",
    rose:  "bg-[var(--c-rose-bg)] text-[var(--c-rose)]",
  };
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-[5px] ${colors[color]}`}>
      {children}
    </span>
  );
}
