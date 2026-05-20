"use client";
import React from "react";
import { BlogCard } from "../BlogCard";
import { Search, ChevronRight } from "lucide-react";
import Link from "next/link";

interface SidebarLayoutProps {
  posts: any[];
  categories: any[];
}

export function SidebarLayout({ posts, categories }: SidebarLayoutProps) {
  const recentPosts = posts.slice(0, 5);

  return (
    <div className="flex flex-col lg:flex-row gap-16">
      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {posts.map((post, index) => (
          <BlogCard key={post.id} post={post} layout="list" index={index} />
        ))}
        {posts.length === 0 && (
          <div className="py-20 text-center bg-slate-50 rounded-[32px]">
            <p className="text-slate-400 font-bold uppercase tracking-widest">Chưa có bài viết nào</p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="w-full lg:w-80 space-y-12 shrink-0">
        {/* Search Widget */}
        <div className="space-y-4">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-primary pl-4">Tìm kiếm</h4>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Nhập từ khóa..." 
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Categories Widget */}
        <div className="space-y-4">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-primary pl-4">Chuyên mục</h4>
          <div className="flex flex-col gap-1">
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/blog/topic/${cat.slug}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 group transition-all"
              >
                <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">{cat.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Posts Widget */}
        <div className="space-y-6">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-primary pl-4">Bài viết mới nhất</h4>
          <div className="space-y-6">
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <img 
                    src={post.featured_image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=200"} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={post.title}
                  />
                </div>
                <div className="space-y-1 py-1">
                  <h5 className="text-sm font-black text-slate-900 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h5>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(post.published_at || post.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
