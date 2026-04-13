-- ============================================================
-- ENLACES.AI — Database Schema (PostgreSQL / Neon)
-- ============================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- búsqueda fuzzy

-- ============================================================
-- CATEGORÍAS
-- ============================================================
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  name_es     TEXT NOT NULL,
  name_en     TEXT,
  icon        TEXT,
  description_es TEXT,
  tool_count  INT DEFAULT 0,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Categorías iniciales
INSERT INTO categories (slug, name_es, name_en, icon, sort_order) VALUES
  ('escritura',       'Escritura y Texto',      'Writing',            'pen-tool',     1),
  ('imagen',          'Generación de Imágenes',  'Image Generation',   'image',        2),
  ('video',           'Video y Animación',       'Video',              'video',        3),
  ('audio',           'Audio y Música',          'Audio',              'music',        4),
  ('codigo',          'Programación y Código',   'Coding',             'code',         5),
  ('marketing',       'Marketing y SEO',         'Marketing',          'bar-chart-3',  6),
  ('productividad',   'Productividad',           'Productivity',       'rocket',       7),
  ('educacion',       'Educación',               'Education',          'book-open',    8),
  ('negocios',        'Negocios y Finanzas',     'Business',           'credit-card',  9),
  ('legal',           'Legal y Compliance',       'Legal',             'scale',        10),
  ('diseno',          'Diseño y Creatividad',    'Design',             'palette',      11),
  ('datos',           'Análisis de Datos',       'Data Analysis',      'database',     12),
  ('chatbots',        'Chatbots y Asistentes',   'Chatbots',           'message-circle',13),
  ('traduccion',      'Traducción e Idiomas',    'Translation',        'globe',        14),
  ('investigacion',   'Investigación',           'Research',           'search',       15),
  ('redes-sociales',  'Redes Sociales',          'Social Media',       'share-2',      16),
  ('ecommerce',       'E-commerce',              'E-commerce',         'shopping-cart', 17),
  ('rrhh',            'Recursos Humanos',        'HR',                 'users',        18),
  ('salud',           'Salud y Bienestar',       'Health',             'heart',        19),
  ('otros',           'Otros',                   'Other',              'grid',         20);

-- ============================================================
-- HERRAMIENTAS (tools)
-- ============================================================
CREATE TABLE tools (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  tagline_es      TEXT,
  description_es  TEXT,
  url             TEXT,
  logo_url        TEXT,
  logo_color      TEXT DEFAULT '#635bff',

  -- Clasificación
  category_id     UUID REFERENCES categories(id),
  tags            TEXT[] DEFAULT '{}',
  source          TEXT,
  source_url      TEXT,

  -- Metadata
  pricing_summary TEXT,
  has_free_plan   BOOLEAN DEFAULT FALSE,
  supports_spanish BOOLEAN DEFAULT FALSE,
  score           DECIMAL(3,1),
  skill_level     TEXT CHECK (skill_level IN ('principiante','intermedio','avanzado')),

  -- Hugging Face specific
  is_open_source  BOOLEAN DEFAULT FALSE,
  hf_model_id     TEXT,
  hf_downloads    BIGINT,
  hf_likes        INT,
  hf_pipeline_tag TEXT,

  -- Content
  pros            TEXT[],
  cons            TEXT[],
  use_case_es     TEXT,
  verdict_es      TEXT,
  how_to_use      TEXT,
  alternatives    TEXT[],

  -- Localización
  supported_languages TEXT[] DEFAULT '{}',
  accepts_latam_payments BOOLEAN,
  gdpr_compliant  BOOLEAN,
  made_in_country TEXT,

  -- Status
  status          TEXT DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  is_featured     BOOLEAN DEFAULT FALSE,
  featured_at     TIMESTAMPTZ,

  -- Timestamps
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  published_at    TIMESTAMPTZ
);

