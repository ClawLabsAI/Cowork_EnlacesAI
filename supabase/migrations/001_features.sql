-- ============================================================
-- ENLACES.AI — Migration 001: New Features
-- Stacks, Projects, Reviews, Guides, Alerts, Calculator
-- ============================================================

-- ============================================================
-- STACKS (combinaciones de herramientas)
-- ============================================================
CREATE TABLE stacks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,               -- "Stack para YouTuber"
  description   TEXT,
  author_name   TEXT NOT NULL,               -- nombre del creador
  author_email  TEXT,
  use_case      TEXT,                        -- "Creación de contenido", "Marketing", etc.
  votes         INT DEFAULT 0,
  status        TEXT DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE stack_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stack_id      UUID REFERENCES stacks(id) ON DELETE CASCADE,
  tool_id       UUID REFERENCES tools(id),
  role          TEXT,                        -- "Para los guiones", "Para la voz"
  sort_order    INT DEFAULT 0
);

CREATE INDEX idx_stacks_slug ON stacks(slug);
CREATE INDEX idx_stacks_votes ON stacks(votes DESC);
CREATE INDEX idx_stack_items_stack ON stack_items(stack_id);

-- ============================================================
-- PROJECTS ("Construye con IA")
-- ============================================================
CREATE TABLE projects (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,               -- "Podcast automatizado con IA"
  description   TEXT NOT NULL,
  author_name   TEXT NOT NULL,
  author_url    TEXT,                        -- enlace al autor (twitter, web)
  image_url     TEXT,                        -- captura del proyecto
  project_url   TEXT,                        -- enlace al proyecto
  votes         INT DEFAULT 0,
  status        TEXT DEFAULT 'published' CHECK (status IN ('draft','review','published','archived')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE project_tools (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id    UUID REFERENCES projects(id) ON DELETE CASCADE,
  tool_id       UUID REFERENCES tools(id),
  usage_note    TEXT                         -- "Lo uso para generar las voces"
);

CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_votes ON projects(votes DESC);
CREATE INDEX idx_project_tools_project ON project_tools(project_id);

-- ============================================================
-- REVIEWS (comunidad)
-- ============================================================
CREATE TABLE reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id       UUID REFERENCES tools(id) ON DELETE CASCADE,
  author_name   TEXT NOT NULL,
  author_email  TEXT,
  rating        INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title         TEXT,
  body          TEXT,
  -- Contexto LATAM
  country       TEXT,                        -- "MX", "CO", "ES"
  payment_works BOOLEAN,                     -- ¿Funciona el pago desde tu país?
  spanish_quality TEXT CHECK (spanish_quality IN ('excelente','bueno','regular','malo','no_tiene')),
  spanish_support BOOLEAN,                   -- ¿El soporte responde en español?
  helpful_count INT DEFAULT 0,
  status        TEXT DEFAULT 'published' CHECK (status IN ('pending','published','hidden')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_tool ON reviews(tool_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Add avg rating cache to tools
ALTER TABLE tools ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(2,1);
ALTER TABLE tools ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0;

-- Trigger to update avg rating
CREATE OR REPLACE FUNCTION update_tool_rating() RETURNS trigger AS $$
BEGIN
  UPDATE tools SET
    avg_rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id) AND status = 'published'),
    review_count = (SELECT COUNT(*) FROM reviews WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id) AND status = 'published')
  WHERE id = COALESCE(NEW.tool_id, OLD.tool_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_update_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_tool_rating();

-- ============================================================
-- GUIDES (guías de caso de uso)
-- ============================================================
CREATE TABLE guides (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,               -- "Las mejores IAs para abogados en LATAM"
  description   TEXT,
  content       TEXT,                        -- contenido markdown
  profession    TEXT,                        -- "abogados", "profesores", "marketers"
  category_id   UUID REFERENCES categories(id),
  image_url     TEXT,
  status        TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE guide_tools (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id      UUID REFERENCES guides(id) ON DELETE CASCADE,
  tool_id       UUID REFERENCES tools(id),
  recommendation TEXT,                       -- por qué se recomienda en este contexto
  sort_order    INT DEFAULT 0
);

CREATE INDEX idx_guides_slug ON guides(slug);
CREATE INDEX idx_guides_profession ON guides(profession);
CREATE INDEX idx_guide_tools_guide ON guide_tools(guide_id);

-- ============================================================
-- ALERTS (alertas personalizadas)
-- ============================================================
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS alert_preferences JSONB DEFAULT '{}';
-- Estructura: { "categories": ["video","audio"], "free_only": true, "spanish_only": true, "frequency": "weekly" }

CREATE TABLE alerts_log (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  tool_id       UUID REFERENCES tools(id),
  sent_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRICING DATA (para calculadora de costes)
-- ============================================================
CREATE TABLE pricing_plans (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id       UUID REFERENCES tools(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,               -- "Free", "Pro", "Enterprise"
  price_monthly DECIMAL(10,2),               -- NULL = custom/contact
  price_yearly  DECIMAL(10,2),
  currency      TEXT DEFAULT 'USD',
  is_free       BOOLEAN DEFAULT FALSE,
  features      TEXT[],                      -- lista de features incluidas
  limits        JSONB,                       -- {"messages": 100, "images": 50, "minutes": 10}
  sort_order    INT DEFAULT 0
);

CREATE INDEX idx_pricing_tool ON pricing_plans(tool_id);
