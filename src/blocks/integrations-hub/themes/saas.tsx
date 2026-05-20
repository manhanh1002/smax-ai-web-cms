"use client";
import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";
import type { IntegrationsHubData } from "../definition";

export function IntegrationsHubSaaS({ data, isDark }: { data: IntegrationsHubData; isDark?: boolean }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string|null>(null);
  const { executeAction } = useActionExecutor();

  const filtered = useMemo(() => (data.integrations??[]).filter(i => {
    const matchS = !search || i.name.toLowerCase().includes(search.toLowerCase());
    const matchC = !cat || i.category === cat;
    return matchS && matchC;
  }), [data.integrations, search, cat]);

  const featured = filtered.filter(i => i.featured);
  const regular  = filtered.filter(i => !i.featured);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className={cn("text-3xl md:text-4xl mb-8 text-center", isDark?"text-white":"text-[var(--secondary)]")}>{data.title}</h2>
      <div className="space-y-6 mb-10">
        {data.showSearch && (
          <input type="text" placeholder="Tìm kiếm tích hợp..." value={search} onChange={e => setSearch(e.target.value)}
            className={cn("w-full max-w-md mx-auto block px-4 py-3 border transition-all focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]", isDark?"bg-white/5 border-white/10 text-white placeholder-white/30":"bg-white border-slate-200 text-[var(--secondary)] placeholder-slate-400")} style={{ borderRadius: "var(--radius-md)" }} />
        )}
        {(data.categories??[]).length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            <button onClick={() => setCat(null)} className={cn("px-4 py-2 text-sm font-bold transition-all", !cat?"bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20":(isDark?"bg-white/10 text-white/80 hover:bg-white/20":"bg-slate-100 text-slate-700 hover:bg-slate-200"))} style={{ borderRadius: "var(--radius-md)" }}>
              Tất cả ({data.integrations?.length??0})
            </button>
            {(data.categories??[]).map(c => (
              <button key={c} onClick={() => setCat(c)} className={cn("px-4 py-2 text-sm font-bold transition-all", cat===c?"bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20":(isDark?"bg-white/10 text-white/80 hover:bg-white/20":"bg-slate-100 text-slate-700 hover:bg-slate-200"))} style={{ borderRadius: "var(--radius-md)" }}>
                {c} ({(data.integrations??[]).filter(i=>i.category===c).length})
              </button>
            ))}
          </div>
        )}
      </div>

      {featured.length > 0 && (
        <div className="mb-10">
          <p className={cn("text-xs font-bold uppercase tracking-widest mb-6 text-[var(--primary)]")}>Nổi bật</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((item, i) => (
              <button key={i} onClick={() => executeAction(item.action)}
                className={cn("p-5 border text-left transition-all hover:border-[var(--primary)]/50 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]", isDark?"bg-white/5 border-white/10":"bg-white border-slate-200 shadow-sm")} style={{ borderRadius: "var(--radius-md)" }}>
                {item.logo && <img src={item.logo} alt={item.name} className="h-10 mb-3 object-contain" />}
                <h4 className={cn("font-bold text-sm mb-1", isDark?"text-white":"text-[var(--secondary)]")}>{item.name}</h4>
                {item.description && <p className={cn("text-xs", isDark?"text-white/40":"text-slate-500")}>{item.description}</p>}
              </button>
            ))}
          </div>
        </div>
      )}

      {regular.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {regular.map((item, i) => (
            <button key={i} onClick={() => executeAction(item.action)}
              className={cn("p-4 border flex flex-col items-center text-center transition-all hover:border-[var(--primary)]/50 hover:shadow-[var(--shadow-sm)]", isDark?"bg-white/5 border-white/10":"bg-white border-slate-200")} style={{ borderRadius: "var(--radius-md)" }}>
              {item.logo && <img src={item.logo} alt={item.name} className="h-8 mb-2 object-contain" />}
              <p className={cn("text-xs font-bold", isDark?"text-white/80":"text-slate-700")}>{item.name}</p>
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 && <div className={cn("text-center py-12", isDark?"text-white/40":"text-slate-500")}>Không tìm thấy tích hợp</div>}
    </div>
  );
}
