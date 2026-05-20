"use client";

export interface CTABlockData {
  title?: string;
  subtitle?: string;
  bullets?: string[];
  formUrl?: string;
  formHeight?: number;
  nativeFormId?: string;
  darkMode?: boolean;
}

import { FormRenderer } from "./FormRenderer";

export function CTABlock({ data }: { data: CTABlockData }) {
  const isDark = data.darkMode === true;

  return (
    <section
      id="form"
      className={cn(
        "py-20 transition-colors duration-300",
        isDark ? "bg-[#0F1836] text-white" : ""
      )}
      style={!isDark ? { background: "linear-gradient(135deg,#fff5f3 0%,#fff0ee 100%)" } : {}}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-14 items-start">
          <div className="flex-1 space-y-6 pt-2">
            {data.title && (
              <h2 className={cn(
                "text-3xl md:text-4xl font-black leading-snug",
                isDark ? "text-white" : "text-[#0F1836]"
              )}>
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p className={cn(
                "text-sm leading-relaxed",
                isDark ? "text-slate-400" : "text-slate-500"
              )}>{data.subtitle}</p>
            )}
            {data.bullets && data.bullets.length > 0 && (
              <div className="space-y-3">
                {data.bullets.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="mt-0.5 shrink-0 w-5 h-5 text-[#fa6e5b]" viewBox="0 0 512 512" fill="currentColor">
                      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                    </svg>
                    <span className={cn(
                      "text-sm",
                      isDark ? "text-slate-300" : "text-slate-700"
                    )}>{point}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {(data.formUrl || data.nativeFormId) && (
            <div className={cn(
              "w-full lg:w-[480px] rounded-[32px] overflow-hidden shrink-0 border transition-all duration-300",
              isDark ? "bg-white border-white/10 shadow-2xl shadow-black/50" : "bg-white border-slate-100 shadow-xl shadow-slate-200/50"
            )}>
              {data.nativeFormId ? (
                <div className="p-8">
                  <FormRenderer formId={data.nativeFormId} />
                </div>
              ) : (
                <iframe
                  src={data.formUrl}
                  className="w-full border-0"
                  height={data.formHeight || 500}
                  title="Contact Form"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";
