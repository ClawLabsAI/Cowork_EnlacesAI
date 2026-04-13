"use client";

import { useState } from "react";
import { Calculator, Plus, X, DollarSign } from "lucide-react";

interface ToolUsage {
  name: string;
  plan: string;
  cost: number;
}

const POPULAR_TOOLS = [
  { name: "ChatGPT Plus", plans: [{ label: "Gratis", cost: 0 }, { label: "Plus ($20/mes)", cost: 20 }, { label: "Team ($25/usuario)", cost: 25 }] },
  { name: "Claude Pro", plans: [{ label: "Gratis", cost: 0 }, { label: "Pro ($20/mes)", cost: 20 }, { label: "Team ($25/usuario)", cost: 25 }] },
  { name: "Midjourney", plans: [{ label: "Basic ($10/mes)", cost: 10 }, { label: "Standard ($30/mes)", cost: 30 }, { label: "Pro ($60/mes)", cost: 60 }] },
  { name: "Cursor", plans: [{ label: "Hobby (gratis)", cost: 0 }, { label: "Pro ($20/mes)", cost: 20 }, { label: "Business ($40/usuario)", cost: 40 }] },
  { name: "ElevenLabs", plans: [{ label: "Gratis", cost: 0 }, { label: "Starter ($5/mes)", cost: 5 }, { label: "Creator ($22/mes)", cost: 22 }] },
  { name: "Gamma", plans: [{ label: "Gratis", cost: 0 }, { label: "Plus ($8/mes)", cost: 8 }, { label: "Pro ($15/mes)", cost: 15 }] },
  { name: "Perplexity", plans: [{ label: "Gratis", cost: 0 }, { label: "Pro ($20/mes)", cost: 20 }] },
  { name: "DeepL", plans: [{ label: "Gratis", cost: 0 }, { label: "Starter ($9/mes)", cost: 9 }, { label: "Advanced ($29/mes)", cost: 29 }] },
  { name: "Notion AI", plans: [{ label: "AI Add-on ($8/mes)", cost: 8 }] },
  { name: "Runway", plans: [{ label: "Gratis", cost: 0 }, { label: "Standard ($12/mes)", cost: 12 }, { label: "Pro ($28/mes)", cost: 28 }] },
];

export default function CalculadoraPage() {
  const [selected, setSelected] = useState<{ name: string; planIndex: number }[]>([]);

  function addTool(name: string) {
    if (selected.find(s => s.name === name)) return;
    setSelected(prev => [...prev, { name, planIndex: 0 }]);
  }

  function removeTool(name: string) {
    setSelected(prev => prev.filter(s => s.name !== name));
  }

  function changePlan(name: string, planIndex: number) {
    setSelected(prev => prev.map(s => s.name === name ? { ...s, planIndex } : s));
  }

  const totalMonthly = selected.reduce((sum, s) => {
    const tool = POPULAR_TOOLS.find(t => t.name === s.name);
    return sum + (tool?.plans[s.planIndex]?.cost ?? 0);
  }, 0);

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-[var(--c-accent-text)] mb-4">
          <Calculator className="w-5 h-5" />
          <span className="text-[13px] font-semibold uppercase tracking-wider">Calculadora</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--c-heading)] tracking-tight mb-3">
          Calculadora de costes IA
        </h1>
        <p className="text-[15px] text-[var(--c-dim)] max-w-[480px]">
          Selecciona las herramientas que usas, elige el plan y calcula tu gasto mensual.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Tool list */}
        <div>
          <h2 className="text-[14px] font-semibold text-[var(--c-heading)] mb-4">Herramientas populares</h2>
          <div className="space-y-2">
            {POPULAR_TOOLS.map((tool) => {
              const isSelected = selected.find(s => s.name === tool.name);
              return (
                <div
                  key={tool.name}
                  className={`rounded-lg border p-4 transition-colors ${
                    isSelected
                      ? "border-[var(--c-accent-border)] bg-[var(--c-accent-subtle)]"
                      : "border-[var(--c-border)] bg-[var(--c-surface)] hover:border-[var(--c-border2)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-medium text-[var(--c-heading)]">{tool.name}</span>
                    {isSelected ? (
                      <button onClick={() => removeTool(tool.name)} className="text-[var(--c-rose)] text-[12px] font-medium flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> Quitar
                      </button>
                    ) : (
                      <button onClick={() => addTool(tool.name)} className="text-[var(--c-accent-text)] text-[12px] font-medium flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" /> Añadir
                      </button>
                    )}
                  </div>
                  {isSelected && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {tool.plans.map((plan, i) => (
                        <button
                          key={i}
                          onClick={() => changePlan(tool.name, i)}
                          className={`text-[12px] px-3 py-1.5 rounded-md border transition-colors ${
                            isSelected.planIndex === i
                              ? "border-[var(--c-accent)] bg-[var(--c-accent)] text-white"
                              : "border-[var(--c-border)] text-[var(--c-dim)] hover:border-[var(--c-accent-border)]"
                          }`}
                        >
                          {plan.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-20 h-fit">
          <div className="rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6">
            <h2 className="text-[14px] font-semibold text-[var(--c-heading)] mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Resumen
            </h2>

            {selected.length > 0 ? (
              <>
                <div className="space-y-2 mb-4">
                  {selected.map(s => {
                    const tool = POPULAR_TOOLS.find(t => t.name === s.name);
                    const plan = tool?.plans[s.planIndex];
                    return (
                      <div key={s.name} className="flex justify-between text-[13px]">
                        <span className="text-[var(--c-text)]">{s.name}</span>
                        <span className="font-medium text-[var(--c-heading)]">
                          {plan?.cost === 0 ? "Gratis" : `$${plan?.cost}/mes`}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-4 border-t border-[var(--c-border)]">
                  <div className="flex justify-between">
                    <span className="text-[14px] font-semibold text-[var(--c-heading)]">Total mensual</span>
                    <span className="text-[20px] font-extrabold text-[var(--c-accent-text)]">${totalMonthly}</span>
                  </div>
                  <p className="text-[12px] text-[var(--c-faint)] mt-1">${(totalMonthly * 12).toFixed(0)}/año</p>
                </div>
              </>
            ) : (
              <p className="text-[13px] text-[var(--c-faint)]">Añade herramientas para calcular el coste.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
