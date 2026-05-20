import React from "react";
import { cn } from "@/lib/utils";
import type { AuthorBioData } from "../definition";

const platformLabels: Record<string,string> = { linkedin:"LinkedIn", twitter:"Twitter/X", facebook:"Facebook", website:"Website", github:"GitHub" };
const platformIcons: Record<string,string> = { linkedin:"in", twitter:"𝕏", facebook:"f", website:"🌐", github:"⌥" };

export function AuthorBioSaaS({ data, isDark }: { data: AuthorBioData; isDark?: boolean }) {
  const isVertical = data.layout === "vertical";
  return (
    <div className="max-w-3xl mx-auto">
      <div className={cn("border p-6 md:p-8", isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200")} style={{ borderRadius: "var(--radius-md)" }}>
        <div className={cn("flex gap-6", isVertical ? "flex-col items-center text-center" : "flex-col sm:flex-row")}>
          {data.avatar
            ? <img src={data.avatar} alt={data.name} className="w-20 h-20 object-cover flex-shrink-0" style={{ borderRadius: "var(--radius-md)" }} />
            : <div className={cn("w-20 h-20 flex-shrink-0 flex items-center justify-center text-2xl font-bold", isDark ? "bg-[var(--primary)] text-white" : "bg-[var(--primary)]/10 text-[var(--primary)]")} style={{ borderRadius: "var(--radius-md)" }}>{data.name.charAt(0)}</div>
          }
          <div className="flex-1">
            <p className={cn("text-xs font-bold uppercase tracking-widest mb-1 text-[var(--primary)]")}>Về tác giả</p>
            <h3 className={cn("text-xl mb-0.5", isDark ? "text-white" : "text-[var(--secondary)]")}>{data.name}</h3>
            {(data.title || data.company) && (
              <p className={cn("text-sm mb-3", isDark ? "text-white/60" : "text-[var(--secondary)]/60")}>{[data.title, data.company].filter(Boolean).join(" tại ")}</p>
            )}
            <p className={cn("text-base leading-relaxed mb-4", isDark ? "text-white/80" : "text-[var(--secondary)]/80")}>{data.bio}</p>
            {(data.socials ?? []).length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {data.socials!.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                    className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold", isDark ? "bg-white/10 text-white/80 hover:bg-white/20" : "bg-white text-[var(--secondary)] border border-slate-200 hover:bg-slate-50 shadow-sm")} style={{ borderRadius: "var(--radius-md)" }}>
                    <span className="text-xs">{platformIcons[s.platform]}</span>
                    {platformLabels[s.platform]}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
