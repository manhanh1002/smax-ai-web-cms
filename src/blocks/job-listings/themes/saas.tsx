"use client";
import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";
import type { JobListingsData } from "../definition";

const typeLabels: Record<string,string> = { "full-time":"Full-time","part-time":"Part-time",contract:"Contract",remote:"Remote" };
const typeColors: Record<string,string> = { "full-time":"bg-blue-100 text-blue-700","part-time":"bg-green-100 text-green-700",contract:"bg-orange-100 text-orange-700",remote:"bg-purple-100 text-purple-700" };

export function JobListingsSaaS({ data, isDark }: { data: JobListingsData; isDark?: boolean }) {
  const [filterDept, setFilterDept] = useState<string|null>(null);
  const { executeAction } = useActionExecutor();
  const filtered = useMemo(() => filterDept ? (data.jobs??[]).filter(j=>j.department===filterDept) : (data.jobs??[]), [data.jobs, filterDept]);
  return (
    <div className="max-w-4xl mx-auto">
      {(data.sectionLabel||data.title) && (
        <div className="mb-10">
          {data.sectionLabel && <p className={cn("text-xs font-bold uppercase tracking-widest mb-3", isDark?"text-[var(--primary)]":"text-[var(--primary)]")}>{data.sectionLabel}</p>}
          <h2 className={cn("text-3xl md:text-4xl mb-3", isDark?"text-white":"text-[var(--secondary)]")}>{data.title}</h2>
          {data.subtitle && <p className={cn("text-lg", isDark?"text-white/60":"text-[var(--secondary)]/60")}>{data.subtitle}</p>}
        </div>
      )}
      {data.showFilter && (data.departments??[]).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setFilterDept(null)} className={cn("px-4 py-2 rounded-[var(--radius)] text-sm font-bold transition-all", !filterDept?"bg-[var(--primary)] text-white":(isDark?"bg-white/10 text-white/80":"bg-slate-100 text-slate-700"))}>
            {data.allFilterLabel || "Tất cả"} ({data.jobs?.length??0})
          </button>
          {(data.departments??[]).map(dept => (
            <button key={dept} onClick={() => setFilterDept(dept)} className={cn("px-4 py-2 rounded-[var(--radius)] text-sm font-bold transition-all", filterDept===dept?"bg-[var(--primary)] text-white":(isDark?"bg-white/10 text-white/80":"bg-slate-100 text-slate-700"))}>
              {dept} ({(data.jobs??[]).filter(j=>j.department===dept).length})
            </button>
          ))}
        </div>
      )}
      <div className="space-y-4">
        {filtered.length === 0
          ? <div className={cn("text-center py-12", isDark?"text-white/40":"text-slate-500")}>{data.emptyStateText || "Không có vị trí nào"}</div>
          : filtered.map((job, i) => (
            <button key={i} onClick={() => executeAction(job.applyAction)} className={cn("w-full text-left block p-6 border transition-all hover:border-[var(--primary)]/50 hover:shadow-[var(--shadow-md)]", isDark?"bg-white/5 border-white/10":"bg-white border-slate-200 shadow-sm")} style={{ borderRadius: "var(--radius-md)" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className={cn("font-bold text-lg mb-2", isDark?"text-white":"text-[var(--secondary)]")}>{job.title}</h3>
                  {job.description && <p className={cn("text-sm mb-3 line-clamp-2", isDark?"text-white/60":"text-[var(--secondary)]/60")}>{job.description}</p>}
                  <div className="flex flex-wrap gap-2 items-center text-sm">
                    <span className={cn("font-bold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider", typeColors[job.type])}>{typeLabels[job.type]}</span>
                    <span className={isDark?"text-white/40":"text-slate-500"}>{job.department}</span>
                    <span className={isDark?"text-white/40":"text-slate-500"}>📍 {job.location}</span>
                    {job.salary && <span className={cn("font-bold", isDark?"text-[var(--primary)]":"text-[var(--primary)]")}>{job.salary}</span>}
                  </div>
                </div>
                <span className={cn("px-4 py-2 rounded-[var(--radius)] text-xs font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0", isDark?"bg-white/10 text-white/80":"bg-slate-100 text-slate-700")}>{data.applyBtnText || "Chi tiết →"}</span>
              </div>
            </button>
          ))
        }
      </div>
    </div>
  );
}
