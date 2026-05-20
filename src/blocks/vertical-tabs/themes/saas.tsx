"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { VerticalTabsBlockData } from "../definition";
import { BlockSettings } from "../../types";

import { SectionTitle } from "../../SectionTitle";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";

export function VerticalTabsSaaS({ data, isDark, settings }: { data: VerticalTabsBlockData; isDark?: boolean; settings?: BlockSettings }) {
  const { executeAction } = useActionExecutor();
  const dark = isDark !== undefined ? isDark : false;
  const align = settings?.textAlign || "center";
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
      <SectionTitle 
        badge={data.badge}
        title={data.title}
        titleHighlight={data.titleHighlight}
        subtitle={data.subtitle}
        isDark={dark}
        align={align as any}
      />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Menu bên trái */}
        <div className="w-full lg:w-72 space-y-2 shrink-0">
          {data.tabs?.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={cn(
                "w-full p-5 transition-all duration-300 border flex items-center justify-between group",
                activeTab === i 
                  ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" 
                  : dark 
                    ? "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10" 
                    : "bg-slate-50 border-slate-100 text-[var(--secondary)] hover:bg-white hover:shadow-md"
              )}
              style={{ borderRadius: "var(--radius-md)" }}
            >
              <span className="font-bold text-sm uppercase tracking-wider">{tab.label}</span>
              <svg className={cn("w-5 h-4 transition-transform", activeTab === i ? "translate-x-1" : "opacity-0 group-hover:opacity-100")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          ))}
        </div>

        {/* Nội dung bên phải */}
        <div className="flex-1 w-full min-h-[400px]">
          <AnimatePresence mode="wait">
            {data.tabs?.[activeTab] && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className={cn(
                  "p-6 md:p-8 border transition-all duration-500 min-h-full flex flex-col justify-center shadow-[var(--shadow-lg)]",
                  dark ? "bg-white/5 border-white/10" : "bg-white border-slate-100"
                )}
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className={cn("text-2xl md:text-3xl leading-tight font-bold", dark ? "text-white" : "text-[var(--secondary)]")}>
                      {data.tabs[activeTab].title}
                    </h3>
                    <p className={cn("text-lg leading-relaxed", dark ? "text-white/60" : "text-[var(--secondary)]/60")}>
                      {data.tabs[activeTab].description}
                    </p>
                  </div>

                  {data.tabs[activeTab].btnText && (
                    <div className="pt-2">
                      <button
                        onClick={() => executeAction(data.tabs[activeTab].btnAction)}
                        className="inline-flex items-center gap-2 h-12 px-8 bg-[var(--primary)] text-white font-bold text-sm shadow-lg shadow-[var(--primary)]/20 hover:scale-105 active:scale-95 transition-all"
                        style={{ borderRadius: "var(--radius-md)" }}
                      >
                        {data.tabs[activeTab].btnText}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {data.tabs[activeTab].image && (
                    <div className="pt-8 -mx-6 md:-mx-8 -mb-6 md:-mb-8 mt-auto overflow-hidden">
                      <img 
                        src={data.tabs[activeTab].image} 
                        className="w-full h-auto object-cover" 
                        alt="" 
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
