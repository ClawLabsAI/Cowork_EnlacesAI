import { sql } from "@/lib/db";
import Link from "next/link";
import { Star, MessageSquare, Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews — Opiniones de la comunidad",
  description: "Reviews de herramientas de IA escritas por la comunidad hispanohablante con contexto LATAM.",
};

export const revalidate = 300;

export default async function ReviewsPage() {
  let reviews: any[] = [];
  let topReviewed: any[] = [];
  try {
    reviews = await sql`
      SELECT r.*, t.name as tool_name, t.slug as tool_slug, t.logo_color as tool_color
      FROM reviews r
      JOIN tools t ON t.id = r.tool_id
      WHERE r.status = 'published'
      ORDER BY r.created_at DESC
      LIMIT 50
    `;
    topReviewed = await sql`
      SELECT t.slug, t.name, t.logo_color, t.review_count, t.avg_rating
      FROM tools t
      WHERE t.status = 'published' AND t.review_count > 0
      ORDER BY t.review_count DESC
      LIMIT 10
    `;
  } catch {}

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-[var(--c-accent-text)] mb-4">
          <MessageSquare className="w-5 h-5" />
          <span className="text-[13px] font-semibold uppercase tracking-wider">Reviews</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--c-heading)] tracking-tight mb-3">
          Reviews de la comunidad
        </h1>
        <p className="text-[15px] text-[var(--c-dim)] max-w-[480px]">
          Opiniones reales en español. ¿Funciona el pago desde LATAM? ¿El soporte responde en español? Aquí lo descubres.
        </p>
      </div>

      {/* Top reviewed tools */}
      {topReviewed.length > 0 && (
        <div className="mb-10">
          <h2 className="text-[14px] font-semibold text-[var(--c-heading)] mb-4">Más revisadas</h2>
          <div className="flex gap-2 flex-wrap">
            {topReviewed.map((t: any) => (
              <Link
                key={t.slug}
                href={`/herramienta/${t.slug}`}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] hover:border-[var(--c-accent-border)] transition-colors"
              >
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: t.tool_color }}>
                  {t.name.charAt(0)}
                </div>
                <span className="text-[13px] font-medium text-[var(--c-heading)]">{t.name}</span>
                <span className="flex items-center gap-0.5 text-[12px] text-[var(--c-amber)]">
                  <Star className="w-3 h-3 fill-current" /> {Number(t.avg_rating).toFixed(1)}
                </span>
                <span className="text-[11px] text-[var(--c-faint)]">({t.review_count})</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <div key={review.id} className="rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Link href={`/herramienta/${review.tool_slug}`} className="flex items-center gap-2 hover:opacity-80">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[12px] font-bold" style={{ backgroundColor: review.tool_color }}>
                      {review.tool_name.charAt(0)}
                    </div>
                    <span className="text-[14px] font-semibold text-[var(--c-heading)]">{review.tool_name}</span>
                  </Link>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i <= review.rating ? "text-amber-400 fill-amber-400" : "text-[var(--c-faint)]"}`} />
                  ))}
                </div>
              </div>

              {review.title && (
                <h3 className="text-[15px] font-semibold text-[var(--c-heading)] mb-1">{review.title}</h3>
              )}
              {review.body && (
                <p className="text-[14px] text-[var(--c-text)] mb-3">{review.body}</p>
              )}

              {/* LATAM context */}
              <div className="flex flex-wrap gap-2 mb-3">
                {review.country && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-[var(--c-surface2)] text-[var(--c-dim)] border border-[var(--c-border)]">
                    <Globe className="w-3 h-3" /> {review.country}
                  </span>
                )}
                {review.payment_works !== null && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-md ${review.payment_works ? "bg-[var(--c-green-bg)] text-[var(--c-green)]" : "bg-[var(--c-rose-bg)] text-[var(--c-rose)]"}`}>
                    {review.payment_works ? "Pago funciona" : "Pago no funciona"}
                  </span>
                )}
                {review.spanish_support !== null && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-md ${review.spanish_support ? "bg-[var(--c-blue-bg)] text-[var(--c-blue)]" : "bg-[var(--c-rose-bg)] text-[var(--c-rose)]"}`}>
                    {review.spanish_support ? "Soporte en español" : "Sin soporte en español"}
                  </span>
                )}
                {review.spanish_quality && (
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--c-surface2)] text-[var(--c-dim)] border border-[var(--c-border)]">
                    Español: {review.spanish_quality}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-[12px] text-[var(--c-faint)]">
                <span>{review.author_name}</span>
                <span>{new Date(review.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)]">
          <MessageSquare className="w-10 h-10 text-[var(--c-faint)] mx-auto mb-4" />
          <p className="text-[var(--c-dim)] text-[15px] mb-2">Todavía no hay reviews.</p>
          <p className="text-[13px] text-[var(--c-faint)]">Las reviews aparecerán aquí cuando la comunidad empiece a opinar.</p>
        </div>
      )}
    </div>
  );
}
