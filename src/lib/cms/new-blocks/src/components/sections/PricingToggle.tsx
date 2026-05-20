"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface PricingPlan {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  description?: string;
  features: string[];
  ctaText: string;
  ctaUrl?: string;
  popular?: boolean;
  badge?: string;
}

export interface PricingToggleData {
  sectionLabel?: string;
  title: string;
  subtitle?: string;
  plans: PricingPlan[];
  savingsBadge?: string;
  darkMode?: boolean;
}

export function PricingToggleBlock({ data }: { data: PricingToggleData }) {
  const [isAnnual, setIsAnnual] = useState(true);
  const isDark = data.darkMode ?? false;

  return (
    <section className={cn("py-20 px-4", isDark ? "bg-slate-900" : "bg-white")}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          {data.sectionLabel && (
            <p className={cn("text-xs font-bold uppercase tracking-widest", isDark ? "text-violet-400" : "text-violet-600")}>
              {data.sectionLabel}
            </p>
          )}
          <h2 className={cn("text-3xl md:text-4xl font-black", isDark ? "text-white" : "text-slate-900")}>{data.title}</h2>
          {data.subtitle && <p className={cn("text-lg max-w-2xl mx-auto", isDark ? "text-slate-400" : "text-slate-600")}>{data.subtitle}</p>}

          <div className="flex items-center justify-center gap-3 pt-2">
            <span className={cn("text-sm font-medium", !isAnnual ? (isDark ? "text-white" : "text-slate-900") : (isDark ? "text-slate-500" : "text-slate-400"))}>
              Hàng tháng
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors",
                isAnnual ? "bg-violet-600" : (isDark ? "bg-slate-600" : "bg-slate-300")
              )}
            >
              <span className={cn("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200", isAnnual ? "translate-x-6 left-0.5" : "left-0.5")} />
            </button>
            <span className={cn("text-sm font-medium flex items-center gap-2", isAnnual ? (isDark ? "text-white" : "text-slate-900") : (isDark ? "text-slate-500" : "text-slate-400"))}>
              Hàng năm
              {data.savingsBadge && isAnnual && (
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">{data.savingsBadge}</span>
              )}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {(data.plans ?? []).map((plan, i) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div key={i} className={cn(
                "rounded-2xl border p-6 space-y-5 relative transition-all",
                plan.popular
                  ? (isDark ? "bg-violet-900/40 border-violet-500" : "bg-violet-600 border-violet-600 text-white")
                  : (isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")
              )}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-violet-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                      {plan.badge || "Phổ biến nhất"}
                    </span>
                  </div>
                )}

                <div>
                  <h3 className={cn("font-black text-xl", plan.popular ? "text-white" : (isDark ? "text-white" : "text-slate-900"))}>
                    {plan.name}
                  </h3>
                  {plan.description && (
                    <p className={cn("text-sm mt-1", plan.popular ? "text-violet-100" : (isDark ? "text-slate-400" : "text-slate-500"))}>
                      {plan.description}
                    </p>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className={cn("text-4xl font-black", plan.popular ? "text-white" : (isDark ? "text-white" : "text-slate-900"))}>
                    {plan.currency}{price.toLocaleString()}
                  </span>
                  <span className={cn("text-sm", plan.popular ? "text-violet-200" : (isDark ? "text-slate-400" : "text-slate-500"))}>
                    /{isAnnual ? "năm" : "tháng"}
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {plan.features.map((f, j) => (
                    <li key={j} className={cn("flex items-start gap-2 text-sm", plan.popular ? "text-violet-100" : (isDark ? "text-slate-300" : "text-slate-700"))}>
                      <span className={cn("mt-0.5 text-base leading-none", plan.popular ? "text-white" : "text-violet-500")}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a href={plan.ctaUrl ?? "#"} className={cn(
                  "block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all",
                  plan.popular
                    ? "bg-white text-violet-700 hover:bg-violet-50"
                    : (isDark ? "bg-violet-600 text-white hover:bg-violet-500" : "bg-violet-600 text-white hover:bg-violet-700")
                )}>
                  {plan.ctaText}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
