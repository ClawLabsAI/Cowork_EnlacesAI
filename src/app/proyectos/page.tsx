import { sql } from "@/lib/db";
import Link from "next/link";
import { FolderOpen, ExternalLink, ThumbsUp, Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proyectos — Construye con IA",
  description: "Descubre qué ha construido la comunidad usando herramientas de IA. Comparte tu proyecto.",
};

export const revalidate = 300;

export default async function ProjectsPage() {
  const projects = await sql`
    SELECT p.*,
      COALESCE(
        json_agg(
          json_build_object('tool_name', t.name, 'tool_slug', t.slug, 'tool_color', t.logo_color, 'usage_note', pt.usage_note)
        ) FILTER (WHERE pt.id IS NOT NULL),
        '[]'
      ) as tools
    FROM projects p
    LEFT JOIN project_tools pt ON pt.project_id = p.id
    LEFT JOIN tools t ON t.id = pt.tool_id
    WHERE p.status = 'published'
    GROUP BY p.id
    ORDER BY p.votes DESC, p.created_at DESC
  `;

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="inline-flex items-center gap-2 text-[var(--c-accent-text)] mb-4">
            <FolderOpen className="w-5 h-5" />
            <span className="text-[13px] font-semibold uppercase tracking-wider">Proyectos</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--c-heading)] tracking-tight mb-3">
            Construye con IA
          </h1>
          <p className="text-[15px] text-[var(--c-dim)] max-w-[480px]">
            Proyectos reales hechos con herramientas de IA. Inspírate y comparte el tuyo.
          </p>
        </div>
        <Link
          href="/proyectos/nuevo"
          className="hidden sm:inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2.5 rounded-lg bg-[var(--c-accent)] text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Compartir proyecto
        </Link>
      </div>

      {/* Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project: any) => {
            const tools = typeof project.tools === "string" ? JSON.parse(project.tools) : project.tools;
            return (
              <div
                key={project.id}
                className="rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] overflow-hidden"
              >
                {project.image_url && (
                  <div className="h-40 bg-[var(--c-surface2)] overflow-hidden">
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-[16px] font-semibold text-[var(--c-heading)] mb-1">{project.title}</h2>
                  <p className="text-[14px] text-[var(--c-dim)] line-clamp-2 mb-3">{project.description}</p>

                  {/* Tools used */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {tools.map((t: any, i: number) => (
                      <Link
                        key={i}
                        href={`/herramienta/${t.tool_slug}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md bg-[var(--c-surface2)] text-[var(--c-dim)] border border-[var(--c-border)] hover:border-[var(--c-accent-border)] transition-colors"
                      >
                        <span className="w-3.5 h-3.5 rounded flex items-center justify-center text-white text-[8px] font-bold" style={{ backgroundColor: t.tool_color }}>
                          {t.tool_name?.charAt(0)}
                        </span>
                        {t.tool_name}
                      </Link>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--c-border)]">
                    <div className="flex items-center gap-3 text-[12px] text-[var(--c-faint)]">
                      <span>por {project.author_name}</span>
                      {project.project_url && (
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--c-accent-text)] hover:underline">
                          Ver <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--c-faint)]">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="text-[12px] font-bold">{project.votes}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)]">
          <FolderOpen className="w-10 h-10 text-[var(--c-faint)] mx-auto mb-4" />
          <p className="text-[var(--c-dim)] text-[15px] mb-2">Todavía no hay proyectos publicados.</p>
          <p className="text-[13px] text-[var(--c-faint)] mb-4">Comparte qué has construido con herramientas de IA.</p>
          <Link href="/proyectos/nuevo" className="inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-lg bg-[var(--c-accent)] text-white hover:opacity-90">
            <Plus className="w-4 h-4" /> Compartir proyecto
          </Link>
        </div>
      )}
    </div>
  );
}
