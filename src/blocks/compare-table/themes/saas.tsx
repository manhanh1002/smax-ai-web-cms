import React from "react";
import { cn } from "@/lib/utils";
import type { CompareTableData } from "../definition";

import { SectionTitle } from "../../SectionTitle";

export function CompareTableSaaS({ data, isDark }: { data: CompareTableData; isDark?: boolean }) {
  const highlight = data.highlightCol ?? 0;
  return (
    <div className="max-w-7xl mx-auto">
      <SectionTitle
        badge={data.sectionLabel}
        title={data.title}
        titleHighlight={data.titleHighlight}
        subtitle={data.subtitle}
        isDark={isDark}
        align="center"
      />
      <div className={cn("overflow-x-auto border transition-all duration-300", isDark?"border-white/10":"border-slate-200")} style={{ borderRadius: "var(--radius-md)" }}>
        <table className={cn("w-full border-collapse", isDark?"bg-slate-900":"bg-white")}>
          <thead>
            <tr>
              <th className={cn("px-5 py-4 text-left font-bold text-sm border-b", isDark?"border-white/10 text-white":"border-slate-100 text-[var(--secondary)]")}>
                Tính năng
              </th>
              {(data.plans??[]).map((plan, i) => (
                <th key={i} className={cn("px-5 py-4 text-center font-bold text-sm border-b whitespace-nowrap", i===highlight?(isDark?"bg-[var(--primary)]/20 border-[var(--primary)]/30 text-[var(--primary)]":"bg-[var(--primary)]/5 border-[var(--primary)]/10 text-[var(--primary)]"):(isDark?"border-white/10 text-white":"border-slate-100 text-[var(--secondary)]"))}>
                  {i===highlight && <span className="text-xs mr-1">★</span>}{plan}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data.categories??[]).map((cat, ci) => (
              <React.Fragment key={ci}>
                <tr>
                  <td colSpan={(data.plans?.length??0)+1} className={cn("px-5 py-3 font-bold text-sm uppercase tracking-wider", isDark?"bg-white/5 text-slate-200":"bg-slate-50 text-slate-700")}>
                    {cat.name}
                  </td>
                </tr>
                {(cat.features??[]).map((feat, fi) => (
                  <tr key={fi} className={cn("border-t", isDark?"border-white/5":"border-slate-100")}>
                    <td className={cn("px-5 py-3 text-sm font-medium", isDark?"text-slate-300":"text-slate-700")}>{feat.label}</td>
                    {(feat.values??[]).map((val, vi) => (
                      <td key={vi} className={cn("px-5 py-3 text-center text-sm", vi===highlight?(isDark?"bg-[var(--primary)]/5":"bg-[var(--primary)]/5"):"")}>
                        {typeof val === "boolean"
                          ? <span className={val?"text-emerald-500 font-bold":"text-slate-300"}>{val?"✓":"✗"}</span>
                          : <span className={isDark?"text-slate-300":"text-slate-600"}>{val}</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
