"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { HeroSecondaryData } from "../definition";
import { BlockSettings } from "../../types";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";

export function HeroSecondarySaaS({ data, isDark, settings }: { data: HeroSecondaryData; isDark?: boolean; settings?: BlockSettings }) {
  const { executeAction } = useActionExecutor();
  const dark = isDark !== undefined ? isDark : false;
  const imagePos = data.imagePosition || "left";
  const textAlign = settings?.textAlign || "left";

  return (
    <div className={cn(
      "flex flex-col lg:flex-row gap-12 lg:gap-20 items-center",
      imagePos === "right" ? "lg:flex-row-reverse" : ""
    )}>
      <motion.div
        initial={{ opacity: 0, x: imagePos === "right" ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex-1"
      >
        <div className="relative group">
          {data.image?.toLowerCase().match(/\.(webm|mp4|mov)$/) ? (
            <video
              src={data.image}
              autoPlay
              loop
              muted
              playsInline
              className="relative w-full h-auto border border-white/10"
              style={{ borderRadius: "var(--radius-md)" }}
            />
          ) : (
            <img
              src={data.image}
              alt={data.title}
              className="relative w-full h-auto border border-white/10"
              style={{ borderRadius: "var(--radius-md)" }}
            />
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: imagePos === "right" ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className={cn(
          "flex-1 space-y-8",
          textAlign === "right" ? "text-right" : textAlign === "center" ? "text-center" : "text-left"
        )}
      >
        {data.badge && (
          <span className={cn(
            "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border shadow-sm",
            dark ? "bg-white/10 border-white/10 text-white" : "bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/10"
          )}>
            {data.badge}
          </span>
        )}
        
        <h2 className={cn(
          "text-4xl md:text-5xl leading-tight font-bold",
          dark ? "text-white" : "text-[var(--secondary)]"
        )}>
          {data.title}{" "}
          {data.titleHighlight && <span className="text-[var(--primary)]">{data.titleHighlight}</span>}
        </h2>
        
        {data.subtitle && (
          <p className={cn(
            "text-lg leading-relaxed",
            dark ? "text-white/60" : "text-[var(--secondary)]/60"
          )}>
            {data.subtitle}
          </p>
        )}
        
        <div className={cn(
          "flex",
          textAlign === "right" ? "justify-end" : textAlign === "center" ? "justify-center" : "justify-start"
        )}>
          <button
            onClick={() => executeAction(data.primaryBtnUrl)}
            className="inline-flex items-center gap-2 h-14 px-10 bg-[var(--primary)] hover:brightness-110 text-white font-bold text-base transition-all hover:shadow-lg hover:shadow-[var(--primary)]/25 active:scale-95"
            style={{ borderRadius: "var(--radius-md)" }}
          >
            {data.primaryBtn || "Bắt đầu ngay"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
