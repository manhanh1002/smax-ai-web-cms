import React from "react";
import { cn } from "@/lib/utils";
import type { TeamGridData } from "../definition";

import { SectionTitle } from "../../SectionTitle";

export function TeamGridSaaS({ data, isDark }: { data: TeamGridData; isDark?: boolean }) {
  const gridCols = data.columns === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
  return (
    <div className="max-w-6xl mx-auto">
      <SectionTitle
        badge={data.sectionLabel}
        title={data.title}
        titleHighlight={data.titleHighlight}
        subtitle={data.subtitle}
        isDark={isDark}
        align="center"
      />
      <div className={cn("grid gap-6", gridCols)}>
        {(data.members??[]).map((m, i) => (
          <div key={i} className={cn("text-center p-6 border transition-all hover:border-[var(--primary)]/50 hover:shadow-[var(--shadow-md)]", isDark?"bg-white/5 border-white/10":"bg-white border-slate-200")} style={{ borderRadius: "var(--radius-md)" }}>
            {m.avatar
              ? <img src={m.avatar} alt={m.name} className={cn("w-20 h-20 object-cover mx-auto mb-4", data.avatarShape==="rounded"?"":"rounded-full")} style={{ borderRadius: data.avatarShape==="rounded"?"calc(var(--radius)/1.5)":undefined }} />
              : <div className={cn("w-20 h-20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold", data.avatarShape==="rounded"?"":"rounded-full", isDark?"bg-[var(--primary)] text-white":"bg-[var(--primary)]/10 text-[var(--primary)]")} style={{ borderRadius: data.avatarShape==="rounded"?"calc(var(--radius)/1.5)":undefined }}>{m.name.charAt(0)}</div>
            }
            <h3 className={cn("font-bold text-base mb-0.5", isDark?"text-white":"text-[var(--secondary)]")}>{m.name}</h3>
            <p className={cn("text-sm mb-3 font-bold text-[var(--primary)]")}>{m.role}</p>
            {data.showBio && m.bio && <p className={cn("text-xs leading-relaxed mb-3", isDark?"text-white/60":"text-[var(--secondary)]/60")}>{m.bio}</p>}
            {(m.linkedin||m.twitter) && (
              <div className="flex justify-center gap-2">
                {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className={cn("text-xs px-3 py-1.5 font-bold transition-all", isDark?"bg-white/10 text-white/80 hover:bg-white/20":"bg-slate-100 text-slate-700 hover:bg-slate-200")} style={{ borderRadius: "calc(var(--radius)/2)" }}>in</a>}
                {m.twitter  && <a href={m.twitter}  target="_blank" rel="noopener noreferrer" className={cn("text-xs px-3 py-1.5 font-bold transition-all", isDark?"bg-white/10 text-white/80 hover:bg-white/20":"bg-slate-100 text-slate-700 hover:bg-slate-200")} style={{ borderRadius: "calc(var(--radius)/2)" }}>𝕏</a>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
