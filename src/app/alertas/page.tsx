"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";

const CATEGORIES = [
  "Escritura", "Imagen", "Video", "Audio", "Código", "Marketing",
  "Productividad", "Educación", "Chatbots", "Traducción", "Investigación", "Datos",
];

export default function AlertasPage() {
  const [email, setEmail] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [freeOnly, setFreeOnly] = useState(false);
  const [spanishOnly, setSpanishOnly] = useState(false);
  const [frequency, setFrequency] = useState<"daily" | "weekly">("weekly");
  const [submitted, setSubmitted] = useState(false);

  function toggleCat(cat: string) {
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;

    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        alert_preferences: {
          categories: selectedCats,
          free_only: freeOnly,
          spanish_only: spanishOnly,
          frequency,
        },
      }),
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-[500px] mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--c-green-bg)] flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-[var(--c-green)]" />
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--c-heading)] mb-3">¡Alertas configuradas!</h1>
        <p className="text-[15px] text-[var(--c-dim)]">
          Te avisaremos por email cuando aparezcan herramientas nuevas que encajen con tus preferencias.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto px-6 py-10">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-[var(--c-accent-text)] mb-4">
          <Bell className="w-5 h-5" />
          <span className="text-[13px] font-semibold uppercase tracking-wider">Alertas</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--c-heading)] tracking-tight mb-3">
          Alertas personalizadas
        </h1>
        <p className="text-[15px] text-[var(--c-dim)]">
          Recibe un email cuando aparezca una herramienta nueva que encaje con lo que buscas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label className="text-[13px] font-semibold text-[var(--c-heading)] block mb-2">Tu email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="w-full h-11 px-4 text-[14px] bg-[var(--c-surface)] border border-[var(--c-border2)] rounded-lg text-[var(--c-heading)] outline-none focus:border-[var(--c-accent)] placeholder:text-[var(--c-faint)]"
          />
        </div>

        {/* Categories */}
        <div>
          <label className="text-[13px] font-semibold text-[var(--c-heading)] block mb-2">Categorías que te interesan</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCat(cat)}
                className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                  selectedCats.includes(cat)
                    ? "border-[var(--c-accent-border)] text-[var(--c-accent-text)] bg-[var(--c-accent-subtle)]"
                    : "border-[var(--c-border)] text-[var(--c-dim)] hover:border-[var(--c-accent-border)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[var(--c-faint)] mt-1.5">Deja vacío para recibir de todas las categorías</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={freeOnly} onChange={e => setFreeOnly(e.target.checked)} className="rounded border-[var(--c-border2)]" />
            <span className="text-[13px] text-[var(--c-text)]">Solo con plan gratis</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={spanishOnly} onChange={e => setSpanishOnly(e.target.checked)} className="rounded border-[var(--c-border2)]" />
            <span className="text-[13px] text-[var(--c-text)]">Solo en español</span>
          </label>
        </div>

        {/* Frequency */}
        <div>
          <label className="text-[13px] font-semibold text-[var(--c-heading)] block mb-2">Frecuencia</label>
          <div className="flex gap-2">
            {(["weekly", "daily"] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                className={`text-[13px] px-4 py-2 rounded-lg border transition-colors ${
                  frequency === f
                    ? "border-[var(--c-accent)] bg-[var(--c-accent)] text-white"
                    : "border-[var(--c-border)] text-[var(--c-dim)]"
                }`}
              >
                {f === "weekly" ? "Semanal" : "Diaria"}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-11 rounded-lg bg-[var(--c-accent)] text-white text-[14px] font-semibold hover:opacity-90 transition-opacity"
        >
          Activar alertas
        </button>
      </form>
    </div>
  );
}
