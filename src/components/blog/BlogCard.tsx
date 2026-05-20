"use client";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BlogCardProps {
  post: {
    title: string;
    summary?: string;
    published_at?: string;
    created_at: string;
    featured_image?: string;
    slug: string;
    categories?: { name: string; slug: string } | any;
  };
  layout?: "grid" | "list" | "featured";
  index?: number;
}

export function BlogCard({ post, layout = "grid", index = 0 }: BlogCardProps) {
  const date = new Date(post.published_at || post.created_at).toLocaleDateString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

  if (layout === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative overflow-hidden rounded-[40px] bg-slate-900 aspect-[21/9] flex items-center"
      >
        <img
          src={post.featured_image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1600"}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="relative z-10 p-12 md:p-20 max-w-3xl space-y-6">
          <Link 
            href={`/blog/topic/${post.categories?.slug || 'tin-tuc'}`}
            className="inline-block px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest"
          >
            {post.categories?.name || "Tin tức"}
          </Link>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
              {post.title}
            </Link>
          </h2>
          <p className="text-lg text-slate-300 line-clamp-2 font-medium">
            {post.summary}
          </p>
          <div className="flex items-center gap-6 pt-4">
            <Link 
              href={`/blog/${post.slug}`}
              className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/20"
            >
              Đọc bài viết <ArrowRight className="w-5 h-5" />
            </Link>
            <span className="text-slate-400 text-sm font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {date}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (layout === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="group flex flex-col md:flex-row gap-8 p-6 rounded-[32px] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
      >
        <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden shrink-0">
          <img
            src={post.featured_image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
        <div className="flex-1 space-y-3 py-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{post.categories?.name || "Tin tức"}</span>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-xs text-slate-400 font-bold">{date}</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="text-slate-500 line-clamp-2 text-sm leading-relaxed">
            {post.summary}
          </p>
          <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 group-hover:text-primary transition-all pt-2"
          >
            Đọc tiếp <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all flex flex-col h-full"
    >
      <div className="aspect-[16/10] overflow-hidden relative">
        <img
          src={post.featured_image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <Link href={`/blog/topic/${post.categories?.slug || 'tin-tuc'}`}>
            <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900">
              {post.categories?.name || "Tin tức"}
            </span>
          </Link>
        </div>
      </div>
      <div className="p-8 flex flex-col flex-1 space-y-4">
        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
          <Calendar className="w-3.5 h-3.5" />
          {date}
        </div>
        <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight line-clamp-2">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 flex-1 leading-relaxed">
          {post.summary}
        </p>
        <Link 
          href={`/blog/${post.slug}`}
          className="pt-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 group-hover:text-primary transition-all group-hover:gap-3"
        >
          Đọc thêm <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
