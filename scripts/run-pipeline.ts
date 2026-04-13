/**
 * Script para ejecutar el pipeline y guardar resultados en Neon.
 *
 * Uso:
 *   npx tsx scripts/run-pipeline.ts
 *   npx tsx scripts/run-pipeline.ts --dry-run
 */
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

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
  que_hace?: string;
  como_usarlo?: string;
  popularidad?: string;
}

function generateColor(name: string): string {
  const colors = [
    "#635bff", "#1a8cd8", "#e11d48", "#0f172a", "#171717",
    "#059669", "#d97706", "#7c3aed", "#0891b2", "#dc2626",
  ];
  let hash = 0;
  for (const ch of name) hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0;
  return colors[Math.abs(hash) % colors.length];
}

async function importFicha(ficha: PipelineFicha): Promise<{ success: boolean; error?: string }> {
  try {
    // Buscar categoría
    let categoryId: string | null = null;
    if (ficha.categoria) {
      const cats = await sql`SELECT id FROM categories WHERE slug = ${ficha.categoria} LIMIT 1`;
      categoryId = cats[0]?.id ?? null;
    }

    const now = new Date().toISOString();
    const color = generateColor(ficha.nombre);

    await sql`
      INSERT INTO tools (
        slug, name, tagline_es, description_es, url, category_id,
        tags, source, pricing_summary, has_free_plan, supports_spanish,
        score, skill_level, is_open_source, use_case_es, verdict_es,
        how_to_use, pros, logo_color, status, created_at, updated_at
      ) VALUES (
        ${ficha.slug}, ${ficha.nombre}, ${ficha.tagline_es}, ${ficha.descripcion_es},
        ${ficha.source_url ?? null}, ${categoryId},
        ${ficha.tags ?? []}, ${ficha.source ?? "pipeline"},
        ${ficha.pricing_resumen ?? null}, ${ficha.tiene_plan_gratis ?? false},
        ${ficha.soporta_espanol ?? false}, ${ficha.puntuacion ?? null},
        ${ficha.nivel_tecnico ?? null}, ${ficha.es_open_source ?? false},
        ${ficha.caso_de_uso ?? null}, ${ficha.veredicto ?? null},
        ${ficha.como_usarlo ?? null}, ${ficha.caracteristicas ?? []},
        ${color}, 'review', ${now}, ${now}
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        tagline_es = EXCLUDED.tagline_es,
        description_es = EXCLUDED.description_es,
        updated_at = EXCLUDED.updated_at
    `;

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  const fs = await import("fs");
  const path = await import("path");

  const pipelineOutput = path.resolve(__dirname, "../../pipeline_output");
  if (!fs.existsSync(pipelineOutput)) {
    console.error("No se encontró el directorio de output del pipeline.");
    console.error("Ejecuta primero: python pipeline.py");
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
