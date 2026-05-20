import React from "react";
import { cn } from "@/lib/utils";

export interface ChecklistColumn {
  label: string;
  sublabel?: string;
  items: { text: string; checked: boolean }[];
}

export interface FeatureChecklistData {
  sectionLabel?: string;
  title: string;
  subtitle?: string;
  columnA: ChecklistColumn;
  columnB: ChecklistColumn;
  darkMode?: boolean;
}

function Column({ col, isDark }: { col: ChecklistColumn; isDark: boolean }) {
  return (
    <div className={cn("rounded-2xl border p-6", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
      <h3 className={cn("font-black text-lg mb-0.5", isDark ? "text-white" : "text-slate-900")}>{col.label}</h3>
      {col.sublabel && <p className={cn("text-sm mb-5", isDark ? "text-slate-400" : "text-slate-500")}>{col.sublabel}</p>}
      <ul className="space-y-3 mt-4">
        {(col.items ?? []).map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className={cn(
              "mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
              item.checked
                ? (isDark ? "bg-emerald-700 text-emerald-200" : "bg-emerald-100 text-emerald-700")
                : (isDark ? "bg-slate-700 text-slate-500" : "bg-slate-100 text-slate-400")
            )}>
              {item.checked ? "✓" : "✕"}
            </span>
            <span className={cn(
              "text-sm leading-relaxed",
              item.checked
                ? (isDark ? "text-slate-200" : "text-slate-800")
                : (isDark ? "text-slate-500 line-through decoration-slate-600" : "text-slate-400 line-through decoration-slate-300")
            )}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FeatureChecklistBlock({ data }: { data: FeatureChecklistData }) {
  const isDark = data.darkMode ?? false;

  return (
    <section className={cn("py-20 px-4", isDark ? "bg-slate-900" : "bg-slate-50")}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          {data.sectionLabel && <p className={cn("text-xs font-bold uppercase tracking-widest mb-3", isDark ? "text-violet-400" : "text-violet-600")}>{data.sectionLabel}</p>}
          <h2 className={cn("text-3xl md:text-4xl font-black mb-3", isDark ? "text-white" : "text-slate-900")}>{data.title}</h2>
          {data.subtitle && <p className={cn("text-lg max-w-2xl mx-auto", isDark ? "text-slate-400" : "text-slate-600")}>{data.subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Column col={data.columnA ?? { label: "", items: [] }} isDark={isDark} />
          <Column col={data.columnB ?? { label: "", items: [] }} isDark={isDark} />
        </div>
      </div>
    </section>
  );
}
