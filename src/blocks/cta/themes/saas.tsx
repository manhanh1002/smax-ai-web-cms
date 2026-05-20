"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CTABlockData } from "../definition";
import { BlockSettings } from "../../types";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";

export function CTASaaS({ data, isDark, settings }: { data: CTABlockData; isDark?: boolean; settings?: BlockSettings }) {
  const { executeAction } = useActionExecutor();
  const dark = isDark !== undefined ? isDark : false;
  const align = settings?.textAlign || "left";

  return (
    <div className="flex flex-col lg:flex-row gap-14 items-start">
      <div className={cn(
        "flex-1 space-y-6 pt-2",
        align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"
      )}>
        {(data.title || data.titleHighlight) && (
          <h2 className={cn(
            "text-3xl md:text-4xl leading-snug font-bold",
            dark ? "text-white" : "text-[var(--secondary)]"
          )}>
            {data.title}{" "}
            {data.titleHighlight && <span className="text-[var(--primary)]">{data.titleHighlight}</span>}
          </h2>
        )}
        {data.subtitle && (
          <p className={cn(
            "text-sm leading-relaxed",
            dark ? "text-white/60" : "text-[var(--secondary)]/60"
          )}>{data.subtitle}</p>
        )}
        {data.bullets && data.bullets.length > 0 && (
          <div className={cn(
            "space-y-3",
            align === "center" ? "flex flex-col items-center" : align === "right" ? "flex flex-col items-end" : ""
          )}>
            {data.bullets.map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg className={cn("mt-0.5 shrink-0 w-5 h-5", dark ? "text-white" : "text-[var(--primary)]")} viewBox="0 0 512 512" fill="currentColor">
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                </svg>
                <span className={cn(
                  "text-sm text-left font-bold",
                  dark ? "text-white/80" : "text-[var(--secondary)]"
                )}>{point}</span>
              </div>
            ))}
          </div>
        )}
        
        {data.btnText && (
          <div className="pt-4">
            <button
              onClick={() => executeAction(data.url)}
              className="inline-flex items-center gap-2 h-14 px-10 bg-[var(--primary)] hover:brightness-110 text-white font-bold text-lg transition-all hover:shadow-xl hover:shadow-[var(--primary)]/25 active:scale-95"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              {data.btnText}
            </button>
          </div>
        )}
      </div>
      {data.formUrl && (
        <div className={cn(
          "w-full lg:w-[480px] overflow-hidden shrink-0 border transition-all duration-300 shadow-[var(--shadow-lg)]",
          dark ? "bg-white border-white/10" : "bg-white border-slate-200"
        )} style={{ borderRadius: "var(--radius-lg)" }}>
          <iframe
            src={data.formUrl}
            className="w-full border-0"
            height={data.formHeight || 500}
            title="Contact Form"
          />
        </div>
      )}
    </div>
  );
}
