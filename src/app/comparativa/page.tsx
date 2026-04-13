import Link from "next/link";
import { getComparisons } from "@/lib/data";
import { ArrowRight, Scale } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparativas — enlaces.ai",
  description: "Comparativas detalladas entre herramientas de IA. Encuentra cuál se adapta mejor a tus necesidades.",
};

export const revalidate = 300;

export default async function ComparativasPage() {
  const comparisons = await getComparisons();

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-[var(--c-accent-text)] mb-4">
          <Scale className="w-5 h-5" />
          <span className="text-[13px] font-semibold uppercase tracking-wider">Comparativas</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--c-heading)] tracking-tight mb-3">
          Comparativas de herramientas
        </h1>
        <p className="text-[15px] text-[var(--c-dim)] max-w-[520px]">
          Análisis lado a lado para que elijas la herramienta que mejor se adapta a tu caso.
          Sin patrocinios, sin afiliados — opinión honesta.
        </p>
      </div>

      {/* List */}
      {comparisons.length > 0 ? (
        <div className="space-y-4">
          {comparisons.map((comp) => {
            const toolNames = comp.items?.map((i: any) => i.tool?.name).filter(Boolean) ?? [];
            const colors = comp.items?.map((i: any) => i.tool?.logo_color).filter(Boolean) ?? [];

            return (
              <Link
                key={comp.id}
                href={`/comparativa/${comp.slug}`}
                className="group block rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 hover:border-[var(--c-accent-border)] transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Tool avatars */}
                    <div className="flex items-center gap-2 mb-3">
                      {colors.slice(0, 4).map((color: string, i: number) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[13px] font-bold"
                          style={{ backgroundColor: color }}
                        >
                          {toolNames[i]?.charAt(0) ?? "?"}
                        </div>
                      ))}
                      {toolNames.length > 4 && (
                        <span className="text-[12px] text-[var(--c-faint)]">
                          +{toolNames.length - 4}
                        </span>
                      )}
                    </div>

                    <h2 className="text-[16px] font-semibold text-[var(--c-heading)] group-hover:text-[var(--c-accent-text)] transition-colors mb-1">
                      {comp.title_es}
                    </h2>
                    {comp.description_es && (
                      <p className="text-[14px] text-[var(--c-dim)] line-clamp-2">
                        {comp.description_es}
                      </p>
                    )}

                    {toolNames.length > 0 && (
                      <p className="text-[12px] text-[var(--c-faint)] mt-2">
                        {toolNames.join(" vs ")}
                      </p>
                    )}
                  </div>

                  <ArrowRight className="w-5 h-5 text-[var(--c-faint)] group-hover:text-[var(--c-accent-text)] shrink-0 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)]">
          <Scale className="w-10 h-10 text-[var(--c-faint)] mx-auto mb-4" />
          <p className="text-[var(--c-dim)] text-[15px] mb-2">
            Las comparativas están en camino.
          </p>
          <p className="text-[13px] text-[var(--c-faint)]">
            Estamos preparando análisis detallados de las herramientas más populares.
          </p>
        </div>
      )}
    </div>
  );
}
