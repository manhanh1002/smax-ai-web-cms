-- Create ai_generation_status table to track real-time generation progress
CREATE TABLE IF NOT EXISTS public.ai_generation_status (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  progress integer NOT NULL DEFAULT 0,
  current_step text NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_generation_status;

-- If pages table doesn't exist, create a basic one for testing. 
-- In a real app, this might be more complex.
CREATE TABLE IF NOT EXISTS public.pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
