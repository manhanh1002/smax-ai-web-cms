"use client";
import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { GlossaryData } from "../definition";

export function GlossarySaaS({ data, isDark }: { data: GlossaryData; isDark?: boolean }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string|null>(null);
  const [open, setOpen] = useState<number|null>(null);

  const categories = useMemo(() => [...new Set((data.terms??[]).map(t=>t.category).filter(Boolean))] as string[], [data.terms]);
  const filtered = useMemo(() => (data.terms??[]).filter(t => {
    const mS = !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase());
    const mC = !cat || t.category === cat;
    return mS && mC;
  }), [data.terms, search, cat]);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className={cn("text-3xl md:text-4xl mb-8", isDark?"text-white":"text-[var(--secondary)]")}>{data.title}</h2>
      {(data.showSearch || data.showFilter) && (
        <div className="space-y-4 mb-8">
          {data.showSearch && (
            <input type="text" placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)}
              className={cn("w-full px-4 py-3 border transition-all focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]", isDark?"bg-white/5 border-white/10 text-white placeholder-white/30":"bg-white border-slate-200 text-[var(--secondary)] placeholder-slate-400")} style={{ borderRadius: "var(--radius-md)" }} />
          )}
          {data.showFilter && categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setCat(null)} className={cn("px-4 py-2 text-sm font-bold transition-all", !cat?"bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20":(isDark?"bg-white/10 text-white/80 hover:bg-white/20":"bg-slate-100 text-slate-700 hover:bg-slate-200"))} style={{ borderRadius: "var(--radius-md)" }}>Tất cả</button>
              {categories.map(c => <button key={c} onClick={() => setCat(c)} className={cn("px-4 py-2 text-sm font-bold transition-all", cat===c?"bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20":(isDark?"bg-white/10 text-white/80 hover:bg-white/20":"bg-slate-100 text-slate-700 hover:bg-slate-200"))} style={{ borderRadius: "var(--radius-md)" }}>{c}</button>)}
            </div>
          )}
        </div>
      )}
      {filtered.length === 0
        ? <div className={cn("text-center py-12", isDark?"text-white/40":"text-slate-500")}>Không có kết quả</div>
        : <div className="space-y-2">
            {filtered.map((term, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className={cn("border overflow-hidden transition-all", isDark?(isOpen?"bg-white/10 border-[var(--primary)]/50 shadow-[var(--shadow-md)]":"bg-white/5 border-white/10"):(isOpen?"bg-[var(--primary)]/5 border-[var(--primary)]/20 shadow-[var(--shadow-md)]":"bg-white border-slate-200"))} style={{ borderRadius: "var(--radius-md)" }}>
                  <button className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left" onClick={() => setOpen(isOpen?null:i)}>
                    <div>
                      <div className={cn("font-bold text-base", isDark?"text-white":"text-[var(--secondary)]")}>{term.term}</div>
                      {term.category && <div className={cn("text-xs mt-0.5", isDark?"text-white/40":"text-slate-500")}>{term.category}</div>}
                    </div>
                    <span className={cn("flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm", isOpen?(isDark?"bg-[var(--primary)] text-white":"bg-[var(--primary)] text-white"):(isDark?"bg-white/10 text-white/40":"bg-slate-100 text-slate-400"))}>
                      {isOpen?"−":"+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className={cn("px-5 pb-4 space-y-3 border-t", isDark?"border-white/10 text-white/80":"border-slate-100 text-[var(--secondary)]/80")}>
                      <p className="leading-relaxed pt-3">{term.definition}</p>
                      {term.example && (
                        <div className={cn("p-3", isDark?"bg-black/20":"bg-slate-50")} style={{ borderRadius: "calc(var(--radius)/2)" }}>
                          <div className={cn("text-xs font-bold mb-1", isDark?"text-white/40":"text-slate-400")}>Ví dụ:</div>
                          <div className="text-sm italic">{term.example}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
      }
    </div>
  );
}
