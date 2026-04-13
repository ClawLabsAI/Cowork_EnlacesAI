import { supabase } from "./supabase";
import type { Tool, Category, SearchResult, ToolFilters, Comparison } from "./types";

const PAGE_SIZE = 24;

// ── Categorías ──────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  if (error) throw error;
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

// ── Herramientas ────────────────────────────────────────────

export async function getTools(filters: ToolFilters = {}): Promise<{
  tools: Tool[];
  total: number;
}> {
  let query = supabase
    .from("tools")
    .select("*, category:categories(*)", { count: "exact" })
    .eq("status", "published");

  // Filtros
  if (filters.category) {
    const cat = await getCategoryBySlug(filters.category);
    if (cat) query = query.eq("category_id", cat.id);
  }
  if (filters.free) query = query.eq("has_free_plan", true);
  if (filters.spanish) query = query.eq("supports_spanish", true);
  if (filters.open_source) query = query.eq("is_open_source", true);

  // Orden
  switch (filters.sort) {
    case "newest":
      query = query.order("published_at", { ascending: false, nullsFirst: false });
      break;
    case "name":
      query = query.order("name");
      break;
    default: // score
      query = query.order("score", { ascending: false, nullsFirst: false });
  }

  // Paginación
  const page = filters.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;
  query = query.range(from, from + PAGE_SIZE - 1);

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    tools: data ?? [],
    total: count ?? 0,
  };
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const { data, error } = await supabase
    .from("tools")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data;
}

export async function getFeaturedTools(limit = 6): Promise<Tool[]> {
  const { data, error } = await supabase
    .from("tools")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("featured_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getLatestTools(limit = 6): Promise<Tool[]> {
  const { data, error } = await supabase
    .from("tools")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getToolsByCountry(country: string, limit = 6): Promise<Tool[]> {
  const { data, error } = await supabase
    .from("tools")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .eq("made_in_country", country)
    .order("score", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getRelatedTools(tool: Tool, limit = 3): Promise<Tool[]> {
  const { data, error } = await supabase
    .from("tools")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .eq("category_id", tool.category_id)
    .neq("id", tool.id)
    .order("score", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

// ── Búsqueda ────────────────────────────────────────────────

export async function searchTools(query: string, limit = 20): Promise<SearchResult[]> {
  const { data, error } = await supabase.rpc("search_tools", {
    query,
    lim: limit,
  });

  if (error) throw error;
  return data ?? [];
}

// ── Comparativas ────────────────────────────────────────────

export async function getComparisons(): Promise<Comparison[]> {
  const { data, error } = await supabase
    .from("comparisons")
    .select("*, items:comparison_items(*, tool:tools(name, slug, logo_color))")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getComparisonBySlug(slug: string): Promise<Comparison | null> {
  const { data, error } = await supabase
    .from("comparisons")
    .select("*, items:comparison_items(*, tool:tools(*))")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

// ── Newsletter ──────────────────────────────────────────────

export async function subscribeEmail(email: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("subscribers")
    .insert({ email, source: "website" });

  if (error) {
    if (error.code === "23505") return { success: true }; // ya existe, ok
    return { success: false, error: error.message };
  }
  return { success: true };
}

// ── Stats ───────────────────────────────────────────────────

export async function getSiteStats(): Promise<{
  tools: number;
  models: number;
  categories: number;
  subscribers: number;
}> {
  const [toolsRes, modelsRes, catsRes, subsRes] = await Promise.all([
    supabase.from("tools").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("tools").select("*", { count: "exact", head: true }).eq("status", "published").eq("is_open_source", true),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("subscribers").select("*", { count: "exact", head: true }).eq("status", "active"),
  ]);

  return {
    tools: toolsRes.count ?? 0,
    models: modelsRes.count ?? 0,
    categories: catsRes.count ?? 0,
    subscribers: subsRes.count ?? 0,
  };
}
