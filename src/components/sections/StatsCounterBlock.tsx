"use client";
import { motion } from "framer-motion";

export interface StatItem {
  value: string;
  label: string;
  suffix?: string;
}

export interface StatsCounterBlockData {
  items: StatItem[];
  darkMode?: boolean;
}

export function StatsCounterBlock({ data }: { data: StatsCounterBlockData }) {
  const isDark = data.darkMode !== false; // Default to true for this specific block

  return (
    <section className={cn(
      "py-20 transition-colors duration-300",
      isDark ? "bg-[#0F1836] text-white" : "bg-white text-slate-900 border-y border-slate-100"
    )}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {data.items?.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-2"
            >
              <div className="text-4xl md:text-5xl font-black text-[#fa6e5b]">
                {item.value}
                {item.suffix && <span className="text-2xl ml-1">{item.suffix}</span>}
              </div>
              <p className={cn(
                "text-sm font-bold uppercase tracking-widest",
                isDark ? "text-slate-400" : "text-slate-500"
              )}>
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";
