"use client";
import { motion } from "framer-motion";

export interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
}

export interface TestimonialsBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  items: TestimonialItem[];
  darkMode?: boolean;
}

export function TestimonialsBlock({ data }: { data: TestimonialsBlockData }) {
  const isDark = data.darkMode === true;

  return (
    <section className={cn(
      "py-20 transition-colors duration-300",
      isDark ? "bg-[#0F1836] text-white" : "bg-white"
    )}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          {data.badge && (
            <span className={cn(
              "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5",
              isDark ? "bg-white/10 text-[#fa6e5b]" : "bg-[#f4f7ff] text-[#fa6e5b]"
            )}>
              {data.badge}
            </span>
          )}
          {(data.title || data.titleHighlight) && (
            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              {data.title}{" "}
              {data.titleHighlight && (
                <span className="text-[#fa6e5b]">{data.titleHighlight}</span>
              )}
            </h2>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data.items?.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-7 rounded-3xl border transition-all duration-300",
                isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"
              )}
            >
              <svg className={cn(
                "w-8 h-8 mb-5 opacity-40",
                isDark ? "text-primary" : "text-[#2563eb]"
              )} viewBox="0 0 448 512" fill="currentColor">
                <path d="M0 216C0 149.7 53.7 96 120 96l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72zm256 0c0-66.3 53.7-120 120-120l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72z" />
              </svg>
              <p className={cn(
                "text-sm leading-loose mb-7",
                isDark ? "text-slate-300" : "text-slate-600"
              )}>{t.quote}</p>
              <div className="flex items-center gap-3">
                {t.avatar && (
                  <img src={t.avatar} alt={t.author} className="w-9 h-9 rounded-full object-cover border-2 border-white/10" />
                )}
                <div>
                  <p className={cn(
                    "font-bold text-sm",
                    isDark ? "text-white" : "text-[#0F1836]"
                  )}>{t.author}</p>
                  {t.role && <p className="text-xs text-slate-400 mt-0.5">{t.role}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";
