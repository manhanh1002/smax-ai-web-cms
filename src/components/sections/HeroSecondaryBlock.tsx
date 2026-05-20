"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export interface HeroSecondaryBlockData {
  badge?: string;
  title: string;
  titleHighlight?: string;
  description: string;
  image: string;
  btnText?: string;
  btnUrl?: string;
  darkMode?: boolean;
}

export function HeroSecondaryBlock({ data }: { data: HeroSecondaryBlockData }) {
  const isDark = data.darkMode === true;

  return (
    <section className={cn(
      "py-24 transition-colors duration-300 overflow-hidden",
      isDark ? "bg-[#0B1229] text-white" : "bg-white text-slate-900"
    )}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          {/* Content */}
          <div className="flex-1 space-y-8">
            {data.badge && (
              <span className={cn(
                "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest",
                isDark ? "bg-white/10 text-[#fa6e5b]" : "bg-blue-50 text-[#2563eb]"
              )}>
                {data.badge}
              </span>
            )}
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1]">
              {data.title}{" "}
              {data.titleHighlight && (
                <span className={cn(
                  isDark ? "text-primary" : "text-[#2563eb]"
                )}>{data.titleHighlight}</span>
              )}
            </h2>
            <p className={cn(
              "text-lg leading-relaxed max-w-xl",
              isDark ? "text-slate-400" : "text-slate-500"
            )}>
              {data.description}
            </p>
            {data.btnText && (
              <a
                href={data.btnUrl || "#"}
                className={cn(
                  "inline-flex items-center gap-2 h-14 px-8 rounded-full font-bold transition-all group",
                  isDark 
                    ? "bg-[#fa6e5b] text-white hover:bg-[#e85c4a] shadow-lg shadow-orange-500/20" 
                    : "bg-[#0F1836] text-white hover:bg-slate-800"
                )}
              >
                {data.btnText}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full"
          >
            <div className="relative">
              <div className={cn(
                "absolute -inset-4 rounded-[40px] blur-2xl",
                isDark ? "bg-[#fa6e5b]/5" : "bg-blue-500/5"
              )} />
              <img
                src={data.image}
                alt={data.title}
                className={cn(
                  "relative w-full h-auto rounded-[40px] shadow-2xl border transition-all duration-300",
                  isDark 
                    ? "border-white/10 shadow-black/50" 
                    : "border-slate-100 shadow-blue-500/10"
                )}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";
