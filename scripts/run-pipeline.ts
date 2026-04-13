/**
 * Script para ejecutar el pipeline y guardar resultados en Supabase.
 *
 * Uso:
 *   npx tsx scripts/run-pipeline.ts
 *   npx tsx scripts/run-pipeline.ts --source hf
 *   npx tsx scripts/run-pipeline.ts --dry-run
 */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // admin access
);

interface PipelineFicha {
  nombre: string;
  slug: string;
  tagline_es: string;
  descripcion_es: string;
  caracteristicas?: string[];
  caso_de_uso?: string;
  pricing_resumen?: string;
  tiene_plan_gratis?: boolean;
  soporta_espanol?: boolean;
  veredicto?: string;
  categoria?: string;
  tags?: string[];
  puntuacion?: number;
  nivel_tecnico?: string;
  source_url?: string;
  source?: string;
  es_open_source?: boolean;
  // HF fields
  que_hace?: string;
  como_usarlo?: string;
  popularidad?: string;
}

async function importFicha(ficha: PipelineFicha): Promise<{ success: boolean; error?: string }> {
  // Buscar categoría por slug
  let categoryId: string | null = null;
  if (ficha.categoria) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", ficha.categoria)
      .single();
    categoryId = cat?.id ?? null;
  }

  // Verificar si ya existe (por slug)
  const { data: existing } = await supabase
    .from("tools")
    .select("id")
    .eq("slug", ficha.slug)
    .single();

  const toolData = {
    slug: ficha.slug,
    name: ficha.nombre,
    tagline_es: ficha.tagline_es,
    description_es: ficha.descripcion_es,
    url: ficha.source_url || null,
    category_id: categoryId,
    tags: ficha.tags || [],
    source: ficha.source || "pipeline",
    pricing_summary: ficha.pricing_resumen || null,
    has_free_plan: ficha.tiene_plan_gratis ?? false,
    supports_spanish: ficha.soporta_espanol ?? false,
    score: ficha.puntuacion || null,
    skill_level: ficha.nivel_tecnico || null,
    is_open_source: ficha.es_open_source ?? false,
    use_case_es: ficha.caso_de_uso || null,
    verdict_es: ficha.veredicto || null,
    how_to_use: ficha.como_usarlo || null,
    pros: ficha.caracteristicas || [],
    status: "review" as const, // va a cola de revisión, no se publica directamente
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    // Actualizar
    const { error } = await supabase
      .from("tools")
      .update(toolData)
      .eq("id", existing.id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } else {
    // Insertar
    const { error } = await supabase
      .from("tools")
      .insert({
        ...toolData,
        logo_color: generateColor(ficha.nombre),
        created_at: new Date().toISOString(),
      });

    if (error) return { success: false, error: error.message };
    return { success: true };
  }
}

// Generar color consistente por nombre
function generateColor(name: string): string {
  const colors = [
    "#635bff", "#1a8cd8", "#e11d48", "#0f172a", "#171717",
    "#059669", "#d97706", "#7c3aed", "#0891b2", "#dc2626",
  ];
  let hash = 0;
  for (const ch of name) hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0;
  return colors[Math.abs(hash) % colors.length];
}

// ── Main ──
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  // Leer fichas del output del pipeline Python
  const fs = await import("fs");
  const path = await import("path");

  // Buscar el JSON más reciente en el output del pipeline
  const pipelineOutput = path.resolve(__dirname, "../../hayunaiapara-pipeline/output");
  if (!fs.existsSync(pipelineOutput)) {
    console.error("No se encontró el directorio de output del pipeline.");
    console.error("Ejecuta primero: cd hayunaiapara-pipeline && python pipeline.py");
    process.exit(1);
  }

  const files = fs.readdirSync(pipelineOutput)
    .filter((f: string) => f.endsWith(".json") && !f.startsWith("."))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.error("No hay archivos JSON en el output del pipeline.");
    process.exit(1);
  }

  const latestFile = path.join(pipelineOutput, files[0]);
  console.log(`Importando desde: ${latestFile}`);

  const raw = JSON.parse(fs.readFileSync(latestFile, "utf-8"));
  const fichas: PipelineFicha[] = raw.fichas ?? [];

  console.log(`${fichas.length} fichas encontradas.`);

  if (dryRun) {
    console.log("(dry-run: no se guardará nada)");
    fichas.slice(0, 3).forEach((f) => console.log(`  - ${f.nombre} [${f.categoria}]`));
    return;
  }

  // Importar
  let ok = 0, errors = 0;
  for (const ficha of fichas) {
    const result = await importFicha(ficha);
    if (result.success) {
      ok++;
      console.log(`  ✓ ${ficha.nombre}`);
    } else {
      errors++;
      console.log(`  ✗ ${ficha.nombre}: ${result.error}`);
    }
  }

  console.log(`\nResultado: ${ok} importadas, ${errors} errores.`);
}

main().catch(console.error);
