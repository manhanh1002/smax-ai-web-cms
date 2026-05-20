"use client";

import React from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { IconGridData } from "../definition";
import { BlockSettings } from "../../types";

export function IconGridSaaS({ data, isDark, settings }: { data: IconGridData; isDark?: boolean; settings?: BlockSettings }) {
  const dark = isDark !== undefined ? isDark : false;
  const blockAlign = settings?.textAlign || "center";
  const itemAlign = data.itemAlign || blockAlign || "left";
  const isCompact = data.itemStyle === "compact";

  return (
    <>
      <div className={cn(
        "mb-14",
        blockAlign === "left" ? "text-left" : blockAlign === "right" ? "text-right" : "text-center"
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
        {data.description && (
          <p className={cn(
            "text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mt-6",
            dark ? "text-white/60" : "text-[var(--secondary)]/60",
            blockAlign === "left" && "mx-0",
            blockAlign === "right" && "ml-auto"
          )}>
            {data.description}
          </p>
        )}
      </div>

      {data.image && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16 relative rounded-3xl overflow-hidden border border-[var(--primary)]/10"
        >
          <img src={data.image} alt={data.title || "Icon Grid Image"} className="w-full h-auto object-cover max-h-[600px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </motion.div>
      )}

      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-8",
        (data.columns || (isCompact ? 3 : 4)) === 3 ? "lg:grid-cols-3" :
        (data.columns || (isCompact ? 3 : 4)) === 5 ? "lg:grid-cols-5" :
        "lg:grid-cols-4"
      )}>
        {data.items?.map((item, i) => {
          const IconComponent = (LucideIcons as any)[item.icon || "Zap"] || LucideIcons.Zap;
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "group transition-all duration-300",
                itemAlign === "center" ? "text-center flex flex-col items-center" : 
                itemAlign === "right" ? "text-right flex flex-col items-end" : "text-left",
                isCompact ? "p-6 rounded-2xl border border-transparent hover:border-[var(--primary)]/10 hover:bg-[var(--primary)]/5" : "space-y-4"
              )}
            >
              <div className={cn(
                "transition-all duration-300 group-hover:scale-110 flex items-center justify-center",
                isCompact ? "w-10 h-10 mb-3" : "w-14 h-14 mb-4",
                dark ? "bg-white/10 text-white" : "bg-[var(--primary)]/5 text-[var(--primary)]",
                itemAlign === "center" && "mx-auto",
                itemAlign === "right" && "ml-auto"
              )} style={{ borderRadius: isCompact ? "var(--radius-sm)" : "var(--radius-md)" }}>
                <IconComponent className={isCompact ? "w-5 h-5" : "w-7 h-7"} />
              </div>
              <div className={isCompact ? "space-y-1" : "space-y-2"}>
                <h3 className={cn(
                  "font-bold transition-colors group-hover:text-[var(--primary)]", 
                  isCompact ? "text-lg" : "text-xl",
                  dark ? "text-white" : "text-[var(--secondary)]"
                )}>
                  {item.title}
                </h3>
                <p className={cn(
                  "text-sm leading-relaxed", 
                  dark ? "text-white/60" : "text-[var(--secondary)]/60"
                )}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
