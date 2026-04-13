import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug, getCategories, getTools } from "@/lib/data";
import { ToolCard } from "@/components/tools/ToolCard";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
  searchParams: { page?: string; sort?: string; free?: string; spanish?: string; oss?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (params.slug === "todas") {
    return {
      title: "Todas las herramientas — enlaces.ai",
      description: "Explora el catálogo completo de herramientas de IA curadas en español.",
    };
  }
  const cat = await getCategoryBySlug(params.slug);
  if (!cat) return {};
  return {
    title: `${cat.name_es} — Herramientas de IA | enlaces.ai`,
    description: cat.description_es?.slice(0, 160) ?? `Las mejores herramientas de ${cat.name_es} con reviews en español.`,
  };
}

export const revalidate = 300;

export default async function CategoryPage({ params, searchParams }: Props) {
  const isAll = params.slug === "todas";
  const category = isAll ? null : await getCategoryBySlug(params.slug);

  if (!isAll && !category) notFound();

  const categories = await getCategories();
  const page = Number(searchParams.page) || 1;
  const sort = (searchParams.sort as "score" | "newest" | "name") || "score";
  const filters = {
    category: isAll ? undefined : params.slug,
    free: searchParams.free === "1",
    spanish: searchParams.spanish === "1",
    open_source: searchParams.oss === "1",
    sort,
    page,
  };

  const { tools, total } = await getTools(filters);
  const totalPages = Math.ceil(total / 24);
  const title = isAll ? "Todas las herramientas" : category!.name_es;

  // Build URL helpers
  function buildUrl(overrides: Record<string, string | undefined>) {
    const base: Record<string, string> = {};
    if (searchParams.sort) base.sort = searchParams.sort;
    if (searchParams.free) base.free = searchParams.free;
    if (searchParams.spanish) base.spanish = searchParams.spanish;
    if (searchParams.oss) base.oss = searchParams.oss;
    if (searchParams.page) base.page = searchParams.page;

    const merged: Record<string, string> = { ...base };
    for (const [k, v] of Object.entries(overrides)) {
      if (v) merged[k] = v;
      else delete merged[k];
    }
    const qs = new URLSearchParams(merged).toString();
    return `/categoria/${params.slug}${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="max-w-[1120px] mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] text-[var(--c-dim)] hover:text-[var(--c-heading)] mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Inicio
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[var(--c-heading)] tracking-tight mb-2">
          {title}
        </h1>
        {category?.description_es && (
          <p className="text-[15px] text-[var(--c-dim)] max-w-[600px]">{category.description_es}</p>
        )}
        <p className="text-[13px] text-[var(--c-faint)] mt-2">
          {total} herramienta{total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        <Link
          href="/categoria/todas"
          className={`text-[13px] font-medium px-3.5 py-1.5 rounded-lg border transition-all ${
            isAll
              ? "border-[var(--c-accent-border)] text-[var(--c-accent-text)] bg-[var(--c-accent-subtle)]"
              : "border-[var(--c-border)] text-[var(--c-dim)] hover:border-[var(--c-accent-border)] hover:text-[var(--c-accent-text)]"
          }`}
        >
          Todas
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categoria/${cat.slug}`}
            className={`text-[13px] font-medium px-3.5 py-1.5 rounded-lg border transition-all ${
              params.slug === cat.slug
                ? "border-[var(--c-accent-border)] text-[var(--c-accent-text)] bg-[var(--c-accent-subtle)]"
                : "border-[var(--c-border)] text-[var(--c-dim)] hover:border-[var(--c-accent-border)] hover:text-[var(--c-accent-text)]"
            }`}
          >
            {cat.name_es}
          </Link>
        ))}
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-[var(--c-border)]">
        <SlidersHorizontal className="w-4 h-4 text-[var(--c-faint)]" />

        {/* Sort */}
        <div className="flex items-center gap-1.5 text-[13px]">
          <span className="text-[var(--c-faint)]">Ordenar:</span>
          {(["score", "newest", "name"] as const).map((s) => (
            <Link
              key={s}
              href={buildUrl({ sort: s === "score" ? undefined : s, page: undefined })}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                sort === s
                  ? "bg-[var(--c-surface2)] text-[var(--c-heading)] font-medium"
                  : "text-[var(--c-dim)] hover:text-[var(--c-heading)]"
              }`}
            >
              {{ score: "Puntuación", newest: "Recientes", name: "Nombre" }[s]}
            </Link>
          ))}
        </div>

        <span className="text-[var(--c-border2)]">|</span>

        {/* Toggle filters */}
        {[
          { key: "free", label: "Plan gratis", param: searchParams.free },
          { key: "spanish", label: "En español", param: searchParams.spanish },
          { key: "oss", label: "Open source", param: searchParams.oss },
        ].map(({ key, label, param }) => (
          <Link
            key={key}
            href={buildUrl({ [key]: param === "1" ? undefined : "1", page: undefined })}
            className={`text-[13px] px-3 py-1 rounded-md border transition-colors ${
              param === "1"
                ? "border-[var(--c-accent-border)] text-[var(--c-accent-text)] bg-[var(--c-accent-subtle)]"
                : "border-[var(--c-border)] text-[var(--c-dim)] hover:border-[var(--c-accent-border)]"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-[var(--c-dim)] text-[15px] mb-2">No se encontraron herramientas con estos filtros.</p>
          <Link
            href={`/categoria/${params.slug}`}
            className="text-[13px] text-[var(--c-accent-text)] hover:underline"
          >
            Limpiar filtros
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex justify-center items-center gap-2 mt-12">
          {page > 1 && (
            <Link
              href={buildUrl({ page: String(page - 1) })}
              className="px-4 py-2 text-[13px] font-medium rounded-lg border border-[var(--c-border)] text-[var(--c-dim)] hover:border-[var(--c-accent-border)] hover:text-[var(--c-accent-text)] transition-colors"
            >
              Anterior
            </Link>
          )}
          <span className="text-[13px] text-[var(--c-faint)] px-3">
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildUrl({ page: String(page + 1) })}
              className="px-4 py-2 text-[13px] font-medium rounded-lg border border-[var(--c-border)] text-[var(--c-dim)] hover:border-[var(--c-accent-border)] hover:text-[var(--c-accent-text)] transition-colors"
            >
              Siguiente
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
