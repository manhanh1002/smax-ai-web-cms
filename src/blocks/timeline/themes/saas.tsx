import React from "react";
import { cn } from "@/lib/utils";
import type { TimelineData } from "../definition";

import { SectionTitle } from "../../SectionTitle";

export function TimelineSaaS({ data, isDark }: { data: TimelineData; isDark?: boolean }) {
  const isH = data.orientation === "horizontal";
  return (
    <div className="max-w-5xl mx-auto">
      <SectionTitle
        badge={data.sectionLabel}
        title={data.title}
        titleHighlight={data.titleHighlight}
        subtitle={data.subtitle}
        isDark={isDark}
        align="center"
      />
      {isH ? (
        <div className="relative overflow-x-auto pb-4">
          <div className={cn("absolute top-6 left-8 right-8 h-px", isDark?"bg-white/10":"bg-slate-100")} />
          <div className="flex gap-4 min-w-max">
            {(data.items??[]).map((item, i) => (
              <div key={i} className="relative flex flex-col items-center w-44 pt-0">
                <div className={cn("relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 mb-4 transition-all",
                  item.highlight?(isDark?"bg-[var(--primary)] border-[var(--primary)]/50 text-white shadow-lg shadow-[var(--primary)]/20":"bg-[var(--primary)] border-[var(--primary)]/20 text-white shadow-lg shadow-[var(--primary)]/20"):(isDark?"bg-white/5 border-white/10 text-white/40":"bg-white border-slate-200 text-slate-400"))}>
                  {item.icon || (i+1)}
                </div>
                <div className={cn("text-[10px] font-bold uppercase tracking-wider mb-1", isDark?"text-[var(--primary)]":"text-[var(--primary)]")}>{item.year}</div>
                <div className={cn("text-sm font-bold text-center mb-1", isDark?"text-white":"text-[var(--secondary)]")}>{item.title}</div>
                <div className={cn("text-xs text-center leading-relaxed", isDark?"text-white/40":"text-[var(--secondary)]/40")}>{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className={cn("absolute left-6 top-0 bottom-0 w-px", isDark?"bg-white/10":"bg-slate-100")} />
          <div className="space-y-8">
            {(data.items??[]).map((item, i) => (
              <div key={i} className="relative flex gap-6">
                <div className={cn("relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all",
                  item.highlight?(isDark?"bg-[var(--primary)] border-[var(--primary)]/50 text-white shadow-lg shadow-[var(--primary)]/20":"bg-[var(--primary)] border-[var(--primary)]/20 text-white shadow-lg shadow-[var(--primary)]/20"):(isDark?"bg-white/5 border-white/10 text-white/40":"bg-white border-slate-200 text-slate-400"))}>
                  {item.icon || (i+1)}
                </div>
                <div className={cn("flex-1 p-5 mt-1 border transition-all", item.highlight?(isDark?"bg-[var(--primary)]/10 border-[var(--primary)]/20":"bg-[var(--primary)]/5 border-[var(--primary)]/20 shadow-[var(--shadow-md)]"):(isDark?"bg-white/5 border-white/10":"bg-white border-slate-100 shadow-[var(--shadow-sm)]"))} style={{ borderRadius: "var(--radius-md)" }}>
                  <div className={cn("text-[10px] font-bold uppercase tracking-widest mb-1 text-[var(--primary)]")}>{item.year}</div>
                  <div className={cn("font-bold mb-1", isDark?"text-white":"text-[var(--secondary)]")}>{item.title}</div>
                  <div className={cn("text-sm leading-relaxed", isDark?"text-white/60":"text-[var(--secondary)]/60")}>{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
