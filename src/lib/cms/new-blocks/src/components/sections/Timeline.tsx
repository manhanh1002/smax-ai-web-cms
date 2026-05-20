import React from "react";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon?: string;
  highlight?: boolean;
}

export interface TimelineData {
  sectionLabel?: string;
  title: string;
  subtitle?: string;
  items: TimelineItem[];
  orientation?: "vertical" | "horizontal";
  darkMode?: boolean;
}

function VerticalTimeline({ items, isDark }: { items: TimelineItem[]; isDark: boolean }) {
  return (
    <div className="relative">
      <div className={cn("absolute left-6 top-0 bottom-0 w-px", isDark ? "bg-slate-700" : "bg-slate-200")} />
      <div className="space-y-8">
        {items.map((item, i) => (
          <div key={i} className="relative flex gap-6 pl-0">
            <div className={cn(
              "relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2",
              item.highlight
                ? (isDark ? "bg-violet-600 border-violet-400 text-white" : "bg-violet-600 border-violet-200 text-white")
                : (isDark ? "bg-slate-800 border-slate-600 text-slate-300" : "bg-white border-slate-300 text-slate-600")
            )}>
              {item.icon || (i + 1)}
            </div>
            <div className={cn(
              "flex-1 pb-2 rounded-2xl p-5 mt-1",
              item.highlight
                ? (isDark ? "bg-violet-900/30 border border-violet-700/40" : "bg-violet-50 border border-violet-200")
                : (isDark ? "bg-slate-800/50 border border-slate-700/40" : "bg-white border border-slate-200")
            )}>
              <div className={cn("text-xs font-bold uppercase tracking-widest mb-1", isDark ? "text-violet-400" : "text-violet-600")}>
                {item.year}
              </div>
              <div className={cn("text-base font-bold mb-1", isDark ? "text-white" : "text-slate-900")}>
                {item.title}
              </div>
              <div className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalTimeline({ items, isDark }: { items: TimelineItem[]; isDark: boolean }) {
  return (
    <div className="relative overflow-x-auto pb-4">
      <div className={cn("absolute top-6 left-8 right-8 h-px", isDark ? "bg-slate-700" : "bg-slate-200")} />
      <div className="flex gap-4 min-w-max">
        {items.map((item, i) => (
          <div key={i} className="relative flex flex-col items-center w-44 pt-0">
            <div className={cn(
              "relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 mb-4",
              item.highlight
                ? (isDark ? "bg-violet-600 border-violet-400 text-white" : "bg-violet-600 border-violet-200 text-white")
                : (isDark ? "bg-slate-800 border-slate-600 text-slate-300" : "bg-white border-slate-300 text-slate-600")
            )}>
              {item.icon || (i + 1)}
            </div>
            <div className={cn("text-xs font-bold uppercase tracking-wide mb-1", isDark ? "text-violet-400" : "text-violet-600")}>
              {item.year}
            </div>
            <div className={cn("text-sm font-bold text-center mb-1", isDark ? "text-white" : "text-slate-900")}>
              {item.title}
            </div>
            <div className={cn("text-xs text-center leading-relaxed", isDark ? "text-slate-400" : "text-slate-500")}>
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TimelineBlock({ data }: { data: TimelineData }) {
  const isDark = data.darkMode ?? false;

  return (
    <section className={cn("py-20 px-4", isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900")}>
      <div className="max-w-5xl mx-auto">
        {data.sectionLabel && (
          <p className={cn("text-xs font-bold uppercase tracking-widest mb-3", isDark ? "text-violet-400" : "text-violet-600")}>
            {data.sectionLabel}
          </p>
        )}
        <h2 className={cn("text-3xl md:text-4xl font-black mb-3", isDark ? "text-white" : "text-slate-900")}>
          {data.title}
        </h2>
        {data.subtitle && (
          <p className={cn("text-lg mb-12", isDark ? "text-slate-400" : "text-slate-600")}>{data.subtitle}</p>
        )}

        {data.orientation === "horizontal" ? (
          <HorizontalTimeline items={data.items ?? []} isDark={isDark} />
        ) : (
          <VerticalTimeline items={data.items ?? []} isDark={isDark} />
        )}
      </div>
    </section>
  );
}
