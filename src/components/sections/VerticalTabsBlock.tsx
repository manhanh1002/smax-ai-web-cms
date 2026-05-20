"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface VerticalTabItem {
  title: string;
  description: string;
  image?: string;
  tag?: string;
}

export interface VerticalTabsBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  tabs: VerticalTabItem[];
  darkMode?: boolean;
}

export function VerticalTabsBlock({ data }: { data: VerticalTabsBlockData }) {
  const [activeTab, setActiveTab] = useState(0);
  const isDark = data.darkMode === true;
  const tabs = data.tabs || [];

  if (tabs.length === 0) return null;

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
              isDark ? "bg-white/10 text-[#fa6e5b]" : "bg-[#f4f7ff] text-[#fa6e5b]"
            )}>
              {data.badge}
            </span>
          )}
          <h2 className="text-3xl md:text-5xl font-black leading-tight">
            {data.title}{" "}
            <span className="text-[#fa6e5b]">{data.titleHighlight}</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left: Tab Menu */}
          <div className="w-full lg:w-1/3 space-y-3">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "w-full text-left p-6 rounded-2xl border transition-all duration-300 group",
                  activeTab === i
                    ? (isDark ? "bg-white/10 border-[#2563eb] shadow-xl shadow-blue-500/20" : "bg-white border-[#2563eb] shadow-xl shadow-blue-500/10")
                    : (isDark ? "bg-white/5 border-transparent hover:bg-white/10" : "bg-slate-50 border-transparent hover:border-slate-200")
                )}
              >
                {tab.tag && (
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest mb-2 block",
                    activeTab === i ? "text-[#fa6e5b]" : (isDark ? "text-slate-500" : "text-slate-400")
                  )}>
                    {tab.tag}
                  </span>
                )}
                <h3 className={cn(
                  "text-lg font-bold transition-colors",
                  activeTab === i ? (isDark ? "text-white" : "text-[#0F1836]") : (isDark ? "text-slate-400 group-hover:text-slate-200" : "text-slate-500 group-hover:text-slate-700")
                )}>
                  {tab.title}
                </h3>
              </button>
            ))}
          </div>

          {/* Right: Content */}
          <div className="flex-1 min-h-[400px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className={cn(
                  "rounded-3xl p-4 overflow-hidden border",
                  isDark ? "bg-white/5 border-white/10" : "bg-[#f4f7ff] border-slate-100"
                )}>
                  {tabs[activeTab].image && (
                    <img
                      src={tabs[activeTab].image}
                      alt={tabs[activeTab].title}
                      className="w-full h-auto rounded-2xl shadow-sm"
                    />
                  )}
                </div>
                <div className="px-4">
                  <p className={cn(
                    "text-lg leading-relaxed italic",
                    isDark ? "text-slate-300" : "text-slate-500"
                  )}>
                    "{tabs[activeTab].description}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
