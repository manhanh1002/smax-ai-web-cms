"use client";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

export interface HeroBlockData {
  badge?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  primaryBtn?: string;
  primaryBtnUrl?: string;
  secondaryBtn?: string;
  secondaryBtnUrl?: string;
  image?: string;
  darkMode?: boolean;
}

export function HeroBlock({ data }: { data: HeroBlockData }) {
  const isDark = data.darkMode === true;

  return (
    <section
      className={cn(
        "relative pt-24 pb-0 overflow-hidden transition-colors duration-300",
        isDark ? "bg-[#0F1836] text-white" : "bg-[#f4f7ff]"
      )}
      style={!isDark ? { background: "linear-gradient(180deg,#f4f7ff 0%,#fff 100%)" } : {}}
    >
      <div className="max-w-5xl mx-auto px-6 text-center">
        {data.badge && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2 rounded-full border mb-8",
              isDark ? "bg-white/10 border-white/10" : "bg-white border-slate-200"
            )}
          >
            <span className={cn(
              "text-xs font-bold uppercase tracking-[0.12em]",
              isDark ? "text-white" : "text-[#0F1836]"
            )}>
              {data.badge}
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black leading-[1.15] mb-6"
        >
          {data.title}{" "}
          {data.highlight && (
            <span className="text-[#fa6e5b]">{data.highlight}</span>
          )}
        </motion.h1>

        {data.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "text-lg mb-10 max-w-2xl mx-auto leading-relaxed",
              isDark ? "text-slate-400" : "text-slate-500"
            )}
          >
            {data.subtitle}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href={data.primaryBtnUrl || "https://smax.ai/login"}
            className="inline-flex items-center gap-2 h-14 px-10 rounded-full bg-[#fa6e5b] hover:bg-[#e85c4a] text-white font-bold text-base transition-colors shadow-lg shadow-orange-500/20"
          >
            <ArrowRight className="w-5 h-5" />
            {data.primaryBtn || "Dùng thử miễn phí"}
          </a>
          <a
            href={data.secondaryBtnUrl || "#form"}
            className={cn(
              "inline-flex items-center gap-2 h-14 px-10 rounded-full border font-bold text-base transition-colors shadow-lg shadow-blue-500/5",
              isDark 
                ? "border-blue-500 bg-blue-500/10 text-white hover:bg-blue-500/20" 
                : "border-[#2563eb] text-[#2563eb] bg-white hover:bg-blue-50"
            )}
          >
            <Phone className="w-4 h-4" />
            {data.secondaryBtn || "Đặt lịch tư vấn"}
          </a>
        </motion.div>

        {data.image && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-full max-w-6xl mx-auto"
          >
            <img
              src={data.image}
              alt="Hero"
              className={cn(
                "w-full h-auto rounded-t-3xl shadow-2xl",
                isDark ? "shadow-black/50" : "shadow-blue-500/10"
              )}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";
