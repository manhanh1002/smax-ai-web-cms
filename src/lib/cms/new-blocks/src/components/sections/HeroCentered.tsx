import React from "react";
import { cn } from "@/lib/utils";

export interface HeroCenteredData {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  primaryBtn?: string;
  primaryBtnUrl?: string;
  secondaryBtn?: string;
  secondaryBtnUrl?: string;
  bgGradient?: "none" | "purple" | "blue" | "teal" | "orange";
  darkMode?: boolean;
  eyebrowIcon?: string;
}

const gradients: Record<string, string> = {
  none: "",
  purple: "bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100",
  blue: "bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100",
  teal: "bg-gradient-to-br from-teal-50 via-emerald-50 to-green-100",
  orange: "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100",
};

export function HeroCenteredBlock({ data }: { data: HeroCenteredData }) {
  const isDark = data.darkMode;
  const bg = isDark ? "bg-slate-900" : (gradients[data.bgGradient ?? "none"] || "bg-white");

  return (
    <section className={cn("py-24 px-4", bg, isDark ? "text-white" : "text-slate-900")}>
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {data.badge && (
          <span className={cn(
            "inline-block text-sm font-semibold px-4 py-1.5 rounded-full",
            isDark
              ? "bg-white/10 text-white/80 border border-white/20"
              : "bg-white text-slate-600 border border-slate-200 shadow-sm"
          )}>
            {data.eyebrowIcon && <span className="mr-1.5">{data.eyebrowIcon}</span>}
            {data.badge}
          </span>
        )}

        <h1 className={cn("text-5xl md:text-6xl font-black leading-tight tracking-tight", isDark ? "text-white" : "text-slate-900")}>
          {data.title}{" "}
          {data.highlight && (
            <span className={cn(isDark ? "text-violet-400" : "text-violet-600")}>
              {data.highlight}
            </span>
          )}
        </h1>

        {data.subtitle && (
          <p className={cn("text-xl max-w-2xl mx-auto leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>
            {data.subtitle}
          </p>
        )}

        {(data.primaryBtn || data.secondaryBtn) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            {data.primaryBtn && (
              <a
                href={data.primaryBtnUrl || "#"}
                className={cn(
                  "inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-base transition-all",
                  isDark
                    ? "bg-violet-500 hover:bg-violet-400 text-white"
                    : "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200"
                )}
              >
                {data.primaryBtn}
              </a>
            )}
            {data.secondaryBtn && (
              <a
                href={data.secondaryBtnUrl || "#"}
                className={cn(
                  "inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-base transition-all border",
                  isDark
                    ? "border-white/20 text-white/80 hover:bg-white/10"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                )}
              >
                {data.secondaryBtn}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
