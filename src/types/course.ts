export type Author = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  social_links: any | null;
  created_at: string;
  updated_at: string;
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  author_id: string | null;
  is_published: boolean;
  price: number;
  created_at: string;
  updated_at: string;
  author?: Author; // joined relation
  benefits?: { icon: string; text: string }[];
};

export type Lesson = {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  content: any; // JSONB
  order_index: number;
  is_free_preview: boolean;
  created_at: string;
  updated_at: string;
};
