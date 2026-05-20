"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FeaturesBlockData } from "../definition";
import { BlockSettings } from "../../types";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";

export function FeaturesSaaS({ data, isDark, settings }: { data: FeaturesBlockData; isDark?: boolean; settings?: BlockSettings }) {
  const { executeAction } = useActionExecutor();
  const dark = isDark !== undefined ? isDark : false;
  const align = settings?.textAlign || "center";

  return (
    <>
      <div className={cn(
        "mb-16",
        align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"
      )}>
        {data.badge && (
          <span className={cn(
            "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border",
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
          )}>{data.subtitle}</p>
        )}
      </div>

      <div className="space-y-24">
        {data.items?.map((item, i) => {
          const isItemReversed = item.reversed !== undefined ? item.reversed : i % 2 !== 0;

          return (
            <div
              key={i}
              className={cn(
                "flex flex-col md:flex-row items-center gap-10 md:gap-16",
                isItemReversed ? "md:flex-row-reverse" : "md:flex-row"
              )}
            >
              <motion.div
                initial={{ opacity: 0, x: isItemReversed ? 24 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1 space-y-5 text-left"
              >
                {item.tag && (
                  <p className={cn("text-[10px] font-bold uppercase tracking-widest", dark?"text-white/40":"text-slate-400")}>
                    {item.tag}
                  </p>
                )}
                <h3 className={cn("text-2xl md:text-3xl leading-snug font-bold", dark ? "text-white" : "text-[var(--secondary)]")}>
                  {item.title}
                </h3>
                
                {item.points && item.points.length > 0 && (
                  <div className="space-y-3 pt-1">
                    {item.points.map((point, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <svg className={cn("mt-0.5 shrink-0 w-5 h-5", dark ? "text-white" : "text-[var(--primary)]")} viewBox="0 0 512 512" fill="currentColor">
                          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                        </svg>
                        <p className={cn("text-sm font-bold", dark ? "text-white/80" : "text-[var(--secondary)]/80")}>{point}</p>
                      </div>
                    ))}
                  </div>
                )}

                {item.stat && (
                  <div className={cn(
                    "mt-6 p-5 border-l-4 border-[var(--primary)]",
                    dark ? "bg-white/5" : "bg-slate-50"
                  )} style={{ borderRadius: "var(--radius-md)" }}>
                    <p
                      className={cn("text-sm leading-relaxed font-bold", dark ? "text-white/80" : "text-[var(--secondary)]/80")}
                      dangerouslySetInnerHTML={{ __html: item.stat }}
                    />
                  </div>
                )}

                {item.btnText && (
                  <div className="pt-4">
                    <button
                      onClick={() => executeAction(item.url)}
                      className="inline-flex items-center gap-2 h-12 px-8 bg-[var(--primary)] hover:brightness-110 text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-[var(--primary)]/25 active:scale-95"
                      style={{ borderRadius: "var(--radius-md)" }}
                    >
                      {item.btnText}
                    </button>
                  </div>
                )}
              </motion.div>

              {item.image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex-1 w-full"
                >
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-slate-200 blur-3xl opacity-0 rounded-full group-hover:opacity-10 transition-opacity"></div>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="relative w-full h-auto border border-white/5"
                      style={{ borderRadius: "var(--radius-md)" }}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
