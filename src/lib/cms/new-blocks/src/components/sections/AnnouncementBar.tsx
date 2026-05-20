"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface AnnouncementBarData {
  message: string;
  ctaText?: string;
  ctaUrl?: string;
  icon?: string;
  bgColor?: "violet" | "blue" | "emerald" | "amber" | "rose" | "slate";
  dismissible?: boolean;
  openInNewTab?: boolean;
}

const bgMap: Record<string, string> = {
  violet: "bg-violet-600",
  blue: "bg-blue-600",
  emerald: "bg-emerald-600",
  amber: "bg-amber-500",
  rose: "bg-rose-600",
  slate: "bg-slate-800",
};

export function AnnouncementBarBlock({ data }: { data: AnnouncementBarData }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const bg = bgMap[data.bgColor ?? "violet"];

  return (
    <div className={cn("w-full py-2.5 px-4 text-white text-sm", bg)}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 relative">
        {data.icon && <span className="text-base">{data.icon}</span>}
        <span className="font-medium text-center">{data.message}</span>
        {data.ctaText && (
          <a
            href={data.ctaUrl ?? "#"}
            target={data.openInNewTab ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="flex-shrink-0 underline underline-offset-2 font-semibold hover:opacity-80 transition-opacity"
          >
            {data.ctaText} →
          </a>
        )}
        {data.dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-xl leading-none"
            aria-label="Đóng thông báo"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
