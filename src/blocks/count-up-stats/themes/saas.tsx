"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { CountUpStatsData, StatItem } from "../definition";

function StatCard({ stat, isDark, isCards }: { stat: StatItem; isDark?: boolean; isCards: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!inView) return;
    let cur = 0; const step = stat.value / (1800 / 16);
    const t = setInterval(() => { cur += step; if (cur >= stat.value) { setCount(stat.value); clearInterval(t); } else setCount(Math.floor(cur)); }, 16);
    return () => clearInterval(t);
  }, [inView, stat.value]);
  return (
    <div ref={ref} className={cn("text-center transition-all", isCards && (isDark?"bg-white/5 border border-white/10 p-6":"bg-white border border-slate-200 p-6 shadow-[var(--shadow-md)]"))} style={{ borderRadius: isCards ? "var(--radius-md)" : undefined }}>
      {stat.icon && <div className="text-3xl mb-3">{stat.icon}</div>}
      <div className={cn("text-4xl md:text-5xl font-bold tabular-nums mb-1", isDark?"text-white":"text-[var(--secondary)]")}>{stat.prefix}{count.toLocaleString()}{stat.suffix}</div>
      <div className={cn("font-bold text-base mb-1", isDark?"text-white":"text-[var(--secondary)]")}>{stat.label}</div>
      {stat.description && <div className={cn("text-sm", isDark?"text-white/40":"text-slate-400")}>{stat.description}</div>}
    </div>
  );
}

import { SectionTitle } from "../../SectionTitle";

export function CountUpStatsSaaS({ data, isDark }: { data: CountUpStatsData; isDark?: boolean }) {
  const cols = data.columns ?? 3;
  const gridCols: Record<number,string> = { 2:"grid-cols-2", 3:"grid-cols-1 md:grid-cols-3", 4:"grid-cols-2 md:grid-cols-4" };
  const isCards = data.layout === "cards";
  return (
    <div className="max-w-6xl mx-auto">
      <SectionTitle
        badge={data.sectionLabel}
        title={data.title}
        titleHighlight={data.titleHighlight}
        subtitle={data.subtitle}
        isDark={isDark}
        align="center"
      />
      <div className={cn("grid gap-6", gridCols[cols])}>
        {(data.stats??[]).map((s, i) => <StatCard key={i} stat={s} isDark={isDark} isCards={isCards} />)}
      </div>
    </div>
  );
}
