import React from "react";
import { cn } from "@/lib/utils";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";
import type { PageHeaderData } from "../definition";

export function PageHeaderSaaS({ data, isDark }: { data: PageHeaderData; isDark?: boolean }) {
  const { executeAction } = useActionExecutor();
  const isCenter = data.alignment === "center";
  return (
    <div className={cn("border-b max-w-4xl mx-auto space-y-4 pb-8", isDark?"border-white/10":"border-slate-100", isCenter&&"text-center")}>
      {(data.breadcrumbs ?? []).length > 0 && (
        <nav className="flex items-center gap-1.5 text-sm flex-wrap" aria-label="Breadcrumb">
          {data.breadcrumbs!.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className={isDark?"text-white/20":"text-slate-300"}>/</span>}
              {crumb.action
                ? <button onClick={() => executeAction(crumb.action)} className={cn("hover:underline transition-colors", isDark?"text-white/40 hover:text-white":"text-slate-500 hover:text-[var(--secondary)]")}>{crumb.label}</button>
                : <span className={isDark?"text-white/80":"text-[var(--secondary)]"}>{crumb.label}</span>
              }
            </React.Fragment>
          ))}
        </nav>
      )}
      {(data.tags ?? []).length > 0 && (
        <div className={cn("flex gap-2 flex-wrap", isCenter&&"justify-center")}>
          {data.tags!.map((tag, i) => <span key={i} className={cn("text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full", isDark?"bg-white/10 text-[var(--primary)]":"bg-[var(--primary)]/10 text-[var(--primary)]")}>{tag}</span>)}
        </div>
      )}
      <h1 className={cn("text-3xl md:text-5xl leading-tight", isDark?"text-white":"text-[var(--secondary)]")}>{data.title}</h1>
      {data.subtitle && <p className={cn("text-lg leading-relaxed max-w-2xl", isCenter&&"mx-auto", isDark?"text-white/60":"text-[var(--secondary)]/60")}>{data.subtitle}</p>}
      {(data.authorName || data.publishDate || data.readTime) && (
        <div className={cn("flex items-center gap-3 text-sm flex-wrap", isCenter&&"justify-center")}>
          {data.authorAvatar && <img src={data.authorAvatar} alt={data.authorName} className="w-8 h-8 rounded-full object-cover" />}
          {data.authorName && <span className={cn("font-bold", isDark?"text-white":"text-[var(--secondary)]")}>{data.authorName}</span>}
          {data.publishDate && <span className={isDark?"text-white/40":"text-slate-500"}>· {data.publishDate}</span>}
          {data.readTime   && <span className={isDark?"text-white/40":"text-slate-500"}>· {data.readTime}</span>}
        </div>
      )}
    </div>
  );
}
