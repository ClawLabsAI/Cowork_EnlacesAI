/**
 * Seed script: Pobla la base de datos con datos de ejemplo.
 *
 * Uso:
 *   npx tsx scripts/seed.ts
 */
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

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
    skill_level: "principiante",
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
    skill_level: "principiante",
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
    skill_level: "intermedio",
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
    skill_level: "principiante",
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
    skill_level: "avanzado",
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
    categoria: "productividad",
    tags: ["presentaciones", "slides", "documentos", "no-code"],
    score: 8.3,
    skill_level: "principiante",
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
    skill_level: "principiante",
    has_free_plan: true,
    supports_spanish: true,
    is_open_source: false,
    pricing_summary: "Gratis (10K chars/mes), Starter $5/mes, Creator $22/mes",
    use_case_es: "Para creadores de contenido, podcasters y empresas que necesitan voces naturales en español.",
    verdict_es: "La mejor síntesis de voz que existe. El español suena muy natural y la clonación de voz es impresionante.",
    pros: ["Calidad de voz excepcional", "Buen español", "Clonación de voz", "API disponible"],
    cons: ["Plan gratis muy limitado", "La clonación requiere plan de pago"],
    is_featured: false,
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
    skill_level: "principiante",
    has_free_plan: false,
    supports_spanish: true,
    is_open_source: false,
    pricing_summary: "Notion AI: +$8/miembro/mes (requiere Notion base)",
    use_case_es: "Para equipos y profesionales que ya usan Notion y quieren potenciar su productividad con IA integrada.",
    verdict_es: "Si ya usas Notion, es un complemento natural. Si no, el costo combinado puede ser alto comparado con alternativas dedicadas.",
    pros: ["Integración perfecta con Notion", "Acceso a tu base de conocimiento", "Soporta español"],
    cons: ["Requiere suscripción a Notion", "No funciona fuera de Notion", "Precio se suma al base"],
    is_featured: false,
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
    skill_level: "intermedio",
    has_free_plan: true,
    supports_spanish: false,
    is_open_source: false,
    pricing_summary: "Gratis (125 créditos), Standard $12/mes, Pro $28/mes",
    use_case_es: "Para videógrafos, editores y creadores de contenido que necesitan herramientas de video con IA de nivel profesional.",
    verdict_es: "El líder en generación de video con IA. Los resultados de Gen-3 son impresionantes, pero el consumo de créditos es alto.",
    pros: ["Generación de video estado del arte", "Herramientas de edición potentes", "Plan gratis para probar"],
    cons: ["Créditos se gastan rápido", "Interfaz solo en inglés", "Requiere GPU para algunos features"],
    is_featured: false,
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
    skill_level: "principiante",
    has_free_plan: true,
    supports_spanish: true,
    is_open_source: false,
    pricing_summary: "Gratis (5K chars), Starter $9/mes, Advanced $29/mes",
    use_case_es: "Para traductores, empresas internacionales y cualquiera que necesite traducciones de alta calidad.",
    verdict_es: "Simplemente el mejor traductor automático. Para español es excelente y la versión gratuita es suficiente para uso personal.",
    pros: ["Calidad de traducción superior", "Excelente español", "Extensión de navegador", "API robusta"],
    cons: ["Límite de caracteres en versión gratis", "Menos idiomas que Google"],
    is_featured: false,
  },
];

function generateColor(name: string): string {
  const colors = [
    "#635bff", "#1a8cd8", "#e11d48", "#0f172a", "#171717",
    "#059669", "#d97706", "#7c3aed", "#0891b2", "#dc2626",
  ];
  let hash = 0;
  for (const ch of name) hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0;
  return colors[Math.abs(hash) % colors.length];
}

async function main() {
  console.log("Seed: Iniciando...\n");

  // Verificar categorías
  const cats = await sql`SELECT slug, id FROM categories`;
  const catMap = new Map(cats.map((c: any) => [c.slug, c.id]));
  console.log(`  ${catMap.size} categorías encontradas en la DB.\n`);

  // Insertar herramientas
  console.log("  Insertando herramientas...");
  for (const tool of TOOLS) {
    const categoryId = catMap.get(tool.categoria) ?? null;
    const color = generateColor(tool.name);
    const now = new Date().toISOString();

    try {
      await sql`
        INSERT INTO tools (
          slug, name, tagline_es, description_es, url, category_id,
          tags, score, skill_level, has_free_plan, supports_spanish,
          is_open_source, pricing_summary, use_case_es, verdict_es,
          pros, cons, is_featured, logo_color, source, status,
          published_at, featured_at, created_at, updated_at
        ) VALUES (
          ${tool.slug}, ${tool.name}, ${tool.tagline_es}, ${tool.description_es},
          ${tool.url}, ${categoryId}, ${tool.tags}, ${tool.score},
          ${tool.skill_level}, ${tool.has_free_plan}, ${tool.supports_spanish},
          ${tool.is_open_source}, ${tool.pricing_summary}, ${tool.use_case_es},
          ${tool.verdict_es}, ${tool.pros}, ${tool.cons}, ${tool.is_featured},
          ${color}, 'seed', 'published', ${now},
          ${tool.is_featured ? now : null}, ${now}, ${now}
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          tagline_es = EXCLUDED.tagline_es,
          description_es = EXCLUDED.description_es,
          updated_at = EXCLUDED.updated_at
      `;
      console.log(`    ✓ ${tool.name}`);
    } catch (err: any) {
      console.error(`    ✗ ${tool.name}: ${err.message}`);
    }
  }

  console.log("\nSeed completado.");
}

main().catch(console.error);
