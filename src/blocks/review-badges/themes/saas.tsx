import React from "react";
import { cn } from "@/lib/utils";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";
import type { ReviewBadgesData } from "../definition";

const pNames: Record<string,string> = { g2:"G2", capterra:"Capterra", trustpilot:"Trustpilot", google:"Google", custom:"Review" };

export function ReviewBadgesSaaS({ data, isDark }: { data: ReviewBadgesData; isDark?: boolean }) {
  const { executeAction } = useActionExecutor();
  return (
    <div className="max-w-5xl mx-auto">
      {data.title && <h2 className={cn("text-2xl md:text-3xl text-center mb-10 font-bold", isDark?"text-white":"text-[var(--secondary)]")}>{data.title}</h2>}
      <div className="flex gap-6 justify-center flex-wrap">
        {(data.badges??[]).map((badge, i) => (
          <button key={i} onClick={() => executeAction(badge.action)}
            className={cn("p-6 border transition-all shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1", isDark?"bg-white/5 border-white/10 hover:border-[var(--primary)]":"bg-white border-slate-100 hover:border-[var(--primary)]/30")}
            style={{ borderRadius: "var(--radius-md)" }}
          >
            {badge.badgeUrl && <img src={badge.badgeUrl} alt={pNames[badge.platform]} className="h-6 mb-3" />}
            <div className={cn("font-bold mb-2", isDark?"text-white":"text-[var(--secondary)]")}>{pNames[badge.platform]}</div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-sm">
                {Array.from({length:5}).map((_,j) => (
                  <span key={j} className={j < Math.floor(badge.rating) ? "text-yellow-400" : j < badge.rating ? "text-yellow-300" : "text-slate-300"}>★</span>
                ))}
              </div>
              <span className={cn("font-bold text-sm", isDark?"text-white":"text-[var(--secondary)]")}>{badge.rating.toFixed(1)}</span>
            </div>
            <div className={cn("text-xs font-bold", isDark?"text-white/40":"text-slate-400")}>{badge.reviewCount.toLocaleString()} đánh giá</div>
          </button>
        ))}
      </div>
    </div>
  );
}
