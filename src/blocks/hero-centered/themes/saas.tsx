import React from "react";
import { cn } from "@/lib/utils";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";
import type { HeroCenteredData } from "../definition";

const gradients: Record<string,string> = {
  none: "", purple: "bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100",
  blue: "bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100",
  teal: "bg-gradient-to-br from-teal-50 via-emerald-50 to-green-100",
  orange: "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100",
};

export function HeroCenteredSaaS({ data, isDark, settings }: { data: HeroCenteredData; isDark?: boolean; settings?: any }) {
  const { executeAction } = useActionExecutor();
  const bg = isDark ? "" : gradients[data.bgGradient ?? "none"];
  return (
    <div className={cn("text-center space-y-6 max-w-4xl mx-auto", bg && `py-8 px-8 ${bg}`)} style={{ borderRadius: bg ? "calc(var(--radius)*2)" : "0" }}>
      {data.badge && (
        <span className={cn("inline-block text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border",
          isDark ? "bg-white/10 text-white border-white/20" : "bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/10 shadow-sm")}>
          {data.eyebrowIcon && <span className="mr-1.5">{data.eyebrowIcon}</span>}{data.badge}
        </span>
      )}
      <h1 className={cn("text-5xl md:text-7xl leading-tight tracking-tight font-bold", isDark?"text-white":"text-[var(--secondary)]")}>
        {data.title}{" "}
        {data.highlight && <span className="text-[var(--primary)]">{data.highlight}</span>}
      </h1>
      {data.subtitle && <p className={cn("text-xl max-w-2xl mx-auto leading-relaxed", isDark?"text-white/60":"text-[var(--secondary)]/60")}>{data.subtitle}</p>}
      {(data.primaryBtnText || data.secondaryBtnText) && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          {data.primaryBtnText && (
            <button onClick={() => executeAction(data.primaryBtnAction)}
              className={cn("px-10 py-4 font-bold text-base transition-all", isDark?"bg-[var(--primary)] hover:brightness-110 text-white":"bg-[var(--primary)] hover:brightness-110 text-white shadow-lg shadow-[var(--primary)]/20")}
              style={{ borderRadius: "var(--radius-md)" }}
            >
              {data.primaryBtnText}
            </button>
          )}
          {data.secondaryBtnText && (
            <button onClick={() => executeAction(data.secondaryBtnAction)}
              className={cn("px-10 py-4 font-bold text-base transition-all border", isDark?"border-white/20 text-white hover:bg-white/5":"border-slate-200 text-[var(--secondary)] hover:bg-slate-50")}
              style={{ borderRadius: "var(--radius-md)" }}
            >
              {data.secondaryBtnText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
