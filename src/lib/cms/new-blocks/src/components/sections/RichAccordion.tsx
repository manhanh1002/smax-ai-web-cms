"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  heading: string;
  body: string;
  icon?: string;
  defaultOpen?: boolean;
}

export interface RichAccordionData {
  sectionLabel?: string;
  title?: string;
  subtitle?: string;
  items: AccordionItem[];
  allowMultiple?: boolean;
  darkMode?: boolean;
}

export function RichAccordionBlock({ data }: { data: RichAccordionData }) {
  const isDark = data.darkMode ?? false;
  const defaultOpenSet = new Set((data.items ?? []).map((item, i) => item.defaultOpen ? i : -1).filter(i => i >= 0));
  const [openItems, setOpenItems] = useState<Set<number>>(defaultOpenSet);

  const toggle = (i: number) => {
    setOpenItems(prev => {
      const next = new Set(data.allowMultiple ? prev : []);
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <section className={cn("py-20 px-4", isDark ? "bg-slate-900" : "bg-white")}>
      <div className="max-w-3xl mx-auto">
        {data.sectionLabel && (
          <p className={cn("text-xs font-bold uppercase tracking-widest mb-3", isDark ? "text-violet-400" : "text-violet-600")}>
            {data.sectionLabel}
          </p>
        )}
        {data.title && (
          <h2 className={cn("text-3xl md:text-4xl font-black mb-3", isDark ? "text-white" : "text-slate-900")}>{data.title}</h2>
        )}
        {data.subtitle && (
          <p className={cn("text-lg mb-10", isDark ? "text-slate-400" : "text-slate-600")}>{data.subtitle}</p>
        )}

        <div className="space-y-3">
          {(data.items ?? []).map((item, i) => {
            const isOpen = openItems.has(i);
            return (
              <div key={i} className={cn(
                "border rounded-2xl overflow-hidden transition-all",
                isDark
                  ? isOpen ? "border-violet-700 bg-slate-800" : "border-slate-700 bg-slate-800/50"
                  : isOpen ? "border-violet-200 bg-violet-50" : "border-slate-200 bg-white"
              )}>
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <span className="text-xl">{item.icon}</span>}
                    <span className={cn("font-semibold text-base", isDark ? "text-white" : "text-slate-900")}>{item.heading}</span>
                  </div>
                  <span className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 text-sm font-bold",
                    isOpen
                      ? (isDark ? "bg-violet-700 text-white rotate-45" : "bg-violet-600 text-white rotate-45")
                      : (isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600")
                  )}>
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className={cn(
                    "px-6 pb-5 text-base leading-relaxed",
                    isDark ? "text-slate-300" : "text-slate-700",
                    item.icon ? "pl-[4.5rem]" : "pl-6"
                  )}>
                    <div style={{ whiteSpace: "pre-wrap" }}>{item.body}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
