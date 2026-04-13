/**
 * Seed script: Pobla la base de datos con datos de ejemplo.
 *
 * Uso:
 *   npx tsx scripts/seed.ts
 *   npx tsx scripts/seed.ts --clean   (borra y re-inserta)
 */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Categorías (deben coincidir con schema.sql) ──
const CATEGORIES = [
  { slug: "escritura", name_es: "Escritura", icon: "pen-tool", sort_order: 1, description_es: "Herramientas para redacción, corrección y generación de texto con IA." },
  { slug: "imagen", name_es: "Imagen", icon: "image", sort_order: 2, description_es: "Generación, edición y mejora de imágenes con inteligencia artificial." },
  { slug: "video", name_es: "Video", icon: "video", sort_order: 3, description_es: "Creación, edición y generación de video con IA." },
  { slug: "audio", name_es: "Audio y Voz", icon: "mic", sort_order: 4, description_es: "Síntesis de voz, transcripción, música y procesamiento de audio." },
  { slug: "codigo", name_es: "Código", icon: "code-2", sort_order: 5, description_es: "Asistentes de programación, generación de código y depuración." },
  { slug: "productividad", name_es: "Productividad", icon: "zap", sort_order: 6, description_es: "Herramientas para automatizar tareas, gestionar proyectos y ser más eficiente." },
  { slug: "investigacion", name_es: "Investigación", icon: "search", sort_order: 7, description_es: "Búsqueda avanzada, análisis de datos y asistentes de investigación." },
  { slug: "chatbots", name_es: "Chatbots", icon: "message-circle", sort_order: 8, description_es: "Chatbots, asistentes virtuales y agentes conversacionales." },
  { slug: "marketing", name_es: "Marketing", icon: "megaphone", sort_order: 9, description_es: "Herramientas de marketing digital, SEO, copywriting y redes sociales." },
  { slug: "diseno", name_es: "Diseño", icon: "palette", sort_order: 10, description_es: "Diseño gráfico, UI/UX y herramientas creativas con IA." },
  { slug: "educacion", name_es: "Educación", icon: "graduation-cap", sort_order: 11, description_es: "Plataformas educativas, tutores IA y herramientas de aprendizaje." },
  { slug: "datos", name_es: "Datos y Analytics", icon: "bar-chart-3", sort_order: 12, description_es: "Análisis de datos, visualización, BI y machine learning." },
  { slug: "traduccion", name_es: "Traducción", icon: "languages", sort_order: 13, description_es: "Traducción automática, localización y herramientas multilingüe." },
  { slug: "presentaciones", name_es: "Presentaciones", icon: "presentation", sort_order: 14, description_es: "Generación automática de presentaciones y slides." },
  { slug: "email", name_es: "Email", icon: "mail", sort_order: 15, description_es: "Redacción de emails, automatización y gestión de correo." },
  { slug: "legal", name_es: "Legal", icon: "scale", sort_order: 16, description_es: "Herramientas legales, contratos, compliance y documentación." },
  { slug: "finanzas", name_es: "Finanzas", icon: "wallet", sort_order: 17, description_es: "Análisis financiero, contabilidad y herramientas de inversión." },
  { slug: "salud", name_es: "Salud", icon: "heart-pulse", sort_order: 18, description_es: "Herramientas de salud, diagnóstico y bienestar con IA." },
  { slug: "modelos", name_es: "Modelos y APIs", icon: "cpu", sort_order: 19, description_es: "Modelos de lenguaje, APIs y plataformas de ML." },
  { slug: "otros", name_es: "Otros", icon: "grid-3x3", sort_order: 20, description_es: "Herramientas que no encajan en otra categoría." },
];

