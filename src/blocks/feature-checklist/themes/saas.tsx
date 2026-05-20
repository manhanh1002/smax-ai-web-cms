import React from "react";
import { cn } from "@/lib/utils";
import type { FeatureChecklistData, ChecklistCol } from "../definition";

function Col({ col, isDark }: { col: ChecklistCol; isDark?: boolean }) {
  return (
    <div className={cn("border p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow", isDark?"bg-white/5 border-white/10":"bg-white border-slate-100")} style={{ borderRadius: "var(--radius-lg)" }}>
      <h3 className={cn("text-lg mb-1 font-bold", isDark?"text-white":"text-[var(--secondary)]")}>{col.label}</h3>
      {col.sublabel && <p className={cn("text-sm mb-5", isDark?"text-white/60":"text-[var(--secondary)]/60")}>{col.sublabel}</p>}
      <ul className="space-y-3 mt-4">
        {(col.items??[]).map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className={cn("mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
              item.checked?(isDark?"bg-[var(--primary)]/20 text-[var(--primary)]":"bg-[var(--primary)]/10 text-[var(--primary)]"):(isDark?"bg-white/5 text-white/20":"bg-slate-50 text-slate-300"))}>
              {item.checked?"✓":"✕"}
            </span>
            <span className={cn("text-sm leading-relaxed", item.checked?(isDark?"text-white/80":"text-[var(--secondary)]/80"):(isDark?"text-white/20 line-through":"text-slate-300 line-through"))}>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FeatureChecklistSaaS({ data, isDark }: { data: FeatureChecklistData; isDark?: boolean }) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        {data.sectionLabel && <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-3 text-[var(--primary)]")}>{data.sectionLabel}</p>}
        <h2 className={cn("text-3xl md:text-4xl mb-3 font-bold", isDark?"text-white":"text-[var(--secondary)]")}>{data.title}</h2>
        {data.subtitle && <p className={cn("text-lg max-w-2xl mx-auto", isDark?"text-white/60":"text-[var(--secondary)]/60")}>{data.subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Col col={data.columnA ?? {label:"",items:[]}} isDark={isDark} />
        <Col col={data.columnB ?? {label:"",items:[]}} isDark={isDark} />
      </div>
    </div>
  );
}
