"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { CaseStudyBlockData } from "../definition";
import { BlockSettings } from "../../types";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";

export function CaseStudySaaS({ data, isDark, settings }: { data: CaseStudyBlockData; isDark?: boolean; settings?: BlockSettings }) {
  const { executeAction } = useActionExecutor();
  const dark = isDark !== undefined ? isDark : false;

  return (
    <>
      <div className="mb-14 text-center">
        {data.badge && (
          <span className={cn(
            "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border",
            dark ? "bg-white/10 border-white/10 text-white" : "bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/10"
          )}>
            {data.badge}
          </span>
        )}
        {data.title && (
          <h2 className={cn("text-3xl md:text-5xl leading-tight mb-4", dark?"text-white":"text-[var(--secondary)]")}>
            {data.title}
          </h2>
        )}
      </div>

      <div className="space-y-20">
        {data.items?.map((item, i) => (
          <div key={i} className={cn(
            "flex flex-col lg:flex-row gap-12 lg:gap-20 items-center",
            i % 2 !== 0 ? "lg:flex-row-reverse" : ""
          )}>
            <div className="flex-1">
              <div className="relative group h-full min-h-[300px] flex items-center justify-center">
                <div className="absolute -inset-4 bg-[var(--primary)] blur-3xl opacity-10" style={{ borderRadius: "calc(var(--radius)*2)" }}></div>
                {item.image ? (
                  <img 
                    src={item.image} 
                    className="relative w-full h-auto border border-white/10 shadow-[var(--shadow-lg)] object-cover" 
                    style={{ borderRadius: "var(--radius-lg)" }}
                    alt={item.title} 
                  />
                ) : (
                  <div className={cn(
                    "relative w-full h-full p-8 flex flex-col justify-center space-y-6 border border-white/10 shadow-[var(--shadow-lg)]",
                    dark ? "bg-white/5" : "bg-slate-50"
                  )} style={{ borderRadius: "var(--radius-lg)" }}>
                    {item.highlights?.map((hl, j) => {
                      // @ts-ignore
                      const Icon = hl.icon ? (LucideIcons[hl.icon] || LucideIcons.Zap) : LucideIcons.Zap;
                      return (
                        <div key={j} className="flex gap-4 items-start">
                          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className={cn("text-lg font-bold", dark ? "text-white" : "text-[var(--secondary)]")}>{hl.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 space-y-8 text-left">
              {item.title && <h3 className={cn("text-3xl font-bold", dark ? "text-white" : "text-[var(--secondary)]")}>{item.title}</h3>}
              {item.description && <p className={cn("text-lg leading-relaxed", dark ? "text-white/60" : "text-[var(--secondary)]/60")}>{item.description}</p>}
              
              {item.quote && (
                <div className={cn(
                  "p-8 border italic",
                  dark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"
                )} style={{ borderRadius: "var(--radius-lg)" }}>
                  <p className={cn("mb-4", dark ? "text-white/80" : "text-[var(--secondary)]/80")}>"{item.quote}"</p>
                  <p className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">{"\u2014"} {item.author}</p>
                </div>
              )}

              {item.btnText && (
                <button
                  onClick={() => executeAction(item.url)}
                  className="inline-flex items-center gap-2 h-12 px-8 bg-[var(--primary)] hover:brightness-110 text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-[var(--primary)]/25 active:scale-95"
                  style={{ borderRadius: "var(--radius-md)" }}
                >
                  {item.btnText}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
