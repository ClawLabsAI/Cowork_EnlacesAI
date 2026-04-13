"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import type { SearchResult } from "@/lib/types";

const POPULAR = [
  "crear presentaciones",
  "transcribir audio",
  "generar imágenes",
  "escribir emails",
  "resumir textos",
];

interface Props {
  compact?: boolean;
}

export function SearchBar({ compact }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setIsOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 250);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/categoria/todas?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} className={`relative w-full ${compact ? "" : "max-w-[520px] mx-auto"}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-faint)] ${compact ? "w-4 h-4" : "w-[18px] h-[18px] left-4"}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={compact ? "Buscar..." : "Buscar herramienta o caso de uso..."}
            className={`w-full bg-[var(--c-surface)] border border-[var(--c-border2)] text-[var(--c-heading)] outline-none transition-all placeholder:text-[var(--c-faint)] focus:border-[var(--c-accent)] ${
              compact
                ? "h-9 pl-9 pr-8 text-[13px] rounded-lg"
                : "h-[50px] pl-11 pr-10 text-[15px] rounded-xl focus:ring-[3px] focus:ring-[var(--c-accent-subtle)]"
            }`}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setResults([]); setIsOpen(false); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-[var(--c-surface2)] text-[var(--c-faint)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {/* Popular searches — only in full mode */}
      {!compact && (
        <div className="flex justify-center gap-1.5 mt-3 flex-wrap">
          {POPULAR.map((term) => (
            <button
              key={term}
              onClick={() => { setQuery(term); doSearch(term); }}
              className="text-[12px] font-medium px-3 py-1 rounded-md border border-[var(--c-border)] text-[var(--c-dim)] hover:border-[var(--c-accent-border)] hover:text-[var(--c-accent-text)] hover:bg-[var(--c-accent-subtle)] transition-all"
            >
              {term}
            </button>
          ))}
        </div>
      )}

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div className={`absolute left-0 right-0 bg-[var(--c-surface)] border border-[var(--c-border2)] rounded-xl shadow-xl overflow-hidden z-50 ${compact ? "top-[42px]" : "top-[56px]"}`}>
          {results.slice(0, 6).map((r) => (
            <button
              key={r.id}
              onClick={() => {
                router.push(`/herramienta/${r.slug}`);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--c-accent-subtle)] transition-colors"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: r.logo_color }}
              >
                {r.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-medium text-[var(--c-heading)] truncate">{r.name}</div>
                <div className="text-[12px] text-[var(--c-dim)] truncate">{r.tagline_es}</div>
              </div>
              {r.score && (
                <span className="ml-auto text-[12px] font-bold text-[var(--c-heading)]">{Number(r.score).toFixed(1)}</span>
              )}
            </button>
          ))}
          <button
            onClick={() => {
              router.push(`/categoria/todas?q=${encodeURIComponent(query)}`);
              setIsOpen(false);
            }}
            className="w-full px-4 py-2.5 text-[13px] font-medium text-[var(--c-accent-text)] bg-[var(--c-surface2)] hover:bg-[var(--c-accent-subtle)] transition-colors text-center"
          >
            Ver todos los resultados
          </button>
        </div>
      )}
    </div>
  );
}
