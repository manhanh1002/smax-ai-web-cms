"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  isDark?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionTitle({
  badge,
  title,
  titleHighlight,
  subtitle,
  isDark = false,
  align = "center",
  className
}: SectionTitleProps) {
  if (!badge && !title && !titleHighlight && !subtitle) return null;

  return (
    <div className={cn(
      "mb-12",
      align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center",
      className
    )}>
      {badge && (
        <span className={cn(
          "inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5 border shadow-sm",
          isDark ? "bg-white/10 border-white/10 text-[var(--primary)]" : "bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/10"
        )}>
          {badge}
        </span>
      )}

      {(title || titleHighlight) && (
        <h2 className={cn(
          "text-3xl md:text-5xl leading-[1.15] mb-6 tracking-tight font-bold",
          isDark ? "text-white" : "text-[var(--secondary)]"
        )}>
          {title}{" "}
          {titleHighlight && (
            <span className="text-[var(--primary)] inline-block relative">
              {titleHighlight}
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[var(--primary)]/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="8" />
              </svg>
            </span>
          )}
        </h2>
      )}

      {subtitle && (
        <p className={cn(
          "text-lg md:text-xl leading-relaxed max-w-3xl",
          align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : "",
          isDark ? "text-white/60" : "text-[var(--secondary)]/60"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