-- ============================================================
-- COMPARATIVAS
-- ============================================================
CREATE TABLE comparisons (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT UNIQUE NOT NULL,
  title_es      TEXT NOT NULL,
  description_es TEXT,
  category_id   UUID REFERENCES categories(id),
  criteria      JSONB,
  status        TEXT DEFAULT 'draft',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE comparison_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comparison_id UUID REFERENCES comparisons(id) ON DELETE CASCADE,
  tool_id       UUID REFERENCES tools(id),
  scores        JSONB NOT NULL,
  sort_order    INT DEFAULT 0
);

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
CREATE TABLE subscribers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  source        TEXT DEFAULT 'website',
  status        TEXT DEFAULT 'active' CHECK (status IN ('active','unsubscribed','bounced')),
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- ============================================================
-- PIPELINE TRACKING
-- ============================================================
CREATE TABLE pipeline_runs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source        TEXT NOT NULL,
  items_found   INT DEFAULT 0,
  items_new     INT DEFAULT 0,
  items_updated INT DEFAULT 0,
  errors        INT DEFAULT 0,
  started_at    TIMESTAMPTZ DEFAULT NOW(),
  finished_at   TIMESTAMPTZ,
  metadata      JSONB
);

CREATE TABLE pipeline_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id        UUID REFERENCES pipeline_runs(id),
  external_id   TEXT NOT NULL,
  source        TEXT NOT NULL,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','done','error','duplicate')),
  tool_id       UUID REFERENCES tools(id),
  raw_data      JSONB,
  error_message TEXT,
  processed_at  TIMESTAMPTZ
);

-- ============================================================
-- ÍNDICES
-- ============================================================

-- Búsqueda full-text en español
ALTER TABLE tools ADD COLUMN search_vector tsvector;

CREATE OR REPLACE FUNCTION tools_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('spanish', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('spanish', COALESCE(NEW.tagline_es, '')), 'B') ||
    setweight(to_tsvector('spanish', COALESCE(NEW.description_es, '')), 'C') ||
    setweight(to_tsvector('spanish', COALESCE(array_to_string(NEW.tags, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tools_search_trigger
  BEFORE INSERT OR UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION tools_search_update();

CREATE INDEX idx_tools_search ON tools USING GIN(search_vector);
CREATE INDEX idx_tools_name_trgm ON tools USING GIN(name gin_trgm_ops);
CREATE INDEX idx_tools_status ON tools(status) WHERE status = 'published';
CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_tools_featured ON tools(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_tools_source ON tools(source);
CREATE INDEX idx_tools_score ON tools(score DESC NULLS LAST);
CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_pipeline_items_ext ON pipeline_items(external_id, source);

-- ============================================================
-- FUNCIONES
-- ============================================================

-- Búsqueda inteligente (full-text + fuzzy fallback)
CREATE OR REPLACE FUNCTION search_tools(query TEXT, lim INT DEFAULT 20)
RETURNS TABLE(
  id UUID, slug TEXT, name TEXT, tagline_es TEXT,
  description_es TEXT, logo_color TEXT, category_slug TEXT,
  has_free_plan BOOLEAN, supports_spanish BOOLEAN,
  score DECIMAL, rank REAL
) AS $$
BEGIN
  RETURN QUERY
    SELECT
      t.id, t.slug, t.name, t.tagline_es,
      t.description_es, t.logo_color, c.slug AS category_slug,
      t.has_free_plan, t.supports_spanish,
      t.score,
      ts_rank(t.search_vector, websearch_to_tsquery('spanish', query)) AS rank
    FROM tools t
    LEFT JOIN categories c ON c.id = t.category_id
    WHERE t.status = 'published'
      AND (
        t.search_vector @@ websearch_to_tsquery('spanish', query)
        OR t.name % query
      )
    ORDER BY rank DESC, t.score DESC NULLS LAST
    LIMIT lim;
END;
$$ LANGUAGE plpgsql;

-- Actualizar counter cache de categorías
CREATE OR REPLACE FUNCTION update_category_count() RETURNS trigger AS $$
BEGIN
  UPDATE categories SET tool_count = (
    SELECT COUNT(*) FROM tools WHERE category_id = COALESCE(NEW.category_id, OLD.category_id) AND status = 'published'
  ) WHERE id = COALESCE(NEW.category_id, OLD.category_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tools_category_count
  AFTER INSERT OR UPDATE OR DELETE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_category_count();
