-- Add benefits column to public.courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS benefits jsonb DEFAULT '[]'::jsonb;
