import { SearchBar } from "@/components/home/SearchBar";
import { ToolCard } from "@/components/tools/ToolCard";
import { getCategories, getFeaturedTools, getLatestTools, getSiteStats } from "@/lib/data";
import Link from "next/link";
import * as icons from "lucide-react";

export const revalidate = 300; // ISR: rebuild cada 5 min

export default async function Home() {
  const [categories, featured, latest, stats] = await Promise.all([
    getCategories(),
    getFeaturedTools(6),
    getLatestTools(6),
    getSiteStats(),
  ]);

  return (
    <>
      {/* ── Hero ── */}
      <section className="max-w-[680px] mx-auto text-center pt-[72px] pb-14 px-6">
        <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--c-accent-text)] bg-[var(--c-accent-subtle)] border border-[var(--c-accent-border)] rounded-full px-3.5 py-1 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {stats.tools > 0
            ? `${stats.tools.toLocaleString("es")} herramientas indexadas`
            : "Actualizando catálogo..."}
        </div>
        <h1 className="text-[clamp(32px,4.6vw,48px)] font-extrabold tracking-tighter leading-[1.1] text-[var(--c-heading)] mb-4">
          El directorio de IA<br />en español
        </h1>
        <p className="text-[17px] text-[var(--c-dim)] leading-relaxed max-w-[520px] mx-auto mb-10">
          Herramientas y modelos de inteligencia artificial curados, con reviews
          honestas y contexto para Latinoamérica y España.
        </p>
        <SearchBar />
      </section>

      {/* ── Métricas ── */}
      <div className="flex justify-center gap-10 py-7 border-y border-[var(--c-border)]">
        {[
          { n: stats.tools.toLocaleString("es"), l: "Herramientas" },
          { n: stats.models.toLocaleString("es"), l: "Modelos HF" },
          { n: String(stats.categories), l: "Categorías" },
          { n: `${(stats.subscribers / 1000).toFixed(1)}K`, l: "Suscriptores" },
        ].map(({ n, l }) => (
          <div key={l} className="text-center">
            <strong className="text-xl font-bold text-[var(--c-heading)] tracking-tight block">{n}</strong>
            <span className="text-[12px] text-[var(--c-faint)]">{l}</span>
          </div>
        ))}
      </div>

      {/* ── Categorías ── */}
      <section className="max-w-[1120px] mx-auto px-6 pt-12 pb-6">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-lg font-bold text-[var(--c-heading)] tracking-tight">Categorías</h2>
          <Link href="/categoria/todas" className="text-[13px] text-[var(--c-accent-text)] font-medium hover:underline">
            Ver todas
          </Link>
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => {
            const Icon = (icons as any)[toPascal(cat.icon)] ?? icons.Grid3X3;
            return (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="flex items-center gap-2 text-[13px] font-medium px-3.5 py-1.5 rounded-lg border border-[var(--c-border)] text-[var(--c-dim)] hover:border-[var(--c-accent-border)] hover:text-[var(--c-accent-text)] hover:bg-[var(--c-accent-subtle)] transition-all"
              >
                <Icon className="w-[15px] h-[15px] opacity-50" />
                {cat.name_es}
                {cat.tool_count > 0 && (
                  <small className="text-[11px] text-[var(--c-faint)]">{cat.tool_count}</small>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Featured ── */}
      {featured.length > 0 && (
        <section className="max-w-[1120px] mx-auto px-6 py-6">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-lg font-bold text-[var(--c-heading)] tracking-tight">Destacadas</h2>
            <Link href="/categoria/todas" className="text-[13px] text-[var(--c-accent-text)] font-medium hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {featured.map((tool) => (
              <ToolCard key={tool.id} tool={tool} featured />
            ))}
          </div>
        </section>
      )}

      {/* ── Últimas ── */}
      {latest.length > 0 && (
        <section className="max-w-[1120px] mx-auto px-6 py-6">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-lg font-bold text-[var(--c-heading)] tracking-tight">Recién añadidas</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {latest.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* ── Newsletter CTA ── */}
      <section className="max-w-[1120px] mx-auto px-6 py-16">
        <div className="bg-[var(--c-surface)] border border-[var(--c-accent-border)] rounded-2xl p-12 text-center">
          <h2 className="text-[22px] font-bold text-[var(--c-heading)] tracking-tight mb-2">
            Las mejores IAs de la semana
          </h2>
          <p className="text-[15px] text-[var(--c-dim)] max-w-[420px] mx-auto mb-6">
            Cada martes en tu inbox. Herramientas curadas, opinión honesta y en
            español. Sin spam.
          </p>
          <form action="/api/newsletter" method="POST" className="flex gap-2 max-w-[400px] mx-auto">
            <input
              type="email"
              name="email"
              required
              placeholder="tu@email.com"
              className="flex-1 h-11 px-3.5 text-[14px] bg-[var(--c-bg)] border border-[var(--c-border2)] rounded-lg text-[var(--c-heading)] outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="h-11 px-5 bg-accent text-white rounded-lg text-[14px] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Suscribirme
            </button>
          </form>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--c-border)] py-8 px-6 text-center">
        <div className="flex justify-center gap-6 mb-3">
          {["Sobre nosotros", "Enviar herramienta", "API", "Contacto", "Privacidad"].map((l) => (
            <a key={l} href="#" className="text-[13px] text-[var(--c-dim)] hover:text-[var(--c-heading)]">{l}</a>
          ))}
        </div>
        <p className="text-[12px] text-[var(--c-faint)]">enlaces.ai © 2026</p>
      </footer>
    </>
  );
}

// Helper: "bar-chart-3" → "BarChart3"
function toPascal(s: string) {
  return s.replace(/(^|[-_])(\w)/g, (_, __, c) => c.toUpperCase()).replace(/\d+/g, (n) => n);
}
