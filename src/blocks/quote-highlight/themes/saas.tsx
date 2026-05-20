import React from "react";
import { cn } from "@/lib/utils";
import type { QuoteHighlightData } from "../definition";

const accents: Record<string, { border: string; text: string; bg: string }> = {
  violet: { border: "border-violet-500", text: "text-violet-500", bg: "bg-violet-50" },
  blue:   { border: "border-blue-500",   text: "text-blue-500",   bg: "bg-blue-50" },
  teal:   { border: "border-teal-500",   text: "text-teal-500",   bg: "bg-teal-50" },
  orange: { border: "border-orange-500", text: "text-orange-500", bg: "bg-orange-50" },
  rose:   { border: "border-rose-500",   text: "text-rose-500",   bg: "bg-rose-50" },
};

export function QuoteHighlightSaaS({ data, isDark }: { data: QuoteHighlightData; isDark?: boolean }) {
  const a = accents[data.accentColor ?? "violet"];
  const isCenter = data.alignment === "center";

  return (
    <div className={cn("max-w-3xl mx-auto", isCenter && "text-center")}>
      <div className={cn("p-8 md:p-12", !isCenter && "border-l-4 border-[var(--primary)]", isDark ? "bg-white/5" : "bg-[var(--primary)]/5")} style={{ borderRadius: "var(--radius-md)" }}>
        <p className={cn("text-2xl md:text-3xl font-bold leading-snug mb-6", isDark ? "text-white" : "text-[var(--secondary)]")}>
          <span className="text-5xl leading-none font-black mr-1 text-[var(--primary)]">"</span>
          {data.quote}
          <span className="text-5xl leading-none font-black ml-1 text-[var(--primary)]">"</span>
        </p>
        {(data.author || data.avatar) && (
          <div className={cn("flex items-center gap-3", isCenter && "justify-center")}>
            {data.avatar && <img src={data.avatar} alt={data.author} className="w-10 h-10 rounded-full object-cover" />}
            <div>
              {data.author && <p className={cn("font-bold", isDark ? "text-white" : "text-[var(--secondary)]")}>{data.author}</p>}
              {(data.role || data.company) && (
                <p className={cn("text-sm", isDark ? "text-white/40" : "text-[var(--secondary)]/60")}>
                  {[data.role, data.company].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
