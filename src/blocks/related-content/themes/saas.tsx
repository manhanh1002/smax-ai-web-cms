import React from "react";
import { cn } from "@/lib/utils";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";
import type { RelatedContentData } from "../definition";

const typeLabels: Record<string,string> = { blog:"Blog","case-study":"Case Study",video:"Video",resource:"Resource" };
const typeColors: Record<string,string> = { blog:"bg-blue-100 text-blue-700","case-study":"bg-green-100 text-green-700",video:"bg-red-100 text-red-700",resource:"bg-purple-100 text-purple-700" };

export function RelatedContentSaaS({ data, isDark }: { data: RelatedContentData; isDark?: boolean }) {
  const { executeAction } = useActionExecutor();
  const itemCount = (data.items??[]).length;
  const gridCols = data.columns===2
    ? (itemCount === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 md:grid-cols-2")
    : (itemCount === 1 ? "grid-cols-1 max-w-md mx-auto" : itemCount === 2 ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3");
  return (
    <div className="max-w-6xl mx-auto">
      {data.title && <h2 className={cn("text-3xl md:text-4xl mb-10 text-center font-bold", isDark?"text-white":"text-[var(--secondary)]")}>{data.title}</h2>}
      <div className={cn("grid gap-6", gridCols)}>
        {(data.items??[]).map((item, i) => (
          <button key={i} onClick={() => executeAction(item.action)}
            className={cn("border overflow-hidden hover:border-[var(--primary)]/50 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all group text-left w-full", isDark?"bg-white/5 border-white/10":"bg-white border-slate-100 shadow-[var(--shadow-sm)]")} style={{ borderRadius: "var(--radius-lg)" }}>
            <div className="relative h-48 overflow-hidden bg-slate-50">
              {item.thumbnail && <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
              {data.showType && <div className={cn("absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg", typeColors[item.type])}>{typeLabels[item.type]}</div>}
            </div>
            <div className="p-6">
              <h3 className={cn("font-bold text-lg mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors", isDark?"text-white":"text-[var(--secondary)]")}>{item.title}</h3>
              {item.excerpt && <p className={cn("text-sm mb-4 line-clamp-2 font-bold", isDark?"text-white/40":"text-slate-400")}>{item.excerpt}</p>}
              <div className={cn("flex items-center justify-between pt-4 border-t", isDark?"border-white/10":"border-slate-50")}>
                {data.showDate && item.date && <span className={cn("text-xs font-bold", isDark?"text-white/40":"text-slate-400")}>{item.date}</span>}
                {item.tag && <span className={cn("text-[10px] uppercase font-bold px-2 py-1 rounded", isDark?"bg-white/10 text-white/50":"bg-slate-50 text-slate-500")}>{item.tag}</span>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
