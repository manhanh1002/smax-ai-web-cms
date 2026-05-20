"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CardCarouselBlockData } from "../definition";
import { BlockSettings } from "../../types";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

export function CardCarouselSaaS({ data, isDark, settings }: { data: CardCarouselBlockData; isDark?: boolean; settings?: BlockSettings }) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dark = isDark !== undefined ? isDark : false;
  const align = settings?.textAlign || "center";
  const cards = data.cards || [];
  
  const [visibleCards, setVisibleCards] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setVisibleCards(1);
      else setVisibleCards(2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, cards.length - visibleCards);
  const autoplay = data.autoplay !== false;
  const interval = data.autoplayInterval || 5000;
  const imageFit = data.imageFit || "cover";

  useEffect(() => {
    if (!autoplay || isHovered || cards.length <= visibleCards) return;
    
    const timer = setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoplay, isHovered, cards.length, interval, maxIndex, visibleCards]);

  const next = () => setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  const prev = () => setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));

  if (cards.length === 0) return null;

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "mb-14",
        align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"
      )}>
        {data.badge && (
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5",
              dark ? "bg-white/10 text-[var(--primary)]" : "bg-[var(--primary)]/10 text-[var(--primary)]"
            )}
          >
            {data.badge}
          </motion.span>
        )}
        {(data.title || data.titleHighlight) && (
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={cn("text-3xl md:text-5xl font-black leading-tight mb-4", dark ? "text-white" : "text-[var(--secondary)]")}
          >
            {data.titleHighlight && (
              <span className="text-[var(--primary)]">{data.titleHighlight}</span>
            )}{" "}
            {data.title}
          </motion.h2>
        )}
        {data.subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={cn("max-w-2xl text-sm", align === "center" ? "mx-auto" : "", dark ? "text-white/60" : "text-[var(--secondary)]/60")}
          >
            {data.subtitle}
          </motion.p>
        )}
      </div>

      <div className="relative group/slider px-4 md:px-12 pb-20">
        {/* Navigation Arrows */}
        {data.showArrows !== false && cards.length > visibleCards && (
          <>
            <button 
              onClick={prev}
              className={cn(
                "absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl opacity-0 group-hover/slider:opacity-100",
                dark ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-white text-[var(--secondary)] hover:bg-slate-50"
              )}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={next}
              className={cn(
                "absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl opacity-0 group-hover/slider:opacity-100",
                dark ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-white text-[var(--secondary)] hover:bg-slate-50"
              )}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div className="overflow-visible">
          <motion.div 
            ref={containerRef}
            className="flex gap-8"
            animate={{ x: `-${index * (100 / visibleCards)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {cards.map((card, i) => (
              <motion.div
                key={i}
                className={cn(
                  "w-[85vw] md:w-[calc(50%-16px)] shrink-0 overflow-hidden group transition-all duration-500",
                  dark ? "bg-white/5" : "bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)]"
                )}
                style={{ borderRadius: "32px" }}
              >
                <div className="w-full overflow-hidden flex items-center justify-center">
                  <img 
                    src={card.image || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800"} 
                    className={cn(
                      "w-full h-auto transition-transform duration-700 group-hover:scale-105",
                      imageFit === "cover" ? "object-cover" : "object-contain"
                    )} 
                    alt={card.title} 
                  />
                </div>
                <div className={cn(
                  "p-8 pt-2 space-y-4 flex flex-col",
                  align === "center" ? "items-center text-center" : align === "right" ? "items-end text-right" : "items-start text-left"
                )}>
                  <div className="space-y-1">
                    {card.subtitle && (
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        dark ? "text-[var(--primary)]" : "text-[var(--primary)]"
                      )}>
                        {card.subtitle}
                      </span>
                    )}
                    <h3 className={cn("text-xl font-black", dark ? "text-white" : "text-[var(--secondary)]")}>
                      {card.title}
                    </h3>
                  </div>
                  
                  {card.description && (
                    <p className={cn("text-sm leading-relaxed", dark ? "text-white/60" : "text-slate-500")}>
                      {card.description}
                    </p>
                  )}

                  {card.features && card.features.length > 0 && (
                    <ul className="space-y-2 pt-2">
                      {card.features.map((feature, idx) => (
                        <li key={idx} className={cn(
                          "flex items-center gap-2 text-xs font-medium",
                          align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"
                        )}>
                          <div className="w-4 h-4 rounded-full bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-[var(--primary)]" />
                          </div>
                          <span className={dark ? "text-white/80" : "text-slate-600"}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Pagination Indicator */}
      {data.showPagination !== false && cards.length > visibleCards && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 transition-all duration-300 rounded-full",
                index === i 
                  ? "w-8 bg-[var(--primary)]" 
                  : "w-2 bg-slate-200 hover:bg-slate-300"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
