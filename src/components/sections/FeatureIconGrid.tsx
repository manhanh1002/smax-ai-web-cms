"use client";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

export interface FeatureIconItem {
  icon: string;
  title: string;
  description: string;
}

export interface FeatureIconGridData {
  badge?: string;
  title?: string;
  items: FeatureIconItem[];
  darkMode?: boolean;
}

export function FeatureIconGrid({ data }: { data: FeatureIconGridData }) {
  const isDark = data.darkMode === true;

  return (
    <section className={cn(
      "py-24 transition-colors duration-300",
      isDark ? "bg-[#0B1229] text-white" : "bg-white text-slate-900"
    )}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          {data.badge && (
            <span className={cn(
              "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border",
              isDark ? "bg-white/10 text-primary border-white/10" : "bg-[#f4f7ff] text-[#2563eb] border-transparent"
            )}>
              {data.badge}
            </span>
          )}
          <h2 className="text-3xl md:text-5xl font-black">
            {data.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {data.items?.map((item, i) => {
            const IconComponent = (Icons as any)[item.icon] || Icons.Zap;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group"
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm",
                  isDark 
                    ? "bg-white/10 text-primary group-hover:bg-primary group-hover:text-white" 
                    : "bg-[#f4f7ff] text-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white"
                )}>
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className={cn(
                  "text-lg font-black mb-3",
                  isDark ? "text-white" : "text-[#0F1836]"
                )}>{item.title}</h3>
                <p className={cn(
                  "text-sm leading-relaxed",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";
