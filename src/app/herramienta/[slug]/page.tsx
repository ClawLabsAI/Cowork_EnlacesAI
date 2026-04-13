import { notFound } from "next/navigation";
import Link from "next/link";
import { getToolBySlug, getRelatedTools } from "@/lib/data";
import { ToolCard } from "@/components/tools/ToolCard";
import { Star, ExternalLink, Check, X, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = await getToolBySlug(params.slug);
  if (!tool) return {};
  return {
    title: `${tool.name} — ${tool.tagline_es}`,
    description: tool.description_es?.slice(0, 160),
  };
}

export default async function ToolPage({ params }: Props) {
  const tool = await getToolBySlug(params.slug);
  if (!tool) notFound();

  const related = await getRelatedTools(tool, 3);
  const initial = tool.name.charAt(0).toUpperCase();

  return (
    <article className="max-w-[800px] mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <Link
        href="/categoria/todas"
        className="inline-flex items-center gap-1.5 text-[13px] text-[var(--c-dim)] hover:text-[var(--c-heading)] mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Volver al directorio
      </Link>

      {/* Header */}
      <div className="flex items-start gap-5 mb-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0"
          style={{ backgroundColor: tool.logo_color }}
        >
          {tool.logo_url ? (
            <img src={tool.logo_url} alt="" className="w-10 h-10 rounded-lg" />
          ) : (
            initial
          )}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--c-heading)] tracking-tight">
            {tool.name}
          </h1>
          <p className="text-[15px] text-[var(--c-dim)] mt-1">{tool.tagline_es}</p>
          <div className="flex items-center gap-3 mt-3">
            {tool.score && (
              <span className="flex items-center gap-1 text-[14px] font-bold text-[var(--c-heading)]">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                {Number(tool.score).toFixed(1)} / 10
              </span>
            )}
            {tool.skill_level && (
              <span className="text-[12px] px-2 py-0.5 rounded-md bg-[var(--c-surface2)] text-[var(--c-dim)] border border-[var(--c-border)]">
                {tool.skill_level}
              </span>
            )}
            {tool.has_free_plan && (
              <span className="text-[12px] font-semibold px-2 py-0.5 rounded-md bg-[var(--c-green-bg)] text-[var(--c-green)]">
                Plan gratis
              </span>
            )}
            {tool.supports_spanish && (
              <span className="text-[12px] font-semibold px-2 py-0.5 rounded-md bg-[var(--c-blue-bg)] text-[var(--c-blue)]">
                En español
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      {tool.url && (
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-[14px] font-semibold hover:opacity-90 transition-opacity mb-8"
        >
          Visitar {tool.name} <ExternalLink className="w-4 h-4" />
        </a>
      )}

      {/* Description */}
      <div className="prose-custom mb-8">
        <p className="text-[15px] text-[var(--c-text)] leading-relaxed whitespace-pre-line">
          {tool.description_es}
        </p>
      </div>

      {/* Pros / Cons */}
      {(tool.pros?.length || tool.cons?.length) ? (
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {tool.pros?.length ? (
            <div className="rounded-xl border border-[var(--c-border)] p-5 bg-[var(--c-surface)]">
              <h3 className="text-[14px] font-semibold text-[var(--c-green)] mb-3">A favor</h3>
              <ul className="space-y-2">
                {tool.pros.map((p, i) => (
                  <li key={i} className="flex gap-2 text-[14px] text-[var(--c-text)]">
                    <Check className="w-4 h-4 text-[var(--c-green)] shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {tool.cons?.length ? (
            <div className="rounded-xl border border-[var(--c-border)] p-5 bg-[var(--c-surface)]">
              <h3 className="text-[14px] font-semibold text-[var(--c-rose)] mb-3">En contra</h3>
              <ul className="space-y-2">
                {tool.cons.map((c, i) => (
                  <li key={i} className="flex gap-2 text-[14px] text-[var(--c-text)]">
                    <X className="w-4 h-4 text-[var(--c-rose)] shrink-0 mt-0.5" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Caso de uso */}
      {tool.use_case_es && (
        <div className="rounded-xl border border-[var(--c-border)] p-5 bg-[var(--c-surface)] mb-8">
          <h3 className="text-[14px] font-semibold text-[var(--c-heading)] mb-2">Caso de uso ideal</h3>
          <p className="text-[14px] text-[var(--c-text)] leading-relaxed">{tool.use_case_es}</p>
        </div>
      )}

      {/* Veredicto */}
      {tool.verdict_es && (
        <div className="rounded-xl border border-[var(--c-accent-border)] p-5 bg-[var(--c-accent-subtle)] mb-8">
          <h3 className="text-[14px] font-semibold text-[var(--c-accent-text)] mb-2">Nuestro veredicto</h3>
          <p className="text-[14px] text-[var(--c-text)] leading-relaxed">{tool.verdict_es}</p>
        </div>
      )}

      {/* Pricing */}
      {tool.pricing_summary && (
        <div className="rounded-xl border border-[var(--c-border)] p-5 bg-[var(--c-surface)] mb-8">
          <h3 className="text-[14px] font-semibold text-[var(--c-heading)] mb-2">Precio</h3>
          <p className="text-[14px] text-[var(--c-text)]">{tool.pricing_summary}</p>
        </div>
      )}

      {/* Info local */}
      <div className="flex flex-wrap gap-3 mb-12 text-[13px]">
        {tool.accepts_latam_payments !== undefined && (
          <span className="px-3 py-1.5 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)]">
            Pagos LATAM: {tool.accepts_latam_payments ? "Sí" : "No confirmado"}
          </span>
        )}
        {tool.gdpr_compliant !== undefined && (
          <span className="px-3 py-1.5 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)]">
            GDPR: {tool.gdpr_compliant ? "Cumple" : "No confirmado"}
          </span>
        )}
        {tool.category && (
          <Link
            href={`/categoria/${tool.category.slug}`}
            className="px-3 py-1.5 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] hover:border-[var(--c-accent-border)] hover:text-[var(--c-accent-text)] transition-colors"
          >
            {tool.category.name_es}
          </Link>
        )}
      </div>

      {/* Relacionadas */}
      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-[var(--c-heading)] tracking-tight mb-4">
            Herramientas similares
          </h2>
          <div className="grid sm:grid-cols-3 gap-3.5">
            {related.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
