import { sql } from "./db";
import type { Tool, Category, SearchResult, ToolFilters, Comparison } from "./types";

const PAGE_SIZE = 24;

// ── Categorías ──────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const rows = await sql`SELECT * FROM categories ORDER BY sort_order`;
  return rows as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const rows = await sql`SELECT * FROM categories WHERE slug = ${slug} LIMIT 1`;
  return (rows[0] as Category) ?? null;
}

// ── Herramientas ────────────────────────────────────────────

export async function getTools(filters: ToolFilters = {}): Promise<{
  tools: Tool[];
  total: number;
}> {
  const page = filters.page ?? 1;
  const offset = (page - 1) * PAGE_SIZE;

  // Build WHERE conditions
  const conditions: string[] = ["t.status = 'published'"];
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.category) {
    conditions.push(`c.slug = $${paramIndex++}`);
    params.push(filters.category);
  }
  if (filters.free) {
    conditions.push(`t.has_free_plan = true`);
  }
  if (filters.spanish) {
    conditions.push(`t.supports_spanish = true`);
  }
  if (filters.open_source) {
    conditions.push(`t.is_open_source = true`);
  }

  const where = conditions.join(" AND ");

  let orderBy = "t.score DESC NULLS LAST";
  if (filters.sort === "newest") orderBy = "t.published_at DESC NULLS LAST";
  if (filters.sort === "name") orderBy = "t.name ASC";

  // Use tagged template for safety — build dynamic query via sql.unsafe or inline
  const countRows = await sql`
    SELECT COUNT(*) as total
    FROM tools t
    LEFT JOIN categories c ON c.id = t.category_id
    WHERE t.status = 'published'
      AND (${filters.category ? sql`c.slug = ${filters.category}` : sql`TRUE`})
      AND (${filters.free ? sql`t.has_free_plan = true` : sql`TRUE`})
      AND (${filters.spanish ? sql`t.supports_spanish = true` : sql`TRUE`})
      AND (${filters.open_source ? sql`t.is_open_source = true` : sql`TRUE`})
  `;

  const total = Number(countRows[0]?.total ?? 0);

  // For ORDER BY we need separate queries per sort type
  let rows: any[];

  if (filters.sort === "newest") {
    rows = await sql`
      SELECT t.*, row_to_json(c.*) as category
      FROM tools t
      LEFT JOIN categories c ON c.id = t.category_id
      WHERE t.status = 'published'
        AND (${filters.category ? sql`c.slug = ${filters.category}` : sql`TRUE`})
        AND (${filters.free ? sql`t.has_free_plan = true` : sql`TRUE`})
        AND (${filters.spanish ? sql`t.supports_spanish = true` : sql`TRUE`})
        AND (${filters.open_source ? sql`t.is_open_source = true` : sql`TRUE`})
      ORDER BY t.published_at DESC NULLS LAST
      LIMIT ${PAGE_SIZE} OFFSET ${offset}
    `;
  } else if (filters.sort === "name") {
    rows = await sql`
      SELECT t.*, row_to_json(c.*) as category
      FROM tools t
      LEFT JOIN categories c ON c.id = t.category_id
      WHERE t.status = 'published'
        AND (${filters.category ? sql`c.slug = ${filters.category}` : sql`TRUE`})
        AND (${filters.free ? sql`t.has_free_plan = true` : sql`TRUE`})
        AND (${filters.spanish ? sql`t.supports_spanish = true` : sql`TRUE`})
        AND (${filters.open_source ? sql`t.is_open_source = true` : sql`TRUE`})
      ORDER BY t.name ASC
      LIMIT ${PAGE_SIZE} OFFSET ${offset}
    `;
  } else {
    rows = await sql`
      SELECT t.*, row_to_json(c.*) as category
      FROM tools t
      LEFT JOIN categories c ON c.id = t.category_id
      WHERE t.status = 'published'
        AND (${filters.category ? sql`c.slug = ${filters.category}` : sql`TRUE`})
        AND (${filters.free ? sql`t.has_free_plan = true` : sql`TRUE`})
        AND (${filters.spanish ? sql`t.supports_spanish = true` : sql`TRUE`})
        AND (${filters.open_source ? sql`t.is_open_source = true` : sql`TRUE`})
      ORDER BY t.score DESC NULLS LAST
      LIMIT ${PAGE_SIZE} OFFSET ${offset}
    `;
  }

  return { tools: rows as Tool[], total };
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const rows = await sql`
    SELECT t.*, row_to_json(c.*) as category
    FROM tools t
    LEFT JOIN categories c ON c.id = t.category_id
    WHERE t.slug = ${slug} AND t.status = 'published'
    LIMIT 1
  `;
  return (rows[0] as Tool) ?? null;
}

