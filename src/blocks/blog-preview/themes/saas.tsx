"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlogPreviewBlockData } from "../definition";
import { BlockSettings } from "../../types";
import { supabase } from "@/lib/supabase";

export function BlogPreviewSaaS({ data, isDark, settings }: { data: BlogPreviewBlockData; isDark?: boolean; settings?: BlockSettings }) {
  const dark = isDark !== undefined ? isDark : false;
  const align = settings?.textAlign || "center";
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(data.limit || 3);
      
      const { data: results } = await query;
      if (results) setPosts(results);
    }
    fetchPosts();
  }, [data.limit, data.categorySlug]);

  return (
    <>
      <div className={cn(
        "mb-14",
        align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"
      )}>
        {data.badge && (
          <span className={cn(
            "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border",
            dark ? "bg-white/10 border-white/10 text-white" : "bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/10"
          )}>
            {data.badge}
          </span>
        )}
        {(data.title || data.titleHighlight) && (
          <h2 className={cn("text-3xl md:text-5xl leading-tight mb-4", dark?"text-white":"text-[var(--secondary)]")}>
            {data.title}{" "}
            {data.titleHighlight && <span className="text-[var(--primary)]">{data.titleHighlight}</span>}
          </h2>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, i) => (
          <motion.a
            key={post.id}
            href={`/blog/${post.slug}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "group block border overflow-hidden transition-all duration-500 hover:shadow-[var(--shadow-lg)]",
              dark ? "bg-white/5 border-white/10" : "bg-white border-slate-100 shadow-sm"
            )}
            style={{ borderRadius: "var(--radius-md)" }}
          >
            <div className="aspect-[16/10] overflow-hidden relative">
              <img 
                src={post.thumbnail || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800"} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                alt="" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="p-8 space-y-4">
              <div className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest", dark?"text-white/40":"text-slate-400")}>
                <Calendar className="w-3 h-3" />
                {new Date(post.published_at).toLocaleDateString('vi-VN')}
              </div>
              <h3 className={cn("text-xl font-bold group-hover:text-[var(--primary)] transition-colors", dark ? "text-white" : "text-[var(--secondary)]")}>
                {post.title}
              </h3>
              <p className={cn("text-sm line-clamp-2 leading-relaxed", dark ? "text-white/60" : "text-[var(--secondary)]/60")}>
                {post.excerpt}
              </p>
              <div className="pt-4 flex items-center gap-2 text-[var(--primary)] text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                Đọc bài viết <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </>
  );
}
