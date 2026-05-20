"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface StatItem {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface CountUpStatsData {
  sectionLabel?: string;
  title?: string;
  subtitle?: string;
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  darkMode?: boolean;
  layout?: "cards" | "minimal";
}

function useCountUp(target: number, duration: number, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

function StatCard({ stat, isDark, layout }: { stat: StatItem; isDark: boolean; layout: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const count = useCountUp(stat.value, 1800, inView);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isCards = layout === "cards";

  return (
    <div ref={ref} className={cn(
      "text-center",
      isCards && (isDark ? "bg-slate-800 border border-slate-700 rounded-2xl p-6" : "bg-white border border-slate-200 rounded-2xl p-6 shadow-sm")
    )}>
      {stat.icon && <div className="text-3xl mb-3">{stat.icon}</div>}
      <div className={cn("text-4xl md:text-5xl font-black tabular-nums mb-1", isDark ? "text-white" : "text-slate-900")}>
        {stat.prefix}{count.toLocaleString()}{stat.suffix}
      </div>
      <div className={cn("font-semibold text-base mb-1", isDark ? "text-slate-200" : "text-slate-800")}>{stat.label}</div>
      {stat.description && (
        <div className={cn("text-sm", isDark ? "text-slate-500" : "text-slate-400")}>{stat.description}</div>
      )}
    </div>
  );
}

export function CountUpStatsBlock({ data }: { data: CountUpStatsData }) {
  const isDark = data.darkMode ?? false;
  const cols = data.columns ?? 3;
  const layout = data.layout ?? "cards";
  const gridCols: Record<number, string> = { 2: "grid-cols-2", 3: "grid-cols-1 md:grid-cols-3", 4: "grid-cols-2 md:grid-cols-4" };

  return (
    <section className={cn("py-20 px-4", isDark ? "bg-slate-900" : "bg-slate-50")}>
      <div className="max-w-6xl mx-auto">
        {(data.sectionLabel || data.title || data.subtitle) && (
          <div className="text-center mb-12">
            {data.sectionLabel && <p className={cn("text-xs font-bold uppercase tracking-widest mb-3", isDark ? "text-violet-400" : "text-violet-600")}>{data.sectionLabel}</p>}
            {data.title && <h2 className={cn("text-3xl md:text-4xl font-black mb-3", isDark ? "text-white" : "text-slate-900")}>{data.title}</h2>}
            {data.subtitle && <p className={cn("text-lg", isDark ? "text-slate-400" : "text-slate-600")}>{data.subtitle}</p>}
          </div>
        )}
        <div className={cn("grid gap-6", gridCols[cols])}>
          {(data.stats ?? []).map((stat, i) => (
            <StatCard key={i} stat={stat} isDark={isDark} layout={layout} />
          ))}
        </div>
      </div>
    </section>
  );
}