// ── Herramientas de ejemplo ──
const TOOLS = [
  {
    slug: "chatgpt",
    name: "ChatGPT",
    tagline_es: "El chatbot de IA más popular del mundo",
    description_es: "ChatGPT de OpenAI es un modelo de lenguaje conversacional que puede responder preguntas, redactar textos, programar y mucho más. Con GPT-4o como modelo más avanzado, es capaz de procesar texto, imágenes y audio. Tiene una versión gratuita generosa y planes de pago que desbloquean funciones avanzadas como análisis de datos, generación de imágenes con DALL-E y navegación web.",
    url: "https://chat.openai.com",
    categoria: "chatbots",
    tags: ["chatbot", "gpt", "openai", "multimodal"],
    score: 9.2,
    skill_level: "Principiante",
    has_free_plan: true,
    supports_spanish: true,
    is_open_source: false,
    pricing_summary: "Gratis (GPT-3.5), Plus $20/mes (GPT-4o), Team $25/usuario/mes",
    use_case_es: "Ideal para cualquier persona que necesite un asistente inteligente para redacción, programación, análisis o lluvia de ideas.",
    verdict_es: "El estándar de oro en chatbots de IA. La versión gratuita es sorprendentemente capaz, y GPT-4o es de lo mejor que hay. Imprescindible.",
    pros: ["Versión gratuita muy completa", "Soporta español excelente", "Plugins y GPTs personalizados", "Multimodal (texto, imagen, voz)"],
    cons: ["Puede inventar información", "Límites de uso en plan gratuito"],
    is_featured: true,
  },
  {
    slug: "claude",
    name: "Claude",
    tagline_es: "IA conversacional con contexto extenso y razonamiento profundo",
    description_es: "Claude de Anthropic destaca por su capacidad de mantener conversaciones largas y complejas gracias a su ventana de contexto de 200K tokens. Es excelente para análisis de documentos largos, programación y tareas que requieren razonamiento profundo. Su enfoque en seguridad y veracidad lo diferencia de la competencia.",
    url: "https://claude.ai",
    categoria: "chatbots",
    tags: ["chatbot", "anthropic", "contexto largo", "razonamiento"],
    score: 9.0,
    skill_level: "Principiante",
    has_free_plan: true,
    supports_spanish: true,
    is_open_source: false,
    pricing_summary: "Gratis (limitado), Pro $20/mes, Team $25/usuario/mes",
    use_case_es: "Perfecto para analizar documentos largos, programación avanzada y tareas que requieren razonamiento cuidadoso.",
    verdict_es: "El rival más serio de ChatGPT. Su ventana de contexto enorme y la calidad de sus respuestas lo hacen ideal para trabajo profesional.",
    pros: ["Contexto de 200K tokens", "Excelente en programación", "Respuestas más matizadas", "Buen soporte de español"],
    cons: ["Versión gratuita más limitada", "No genera imágenes nativamente"],
    is_featured: true,
  },
  {
    slug: "midjourney",
    name: "Midjourney",
    tagline_es: "Generación de imágenes artísticas con calidad profesional",
    description_es: "Midjourney es el referente en generación de imágenes con IA. Produce resultados de calidad artística excepcional, especialmente en estilos fotorealistas, ilustración y arte conceptual. Funciona a través de Discord, aunque ya tiene interfaz web. La V6 ha dado un salto enorme en calidad y coherencia.",
    url: "https://midjourney.com",
    categoria: "imagen",
    tags: ["imagen", "arte", "generación", "creative"],
    score: 9.1,
    skill_level: "Intermedio",
    has_free_plan: false,
    supports_spanish: false,
    is_open_source: false,
    pricing_summary: "Básico $10/mes, Standard $30/mes, Pro $60/mes",
    use_case_es: "Para diseñadores, artistas y creativos que necesitan imágenes de alta calidad para proyectos profesionales.",
    verdict_es: "La mejor calidad artística del mercado. No tiene plan gratis, pero si necesitas imágenes impactantes, merece cada centavo.",
    pros: ["Calidad artística superior", "Estilos variados", "Comunidad activa"],
    cons: ["Sin plan gratis", "Funciona por Discord", "No soporta español en prompts"],
    is_featured: true,
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    tagline_es: "Motor de búsqueda potenciado con IA y fuentes verificables",
    description_es: "Perplexity combina búsqueda web con IA para darte respuestas actualizadas con fuentes citadas. A diferencia de ChatGPT, siempre busca información en internet, lo que lo hace ideal para investigación y preguntas sobre temas actuales. Su modo Pro permite búsquedas más profundas.",
    url: "https://perplexity.ai",
    categoria: "investigacion",
    tags: ["búsqueda", "investigación", "fuentes", "rag"],
    score: 8.7,
    skill_level: "Principiante",
    has_free_plan: true,
    supports_spanish: true,
    is_open_source: false,
    pricing_summary: "Gratis (búsquedas básicas), Pro $20/mes (búsquedas ilimitadas)",
    use_case_es: "Para investigadores, periodistas y cualquiera que necesite respuestas actualizadas con fuentes verificables.",
    verdict_es: "El mejor buscador con IA. Si necesitas información actual y verificable, es superior a preguntarle a un chatbot.",
    pros: ["Cita fuentes siempre", "Información actualizada", "Interfaz limpia", "Plan gratis funcional"],
    cons: ["Respuestas a veces superficiales", "Pro es caro para el uso"],
    is_featured: true,
  },
  {
    slug: "cursor",
    name: "Cursor",
    tagline_es: "El editor de código con IA integrada para desarrolladores",
    description_es: "Cursor es un fork de VS Code con IA integrada que permite autocompletado inteligente, edición por instrucciones en lenguaje natural y chat con tu codebase. Entiende el contexto de tu proyecto completo y puede hacer refactorizaciones complejas en segundos.",
    url: "https://cursor.sh",
    categoria: "codigo",
    tags: ["programación", "editor", "autocompletado", "refactoring"],
    score: 9.0,
    skill_level: "Avanzado",
    has_free_plan: true,
    supports_spanish: false,
    is_open_source: false,
    pricing_summary: "Hobby gratis (2000 completions), Pro $20/mes, Business $40/usuario/mes",
    use_case_es: "Para desarrolladores que quieren multiplicar su productividad con un editor que entiende su código.",
    verdict_es: "Ha cambiado la forma de programar. Si eres desarrollador, probarlo es obligatorio. El plan gratis alcanza para evaluarlo bien.",
    pros: ["Integración con VS Code perfecta", "Entiende contexto del proyecto", "Autocompletado excelente"],
    cons: ["Requiere conocimientos de programación", "Plan gratuito limitado", "Interfaz solo en inglés"],
    is_featured: true,
  },
  {
    slug: "gamma",
    name: "Gamma",
    tagline_es: "Crea presentaciones profesionales con IA en minutos",
    description_es: "Gamma genera presentaciones, documentos y páginas web a partir de texto o un simple prompt. No necesitas saber diseñar: la IA estructura el contenido, elige layouts y aplica estilos automáticamente. Exporta a PowerPoint y PDF.",
    url: "https://gamma.app",
    categoria: "presentaciones",
    tags: ["presentaciones", "slides", "documentos", "no-code"],
    score: 8.3,
    skill_level: "Principiante",
    has_free_plan: true,
    supports_spanish: true,
    is_open_source: false,
    pricing_summary: "Gratis (400 créditos), Plus $8/mes, Pro $15/mes",
    use_case_es: "Ideal para profesionales que necesitan crear presentaciones rápidamente sin dominar PowerPoint o diseño.",
    verdict_es: "La mejor forma de crear presentaciones con IA. Los resultados son sorprendentemente buenos y la interfaz es muy intuitiva.",
    pros: ["Resultados instantáneos", "Diseño automático profesional", "Soporta español", "Exporta a PPTX/PDF"],
    cons: ["Personalización limitada", "Créditos gratuitos se agotan rápido"],
    is_featured: true,
  },
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    tagline_es: "Síntesis de voz ultrarrealista en múltiples idiomas",
    description_es: "ElevenLabs ofrece la síntesis de voz más natural del mercado. Puede clonar tu voz con solo minutos de audio, generar voces en decenas de idiomas y convertir texto a audio con calidad de locutor profesional. Ideal para podcasts, audiolibros y doblaje.",
    url: "https://elevenlabs.io",
    categoria: "audio",
    tags: ["voz", "text-to-speech", "clonación", "audio"],
    score: 8.8,
    skill_level: "Principiante",
    has_free_plan: true,
    supports_spanish: true,
    is_open_source: false,
    pricing_summary: "Gratis (10K chars/mes), Starter $5/mes, Creator $22/mes",
    use_case_es: "Para creadores de contenido, podcasters y empresas que necesitan voces naturales en español.",
    verdict_es: "La mejor síntesis de voz que existe. El español suena muy natural y la clonación de voz es impresionante.",
    pros: ["Calidad de voz excepcional", "Buen español", "Clonación de voz", "API disponible"],
    cons: ["Plan gratis muy limitado", "La clonación requiere plan de pago"],
  },
  {
    slug: "notion-ai",
    name: "Notion AI",
    tagline_es: "IA integrada en tu espacio de trabajo todo-en-uno",
    description_es: "Notion AI añade inteligencia artificial directamente dentro de Notion, permitiéndote resumir páginas, redactar borradores, traducir, extraer datos de tablas y mucho más sin salir de tu flujo de trabajo. Se integra con toda tu base de conocimiento.",
    url: "https://notion.so/product/ai",
    categoria: "productividad",
    tags: ["productividad", "notas", "documentos", "workspace"],
    score: 8.1,
    skill_level: "Principiante",
    has_free_plan: false,
    supports_spanish: true,
    is_open_source: false,
    pricing_summary: "Notion AI: +$8/miembro/mes (requiere Notion base)",
    use_case_es: "Para equipos y profesionales que ya usan Notion y quieren potenciar su productividad con IA integrada.",
    verdict_es: "Si ya usas Notion, es un complemento natural. Si no, el costo combinado puede ser alto comparado con alternativas dedicadas.",
    pros: ["Integración perfecta con Notion", "Acceso a tu base de conocimiento", "Soporta español"],
    cons: ["Requiere suscripción a Notion", "No funciona fuera de Notion", "Precio se suma al base"],
  },
  {
    slug: "runway-ml",
    name: "Runway",
    tagline_es: "Herramientas de video con IA para creadores profesionales",
    description_es: "Runway es una plataforma de edición y generación de video con IA. Su modelo Gen-3 Alpha permite generar clips de video desde texto o imágenes, además de herramientas para eliminar fondos, expandir escenas, y efectos visuales avanzados.",
    url: "https://runwayml.com",
    categoria: "video",
    tags: ["video", "generación", "edición", "vfx"],
    score: 8.5,
    skill_level: "Intermedio",
    has_free_plan: true,
    supports_spanish: false,
    is_open_source: false,
    pricing_summary: "Gratis (125 créditos), Standard $12/mes, Pro $28/mes",
    use_case_es: "Para videógrafos, editores y creadores de contenido que necesitan herramientas de video con IA de nivel profesional.",
    verdict_es: "El líder en generación de video con IA. Los resultados de Gen-3 son impresionantes, pero el consumo de créditos es alto.",
    pros: ["Generación de video estado del arte", "Herramientas de edición potentes", "Plan gratis para probar"],
    cons: ["Créditos se gastan rápido", "Interfaz solo en inglés", "Requiere GPU para algunos features"],
  },
  {
    slug: "deepl",
    name: "DeepL",
    tagline_es: "El traductor con IA más preciso del mercado",
    description_es: "DeepL supera consistentemente a Google Translate en calidad de traducción, especialmente entre idiomas europeos. Su tecnología de redes neuronales produce traducciones que suenan naturales y captura matices que otros traductores pierden. Tiene extensión de navegador, app de escritorio y API.",
    url: "https://deepl.com",
    categoria: "traduccion",
    tags: ["traducción", "idiomas", "localización", "nlp"],
    score: 9.0,
    skill_level: "Principiante",
    has_free_plan: true,
    supports_spanish: true,
    is_open_source: false,
    pricing_summary: "Gratis (5K chars), Starter $9/mes, Advanced $29/mes",
    use_case_es: "Para traductores, empresas internacionales y cualquiera que necesite traducciones de alta calidad.",
    verdict_es: "Simplemente el mejor traductor automático. Para español es excelente y la versión gratuita es suficiente para uso personal.",
    pros: ["Calidad de traducción superior", "Excelente español", "Extensión de navegador", "API robusta"],
    cons: ["Límite de caracteres en versión gratis", "Menos idiomas que Google"],
  },
];

