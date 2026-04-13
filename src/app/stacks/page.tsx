import { sql } from "@/lib/db";
import Link from "next/link";
import { Layers, ArrowRight, ThumbsUp, Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stacks de IA — Combinaciones de herramientas",
  description: "Descubre combinaciones de herramientas de IA para flujos de trabajo completos. Creadas por la comunidad.",
};

export const revalidate = 300;

export default async function StacksPage() {
  const stacks = await sql`
    SELECT s.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', si.id,
            'role', si.role,
            'sort_order', si.sort_order,
            'tool_name', t.name,
            'tool_slug', t.slug,
            'tool_color', t.logo_color
          ) ORDER BY si.sort_order
        ) FILTER (WHERE si.id IS NOT NULL),
        '[]'
      ) as items
    FROM stacks s
    LEFT JOIN stack_items si ON si.stack_id = s.id
    LEFT JOIN tools t ON t.id = si.tool_id
    WHERE s.status = 'published'
    GROUP BY s.id
    ORDER BY s.votes DESC, s.created_at DESC
  `;

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="inline-flex items-center gap-2 text-[var(--c-accent-text)] mb-4">
            <Layers className="w-5 h-5" />
            <span className="text-[13px] font-semibold uppercase tracking-wider">Stacks</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--c-heading)] tracking-tight mb-3">
            Stacks de IA
          </h1>
          <p className="text-[15px] text-[var(--c-dim)] max-w-[480px]">
            Combinaciones de herramientas para flujos de trabajo completos.
            Creadas y votadas por la comunidad.
          </p>
        </div>
        <Link
          href="/stacks/nuevo"
          className="hidden sm:inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2.5 rounded-lg bg-[var(--c-accent)] text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Crear stack
        </Link>
      </div>

      {/* List */}
      {stacks.length > 0 ? (
        <div className="space-y-4">
          {stacks.map((stack: any) => {
            const items = typeof stack.items === "string" ? JSON.parse(stack.items) : stack.items;
            return (
              <Link
                key={stack.id}
                href={`/stacks/${stack.slug}`}
                className="group block rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 hover:border-[var(--c-accent-border)] transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Tool chain */}
                    <div className="flex items-center gap-1.5 mb-3">
                      {items.slice(0, 5).map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[12px] font-bold"
                            style={{ backgroundColor: item.tool_color }}
                          >
                            {item.tool_name?.charAt(0) ?? "?"}
                          </div>
                          {i < items.length - 1 && i < 4 && (
                            <ArrowRight className="w-3 h-3 text-[var(--c-faint)]" />
                          )}
                        </div>
                      ))}
                    </div>

                    <h2 className="text-[16px] font-semibold text-[var(--c-heading)] group-hover:text-[var(--c-accent-text)] transition-colors mb-1">
                      {stack.title}
                    </h2>
                    {stack.description && (
                      <p className="text-[14px] text-[var(--c-dim)] line-clamp-2">{stack.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-[12px] text-[var(--c-faint)]">
                      <span>por {stack.author_name}</span>
                      {stack.use_case && <span className="px-2 py-0.5 rounded-md bg-[var(--c-surface2)] border border-[var(--c-border)]">{stack.use_case}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <ThumbsUp className="w-4 h-4 text-[var(--c-faint)]" />
                    <span className="text-[13px] font-bold text-[var(--c-heading)]">{stack.votes}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)]">
          <Layers className="w-10 h-10 text-[var(--c-faint)] mx-auto mb-4" />
          <p className="text-[var(--c-dim)] text-[15px] mb-2">Todavía no hay stacks publicados.</p>
          <p className="text-[13px] text-[var(--c-faint)] mb-4">Sé el primero en compartir tu combinación de herramientas.</p>
          <Link
            href="/stacks/nuevo"
            className="inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-lg bg-[var(--c-accent)] text-white hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Crear stack
          </Link>
        </div>
      )}
    </div>
  );
}
