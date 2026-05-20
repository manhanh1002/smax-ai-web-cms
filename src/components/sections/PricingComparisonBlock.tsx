"use client";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  notIncluded?: string[];
  btnText: string;
  btnUrl: string;
  highlighted?: boolean;
}

export interface PricingComparisonBlockData {
  badge?: string;
  title: string;
  subtitle?: string;
  plans: PricingPlan[];
  darkMode?: boolean;
}

export function PricingComparisonBlock({ data }: { data: PricingComparisonBlockData }) {
  const isDark = data.darkMode === true;

  return (
    <section className={cn(
      "py-24 transition-colors duration-300",
      isDark ? "bg-[#0B1229] text-white" : "bg-white text-slate-900"
    )}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          {data.badge && (
            <span className={cn(
              "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5",
              isDark ? "bg-white/10 text-primary" : "bg-[#f4f7ff] text-[#fa6e5b]"
            )}>
              {data.badge}
            </span>
          )}
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            {data.title}
          </h2>
          {data.subtitle && <p className={cn(
            "text-sm max-w-2xl mx-auto",
            isDark ? "text-slate-400" : "text-slate-500"
          )}>{data.subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.plans?.map((plan, i) => (
            <div
              key={i}
              className={cn(
                "relative p-8 rounded-[40px] border flex flex-col h-full transition-all duration-300",
                plan.highlighted
                  ? "bg-[#fa6e5b] text-white border-[#fa6e5b] shadow-2xl shadow-orange-500/20 scale-105 z-10"
                  : isDark 
                    ? "bg-white/5 text-white border-white/10 hover:border-white/20 shadow-sm" 
                    : "bg-white text-[#0F1836] border-slate-200 hover:border-slate-300 shadow-sm"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0F1836] text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                  Phổ biến nhất
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-black mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  {plan.period && (
                    <span className={cn("text-sm", plan.highlighted ? "text-white/70" : (isDark ? "text-slate-400" : "text-slate-500"))}>
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p className={cn("text-sm mt-4", plan.highlighted ? "text-white/70" : (isDark ? "text-slate-400" : "text-slate-500"))}>
                  {plan.description}
                </p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <Check className={cn("w-5 h-5 shrink-0", plan.highlighted ? "text-white" : "text-primary")} />
                    <span className="text-sm font-medium">{f}</span>
                  </div>
                ))}
                {plan.notIncluded?.map((f, j) => (
                  <div key={j} className={cn("flex items-start gap-3 opacity-40", plan.highlighted ? "text-white" : "")}>
                    <X className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium line-through">{f}</span>
                  </div>
                ))}
              </div>

              <a
                href={plan.btnUrl}
                className={cn(
                  "w-full h-14 rounded-2xl flex items-center justify-center font-black transition-all",
                  plan.highlighted
                    ? "bg-[#0F1836] text-white hover:bg-slate-800"
                    : isDark 
                      ? "bg-white/10 text-white hover:bg-white/20" 
                      : "bg-slate-100 text-[#0F1836] hover:bg-slate-200"
                )}
              >
                {plan.btnText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
