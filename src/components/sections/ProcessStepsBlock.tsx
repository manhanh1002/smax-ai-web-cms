"use client";
import { motion } from "framer-motion";

export interface ProcessStep {
  title: string;
  description: string;
  icon?: string;
}

export interface ProcessStepsBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  steps: ProcessStep[];
  darkMode?: boolean;
}

export function ProcessStepsBlock({ data }: { data: ProcessStepsBlockData }) {
  const isDark = data.darkMode === true;
  const steps = data.steps || [];

  return (
    <section className={cn(
      "py-24 transition-colors duration-300",
      isDark ? "bg-[#0F1836] text-white" : "bg-white text-slate-900"
    )}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          {data.badge && (
            <span className={cn(
              "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5",
              isDark ? "bg-white/10 text-[#fa6e5b]" : "bg-[#f4f7ff] text-[#fa6e5b]"
            )}>
              {data.badge}
            </span>
          )}
          <h2 className="text-3xl md:text-5xl font-black">
            {data.title}{" "}
            <span className="text-[#fa6e5b]">{data.titleHighlight}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector line (Desktop) */}
          <div className={cn(
            "hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 border-t-2 border-dashed -z-0",
            isDark ? "border-white/10" : "border-slate-200"
          )} />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative z-10 flex flex-col items-center text-center space-y-6"
            >
              <div className={cn(
                "w-20 h-20 rounded-[24px] border-2 flex items-center justify-center text-2xl font-black transition-all duration-300 shadow-xl",
                isDark 
                  ? "bg-[#161F3D] border-white/10 text-[#fa6e5b] shadow-black/20" 
                  : "bg-white border-slate-100 text-[#fa6e5b] shadow-slate-200/50"
              )}>
                {i + 1}
              </div>
              <div className="space-y-3">
                <h3 className={cn(
                  "text-lg font-black",
                  isDark ? "text-white" : "text-[#0F1836]"
                )}>{step.title}</h3>
                <p className={cn(
                  "text-sm leading-relaxed max-w-[200px] mx-auto",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";
