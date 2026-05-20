"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselCard {
  title: string;
  description: string;
  image: string;
  tag?: string;
}

export interface CardCarouselBlockData {
  badge?: string;
  title: string;
  subtitle?: string;
  cards: CarouselCard[];
  darkMode?: boolean;
}

export function CardCarouselBlock({ data }: { data: CardCarouselBlockData }) {
  const [index, setIndex] = useState(0);
  const isDark = data.darkMode === true;
  const cards = data.cards || [];

  const next = () => setIndex((i) => (i + 1) % cards.length);
  const prev = () => setIndex((i) => (i - 1 + cards.length) % cards.length);

  if (cards.length === 0) return null;

  return (
    <section className={cn(
      "py-24 transition-colors duration-300 overflow-hidden",
      isDark ? "bg-[#0B1229] text-white" : "bg-white text-slate-900"
    )}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            {data.badge && (
              <span className={cn(
                "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5",
                isDark ? "bg-white/10 text-primary" : "bg-[#f4f7ff] text-[#2563eb]"
              )}>
                {data.badge}
              </span>
            )}
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              {data.title}
            </h2>
            {data.subtitle && <p className={cn(
              "text-sm",
              isDark ? "text-slate-400" : "text-slate-500"
            )}>{data.subtitle}</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={prev} className={cn(
              "w-12 h-12 rounded-xl border flex items-center justify-center transition-all",
              isDark ? "border-white/10 hover:bg-white/10" : "border-slate-200 hover:bg-slate-50"
            )}>
              <ChevronLeft className="w-6 h-6 text-slate-400" />
            </button>
            <button onClick={next} className={cn(
              "w-12 h-12 rounded-xl border flex items-center justify-center transition-all",
              isDark ? "border-white/10 hover:bg-white/10" : "border-slate-200 hover:bg-slate-50"
            )}>
              <ChevronRight className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="relative overflow-visible">
          <div className="flex gap-6 transition-transform duration-500" style={{ transform: `translateX(-${index * 33.33}%)` }}>
            {cards.map((card, i) => (
              <motion.div
                key={i}
                className={cn(
                  "w-full md:w-[calc(33.33%-16px)] shrink-0 rounded-[32px] p-8 space-y-6 border transition-all duration-300",
                  isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"
                )}
              >
                <div className={cn(
                  "aspect-square rounded-2xl p-4 flex items-center justify-center border overflow-hidden",
                  isDark ? "bg-white/5 border-white/5" : "bg-white border-slate-50"
                )}>
                  <img src={card.image} alt={card.title} className="w-full h-full object-contain" />
                </div>
                <div className="space-y-3">
                  {card.tag && <span className="text-[10px] font-black text-primary uppercase tracking-widest">{card.tag}</span>}
                  <h3 className={cn(
                    "text-xl font-black",
                    isDark ? "text-white" : "text-[#0F1836]"
                  )}>{card.title}</h3>
                  <p className={cn(
                    "text-sm leading-relaxed line-clamp-3",
                    isDark ? "text-slate-400" : "text-slate-500"
                  )}>
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";
