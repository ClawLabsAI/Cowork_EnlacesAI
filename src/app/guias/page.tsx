import { sql } from "@/lib/db";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guías — IA por profesión y caso de uso",
  description: "Guías curadas de herramientas de IA por profesión y caso de uso. Encuentra la IA perfecta para tu trabajo.",
};

export const revalidate = 300;

export default async function GuidesPage() {
  const guides = await sql`
    SELECT g.*,
      c.name_es as category_name,
      (SELECT COUNT(*) FROM guide_tools gt WHERE gt.guide_id = g.id) as tool_count
    FROM guides g
    LEFT JOIN categories c ON c.id = g.category_id
    WHERE g.status = 'published'
    ORDER BY g.created_at DESC
  `;

  // Static suggestions for guides that haven't been created yet
  const SUGGESTED_PROFESSIONS = [
    { profession: "abogados", title: "Las mejores IAs para abogados", emoji: "⚖️" },
    { profession: "profesores", title: "Herramientas de IA para educadores", emoji: "📚" },
    { profession: "marketers", title: "IA para marketing digital", emoji: "📈" },
    { profession: "developers", title: "Herramientas de IA para programadores", emoji: "💻" },
    { profession: "diseñadores", title: "IA para diseñadores gráficos", emoji: "🎨" },
    { profession: "escritores", title: "IA para escritores y redactores", emoji: "✍️" },
    { profession: "emprendedores", title: "IA para startups y emprendedores", emoji: "🚀" },
    { profession: "ecommerce", title: "IA para e-commerce", emoji: "🛒" },
    { profession: "rrhh", title: "IA para recursos humanos", emoji: "👥" },
    { profession: "finanzas", title: "IA para finanzas y contabilidad", emoji: "💰" },
    { profession: "salud", title: "IA para profesionales de la salud", emoji: "🏥" },
    { profession: "periodistas", title: "IA para periodistas e investigadores", emoji: "📰" },
  ];

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-[var(--c-accent-text)] mb-4">
          <BookOpen className="w-5 h-5" />
          <span className="text-[13px] font-semibold uppercase tracking-wider">Guías</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--c-heading)] tracking-tight mb-3">
          Guías de IA por profesión
        </h1>
        <p className="text-[15px] text-[var(--c-dim)] max-w-[480px]">
          Las mejores herramientas de IA curadas para cada profesión y caso de uso. Con contexto para LATAM y España.
        </p>
      </div>

      {/* Published guides */}
      {guides.length > 0 && (
        <div className="mb-12">
          <h2 className="text-[14px] font-semibold text-[var(--c-heading)] mb-4">Guías disponibles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guides.map((guide: any) => (
              <Link
                key={guide.id}
                href={`/guias/${guide.slug}`}
                className="group rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] p-5 hover:border-[var(--c-accent-border)] transition-colors"
              >
                <h3 className="text-[16px] font-semibold text-[var(--c-heading)] group-hover:text-[var(--c-accent-text)] transition-colors mb-1">
                  {guide.title}
                </h3>
                {guide.description && (
                  <p className="text-[14px] text-[var(--c-dim)] line-clamp-2 mb-3">{guide.description}</p>
                )}
                <div className="flex items-center gap-3 text-[12px] text-[var(--c-faint)]">
                  {guide.category_name && <span>{guide.category_name}</span>}
                  <span>{guide.tool_count} herramientas</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-[var(--c-accent-text)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Profession grid */}
      <div>
        <h2 className="text-[14px] font-semibold text-[var(--c-heading)] mb-4">
          {guides.length > 0 ? "Más guías próximamente" : "Guías en preparación"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {SUGGESTED_PROFESSIONS.map(({ profession, title, emoji }) => {
            const exists = guides.find((g: any) => g.profession === profession);
            return exists ? null : (
              <div
                key={profession}
                className="rounded-lg border border-dashed border-[var(--c-border2)] bg-[var(--c-surface)] p-4 text-center"
              >
                <span className="text-2xl mb-2 block">{emoji}</span>
                <span className="text-[13px] font-medium text-[var(--c-dim)]">{title}</span>
                <p className="text-[11px] text-[var(--c-faint)] mt-1">Próximamente</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
