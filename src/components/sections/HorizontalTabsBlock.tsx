"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface HorizontalTabItem {
  label: string;
  title: string;
  description: string;
  image?: string;
  features?: string[];
}

export interface HorizontalTabsBlockData {
  badge?: string;
  title?: string;
  tabs: HorizontalTabItem[];
  darkMode?: boolean;
}

export function HorizontalTabsBlock({ data }: { data: HorizontalTabsBlockData }) {
  const [activeTab, setActiveTab] = useState(0);
  const isDark = data.darkMode === true;
  const tabs = data.tabs || [];

  if (tabs.length === 0) return null;

  return (
    <section className={cn(
      "py-24 transition-colors duration-300",
      isDark ? "bg-[#0B1229] text-white" : "bg-slate-50 text-slate-900"
    )}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          {data.badge && (
            <span className={cn(
              "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border",
              isDark ? "bg-white/10 text-primary border-white/10" : "bg-white text-[#2563eb] border-slate-200"
            )}>
              {data.badge}
            </span>
          )}
          <h2 className="text-3xl md:text-5xl font-black">
            {data.title}
          </h2>
        </div>

        {/* Tab Header */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={cn(
                "px-8 py-4 rounded-full text-sm font-bold transition-all duration-300",
                activeTab === i
                  ? (isDark ? "bg-[#fa6e5b] text-white shadow-lg shadow-orange-500/20" : "bg-[#0F1836] text-white shadow-lg")
                  : (isDark ? "bg-white/5 text-slate-400 hover:bg-white/10" : "bg-white text-slate-500 hover:bg-slate-100")
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center p-8 lg:p-16 rounded-[40px] border transition-all duration-300",
              isDark ? "bg-white/5 border-white/10 shadow-2xl" : "bg-white border-slate-100 shadow-sm"
            )}
          >
            <div className="space-y-6">
              <h3 className={cn(
                "text-3xl font-black leading-tight",
                isDark ? "text-white" : "text-[#0F1836]"
              )}>
                {tabs[activeTab].title}
              </h3>
              <p className={cn(
                "leading-relaxed",
                isDark ? "text-slate-300" : "text-slate-500"
              )}>
                {tabs[activeTab].description}
              </p>
              {tabs[activeTab].features && (
                <div className="space-y-3 pt-4">
                  {tabs[activeTab].features?.map((f, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                        isDark ? "bg-primary/20" : "bg-blue-100"
                      )}>
                        <svg className={cn("w-3 h-3", isDark ? "text-primary" : "text-blue-600")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className={cn(
                        "text-sm font-bold",
                        isDark ? "text-slate-200" : "text-slate-700"
                      )}>{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={cn(
              "rounded-3xl overflow-hidden aspect-video flex items-center justify-center p-6 border",
              isDark ? "bg-white/5 border-white/5" : "bg-[#f4f7ff] border-slate-50"
            )}>
              {tabs[activeTab].image && (
                <img
                  src={tabs[activeTab].image}
                  alt={tabs[activeTab].title}
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
