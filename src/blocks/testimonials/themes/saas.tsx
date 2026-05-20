"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TestimonialsBlockData, TestimonialItem } from "../definition";
import { BlockSettings } from "../../types";

export function TestimonialsSaaS({ data, isDark, settings }: { data: TestimonialsBlockData; isDark?: boolean; settings?: BlockSettings }) {
  const dark = isDark !== undefined ? isDark : false;
  const align = settings?.textAlign || "center";
  const displayMode = data.displayMode || "grid";
  const rows = data.rows || 1;

  const StarRating = ({ rating }: { rating?: number }) => {
    if (!rating || rating === 0) return null;
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={cn("w-4 h-4", i < rating ? "text-amber-400" : "text-slate-200")}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  const TestimonialCard = ({ item, i, className }: { item: TestimonialItem, i: number, className?: string }) => (
    <motion.div
      initial={displayMode === "grid" ? { opacity: 0, y: 20 } : undefined}
      whileInView={displayMode === "grid" ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
      className={cn(
        "p-8 border transition-all duration-300 flex flex-col h-full shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)]",
        dark 
          ? "bg-white/5 border-white/10" 
          : "bg-white border-slate-100",
        className
      )}
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="text-[var(--primary)]">
          <svg className="w-8 h-8 opacity-20" fill="currentColor" viewBox="0 0 32 32">
            <path d="M10 8v8H6v-8h4zm12 0v8h-4v-8h4zM4 16h8v8H4v-8zm12 0h8v8h-8v-8z" />
          </svg>
        </div>
        <StarRating rating={item.rating} />
      </div>
      <p className={cn("text-lg italic leading-relaxed mb-8 flex-1", dark ? "text-white/80" : "text-[var(--secondary)]/80")}>
        "{item.quote}"
      </p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--primary)]/20 shrink-0">
          <img 
            src={item.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} 
            alt={item.author} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="text-left">
          <div className={cn("font-bold text-sm", dark ? "text-white" : "text-[var(--secondary)]")}>{item.author}</div>
          {item.role && <div className={cn("text-[10px] font-bold uppercase tracking-widest", dark?"text-white/40":"text-slate-400")}>{item.role}</div>}
        </div>
      </div>
    </motion.div>
  );

  const MarqueeRow = ({ items, speed, reverse = false }: { items: any[], speed: number, reverse?: boolean }) => (
    <div className="flex overflow-hidden group">
      <motion.div
        animate={{ x: reverse ? [0, -100 + "%"] : [-100 + "%", 0] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="flex gap-6 pr-6 shrink-0 py-4"
      >
        {items.map((item, i) => (
          <TestimonialCard key={`orig-${i}`} item={item} i={i} className="w-[400px] shrink-0" />
        ))}
      </motion.div>
      <motion.div
        animate={{ x: reverse ? [0, -100 + "%"] : [-100 + "%", 0] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="flex gap-6 pr-6 shrink-0 py-4"
      >
        {items.map((item, i) => (
          <TestimonialCard key={`clone-${i}`} item={item} i={i} className="w-[400px] shrink-0" />
        ))}
      </motion.div>
    </div>
  );

  const renderContent = () => {
    if (displayMode === "grid") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.items?.map((item, i) => (
            <TestimonialCard key={i} item={item} i={i} />
          ))}
        </div>
      );
    }

    if (displayMode === "marquee" || displayMode === "slider") {
      const chunks = [];
      const itemsPerRow = Math.ceil(data.items.length / rows);
      for (let i = 0; i < rows; i++) {
        chunks.push(data.items.slice(i * itemsPerRow, (i + 1) * itemsPerRow));
      }

      return (
        <div className="space-y-2 -mx-4 md:-mx-12 lg:-mx-24">
          {chunks.map((rowItems, idx) => (
            <MarqueeRow 
              key={idx} 
              items={rowItems} 
              speed={40 + (idx * 5)} 
              reverse={idx % 2 === 1} 
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="relative">
      <div className={cn(
        "mb-16",
        align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"
      )}>
        {data.badge && (
          <span className={cn(
            "inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5 border",
            dark ? "bg-white/10 border-white/10 text-white" : "bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/10"
          )}>
            {data.badge}
          </span>
        )}
        {(data.title || data.titleHighlight) && (
          <h2 className={cn("text-3xl md:text-5xl leading-tight mb-4 font-bold", dark?"text-white":"text-[var(--secondary)]")}>
            {data.title}{" "}
            {data.titleHighlight && (
              <span className="text-[var(--primary)]">{data.titleHighlight}</span>
            )}
          </h2>
        )}
      </div>

      {renderContent()}
    </div>
  );
}
