"use client";

export interface SuitableCard {
  tag: string;
  title: string;
  description: string;
}

export interface SuitableForBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  cards: SuitableCard[];
  darkMode?: boolean;
}

export function SuitableForBlock({ data }: { data: SuitableForBlockData }) {
  const isDark = data.darkMode !== false; // Default to dark

  return (
    <section className={cn(
      "py-20 transition-colors duration-300",
      isDark ? "bg-[#0F1836] text-white" : "bg-white text-slate-900"
    )}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          {data.badge && (
            <span className={cn(
              "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5",
              isDark ? "border border-white/10 text-[#fa6e5b]" : "bg-[#f4f7ff] text-[#fa6e5b]"
            )}>
              {data.badge}
            </span>
          )}
          {(data.title || data.titleHighlight) && (
            <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4">
              {data.titleHighlight && (
                <span className="text-[#fa6e5b]">{data.titleHighlight}</span>
              )}{" "}
              {data.title}
            </h2>
          )}
          {data.subtitle && (
            <p className={cn(
              "max-w-2xl mx-auto text-sm",
              isDark ? "text-slate-400" : "text-slate-500"
            )}>
              {data.subtitle}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data.cards?.map((card, i) => (
            <div key={i} className={cn(
              "p-7 rounded-3xl border transition-all duration-300",
              isDark ? "bg-white/5 border-white/10 hover:border-white/20" : "bg-slate-50 border-slate-100 hover:border-slate-200"
            )}>
              <span className={cn(
                "inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4",
                isDark ? "bg-white/10 text-[#fa6e5b]" : "bg-white text-[#fa6e5b] shadow-sm"
              )}>
                {card.tag}
              </span>
              <h4 className="text-base font-bold mb-3">{card.title}</h4>
              <p className={cn(
                "text-sm leading-relaxed",
                isDark ? "text-slate-400" : "text-slate-500"
              )}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";
