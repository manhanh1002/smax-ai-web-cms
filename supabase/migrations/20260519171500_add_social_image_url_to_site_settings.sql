-- Add social_image_url to site_settings table
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS social_image_url text;
