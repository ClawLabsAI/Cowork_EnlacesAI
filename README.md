# enlaces.ai

Directorio de herramientas de IA curado en español. Combina lo mejor de theresanaiforthat.com y HuggingFace con contenido original, contexto para LATAM/España, y personalidad editorial propia.

## Stack

- **Next.js 14** (App Router, ISR, Server Components)
- **Supabase** (PostgreSQL, RLS, full-text search en español)
- **Tailwind CSS** (dark/light themes via CSS custom properties)
- **TypeScript**

## Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus keys de Supabase

# 3. Crear la base de datos
# Ejecutar supabase/schema.sql en el SQL Editor de Supabase

# 4. Seed con datos de ejemplo
npx tsx scripts/seed.ts

# 5. Desarrollo
npm run dev
```

## Estructura

```
src/
├── app/
│   ├── page.tsx                  # Homepage con ISR (5min)
│   ├── herramienta/[slug]/       # Ficha detallada de herramienta
│   ├── categoria/[slug]/         # Listado con filtros y paginación
│   ├── comparativa/              # Comparativas lado a lado
│   └── api/                      # Search y newsletter endpoints
├── components/
│   ├── home/SearchBar.tsx        # Búsqueda live con debounce
│   ├── layout/Navbar.tsx         # Nav con toggle dark/light
│   └── tools/ToolCard.tsx        # Tarjeta de herramienta
├── lib/
│   ├── types.ts                  # Interfaces TypeScript
│   ├── supabase.ts               # Cliente Supabase
│   └── data.ts                   # Capa de acceso a datos
└── styles/globals.css            # Tokens dark/light
scripts/
├── seed.ts                       # Datos de ejemplo
└── run-pipeline.ts               # Conector pipeline → Supabase
supabase/
└── schema.sql                    # Esquema completo
```

## Pipeline de contenido

El directorio `../` contiene el pipeline de Python para scraping + generación de fichas con LLM. Ver `pipeline.py --help`.

## Dominio

- **enlaces.ai** — dominio principal
- **hayunaiapara.com** — redirect 301
