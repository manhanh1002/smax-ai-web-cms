import React from "react";
import { cn } from "@/lib/utils";

export interface Breadcrumb {
  label: string;
  url?: string;
}

export interface PageHeaderData {
  breadcrumbs?: Breadcrumb[];
  title: string;
  subtitle?: string;
  tags?: string[];
  publishDate?: string;
  readTime?: string;
  authorName?: string;
  authorAvatar?: string;
  darkMode?: boolean;
  alignment?: "left" | "center";
}

export function PageHeaderBlock({ data }: { data: PageHeaderData }) {
  const isDark = data.darkMode;
  const isCenter = data.alignment === "center";

  return (
    <section className={cn(
      "py-14 px-4 border-b",
      isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
    )}>
      <div className={cn("max-w-4xl mx-auto space-y-4", isCenter && "text-center")}>
        {data.breadcrumbs && data.breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-sm flex-wrap" aria-label="Breadcrumb">
            {data.breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className={isDark ? "text-slate-500" : "text-slate-400"}>/</span>}
                {crumb.url ? (
                  <a href={crumb.url} className={cn("hover:underline", isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900")}>
                    {crumb.label}
                  </a>
                ) : (
                  <span className={isDark ? "text-slate-200" : "text-slate-700"}>{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {data.tags && data.tags.length > 0 && (
          <div className={cn("flex gap-2 flex-wrap", isCenter && "justify-center")}>
            {data.tags.map((tag, i) => (
              <span key={i} className={cn(
                "text-xs font-semibold px-3 py-1 rounded-full",
                isDark ? "bg-violet-900/40 text-violet-300" : "bg-violet-100 text-violet-700"
              )}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className={cn("text-3xl md:text-5xl font-black leading-tight", isDark ? "text-white" : "text-slate-900")}>
          {data.title}
        </h1>

        {data.subtitle && (
          <p className={cn("text-lg leading-relaxed max-w-2xl", isCenter && "mx-auto", isDark ? "text-slate-300" : "text-slate-600")}>
            {data.subtitle}
          </p>
        )}

        {(data.authorName || data.publishDate || data.readTime) && (
          <div className={cn("flex items-center gap-3 pt-1 text-sm flex-wrap", isCenter && "justify-center")}>
            {data.authorAvatar && (
              <img src={data.authorAvatar} alt={data.authorName} className="w-8 h-8 rounded-full object-cover" />
            )}
            {data.authorName && (
              <span className={cn("font-medium", isDark ? "text-slate-200" : "text-slate-800")}>{data.authorName}</span>
            )}
            {data.publishDate && (
              <span className={isDark ? "text-slate-400" : "text-slate-500"}>· {data.publishDate}</span>
            )}
            {data.readTime && (
              <span className={isDark ? "text-slate-400" : "text-slate-500"}>· {data.readTime}</span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
