"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PricingBlockData } from "../definition";
import { BlockSettings } from "../../types";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";

export function PricingSaaS({ data, isDark, settings }: { data: PricingBlockData; isDark?: boolean; settings?: BlockSettings }) {
  const { executeAction } = useActionExecutor();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  
  const categories = (data.categories && data.categories.length > 0) 
    ? data.categories 
    : ((data as any).plans && (data as any).plans.length > 0)
      ? [{ id: "legacy", name: "Dịch vụ", plans: (data as any).plans }]
      : [];

  const [activeCatId, setActiveCatId] = useState(categories[0]?.id || "");
  const dark = isDark !== undefined ? isDark : false;
  const align = settings?.textAlign || "center";

  const currentCategory = categories.find(c => c.id === activeCatId) || categories[0];
  const plans = currentCategory?.plans || [];

  return (
    <div className="w-full">
      {/* Header */}
      {(data.badge || data.title || data.subtitle) && (
        <div className={cn(
          "mb-12",
          align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"
        )}>
          {data.badge && (
            <span className={cn(
              "inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5 border",
              dark ? "bg-white/10 text-white border-white/20" : "bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/10 shadow-sm"
            )}>
              {data.badge}
            </span>
          )}
          {(data.title || data.titleHighlight) && (
            <h2 className={cn("text-3xl md:text-5xl leading-tight mb-4 font-bold tracking-tight", dark ? "text-white" : "text-[var(--secondary)]")}>
              {data.title}{" "}
              {data.titleHighlight && <span className="text-[var(--primary)]">{data.titleHighlight}</span>}
            </h2>
          )}
          {data.subtitle && (
            <p className={cn(
              "max-w-2xl text-sm leading-relaxed",
              align === "center" ? "mx-auto" : "",
              dark ? "text-white/60" : "text-[var(--secondary)]/60"
            )}>
              {data.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-100/50 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-white/10 overflow-hidden">
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setActiveCatId(cat.id)}
                className={cn(
                  "relative px-6 py-2.5 text-sm font-black transition-all duration-300 rounded-xl",
                  activeCatId === cat.id 
                    ? (dark ? "text-slate-900" : "text-white") 
                    : (dark ? "text-white/50 hover:text-white" : "text-slate-500 hover:text-slate-900")
                )}
              >
                {cat.name}
                {activeCatId === cat.id && (
                  <motion.div
                    layoutId="active-cat"
                    className={cn("absolute inset-0 z-[-1] rounded-xl shadow-lg", dark ? "bg-white" : "bg-[var(--primary)]")}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Billing Switcher */}
      {data.showSwitcher && (
        <div className="flex flex-col items-center gap-4 mb-16">
          <div className={cn(
            "relative flex p-1 rounded-full border",
            dark ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"
          )}>
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "relative z-10 px-6 py-2 text-sm font-bold transition-colors duration-300",
                billingCycle === "monthly" ? (dark ? "text-slate-900" : "text-white") : (dark ? "text-white/50" : "text-slate-500")
              )}
            >
              {data.monthlyLabel || "Tháng"}
              {billingCycle === "monthly" && (
                <motion.div
                  layoutId="active-cycle"
                  className={cn("absolute inset-0 z-[-1] rounded-full", dark ? "bg-white" : "bg-[var(--primary)]")}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={cn(
                "relative z-10 px-6 py-2 text-sm font-bold transition-colors duration-300",
                billingCycle === "yearly" ? (dark ? "text-slate-900" : "text-white") : (dark ? "text-white/50" : "text-slate-500")
              )}
            >
              {data.yearlyLabel || "Năm"}
              {billingCycle === "yearly" && (
                <motion.div
                  layoutId="active-cycle"
                  className={cn("absolute inset-0 z-[-1] rounded-full", dark ? "bg-white" : "bg-[var(--primary)]")}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          </div>
          {data.discountLabel && billingCycle === "yearly" && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-black text-[var(--primary)] uppercase tracking-wider"
            >
              ✨ {data.discountLabel}
            </motion.span>
          )}
        </div>
      )}

      {/* Pricing Grid */}
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
        plans.length === 1 ? "max-w-md mx-auto grid-cols-1" :
        plans.length === 2 ? "max-w-4xl mx-auto grid-cols-1 md:grid-cols-2" : ""
      )}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCatId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="contents"
          >
            {plans.map((plan: any, i: number) => {
              const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
              const period = billingCycle === "monthly" ? "/tháng" : "/năm";

              return (
                <div
                  key={i}
                  className={cn(
                    "p-8 border relative flex flex-col h-full transition-all duration-500 group",
                    plan.isPopular 
                      ? "border-[var(--primary)] shadow-[0_20px_50px_-12px_rgba(var(--primary-rgb),0.3)] scale-105 z-10" 
                      : dark 
                        ? "bg-white/5 border-white/10 hover:border-white/20 shadow-xl" 
                        : "bg-white border-slate-100 hover:border-slate-200 shadow-xl hover:shadow-2xl"
                  )}
                  style={{ 
                    borderRadius: "var(--radius-2xl)",
                    backgroundColor: plan.isPopular ? (dark ? "#1a2544" : "white") : undefined
                  }}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--primary)] text-white text-[10px] font-black px-6 py-1.5 rounded-full uppercase tracking-widest shadow-xl ring-4 ring-white dark:ring-[#0F1836]">
                      {plan.popularText || "PHỔ BIẾN NHẤT"}
                    </div>
                  )}
                  
                  <div className={cn(
                    "mb-8",
                    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"
                  )}>
                    <h3 className={cn("text-xl mb-4 font-bold tracking-tight", dark ? "text-white" : "text-[var(--secondary)]")}>
                      {plan.name}
                    </h3>
                    <div className={cn(
                      "flex items-baseline gap-1",
                      align === "center" && "justify-center",
                      align === "right" && "justify-end"
                    )}>
                      <span className={cn("text-5xl font-black tracking-tighter", dark ? "text-white" : "text-[var(--primary)]")}>
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={price}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {price}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                      <span className={cn("text-sm font-bold opacity-50", dark ? "text-white" : "text-slate-400")}>
                        {period}
                      </span>
                    </div>
                    {plan.description && (
                      <p className={cn("mt-4 text-xs font-medium leading-relaxed opacity-60", dark ? "text-white" : "text-slate-500")}>
                        {plan.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4 mb-8">
                    {plan.features?.map((feat: string, j: number) => (
                      <div key={j} className="flex gap-3 text-sm font-medium items-start">
                        <div className={cn(
                          "mt-0.5 p-0.5 rounded-full shrink-0",
                          dark ? "bg-white/10" : "bg-[var(--primary)]/10"
                        )}>
                          <Check className={cn("w-3.5 h-3.5", dark ? "text-white" : "text-[var(--primary)]")} />
                        </div>
                        <span className={dark ? "text-white/80" : "text-slate-600"}>{feat}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => executeAction(plan.btnUrl)}
                    className={cn(
                      "w-full h-14 flex items-center justify-center font-black transition-all duration-300 uppercase tracking-widest text-xs",
                      plan.isPopular 
                        ? "bg-[var(--primary)] text-white hover:brightness-110 shadow-lg shadow-[var(--primary)]/30 group-hover:-translate-y-1" 
                        : dark 
                          ? "bg-white/10 text-white hover:bg-white/20" 
                          : "bg-slate-100 text-[var(--secondary)] hover:bg-slate-200 group-hover:-translate-y-1"
                    )}
                    style={{ borderRadius: "var(--radius-xl)" }}
                  >
                    {plan.btnText || "Bắt đầu"}
                  </button>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
