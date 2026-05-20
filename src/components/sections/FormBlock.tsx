"use client";

import React from "react";
import { FormRenderer } from "./FormRenderer";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

import { BlockWrapper } from "@/blocks/BlockWrapper";
import { BlockSettings } from "@/blocks/types";

export interface FormBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  formId?: string;
  layout?: "centered" | "split";
  darkMode?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  settings?: BlockSettings;
  features?: { icon: string; text: string }[];
}

export function FormBlock({ data }: { data: FormBlockData }) {
  const settings = data.settings || {};
  const isDark = settings.colorMode === "dark" || (!settings.colorMode && (settings.background === "dark" || settings.background === "primary" || data.darkMode));
  const layout = data.layout || "centered";
  const align = settings.textAlign || (layout === "centered" ? "center" : "left");
  
  const widthClasses = {
    sm: "max-w-md",
    md: "max-w-4xl",
    lg: "max-w-5xl",
    xl: "max-w-7xl",
  };

  const renderHeader = (isSplit = false) => (
    <div className={cn(
      "space-y-4",
      isSplit ? (align === "right" ? "text-right" : "text-left") : (align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center mb-16")
    )}>
      {data.badge && (
        <span className={cn(
          "inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5 border",
          isDark ? "bg-white/10 text-white border-white/20" : "bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/10 shadow-sm"
        )}>
          {data.badge}
        </span>
      )}
      {(data.title || data.titleHighlight) && (
        <h2 className={cn(
          "text-4xl md:text-5xl font-black tracking-tight leading-tight",
          isDark ? "text-white" : "text-slate-900"
        )}>
          {data.title}{" "}
          {data.titleHighlight && <span className="text-[var(--primary)]">{data.titleHighlight}</span>}
        </h2>
      )}
      {data.subtitle && (
        <p className={cn(
          "text-lg font-medium opacity-80",
          !isSplit && align === "center" ? "max-w-2xl mx-auto" : "",
          isDark ? "text-slate-300" : "text-slate-500"
        )}>
          {data.subtitle}
        </p>
      )}
    </div>
  );

  return (
    <BlockWrapper settings={settings}>
      {/* Decorative Background Elements */}
      <div className={cn(
        "absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none",
        isDark ? "bg-[var(--primary)]/20" : "bg-[var(--primary)]/10"
      )} />
      
      <div className={cn("mx-auto relative z-10", widthClasses[data.maxWidth || "md"])}>
        {layout === "centered" ? (
          <>
            {renderHeader()}
            <div className={cn(
              "p-8 md:p-12 rounded-[40px] border shadow-2xl mx-auto max-w-2xl",
              isDark 
                ? "bg-slate-800/50 border-slate-700/50 backdrop-blur-xl shadow-slate-950/50" 
                : "bg-white border-slate-100 shadow-slate-200/50"
            )}>
              {data.formId ? (
                <FormRenderer formId={data.formId} />
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chưa chọn Form hiển thị</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className={cn(align === "right" ? "order-2" : "order-1")}>
              {renderHeader(true)}
              <div className={cn(
                "mt-8 space-y-6 hidden lg:block",
                align === "right" ? "flex flex-col items-end" : ""
              )}>
                {(data.features || []).map((feat, idx) => {
                  const Icon = (LucideIcons as any)[feat.icon] || LucideIcons.CheckCircle;
                  return (
                    <div key={idx} className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl bg-[var(--primary)]/5 border border-[var(--primary)]/10 animate-in slide-in-from-left-4 duration-500",
                      align === "right" ? "flex-row-reverse text-right" : ""
                    )} style={{ transitionDelay: `${idx * 100}ms` }}>
                      <div className="w-12 h-12 shrink-0 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[var(--primary)]/20">
                        <Icon className="w-6 h-6" />
                      </div>
                      <p className={cn("text-sm font-bold leading-relaxed", isDark ? "text-white/80" : "text-slate-700")}>
                        {feat.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={cn(
              "p-8 md:p-12 rounded-[40px] border shadow-2xl",
              align === "right" ? "order-1" : "order-2",
              isDark 
                ? "bg-slate-800/50 border-slate-700/50 backdrop-blur-xl shadow-slate-950/50" 
                : "bg-white border-slate-100 shadow-slate-200/50"
            )}>
              {data.formId ? (
                <FormRenderer formId={data.formId} />
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chưa chọn Form hiển thị</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </BlockWrapper>
  );
}