// ── Main ──

async function main() {
  const args = process.argv.slice(2);
  const clean = args.includes("--clean");

  console.log("Seed: Iniciando...\n");

  // 1. Categorías
  if (clean) {
    console.log("  Limpiando tablas...");
    await supabase.from("comparison_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("comparisons").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("tools").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  }

  console.log("  Insertando categorías...");
  for (const cat of CATEGORIES) {
    const { error } = await supabase
      .from("categories")
      .upsert(cat, { onConflict: "slug" });
    if (error) console.error(`    ✗ ${cat.name_es}: ${error.message}`);
    else console.log(`    ✓ ${cat.name_es}`);
  }

  // 2. Herramientas
  console.log("\n  Insertando herramientas...");
  for (const tool of TOOLS) {
    // Buscar category_id
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", tool.categoria)
      .single();

    const { categoria, ...rest } = tool;
    const toolData = {
      ...rest,
      category_id: cat?.id ?? null,
      source: "seed",
      status: "published",
      logo_color: generateColor(tool.name),
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("tools")
      .upsert(toolData, { onConflict: "slug" });

    if (error) console.error(`    ✗ ${tool.name}: ${error.message}`);
    else console.log(`    ✓ ${tool.name}`);
  }

  console.log("\nSeed completado.");
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

main().catch(console.error);
