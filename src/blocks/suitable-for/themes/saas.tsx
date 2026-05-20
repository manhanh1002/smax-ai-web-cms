"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SuitableForBlockData } from "../definition";
import { BlockSettings } from "../../types";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";

export function SuitableForSaaS({ data, isDark, settings }: { data: SuitableForBlockData; isDark?: boolean; settings?: BlockSettings }) {
  const { executeAction } = useActionExecutor();
  const dark = isDark !== undefined ? isDark : false;
  const align = settings?.textAlign || "center";

  return (
    <>
      <div className={cn(
        "mb-14",
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
            {data.titleHighlight && (
              <span className="text-[var(--primary)]">{data.titleHighlight}</span>
            )}{" "}
            {data.title}
          </h2>
        )}
        {data.subtitle && (
          <p className={cn(
            "max-w-2xl text-sm",
            align === "center" ? "mx-auto" : "",
            dark ? "text-white/60" : "text-[var(--secondary)]/60"
          )}>
            {data.subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.cards?.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            onClick={() => card.url && executeAction(card.url)}
            className={cn(
              "border flex flex-col transition-all duration-300 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] overflow-hidden",
              align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center",
              dark ? "bg-white/5 border-white/10 hover:border-[var(--primary)]/50" : "bg-white border-slate-100 hover:border-[var(--primary)]/20",
              card.url ? "cursor-pointer" : ""
            )}
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            {card.image && (
              <div className="w-full relative overflow-hidden">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className={cn(
              "p-8 space-y-4 flex flex-col flex-1",
              align === "left" ? "items-start" : align === "right" ? "items-end" : "items-center"
            )}>
              {card.tag && (
                <span className={cn(
                  "inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 shadow-sm",
                  dark ? "bg-[var(--primary)]/20 text-white" : "bg-[var(--primary)]/5 text-[var(--primary)]"
                )}>
                  {card.tag}
                </span>
              )}
              <h3 className={cn("text-xl font-bold mb-1", dark ? "text-white" : "text-[var(--secondary)]")}>{card.title}</h3>
              <p className={cn("text-sm leading-relaxed", dark ? "text-white/60" : "text-[var(--secondary)]/60")}>{card.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
