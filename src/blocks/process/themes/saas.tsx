"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProcessBlockData } from "../definition";
import { BlockSettings } from "../../types";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";

export function ProcessSaaS({ data, isDark, settings }: { data: ProcessBlockData; isDark?: boolean; settings?: BlockSettings }) {
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
            "inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5 border",
            dark ? "bg-white/10 border-white/10 text-white" : "bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/10"
          )}>
            {data.badge}
          </span>
        )}
        {(data.title || data.titleHighlight) && (
          <h2 className={cn("text-3xl md:text-5xl leading-tight mb-4 font-bold", dark ? "text-white" : "text-[var(--secondary)]")}>
            {data.title}{" "}
            {data.titleHighlight && <span className="text-[var(--primary)]">{data.titleHighlight}</span>}
          </h2>
        )}
      </div>

      <div className="relative overflow-visible">
        <div className="flex flex-wrap justify-center gap-12 lg:gap-16 relative z-10 px-4 pt-10">
          {data.steps?.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => step.url && executeAction(step.url)}
              className={cn(
                "text-center group w-full md:w-[calc(50%-3rem)] lg:w-[calc(33.333%-4rem)] max-w-sm relative",
                step.url ? "cursor-pointer" : ""
              )}
            >
              <div className="relative mb-8 inline-block">
                <div className="absolute inset-0 bg-[var(--primary)] blur-xl opacity-0 group-hover:opacity-20 transition duration-500 rounded-full"></div>

                {/* Connector Line (Desktop) - Very long to ensure connection */}
                {i < data.steps.length - 1 && (
                  <div
                    className={cn(
                      "hidden lg:block absolute top-1/2 left-1/2 w-[1000px] border-t-2 border-dashed -translate-y-1/2 z-[-1]",
                      (i + 1) % 3 === 0 ? "lg:hidden" : "", // Hide at end of 3-column row
                      dark ? "border-white/10" : "border-slate-200"
                    )}
                  />
                )}

                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 border-2 relative z-10",
                  dark
                    ? "bg-[#0F1836] border-white/10 text-white group-hover:border-[var(--primary)]"
                    : "bg-white border-slate-100 text-[var(--primary)] group-hover:border-[var(--primary)] group-hover:shadow-[var(--shadow-lg)] shadow-[var(--shadow-md)]"
                )}>
                  {(i + 1).toString().padStart(2, "0")}
                </div>
              </div>
              <h3 className={cn("text-xl mb-4 font-bold px-4", dark ? "text-white" : "text-[var(--secondary)]")}>
                {step.title}
              </h3>
              <p className={cn("text-sm leading-relaxed px-4", dark ? "text-white/60" : "text-[var(--secondary)]/60")}>
                {step.description}
              </p>
              {step.image && (
                <div className="mt-6 px-4">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
