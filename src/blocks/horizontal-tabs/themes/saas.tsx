"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { HorizontalTabsBlockData } from "../definition";
import { BlockSettings } from "../../types";

import { SectionTitle } from "../../SectionTitle";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";

export function HorizontalTabsSaaS({ data, isDark, settings }: { data: HorizontalTabsBlockData; isDark?: boolean; settings?: BlockSettings }) {
  const { executeAction } = useActionExecutor();
  const dark = isDark !== undefined ? isDark : false;
  const align = settings?.textAlign || "center";
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <SectionTitle 
        badge={data.badge}
        title={data.title}
        titleHighlight={data.titleHighlight}
        subtitle={data.subtitle}
        isDark={dark}
        align={align as any}
      />

      <div className="flex flex-col items-center w-full">
        {/* Tab Buttons */}
        <div className={cn(
          "flex flex-wrap justify-center gap-1 mb-12 p-1.5 border",
          dark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"
        )} style={{ borderRadius: "var(--radius-md)" }}>
          {data.tabs?.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={cn(
                "px-6 py-2.5 text-sm font-bold transition-all duration-300",
                activeTab === i 
                  ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" 
                  : dark ? "text-white/40 hover:text-white" : "text-slate-500 hover:text-[var(--secondary)]"
              )}
              style={{ borderRadius: "calc(var(--radius-md) - 4px)" }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6">
          <AnimatePresence mode="wait">
            {data.tabs?.[activeTab] && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start p-6 md:p-12 border transition-all duration-500 shadow-[var(--shadow-lg)]",
                  dark ? "bg-white/5 border-white/10" : "bg-white border-slate-100"
                )}
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                <div className="w-full space-y-6 md:space-y-8 text-left">
                  <div className="space-y-4">
                    <h3 className={cn("text-xl md:text-3xl leading-tight font-bold", dark ? "text-white" : "text-[var(--secondary)]")}>
                      {data.tabs[activeTab].title}
                    </h3>
                    <p className={cn("text-sm md:text-lg leading-relaxed", dark ? "text-white/60" : "text-[var(--secondary)]/60")}>
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
                </div>
                {data.tabs[activeTab].image && (
                  <div className="w-full">
                    <img 
                      src={data.tabs[activeTab].image} 
                      className="w-full h-auto object-cover" 
                      style={{ borderRadius: "calc(var(--radius-lg) / 2)" }}
                      alt="" 
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
