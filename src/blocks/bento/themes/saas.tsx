"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BentoBlockData, BentoCard } from "../definition";
import { BlockSettings } from "../../types";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";

function BentoCardInner({
  card,
  imageClass = "h-48",
  delay = 0,
  isDark = false,
  executeAction,
}: {
  card: BentoCard;
  imageClass?: string;
  delay?: number;
  isDark?: boolean;
  executeAction: (action: any) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      onClick={() => card.url && executeAction(card.url)}
      className={cn(
        "border overflow-hidden flex flex-col h-full transition-all duration-300 group shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)]",
        isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-100",
        card.url ? "cursor-pointer" : ""
      )}
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <div className={cn(
        "w-full flex items-center justify-center p-6 overflow-hidden", 
        imageClass,
        isDark ? "bg-white/5" : "bg-transparent"
      )}>
        {card.image && (
          <img 
            src={card.image} 
            alt={card.title} 
            className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-500" 
          />
        )}
      </div>
      <div className="p-6 text-center flex-1 flex flex-col justify-center">
        <h4 className={cn(
          "text-lg mb-2 font-bold",
          isDark ? "text-white" : "text-[var(--secondary)]"
        )}>{card.title}</h4>
        <p className={cn(
          "text-sm leading-relaxed font-bold",
          isDark ? "text-white/40" : "text-slate-400"
        )}>{card.description}</p>
      </div>
    </motion.div>
  );
}

function BigCard({ card, delay = 0, isDark = false, executeAction }: { card: BentoCard; delay?: number; isDark?: boolean; executeAction: (action: any) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      onClick={() => card.url && executeAction(card.url)}
      className={cn(
        "border overflow-hidden flex flex-col h-full transition-all duration-300 group shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)]",
        isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-100",
        card.url ? "cursor-pointer" : ""
      )}
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <div className={cn(
        "w-full flex items-center justify-center p-6 h-64 overflow-hidden",
        isDark ? "bg-white/5" : "bg-transparent"
      )}>
        {card.image && (
          <img 
            src={card.image} 
            alt={card.title} 
            className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-500" 
          />
        )}
      </div>
      <div className="p-6 text-center flex-1 flex flex-col justify-center">
        <h4 className={cn(
          "text-xl mb-2 font-bold",
          isDark ? "text-white" : "text-[var(--secondary)]"
        )}>{card.title}</h4>
        <p className={cn(
          "text-sm leading-relaxed font-bold",
          isDark ? "text-white/40" : "text-slate-400"
        )}>{card.description}</p>
      </div>
    </motion.div>
  );
}

export function BentoSaaS({ data, isDark, settings }: { data: BentoBlockData; isDark?: boolean; settings?: BlockSettings }) {
  const { executeAction } = useActionExecutor();
  const dark = isDark !== undefined ? isDark : false;
  const cards = data.cards || [];
  const align = settings?.textAlign || "center";

  return (
    <>
      <div className={cn(
        "mb-12",
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
          <h2 className={cn("text-3xl md:text-5xl leading-tight mb-3 font-bold", dark?"text-white":"text-[var(--secondary)]")}>
            {data.title}{" "}
            {data.titleHighlight && (
              <span className="text-[var(--primary)]">{data.titleHighlight}</span>
            )}
          </h2>
        )}
        {data.subtitle && (
          <p className={cn(
            "text-sm",
            align === "center" ? "mx-auto" : "",
            dark ? "text-white/60" : "text-[var(--secondary)]/60"
          )}>{data.subtitle}</p>
        )}
      </div>

      {cards.length >= 7 ? (
        <>
          {/* ROW 1: big-left (col-span-2) + small-right */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2 h-full">
              <BigCard card={cards[0]} delay={0} isDark={dark} executeAction={executeAction} />
            </div>
            <BentoCardInner card={cards[1]} imageClass="h-64" delay={0.1} isDark={dark} executeAction={executeAction} />
          </div>
 
          {/* ROW 2: 3 equal small cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <BentoCardInner card={cards[2]} delay={0} isDark={dark} executeAction={executeAction} />
            <BentoCardInner card={cards[3]} delay={0.1} isDark={dark} executeAction={executeAction} />
            <BentoCardInner card={cards[4]} delay={0.2} isDark={dark} executeAction={executeAction} />
          </div>
 
          {/* ROW 3: small-left + big-right (col-span-2) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 h-full">
              <BentoCardInner card={cards[5]} delay={0} imageClass="h-64" isDark={dark} executeAction={executeAction} />
            </div>
            <div className="md:col-span-2 h-full">
              <BigCard card={cards[6]} delay={0.1} isDark={dark} executeAction={executeAction} />
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <BentoCardInner key={i} card={card} delay={i * 0.1} isDark={dark} executeAction={executeAction} />
          ))}
        </div>
      )}
    </>
  );
}
