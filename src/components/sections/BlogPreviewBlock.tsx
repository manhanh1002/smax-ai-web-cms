"use client";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";

export interface BlogPostItem {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  url: string;
  category?: string;
}

export interface BlogPreviewBlockData {
  badge?: string;
  title: string;
  titleHighlight?: string;
  posts: BlogPostItem[];
  darkMode?: boolean;
}

export function BlogPreviewBlock({ data }: { data: BlogPreviewBlockData }) {
  const isDark = data.darkMode === true;

  return (
    <section className={cn(
      "py-24 transition-colors duration-300",
      isDark ? "bg-[#0F1836] text-white" : "bg-slate-50 text-slate-900"
    )}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            {data.badge && (
              <span className={cn(
                "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border",
                isDark ? "bg-white/10 text-primary border-white/10" : "bg-white text-[#fa6e5b] border-slate-200"
              )}>
                {data.badge}
              </span>
            )}
            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              {data.title}{" "}
              <span className="text-[#fa6e5b]">{data.titleHighlight}</span>
            </h2>
          </div>
          <a href="/blog" className={cn(
            "inline-flex items-center gap-2 text-sm font-black transition-colors group",
            isDark ? "text-white hover:text-primary" : "text-[#0F1836] hover:text-[#fa6e5b]"
          )}>
            Xem tất cả bài viết
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.posts?.map((post, i) => (
            <motion.a
              key={i}
              href={post.url}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "group rounded-[32px] overflow-hidden border transition-all duration-500 shadow-sm hover:shadow-2xl",
                isDark 
                  ? "bg-white/5 border-white/10 hover:border-primary shadow-black/20 hover:shadow-primary/10" 
                  : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-blue-500/10"
              )}
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {post.category && (
                  <span className={cn(
                    "absolute top-4 left-4 px-3 py-1 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest",
                    isDark ? "bg-black/60 text-white" : "bg-white/90 text-[#0F1836]"
                  )}>
                    {post.category}
                  </span>
                )}
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </div>
                <h3 className={cn(
                  "text-xl font-black leading-snug transition-colors line-clamp-2",
                  isDark ? "text-white group-hover:text-primary" : "text-[#0F1836] group-hover:text-blue-600"
                )}>
                  {post.title}
                </h3>
                <p className={cn(
                  "text-sm leading-relaxed line-clamp-2",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  {post.excerpt}
                </p>
                <div className={cn(
                  "pt-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all group-hover:gap-3",
                  isDark ? "text-white" : "text-[#0F1836]"
                )}>
                  Đọc thêm <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";
