"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

export interface CaseStudyItem {
  logo?: string;
  companyName: string;
  statValue: string;
  statLabel: string;
  quote: string;
  author: string;
  role: string;
  image: string;
}

export interface CaseStudySliderBlockData {
  badge?: string;
  title: string;
  items: CaseStudyItem[];
  darkMode?: boolean;
}

export function CaseStudySliderBlock({ data }: { data: CaseStudySliderBlockData }) {
  const [current, setCurrent] = useState(0);
  const isDark = data.darkMode !== false;
  const items = data.items || [];

  const next = () => setCurrent((c) => (c + 1) % items.length);
  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);

  if (items.length === 0) return null;

  return (
    <section className={cn(
      "py-24 transition-colors duration-300 overflow-hidden",
      isDark ? "bg-[#0F1836] text-white" : "bg-white text-slate-900 border-y border-slate-100"
    )}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="max-w-xl">
            {data.badge && (
              <span className={cn(
                "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5",
                isDark ? "bg-white/10 text-[#fa6e5b]" : "bg-slate-100 text-[#fa6e5b]"
              )}>
                {data.badge}
              </span>
            )}
            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              {data.title}
            </h2>
          </div>
          <div className="flex gap-3">
            <button onClick={prev} className={cn(
              "w-14 h-14 rounded-full border flex items-center justify-center transition-all",
              isDark 
                ? "border-white/20 hover:bg-white hover:text-[#0F1836]" 
                : "border-slate-200 hover:bg-[#0F1836] hover:text-white"
            )}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button onClick={next} className="w-14 h-14 rounded-full bg-[#fa6e5b] flex items-center justify-center hover:bg-[#e85c4a] transition-all text-white">
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
            >
              <div className="space-y-8">
                {items[current].logo && (
                  <img 
                    src={items[current].logo} 
                    alt={items[current].companyName} 
                    className={cn(
                      "h-8 w-auto grayscale brightness-0",
                      isDark ? "invert" : ""
                    )} 
                  />
                )}
                <div className="space-y-2">
                  <div className="text-6xl font-black text-[#fa6e5b]">
                    {items[current].statValue}
                  </div>
                  <p className={cn(
                    "text-xl font-bold uppercase tracking-widest",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}>
                    {items[current].statLabel}
                  </p>
                </div>
                <div className="relative pt-6">
                  <Quote className={cn(
                    "absolute top-0 left-0 w-12 h-12 -translate-x-4 -translate-y-4",
                    isDark ? "text-white/10" : "text-slate-200"
                  )} />
                  <p className={cn(
                    "text-2xl font-medium leading-relaxed italic relative z-10",
                    isDark ? "text-white" : "text-slate-700"
                  )}>
                    "{items[current].quote}"
                  </p>
                </div>
                <div className="pt-4">
                  <p className={cn(
                    "font-black text-lg",
                    isDark ? "text-white" : "text-[#0F1836]"
                  )}>{items[current].author}</p>
                  <p className="text-slate-400">{items[current].role}</p>
                </div>
              </div>
              <div className="relative">
                <div className={cn(
                  "absolute -inset-10 rounded-full blur-[100px]",
                  isDark ? "bg-blue-500/10" : "bg-blue-500/5"
                )} />
                <img
                  src={items[current].image}
                  alt={items[current].companyName}
                  className={cn(
                    "relative w-full aspect-[4/5] object-cover rounded-[40px] shadow-2xl",
                    isDark ? "shadow-black/50" : "shadow-blue-500/10"
                  )}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";
