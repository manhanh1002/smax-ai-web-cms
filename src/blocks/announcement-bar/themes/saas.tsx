"use client";
import React, { useState } from "react";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";
import type { AnnouncementBarData } from "../definition";

const bgMap: Record<string, string> = {
  violet: "bg-violet-600", blue: "bg-blue-600", emerald: "bg-emerald-600",
  amber: "bg-amber-500", rose: "bg-rose-600", slate: "bg-slate-800",
};

import { cn } from "@/lib/utils";

export function AnnouncementBarSaaS({ data }: { data: AnnouncementBarData }) {
  const [dismissed, setDismissed] = useState(false);
  const { executeAction } = useActionExecutor();
  if (dismissed) return null;

  const getBg = () => {
    if (data.bgColor === "violet") return "var(--primary)";
    if (data.bgColor === "slate") return "var(--secondary)";
    return undefined;
  };

  const bg = getBg();

  return (
    <div 
      className={cn(
        "w-full py-2.5 px-4 text-white text-sm relative z-50", 
        !bg && bgMap[data.bgColor ?? "violet"]
      )} 
      style={{ backgroundColor: bg }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 relative">
        {data.icon && <span className="text-base">{data.icon}</span>}
        <span className="font-bold text-center tracking-tight">{data.message}</span>
        {data.ctaText && (
          <button
            onClick={() => executeAction(data.ctaAction)}
            className="flex-shrink-0 underline underline-offset-4 font-bold hover:opacity-80 transition-opacity ml-1"
          >
            {data.ctaText}
          </button>
        )}
        {data.dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-lg font-bold leading-none w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >×</button>
        )}
      </div>
    </div>
  );
}
