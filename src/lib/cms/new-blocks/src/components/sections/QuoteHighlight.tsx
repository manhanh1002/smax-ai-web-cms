import React from "react";
import { cn } from "@/lib/utils";

export interface QuoteHighlightData {
  quote: string;
  author?: string;
  role?: string;
  company?: string;
  avatar?: string;
  alignment?: "left" | "center";
  accentColor?: "violet" | "blue" | "teal" | "orange" | "rose";
  darkMode?: boolean;
}

const accents: Record<string, { border: string; quote: string; bg: string }> = {
  violet: { border: "border-violet-500", quote: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/20" },
  blue:   { border: "border-blue-500",   quote: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-950/20" },
  teal:   { border: "border-teal-500",   quote: "text-teal-500",   bg: "bg-teal-50 dark:bg-teal-950/20" },
  orange: { border: "border-orange-500", quote: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/20" },
  rose:   { border: "border-rose-500",   quote: "text-rose-500",   bg: "bg-rose-50 dark:bg-rose-950/20" },
};

export function QuoteHighlightBlock({ data }: { data: QuoteHighlightData }) {
  const isDark = data.darkMode ?? false;
  const accent = accents[data.accentColor ?? "violet"];
  const isCenter = data.alignment === "center";

  return (
    <section className={cn("py-20 px-4", isDark ? "bg-slate-900" : "bg-white")}>
      <div className={cn("max-w-3xl mx-auto", isCenter && "text-center")}>
        <div className={cn(
          "p-8 md:p-12 rounded-3xl",
          !isCenter && `border-l-4 ${accent.border}`,
          isDark ? "bg-slate-800" : accent.bg
        )}>
          <p className={cn(
            "text-2xl md:text-3xl font-bold leading-snug mb-6",
            isDark ? "text-white" : "text-slate-900"
          )}>
            <span className={cn("text-5xl leading-none mr-1 font-black", accent.quote)}>"</span>
            {data.quote}
            <span className={cn("text-5xl leading-none ml-1 font-black", accent.quote)}>"</span>
          </p>

          {(data.author || data.avatar) && (
            <div className={cn("flex items-center gap-3 mt-4", isCenter && "justify-center")}>
              {data.avatar && (
                <img src={data.avatar} alt={data.author} className="w-10 h-10 rounded-full object-cover" />
              )}
              <div>
                {data.author && (
                  <p className={cn("font-semibold text-base", isDark ? "text-white" : "text-slate-900")}>{data.author}</p>
                )}
                {(data.role || data.company) && (
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                    {[data.role, data.company].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
