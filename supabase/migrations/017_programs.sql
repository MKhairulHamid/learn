-- ============================================================
-- 017 — Programs layer
-- Adds a top-level "program" above phases so the platform can host
-- more than one curriculum (e.g. Data Analyst, plus future tracks).
-- The existing Data Analyst curriculum is migrated under one program.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.programs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           text NOT NULL UNIQUE,
  name_id        text NOT NULL,
  name_en        text NOT NULL,
  description_id text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  icon           text NOT NULL DEFAULT '📊',
  color          text NOT NULL DEFAULT 'from-blue-500 to-cyan-500',
  is_published   boolean NOT NULL DEFAULT true,
  order_num      int NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Readable by any authenticated user
DROP POLICY IF EXISTS "programs_read" ON public.programs;
CREATE POLICY "programs_read" ON public.programs
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only admins manage program structure (mentors edit content, not structure)
DROP POLICY IF EXISTS "programs_admin_write" ON public.programs;
CREATE POLICY "programs_admin_write" ON public.programs
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ── Seed the existing curriculum's program ──────────────────
INSERT INTO public.programs (slug, name_id, name_en, description_id, description_en, icon, color, order_num)
VALUES (
  'data-analyst',
  'Data Analyst',
  'Data Analyst',
  'Program intensif 12 sesi untuk menjadi Data Analyst — dari Excel, SQL, visualisasi, hingga Python dan simulasi BNSP.',
  '12-session intensive to become a Data Analyst — from Excel and SQL to visualization, Python, and the BNSP simulation.',
  '📊',
  'from-blue-500 to-cyan-500',
  0
)
ON CONFLICT (slug) DO NOTHING;

-- ── Attach existing phases to the Data Analyst program ──────
ALTER TABLE public.phases
  ADD COLUMN IF NOT EXISTS program_id uuid REFERENCES public.programs(id) ON DELETE RESTRICT;

UPDATE public.phases
  SET program_id = (SELECT id FROM public.programs WHERE slug = 'data-analyst')
  WHERE program_id IS NULL;

ALTER TABLE public.phases ALTER COLUMN program_id SET NOT NULL;

-- ── Scope cohorts to a program ──────────────────────────────
ALTER TABLE public.cohorts
  ADD COLUMN IF NOT EXISTS program_id uuid REFERENCES public.programs(id) ON DELETE RESTRICT;

UPDATE public.cohorts
  SET program_id = (SELECT id FROM public.programs WHERE slug = 'data-analyst')
  WHERE program_id IS NULL;

ALTER TABLE public.cohorts ALTER COLUMN program_id SET NOT NULL;
