"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { RichAccordionData } from "../definition";

import { SectionTitle } from "../../SectionTitle";

export function RichAccordionSaaS({ data, isDark }: { data: RichAccordionData; isDark?: boolean }) {
  const [open, setOpen] = useState<Set<number>>(new Set((data.items??[]).map((it,i)=>it.defaultOpen?i:-1).filter(i=>i>=0)));
  const toggle = (i: number) => setOpen(prev => {
    const n = new Set(data.allowMultiple ? prev : []);
    prev.has(i) ? n.delete(i) : n.add(i); return n;
  });
  return (
    <div className="max-w-3xl mx-auto">
      <SectionTitle
        badge={data.sectionLabel}
        title={data.title}
        titleHighlight={data.titleHighlight}
        subtitle={data.subtitle}
        isDark={isDark}
        align="center"
      />
      <div className="space-y-3">
        {(data.items??[]).map((item, i) => {
          const isOpen = open.has(i);
          return (
            <div key={i} className={cn("border transition-all shadow-[var(--shadow-sm)]", isDark?(isOpen?"border-[var(--primary)] bg-white/5":"border-white/10 bg-white/5"):(isOpen?"border-[var(--primary)]/30 bg-[var(--primary)]/5 shadow-[var(--shadow-md)]":"border-slate-100 bg-white"))} style={{ borderRadius: "var(--radius-md)" }}>
              <button className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group" onClick={() => toggle(i)}>
                <div className="flex items-center gap-3">
                  {item.icon && <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>}
                  <span className={cn("font-bold text-lg", isDark?"text-white":"text-[var(--secondary)]")}>{item.heading}</span>
                </div>
                <span className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 text-base font-bold",
                  isOpen?(isDark?"bg-[var(--primary)] text-white rotate-45":"bg-[var(--primary)] text-white rotate-45"):(isDark?"bg-white/5 text-white/40":"bg-slate-50 text-slate-400 group-hover:bg-[var(--primary)] group-hover:text-white"))}>+</span>
              </button>
              {isOpen && (
                <div className={cn("px-6 pb-6 text-base leading-relaxed whitespace-pre-wrap pt-2 border-t mx-6", isDark?"border-white/5 text-white/60":"border-slate-50 text-[var(--secondary)]/60")}>
                  {item.body}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
