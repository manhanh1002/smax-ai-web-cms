"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { HeroBlockData } from "../definition";
import { BlockSettings } from "../../types";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";

export function HeroSaaS({ data, isDark, settings }: { data: HeroBlockData; isDark?: boolean; settings?: BlockSettings }) {
  const { executeAction } = useActionExecutor();
  const dark = isDark !== undefined ? isDark : false;
  const align = settings?.textAlign || "center";

  return (
    <div className={cn(
      "relative py-12 md:py-24",
      align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"
    )}>
      {data.badgeType === "image" && data.badgeImage ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-block"
        >
          <img
            src={data.badgeImage}
            alt="Badge"
            className="h-10 md:h-12 w-auto object-contain select-none max-w-[220px]"
          />
        </motion.div>
      ) : data.badge && (data.badgeType || "text") === "text" ? (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8 border shadow-sm",
            dark ? "bg-white/10 border-white/10 text-white" : "bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/10"
          )}
        >
          {data.badge}
        </motion.span>
      ) : null}

      {(data.title || data.highlight) && (
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "text-4xl md:text-7xl tracking-tight leading-[1.1] mb-8 font-bold",
            dark ? "text-white" : "text-[var(--secondary)]"
          )}
        >
          {data.title}{" "}
          {data.highlight && (
            <span className="text-[var(--primary)] inline-block relative">
              {data.highlight}
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[var(--primary)]/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="8" />
              </svg>
            </span>
          )}
        </motion.h1>
      )}

      {data.subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "text-lg md:text-xl leading-relaxed mb-10 max-w-3xl",
            align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : "",
            dark ? "text-white/60" : "text-[var(--secondary)]/60"
          )}
        >
          {data.subtitle}
        </motion.p>
      )}

      {(data.primaryBtn || data.secondaryBtn) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={cn(
            "flex flex-wrap gap-4 pt-4",
            align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"
          )}>
            {data.primaryBtn && (
              <button
                onClick={() => executeAction(data.primaryBtnUrl)}
                className="h-14 px-10 bg-[var(--primary)] text-white font-bold text-lg shadow-xl shadow-[var(--primary)]/30 hover:brightness-110 active:scale-95 transition-all"
                style={{ borderRadius: "var(--radius-md)" }}
              >
                {data.primaryBtn}
              </button>
            )}
            {data.secondaryBtn && (
              <button
                onClick={() => executeAction(data.secondaryBtnUrl)}
                className={cn(
                  "h-14 px-10 font-bold text-lg border-2 transition-all active:scale-95",
                  dark ? "border-white/20 text-white hover:bg-white/10" : "border-slate-100 text-[var(--secondary)] hover:bg-slate-50"
                )}
                style={{ borderRadius: "var(--radius-md)" }}
              >
                {data.secondaryBtn}
              </button>
            )}
          </div>
        </motion.div>
      )}

      {data.image && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 relative max-w-5xl mx-auto px-4"
        >
          <div className="absolute -inset-10 bg-gradient-to-b from-[var(--primary)]/10 to-transparent blur-3xl rounded-full opacity-50"></div>
          {data.image?.toLowerCase().match(/\.(webm|mp4|mov)$/) ? (
            <video
              src={data.image}
              autoPlay
              loop
              muted
              playsInline
              className="relative w-full h-auto border-8 border-white/5"
              style={{ borderRadius: "var(--radius-lg)" }}
            />
          ) : (
            <img
              src={data.image}
              alt="Hero Dashboard"
              className="relative w-full h-auto border-8 border-white/5"
              style={{ borderRadius: "var(--radius-lg)" }}
            />
          )}
        </motion.div>
      )}
    </div>
  );
}
