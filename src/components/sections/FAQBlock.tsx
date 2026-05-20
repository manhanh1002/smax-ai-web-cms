"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  items: FAQItem[];
  darkMode?: boolean;
}

function FAQRow({ item, index, isDark = false }: { item: FAQItem; index: number; isDark?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden transition-all duration-300",
      isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
    )}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className={cn(
          "text-sm font-bold pr-6",
          isDark ? "text-white" : "text-[#0F1836]"
        )}>{item.question}</span>
        <ChevronDown
          className={cn(
            "shrink-0 w-5 h-5 transition-transform",
            isDark ? "text-slate-500" : "text-slate-400",
            open ? "rotate-180" : ""
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className={cn(
              "px-6 pb-6 pt-2 text-sm leading-relaxed border-t",
              isDark ? "text-slate-400 border-white/5" : "text-slate-500 border-slate-100"
            )}>
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQBlock({ data }: { data: FAQBlockData }) {
  const isDark = data.darkMode === true;

  return (
    <section className={cn(
      "py-20 transition-colors duration-300",
      isDark ? "bg-[#0F1836] text-white" : "bg-white"
    )}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          {data.badge && (
            <span className={cn(
              "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5",
              isDark ? "bg-white/10 text-[#fa6e5b]" : "bg-[#f4f7ff] text-[#fa6e5b]"
            )}>
              {data.badge}
            </span>
          )}
          {(data.title || data.titleHighlight) && (
            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              {data.titleHighlight && (
                <span className="text-[#fa6e5b]">{data.titleHighlight}</span>
              )}{" "}
              {data.title}
            </h2>
          )}
        </div>
        <div className="max-w-3xl mx-auto space-y-3">
          {data.items?.map((item, i) => (
            <FAQRow key={i} item={item} index={i} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";