export async function getFeaturedTools(limit = 6): Promise<Tool[]> {
  const rows = await sql`
    SELECT t.*, row_to_json(c.*) as category
    FROM tools t
    LEFT JOIN categories c ON c.id = t.category_id
    WHERE t.status = 'published' AND t.is_featured = true
    ORDER BY t.featured_at DESC NULLS LAST
    LIMIT ${limit}
  `;
  return rows as Tool[];
}

export async function getLatestTools(limit = 6): Promise<Tool[]> {
  const rows = await sql`
    SELECT t.*, row_to_json(c.*) as category
    FROM tools t
    LEFT JOIN categories c ON c.id = t.category_id
    WHERE t.status = 'published'
    ORDER BY t.published_at DESC NULLS LAST
    LIMIT ${limit}
  `;
  return rows as Tool[];
}

export async function getToolsByCountry(country: string, limit = 6): Promise<Tool[]> {
  const rows = await sql`
    SELECT t.*, row_to_json(c.*) as category
    FROM tools t
    LEFT JOIN categories c ON c.id = t.category_id
    WHERE t.status = 'published' AND t.made_in_country = ${country}
    ORDER BY t.score DESC NULLS LAST
    LIMIT ${limit}
  `;
  return rows as Tool[];
}

export async function getRelatedTools(tool: Tool, limit = 3): Promise<Tool[]> {
  const rows = await sql`
    SELECT t.*, row_to_json(c.*) as category
    FROM tools t
    LEFT JOIN categories c ON c.id = t.category_id
    WHERE t.status = 'published' AND t.category_id = ${tool.category_id} AND t.id != ${tool.id}
    ORDER BY t.score DESC NULLS LAST
    LIMIT ${limit}
  `;
  return rows as Tool[];
}

// ── Búsqueda ────────────────────────────────────────────────

export async function searchTools(query: string, limit = 20): Promise<SearchResult[]> {
  const rows = await sql`SELECT * FROM search_tools(${query}, ${limit})`;
  return rows as SearchResult[];
}

// ── Comparativas ────────────────────────────────────────────

export async function getComparisons(): Promise<Comparison[]> {
  const rows = await sql`
    SELECT comp.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', ci.id,
            'tool_id', ci.tool_id,
            'scores', ci.scores,
            'sort_order', ci.sort_order,
            'tool', json_build_object('name', t.name, 'slug', t.slug, 'logo_color', t.logo_color)
          )
        ) FILTER (WHERE ci.id IS NOT NULL),
        '[]'
      ) as items
    FROM comparisons comp
    LEFT JOIN comparison_items ci ON ci.comparison_id = comp.id
    LEFT JOIN tools t ON t.id = ci.tool_id
    WHERE comp.status = 'published'
    GROUP BY comp.id
    ORDER BY comp.created_at DESC
  `;
  return rows as Comparison[];
}

export async function getComparisonBySlug(slug: string): Promise<Comparison | null> {
  const rows = await sql`
    SELECT comp.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', ci.id,
            'tool_id', ci.tool_id,
            'scores', ci.scores,
            'sort_order', ci.sort_order,
            'tool', row_to_json(t.*)
          )
        ) FILTER (WHERE ci.id IS NOT NULL),
        '[]'
      ) as items
    FROM comparisons comp
    LEFT JOIN comparison_items ci ON ci.comparison_id = comp.id
    LEFT JOIN tools t ON t.id = ci.tool_id
    WHERE comp.slug = ${slug}
    GROUP BY comp.id
    LIMIT 1
  `;
  return (rows[0] as Comparison) ?? null;
}

// ── Newsletter ──────────────────────────────────────────────

export async function subscribeEmail(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    await sql`
      INSERT INTO subscribers (email, source)
      VALUES (${email}, 'website')
      ON CONFLICT (email) DO NOTHING
    `;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ── Stats ───────────────────────────────────────────────────

export async function getSiteStats(): Promise<{
  tools: number;
  models: number;
  categories: number;
  subscribers: number;
}> {
  const rows = await sql`
    SELECT
      (SELECT COUNT(*) FROM tools WHERE status = 'published') as tools,
      (SELECT COUNT(*) FROM tools WHERE status = 'published' AND is_open_source = true) as models,
      (SELECT COUNT(*) FROM categories) as categories,
      (SELECT COUNT(*) FROM subscribers WHERE status = 'active') as subscribers
  `;

  return {
    tools: Number(rows[0]?.tools ?? 0),
    models: Number(rows[0]?.models ?? 0),
    categories: Number(rows[0]?.categories ?? 0),
    subscribers: Number(rows[0]?.subscribers ?? 0),
  };
}
