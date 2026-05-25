"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";
import type { PricingToggleData } from "../definition";
import * as Icons from "lucide-react";

import { BlockSettings } from "../../types";

export function PricingToggleSaaS({ data, isDark, settings }: { data: PricingToggleData; isDark?: boolean; settings?: BlockSettings }) {
  const showSwitch = !!(
    (data.monthlyLabel && data.monthlyLabel.trim() !== "") ||
    (data.yearlyLabel && data.yearlyLabel.trim() !== "") ||
    (data.savingsBadge && data.savingsBadge.trim() !== "") ||
    (data.plans ?? []).some((plan: any) => plan.annualPrice && plan.annualPrice > 0)
  );
  const [isAnnual, setIsAnnual] = useState(showSwitch);
  const { executeAction } = useActionExecutor();
  const align = settings?.textAlign || "center";
  return (
    <div className="max-w-6xl mx-auto">
      <div className={cn(
        "mb-12 space-y-4",
        align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"
      )}>
        {data.sectionLabel && <p className={cn("text-xs font-bold uppercase tracking-widest", isDark?"text-[var(--primary)]":"text-[var(--primary)]")}>{data.sectionLabel}</p>}
        <h2 className={cn("text-3xl md:text-4xl", isDark?"text-white":"text-[var(--secondary)]")}>{data.title}</h2>
        {data.subtitle && <p className={cn("text-lg max-w-2xl mx-auto", isDark?"text-white/60":"text-[var(--secondary)]/60")}>{data.subtitle}</p>}
        {showSwitch && (
          <div className={cn(
            "flex items-center gap-3 pt-2",
            align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"
          )}>
            <span className={cn("text-sm font-medium", !isAnnual?(isDark?"text-white":"text-[var(--secondary)]"):(isDark?"text-slate-500":"text-slate-400"))}>{data.monthlyLabel || "Tháng"}</span>
            <button onClick={() => setIsAnnual(!isAnnual)} className={cn("relative w-12 h-6 rounded-full transition-colors", isAnnual?"bg-[var(--primary)]":(isDark?"bg-slate-600":"bg-slate-300"))}>
              <span className={cn("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200", isAnnual?"left-6":"left-0.5")} />
            </button>
            <span className={cn("text-sm font-medium flex items-center gap-2", isAnnual?(isDark?"text-white":"text-[var(--secondary)]"):(isDark?"text-slate-500":"text-slate-400"))}>
              {data.yearlyLabel || "Năm"}
              {data.savingsBadge && isAnnual && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">{data.savingsBadge}</span>}
            </span>
          </div>
        )}
      </div>
      <div className={cn(
        "grid grid-cols-1 gap-6 items-start",
        (data.plans??[]).length === 1 ? "max-w-md mx-auto grid-cols-1" :
        (data.plans??[]).length === 2 ? "max-w-4xl mx-auto md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
      )}>
        {(data.plans??[]).map((plan, i) => {
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
          return (
            <div key={i} className={cn("rounded-[var(--radius)] border p-6 space-y-5 relative", plan.popular?(isDark?"bg-[var(--primary)]/20 border-[var(--primary)]":"bg-[var(--primary)] border-[var(--primary)] text-white shadow-[var(--shadow-lg)] shadow-[var(--primary)]/20"):(isDark?"bg-slate-800 border-slate-700":"bg-white border-slate-200 shadow-sm"))}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-[var(--secondary)] text-white text-xs font-bold px-4 py-1 rounded-full shadow">{plan.badge||"Phổ biến nhất"}</span></div>}
              <div className={cn(
                align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"
              )}>
                <h3 className={cn("text-xl", plan.popular?"text-white":(isDark?"text-white":"text-[var(--secondary)]"))}>{plan.name}</h3>
                {plan.description && <p className={cn("text-sm mt-1", plan.popular?"text-white/80":(isDark?"text-slate-400":"text-slate-500"))}>{plan.description}</p>}
              </div>
              <div className={cn(
                "flex items-baseline gap-1",
                align === "center" && "justify-center",
                align === "right" && "justify-end"
              )}>
                <span className={cn("text-4xl font-bold", plan.popular?"text-white":(isDark?"text-white":"text-[var(--secondary)]"))}>
                  {price.toLocaleString()}{plan.currency}
                </span>
                <span className={cn("text-sm", plan.popular?"text-white/70":(isDark?"text-slate-400":"text-slate-500"))}>
                  /{isAnnual ? (data.yearlyLabel || "Năm").toLowerCase() : (data.monthlyLabel || "Tháng").toLowerCase()}
                </span>
              </div>
              <ul className="space-y-2.5">
                {(plan.features || []).map((f: any, j: number) => {
                  const isString = typeof f === "string";
                  const text = isString ? f : f.text;
                  const iconName = isString ? "Check" : (f.icon || "Check");
                  // @ts-ignore
                  const IconComponent = Icons[iconName] || Icons.Check;

                  return (
                    <li key={j} className={cn("flex items-start gap-2 text-sm", plan.popular?"text-white/90":(isDark?"text-slate-300":"text-slate-700"))}>
                      <IconComponent className={cn("w-4 h-4 shrink-0 mt-0.5", plan.popular?"text-white":"text-[var(--primary)]")} />
                      <span>{text}</span>
                    </li>
                  );
                })}
              </ul>
              <button onClick={() => executeAction(plan.ctaAction)} className={cn("block w-full text-center py-3 rounded-[var(--radius)] font-bold text-sm transition-all", plan.popular?"bg-white text-[var(--primary)] hover:brightness-110":(isDark?"bg-[var(--primary)] text-white hover:brightness-110":"bg-[var(--primary)] text-white hover:brightness-110"))}>
                {plan.ctaText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
