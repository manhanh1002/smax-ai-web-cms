import React from "react";
import { cn } from "@/lib/utils";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";
import type { DownloadCardsData } from "../definition";

const fileIcons: Record<string,string> = { pdf:"📄", doc:"📝", xls:"📊", zip:"📦", video:"🎥" };
const fileColors: Record<string,string> = { pdf:"bg-red-50 text-red-600", doc:"bg-blue-50 text-blue-600", xls:"bg-green-50 text-green-600", zip:"bg-purple-50 text-purple-600", video:"bg-orange-50 text-orange-600" };

export function DownloadCardsSaaS({ data, isDark }: { data: DownloadCardsData; isDark?: boolean }) {
  const { executeAction } = useActionExecutor();
  const cardCount = (data.resources??[]).length;
  const gridCols = data.columns===2
    ? (cardCount === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 md:grid-cols-2")
    : (cardCount === 1 ? "grid-cols-1 max-w-md mx-auto" : cardCount === 2 ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3");
  return (
    <div className="max-w-6xl mx-auto">
      {(data.sectionLabel||data.title) && (
        <div className="text-center mb-12">
          {data.sectionLabel && <p className={cn("text-xs font-bold uppercase tracking-widest mb-3", isDark?"text-[var(--primary)]":"text-[var(--primary)]")}>{data.sectionLabel}</p>}
          {data.title && <h2 className={cn("text-3xl md:text-4xl mb-3", isDark?"text-white":"text-[var(--secondary)]")}>{data.title}</h2>}
          {data.subtitle && <p className={cn("text-lg", isDark?"text-white/60":"text-[var(--secondary)]/60")}>{data.subtitle}</p>}
        </div>
      )}
      <div className={cn("grid gap-6", gridCols)}>
        {(data.resources??[]).map((r, i) => (
          <div key={i} className={cn("border overflow-hidden hover:border-[var(--primary)]/50 transition-all hover:shadow-[var(--shadow-lg)]", isDark?"bg-white/5 border-white/10":"bg-white border-slate-200 shadow-sm")} style={{ borderRadius: "var(--radius-md)" }}>
            {r.thumbnailUrl && <img src={r.thumbnailUrl} alt={r.title} className="w-full h-48 object-cover" />}
            <div className="p-5">
              <span className={cn("inline-flex items-center gap-2 text-xs font-bold mb-3 px-3 py-1 uppercase tracking-wider", fileColors[r.fileType])} style={{ borderRadius: "calc(var(--radius)/2)" }}>
                <span className="text-lg">{fileIcons[r.fileType]}</span>{r.fileType.toUpperCase()}
              </span>
              <h3 className={cn("font-bold text-base mb-2", isDark?"text-white":"text-[var(--secondary)]")}>{r.title}</h3>
              <p className={cn("text-sm mb-4 leading-relaxed", isDark?"text-white/60":"text-[var(--secondary)]/60")}>{r.description}</p>
              <div className={cn("flex items-center justify-between pt-4 border-t", isDark?"border-white/10":"border-slate-100")}>
                <span className={cn("text-xs font-medium", isDark?"text-white/40":"text-slate-500")}>{r.fileSize}</span>
                <button onClick={() => executeAction(r.downloadAction)}
                  className={cn("inline-flex items-center gap-1 px-3 py-1.5 font-bold text-xs uppercase tracking-wider text-white transition-all hover:brightness-110 shadow-lg shadow-[var(--primary)]/20")} style={{ backgroundColor: "var(--primary)", borderRadius: "var(--radius-md)" }}>
                  Download ↓
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
