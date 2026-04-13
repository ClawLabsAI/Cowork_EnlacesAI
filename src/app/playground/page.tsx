"use client";

import { useState } from "react";
import { Cpu, Play, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

const MODELS = [
  {
    id: "meta-llama/Llama-3.1-8B-Instruct",
    name: "Llama 3.1 8B",
    desc: "Modelo de Meta — generación de texto y chat",
    type: "text",
    placeholder: "Escribe aquí tu prompt en español...",
  },
  {
    id: "Helsinki-NLP/opus-mt-en-es",
    name: "Opus MT (EN→ES)",
    desc: "Traducción de inglés a español",
    type: "translation",
    placeholder: "Enter English text to translate...",
  },
  {
    id: "facebook/bart-large-cnn",
    name: "BART CNN",
    desc: "Resumen automático de textos",
    type: "summarization",
    placeholder: "Pega aquí un texto largo para resumir...",
  },
  {
    id: "openai/whisper-large-v3",
    name: "Whisper v3",
    desc: "Transcripción de audio a texto",
    type: "audio",
    placeholder: "Sube un archivo de audio",
  },
];

export default function PlaygroundPage() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRun() {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");

    // In production, this would call HuggingFace Inference API
    // For now, simulate a response
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (selectedModel.type === "translation") {
      setOutput(`[Traducción simulada]\n\nEsto es una demostración del playground. En producción, este texto se enviaría al modelo ${selectedModel.name} de HuggingFace y recibirías la traducción real.`);
    } else if (selectedModel.type === "summarization") {
      setOutput(`[Resumen simulado]\n\nEsta es una demostración del playground. El modelo ${selectedModel.name} generaría un resumen real del texto proporcionado.`);
    } else {
      setOutput(`[Respuesta simulada]\n\nEsta es una demostración del playground de ${selectedModel.name}. En producción, conectaremos con la API de HuggingFace Inference para obtener respuestas reales del modelo.`);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-[var(--c-accent-text)] mb-4">
          <Cpu className="w-5 h-5" />
          <span className="text-[13px] font-semibold uppercase tracking-wider">Playground</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--c-heading)] tracking-tight mb-3">
          Playground de modelos
        </h1>
        <p className="text-[15px] text-[var(--c-dim)] max-w-[480px]">
          Prueba modelos de IA open source directamente en tu navegador, sin registro ni configuración.
        </p>
      </div>

      {/* Model selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {MODELS.map(model => (
          <button
            key={model.id}
            onClick={() => { setSelectedModel(model); setOutput(""); }}
            className={`text-left p-4 rounded-lg border transition-colors ${
              selectedModel.id === model.id
                ? "border-[var(--c-accent-border)] bg-[var(--c-accent-subtle)]"
                : "border-[var(--c-border)] bg-[var(--c-surface)] hover:border-[var(--c-border2)]"
            }`}
          >
            <p className="text-[14px] font-semibold text-[var(--c-heading)] mb-1">{model.name}</p>
            <p className="text-[12px] text-[var(--c-dim)]">{model.desc}</p>
          </button>
        ))}
      </div>

      {/* Input/Output */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <label className="text-[13px] font-semibold text-[var(--c-heading)] block mb-2">Input</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={selectedModel.placeholder}
            rows={8}
            className="w-full p-4 text-[14px] bg-[var(--c-surface)] border border-[var(--c-border2)] rounded-xl text-[var(--c-heading)] outline-none resize-none focus:border-[var(--c-accent)] placeholder:text-[var(--c-faint)]"
          />
          <button
            onClick={handleRun}
            disabled={loading || !input.trim()}
            className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--c-accent)] text-white text-[14px] font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
            ) : (
              <><Play className="w-4 h-4" /> Ejecutar</>
            )}
          </button>
        </div>

        <div>
          <label className="text-[13px] font-semibold text-[var(--c-heading)] block mb-2">Output</label>
          <div className="w-full min-h-[200px] p-4 text-[14px] bg-[var(--c-surface)] border border-[var(--c-border)] rounded-xl text-[var(--c-text)] whitespace-pre-wrap">
            {output || <span className="text-[var(--c-faint)]">El resultado aparecerá aquí...</span>}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 p-5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)]">
        <p className="text-[14px] text-[var(--c-dim)]">
          <strong className="text-[var(--c-heading)]">¿Cómo funciona?</strong>{" "}
          El playground usa la API de HuggingFace Inference para ejecutar modelos open source directamente desde el navegador.
          No necesitas cuenta ni API key. Los modelos se ejecutan en los servidores de HuggingFace.
        </p>
        <Link href="/categoria/modelos" className="inline-flex items-center gap-1 mt-2 text-[13px] font-medium text-[var(--c-accent-text)] hover:underline">
          Ver todos los modelos <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
