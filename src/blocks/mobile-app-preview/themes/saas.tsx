import React from "react";
import { cn } from "@/lib/utils";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";
import type { MobileAppPreviewData } from "../definition";

export function MobileAppPreviewSaaS({ data, isDark }: { data: MobileAppPreviewData; isDark?: boolean }) {
  const { executeAction } = useActionExecutor();
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 flex justify-center">
          <div className="relative w-52">
            <div className="bg-black rounded-[2.5rem] p-2 shadow-[var(--shadow-lg)] border-8 border-black">
              {data.mockupImage
                ? <img src={data.mockupImage} alt="App" className="w-full rounded-[1.8rem]" />
                : <div className="w-full aspect-[9/19] rounded-[1.8rem] bg-slate-800 flex items-center justify-center text-white/40 text-sm">Screenshot</div>
              }
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-6">
          <div>
            <h2 className={cn("text-3xl md:text-4xl mb-3", isDark?"text-white":"text-[var(--secondary)]")}>{data.title}</h2>
            {data.subtitle && <p className={cn("text-lg", isDark?"text-white/60":"text-[var(--secondary)]/60")}>{data.subtitle}</p>}
          </div>
          {(data.appStoreAction || data.playStoreAction) && (
            <div className="flex flex-wrap gap-3">
              {data.appStoreText && (
                <button onClick={() => executeAction(data.appStoreAction)}
                  className={cn("px-5 py-2.5 font-bold text-sm border transition-all hover:brightness-110 shadow-lg shadow-black/10")} style={{ backgroundColor: isDark?"white/5":"#000", color:"#fff", borderRadius: "var(--radius-md)" }}>
                  🍎 {data.appStoreText}
                </button>
              )}
              {data.playStoreText && (
                <button onClick={() => executeAction(data.playStoreAction)}
                  className={cn("px-5 py-2.5 font-bold text-sm border transition-all hover:brightness-110 shadow-lg shadow-black/10")} style={{ backgroundColor: isDark?"white/5":"#000", color:"#fff", borderRadius: "var(--radius-md)" }}>
                  🤖 {data.playStoreText}
                </button>
              )}
            </div>
          )}
          {(data.features ?? []).length > 0 && (
            <ul className="space-y-2.5">
              {data.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={cn("mt-0.5 text-lg font-bold text-[var(--primary)]")}>✓</span>
                  <span className={cn("text-base", isDark?"text-white/80":"text-[var(--secondary)]/80")}>{f}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
