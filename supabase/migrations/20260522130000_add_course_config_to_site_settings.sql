ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS course_config jsonb DEFAULT '{}'::jsonb;
