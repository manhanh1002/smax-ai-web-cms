CREATE TABLE public.page_versions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  status text NOT NULL,
  content_config jsonb,
  blocks jsonb,
  layout_type text,
  hide_header boolean,
  hide_footer boolean,
  sidebar_left_id uuid,
  sidebar_right_id uuid,
  category_id uuid,
  type text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  created_by uuid,
  description text DEFAULT 'Lưu thủ công'::text,
  CONSTRAINT page_versions_pkey PRIMARY KEY (id),
  CONSTRAINT page_versions_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.pages (id) ON DELETE CASCADE,
  CONSTRAINT page_versions_sidebar_left_id_fkey FOREIGN KEY (sidebar_left_id) REFERENCES public.sidebars (id) ON DELETE SET NULL,
  CONSTRAINT page_versions_sidebar_right_id_fkey FOREIGN KEY (sidebar_right_id) REFERENCES public.sidebars (id) ON DELETE SET NULL,
  CONSTRAINT page_versions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.page_categories (id) ON DELETE SET NULL,
  CONSTRAINT page_versions_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users (id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.page_versions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can access page versions"
ON public.page_versions
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all for anon on page versions"
ON public.page_versions
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Index for performance
CREATE INDEX idx_page_versions_page_id ON public.page_versions(page_id);
