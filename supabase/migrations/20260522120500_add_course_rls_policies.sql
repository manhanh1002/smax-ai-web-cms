-- Enable Row Level Security (RLS)
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Policies for authors
CREATE POLICY "Admins can access authors"
ON public.authors
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all for anon on authors"
ON public.authors
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Policies for courses
CREATE POLICY "Admins can access courses"
ON public.courses
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all for anon on courses"
ON public.courses
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Policies for lessons
CREATE POLICY "Admins can access lessons"
ON public.lessons
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all for anon on lessons"
ON public.lessons
FOR ALL
TO anon
USING (true)
WITH CHECK (true);
