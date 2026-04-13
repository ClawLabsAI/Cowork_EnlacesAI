"use client";

import { useState, useEffect } from "react";
import { Search, Plus, X, Star, Check, Minus } from "lucide-react";
import type { Tool } from "@/lib/types";

export default function ComparadorPage() {
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  async function handleSearch(q: string) {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSearchResults(data.results ?? []);
    } catch { setSearchResults([]); }
    finally { setSearching(false); }
  }

  function addTool(result: any) {
    if (selectedTools.length >= 4) return;
    if (selectedTools.find(t => t.slug === result.slug)) return;
    // Fetch full tool data
    fetch(`/api/tool/${result.slug}`).then(r => r.json()).then(data => {
      if (data.tool) {
        setSelectedTools(prev => [...prev, data.tool]);
      }
    });
    setSearchQuery("");
    setSearchResults([]);
    setActiveSlot(null);
  }

  function removeTool(slug: string) {
    setSelectedTools(prev => prev.filter(t => t.slug !== slug));
  }

  const COMPARE_ROWS = [
    { label: "Puntuación", key: "score", format: (v: any) => v ? `${Number(v).toFixed(1)}/10` : "—" },
    { label: "Plan gratis", key: "has_free_plan", format: (v: any) => v ? "Sí" : "No" },
    { label: "En español", key: "supports_spanish", format: (v: any) => v ? "Sí" : "No" },
    { label: "Open source", key: "is_open_source", format: (v: any) => v ? "Sí" : "No" },
    { label: "Nivel", key: "skill_level", format: (v: any) => v ?? "—" },
    { label: "Pricing", key: "pricing_summary", format: (v: any) => v ?? "—" },
  ];

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-[var(--c-accent-text)] mb-4">
          <Search className="w-5 h-5" />
          <span className="text-[13px] font-semibold uppercase tracking-wider">Comparador</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--c-heading)] tracking-tight mb-3">
          Comparador de herramientas
        </h1>
        <p className="text-[15px] text-[var(--c-dim)] max-w-[480px]">
          Selecciona hasta 4 herramientas y compáralas lado a lado.
        </p>
      </div>

      {/* Tool selector */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {selectedTools.map((tool) => (
          <div key={tool.slug} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--c-accent-border)] bg-[var(--c-accent-subtle)]">
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[11px] font-bold" style={{ backgroundColor: tool.logo_color }}>
              {tool.name.charAt(0)}
            </div>
            <span className="text-[13px] font-medium text-[var(--c-heading)]">{tool.name}</span>
            <button onClick={() => removeTool(tool.slug)} className="text-[var(--c-faint)] hover:text-[var(--c-rose)]">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {selectedTools.length < 4 && (
          <div className="relative">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[var(--c-border2)] bg-[var(--c-surface)]">
              <Plus className="w-4 h-4 text-[var(--c-faint)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Añadir herramienta..."
                className="bg-transparent outline-none text-[13px] text-[var(--c-heading)] placeholder:text-[var(--c-faint)] w-40"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-[var(--c-surface)] border border-[var(--c-border2)] rounded-xl shadow-xl overflow-hidden z-50">
                {searchResults.slice(0, 5).map((r: any) => (
                  <button
                    key={r.id}
                    onClick={() => addTool(r)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--c-accent-subtle)] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: r.logo_color }}>
                      {r.name.charAt(0)}
                    </div>
                    <span className="text-[13px] text-[var(--c-heading)]">{r.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comparison table */}
      {selectedTools.length >= 2 ? (
        <div className="rounded-xl border border-[var(--c-border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--c-border)]">
                <th className="text-left px-5 py-4 text-[13px] font-semibold text-[var(--c-faint)] w-[140px]">Característica</th>
                {selectedTools.map(tool => (
                  <th key={tool.slug} className="text-center px-4 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: tool.logo_color }}>
                        {tool.name.charAt(0)}
                      </div>
                      <span className="text-[13px] font-semibold text-[var(--c-heading)]">{tool.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map(({ label, key, format }) => (
                <tr key={key} className="border-b border-[var(--c-border)] last:border-0">
                  <td className="px-5 py-3.5 text-[13px] font-medium text-[var(--c-dim)]">{label}</td>
                  {selectedTools.map(tool => {
                    const val = (tool as any)[key];
                    const display = format(val);
                    const isYes = display === "Sí";
                    const isNo = display === "No";
                    return (
                      <td key={tool.slug} className="text-center px-4 py-3.5">
                        {isYes ? (
                          <Check className="w-4 h-4 text-[var(--c-green)] mx-auto" />
                        ) : isNo ? (
                          <Minus className="w-4 h-4 text-[var(--c-faint)] mx-auto" />
                        ) : (
                          <span className="text-[13px] text-[var(--c-text)]">{display}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Pros */}
              <tr className="border-b border-[var(--c-border)]">
                <td className="px-5 py-3.5 text-[13px] font-medium text-[var(--c-dim)] align-top">A favor</td>
                {selectedTools.map(tool => (
                  <td key={tool.slug} className="px-4 py-3.5 align-top">
                    <ul className="space-y-1">
                      {tool.pros?.slice(0, 3).map((p, i) => (
                        <li key={i} className="text-[12px] text-[var(--c-text)] flex gap-1.5">
                          <Check className="w-3 h-3 text-[var(--c-green)] shrink-0 mt-0.5" /> {p}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              {/* Cons */}
              <tr>
                <td className="px-5 py-3.5 text-[13px] font-medium text-[var(--c-dim)] align-top">En contra</td>
                {selectedTools.map(tool => (
                  <td key={tool.slug} className="px-4 py-3.5 align-top">
                    <ul className="space-y-1">
                      {tool.cons?.slice(0, 3).map((c, i) => (
                        <li key={i} className="text-[12px] text-[var(--c-text)] flex gap-1.5">
                          <Minus className="w-3 h-3 text-[var(--c-rose)] shrink-0 mt-0.5" /> {c}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : selectedTools.length === 1 ? (
        <p className="text-[14px] text-[var(--c-dim)] text-center py-12">Añade al menos una herramienta más para comparar.</p>
      ) : (
        <div className="text-center py-20 rounded-xl border border-dashed border-[var(--c-border2)] bg-[var(--c-surface)]">
          <Search className="w-10 h-10 text-[var(--c-faint)] mx-auto mb-4" />
          <p className="text-[var(--c-dim)] text-[15px]">Busca y selecciona herramientas para comparar</p>
        </div>
      )}
    </div>
  );
}
