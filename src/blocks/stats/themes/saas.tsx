import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { StatsBlockData } from "../definition";
import { BlockSettings } from "../../types";

function CountUp({ value, duration = 2 }: { value: string; duration?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  
  // Parse numeric part of the value
  const numericValue = parseFloat(value.replace(/,/g, "")) || 0;
  const rounded = useTransform(count, (latest) => {
    const formatted = Math.floor(latest).toLocaleString();
    return formatted;
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, numericValue, { duration });
      return controls.stop;
    }
  }, [isInView, count, numericValue, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function StatsSaaS({ data, isDark, settings }: { data: StatsBlockData; isDark?: boolean; settings?: BlockSettings }) {
  const dark = isDark !== undefined ? isDark : false;
  const columns = data.columns || 3;
  const align = settings?.textAlign || "center";

  return (
    <div className="w-full">
      {/* Header */}
      {(data.badge || data.title || data.subtitle) && (
        <div className={cn(
          "mb-16",
          align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"
        )}>
          {data.badge && (
            <span className={cn(
              "inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5 border",
              dark ? "bg-white/10 border-white/10 text-white" : "bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/10"
            )}>
              {data.badge}
            </span>
          )}
          {(data.title || data.titleHighlight) && (
            <h2 className={cn("text-3xl md:text-5xl leading-tight mb-4 font-bold", dark ? "text-white" : "text-[var(--secondary)]")}>
              {data.title}{" "}
              {data.titleHighlight && <span className="text-[var(--primary)]">{data.titleHighlight}</span>}
            </h2>
          )}
          {data.subtitle && (
            <p className={cn(
              "max-w-2xl text-sm",
              align === "center" ? "mx-auto" : "",
              dark ? "text-white/60" : "text-[var(--secondary)]/60"
            )}>{data.subtitle}</p>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className={cn(
        "grid gap-8 md:gap-12",
        columns === 1 ? "grid-cols-1" : 
        columns === 2 ? ((data.items??[]).length === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-2") : 
        columns === 3 ? ((data.items??[]).length === 1 ? "grid-cols-1 max-w-md mx-auto" : (data.items??[]).length === 2 ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto" : "grid-cols-1 md:grid-cols-3") : 
        ((data.items??[]).length === 1 ? "grid-cols-1 max-w-md mx-auto" : (data.items??[]).length === 2 ? "grid-cols-2 max-w-2xl mx-auto" : (data.items??[]).length === 3 ? "grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto" : "grid-cols-2 lg:grid-cols-4")
      )}>
        {data.items?.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center group p-6"
          >
            <div className="mb-4 relative inline-block">
              <div className="text-4xl md:text-6xl font-bold text-[var(--primary)] tracking-tighter flex items-center justify-center gap-1">
                {stat.prefix && <span className="text-2xl md:text-3xl opacity-50 font-normal">{stat.prefix}</span>}
                <CountUp value={stat.value} />
                {stat.suffix && <span className="text-2xl md:text-3xl opacity-50 font-normal">{stat.suffix}</span>}
              </div>
              <div className="h-1.5 w-12 bg-[var(--primary)]/20 rounded-full mx-auto mt-2 group-hover:w-full transition-all duration-700 ease-out"></div>
            </div>
            
            <h4 className={cn("text-base md:text-lg font-bold mb-1", dark ? "text-white" : "text-[var(--secondary)]")}>
              {stat.label}
            </h4>
            
            {stat.description && (
              <p className={cn("text-xs leading-relaxed opacity-60", dark ? "text-white/40" : "text-slate-500")}>
                {stat.description}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
