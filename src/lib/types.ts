// ============================================================
// TIPOS — enlaces.ai
// ============================================================

export interface Category {
  id: string;
  slug: string;
  name_es: string;
  name_en?: string;
  icon: string;
  description_es?: string;
  tool_count: number;
  sort_order: number;
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  tagline_es?: string;
  description_es?: string;
  url?: string;
  logo_url?: string;
  logo_color: string;

  // Clasificación
  category_id?: string;
  category?: Category;
  tags: string[];
  source?: string;

  // Metadata
  pricing_summary?: string;
  has_free_plan: boolean;
  supports_spanish: boolean;
  score?: number;
  skill_level?: "principiante" | "intermedio" | "avanzado";

  // HF
  is_open_source: boolean;
  hf_model_id?: string;
  hf_downloads?: number;
  hf_likes?: number;
  hf_pipeline_tag?: string;

  // Content
  pros?: string[];
  cons?: string[];
  use_case_es?: string;
  verdict_es?: string;
  how_to_use?: string;
  alternatives?: string[];

  // Localización
  supported_languages?: string[];
  accepts_latam_payments?: boolean;
  gdpr_compliant?: boolean;
  made_in_country?: string;

  // Status
  status: "draft" | "review" | "published" | "archived";
  is_featured: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Comparison {
  id: string;
  slug: string;
  title_es: string;
  description_es?: string;
  category_id?: string;
  criteria?: Record<string, string>;
  items?: ComparisonItem[];
}

export interface ComparisonItem {
  id: string;
  tool_id: string;
  tool?: Tool;
  scores: Record<string, string | boolean | number>;
  sort_order: number;
}

export interface SearchResult {
  id: string;
  slug: string;
  name: string;
  tagline_es?: string;
  description_es?: string;
  logo_color: string;
  category_slug?: string;
  has_free_plan: boolean;
  supports_spanish: boolean;
  score?: number;
  rank: number;
}

// Filtros para la página de herramientas
export interface ToolFilters {
  category?: string;
  free?: boolean;
  spanish?: boolean;
  open_source?: boolean;
  sort?: "score" | "newest" | "name";
  q?: string;
  page?: number;
}
