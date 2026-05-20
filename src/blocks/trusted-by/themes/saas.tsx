"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrustedByBlockData } from "../definition";
import { BlockSettings } from "../../types";

export function TrustedBySaaS({ data, isDark, settings }: { data: TrustedByBlockData; isDark?: boolean; settings?: BlockSettings }) {
  const dark = isDark !== undefined ? isDark : false;
  const align = settings?.textAlign || "center";

  return (
    <div className={cn(
      "w-full",
      align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"
    )}>
      {(data.label || data.highlight) && (
        <p className={cn(
          "text-xs font-bold uppercase tracking-[0.2em] mb-10 opacity-60",
          dark ? "text-white" : "text-[var(--secondary)]"
        )}>
          {data.label} <span className="text-[var(--primary)]">{data.highlight}</span>
        </p>
      )}
      
      <div className="relative overflow-hidden w-full py-2">
        {/* Gradients to fade logos at edges */}
        <div className={cn(
          "absolute inset-y-0 left-0 w-24 z-10 hidden md:block pointer-events-none",
          dark ? "bg-gradient-to-r from-[var(--secondary)] to-transparent" : "bg-gradient-to-r from-white to-transparent"
        )} />
        <div className={cn(
          "absolute inset-y-0 right-0 w-24 z-10 hidden md:block pointer-events-none",
          dark ? "bg-gradient-to-l from-[var(--secondary)] to-transparent" : "bg-gradient-to-l from-white to-transparent"
        )} />
        
        {data.logos && data.logos.length > 0 ? (
          <div className="flex w-full">
            <motion.div 
              className="flex items-center gap-12 md:gap-20 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 py-4 shrink-0"
              animate={{ x: [0, "-33.33%"] }}
              transition={{ 
                duration: 25, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              {/* Triple logos for seamless scrolling on wide screens */}
              {[...data.logos, ...data.logos, ...data.logos].map((logo, i) => (
                logo && (
                  <img
                    key={i}
                    src={logo}
                    alt="Partner Logo"
                    className="h-7 md:h-9 w-auto object-contain flex-shrink-0"
                  />
                )
              ))}
            </motion.div>
          </div>
        ) : (
          <p className={cn("italic text-xs py-4 text-center font-bold", dark?"text-white/20":"text-slate-300")}>Chưa có logo nào được tải lên</p>
        )}
      </div>
    </div>
  );
}
