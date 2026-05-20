"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQBlockData } from "../definition";
import { BlockSettings } from "../../types";

export function FAQSaas({ data, isDark, settings }: { data: FAQBlockData; isDark?: boolean; settings?: BlockSettings }) {
  const dark = isDark !== undefined ? isDark : false;
  const align = settings?.textAlign || "center";
  const columns = data.columns ?? 1;
  const items = data.items ?? [];

  // Split items into left/right for 2-col layout
  const leftItems = items.filter((_, i) => i % 2 === 0);
  const rightItems = items.filter((_, i) => i % 2 === 1);

  return (
    <>
      <div className={cn(
        "mb-14",
        align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"
      )}>
        {data.badge && (
          <span className={cn(
            "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border",
            dark ? "bg-white/10 border-white/10 text-white" : "bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/10"
          )}>
            {data.badge}
          </span>
        )}
        {(data.title || data.titleHighlight) && (
          <h2 className={cn("text-3xl md:text-5xl leading-tight mb-4 font-bold", dark ? "text-white" : "text-[var(--secondary)]")}>
            {data.title}{" "}
            {data.titleHighlight && (
              <span className="text-[var(--primary)]">{data.titleHighlight}</span>
            )}
          </h2>
        )}
      </div>

      {/* Single column */}
      {columns === 1 && (
        <FAQColumn items={items} dark={dark} />
      )}

      {/* Two columns — each column has its own independent accordion state */}
      {columns === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0 items-start">
          <FAQColumn items={leftItems} dark={dark} wrapperClass="max-w-none" />
          <FAQColumn items={rightItems} dark={dark} wrapperClass="max-w-none" />
        </div>
      )}
    </>
  );
}

// ─── Column wrapper with its own activeIndex state ───────────────────────────

function FAQColumn({
  items,
  dark,
  wrapperClass,
}: {
  items: { question: string; answer: string }[];
  dark: boolean;
  wrapperClass?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className={cn("space-y-4", wrapperClass ?? "max-w-3xl mx-auto")}>
      {items.map((item, i) => (
        <FAQItem
          key={i}
          item={item}
          index={i}
          dark={dark}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      ))}
    </div>
  );
}

// ─── Single accordion item ────────────────────────────────────────────────────

function FAQItem({
  item,
  index,
  dark,
  activeIndex,
  setActiveIndex,
}: {
  item: { question: string; answer: string };
  index: number;
  dark: boolean;
  activeIndex: number | null;
  setActiveIndex: (i: number | null) => void;
}) {
  const isOpen = activeIndex === index;

  return (
    <div
      className={cn(
        "border transition-all duration-300 overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
        dark
          ? "bg-white/5 border-white/10"
          : "bg-white border-slate-100 hover:border-[var(--primary)]/20"
      )}
      style={{ borderRadius: "var(--radius-md)" }}
    >
      <button
        onClick={() => setActiveIndex(isOpen ? null : index)}
        className="w-full flex items-center justify-between p-6 text-left group"
      >
        <span className={cn("text-lg font-bold", dark ? "text-white" : "text-[var(--secondary)]")}>
          {item.question}
        </span>
        <div className={cn(
          "p-2 rounded-full transition-all flex-shrink-0 ml-4",
          isOpen
            ? "bg-[var(--primary)] text-white"
            : cn(
                dark ? "bg-white/10 text-white/40" : "bg-slate-100 text-slate-400",
                "group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)]"
              )
        )}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className={cn(
              "px-6 pb-6 text-base leading-relaxed border-t pt-4",
              dark ? "border-white/5 text-white/60" : "border-slate-50 text-[var(--secondary)]/60"
            )}>
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
