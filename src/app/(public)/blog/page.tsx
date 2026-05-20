import React from "react";
import { supabase } from "@/lib/supabase";
import { MagazineLayout } from "@/components/blog/layouts/MagazineLayout";
import { GridLayout } from "@/components/blog/layouts/GridLayout";
import { SidebarLayout } from "@/components/blog/layouts/SidebarLayout";

async function getData() {
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
    posts: postsRes.data || [],
    categories: categoriesRes.data || [],
    blogConfig: settingsRes.data?.blog_config || { blog_layout: "magazine" }
  };
}

export default async function BlogPage() {
  const { posts, categories, blogConfig } = await getData();
  const layoutType = blogConfig.blog_layout || "magazine";

  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-slate-50 border-b border-slate-100 py-24 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
            Blog & Kiến thức
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">
            Khám phá <span className="text-primary italic">Smax AI</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium">
            Cập nhật những tin tức mới nhất về trí tuệ nhân tạo, giải pháp kinh doanh và hướng dẫn sử dụng sản phẩm.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        {layoutType === "magazine" && <MagazineLayout posts={posts} />}
        {layoutType === "grid" && <GridLayout posts={posts} categories={categories} />}
        {layoutType === "sidebar" && <SidebarLayout posts={posts} categories={categories} />}
      </div>
    </main>
  );
}
