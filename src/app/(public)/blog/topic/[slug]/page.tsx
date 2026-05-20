import React from "react";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { GridLayout } from "@/components/blog/layouts/GridLayout";
import { SidebarLayout } from "@/components/blog/layouts/SidebarLayout";

async function getData(categorySlug: string) {
  // Get category first
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", categorySlug)
    .single();

  if (!category) return null;

  const [postsRes, categoriesRes, settingsRes] = await Promise.all([
    supabase
      .from("posts")
      .select("*, categories(name, slug)")
      .eq("status", "published")
      .order("published_at", { ascending: false }),
    supabase
      .from("categories")
      .select("*"),
    supabase
      .from("site_settings")
      .select("blog_config")
      .single()
  ]);

  return {
    category,
    posts: postsRes.data || [],
    categories: categoriesRes.data || [],
    blogConfig: settingsRes.data?.blog_config || { category_layout: "grid" }
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getData(slug);

  if (!data) notFound();

  const { category, posts, categories, blogConfig } = data;
  const layoutType = blogConfig.category_layout || "grid";

  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-slate-50 border-b border-slate-100 py-24 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex items-center gap-4">
            <a href="/blog" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Blog</a>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-xs font-black uppercase tracking-widest text-primary">{category.name}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none capitalize">
            {category.name}
          </h1>
          {category.description && (
            <p className="max-w-2xl text-lg text-slate-500 font-medium">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        {layoutType === "grid" && <GridLayout posts={posts} categories={categories} initialCategory={category.slug} />}
        {layoutType === "sidebar" && <SidebarLayout posts={posts} categories={categories} />}
      </div>
    </main>
  );
}
