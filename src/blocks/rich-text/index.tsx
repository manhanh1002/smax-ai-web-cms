"use client";

import React from "react";
import { BlockData } from "../types";
import { RichTextBlockData } from "./definition";
import { BlockWrapper } from "../BlockWrapper";
import { cn } from "@/lib/utils";

export function RichTextBlockDispatcher({ data }: { data: BlockData<RichTextBlockData> }) {
  const isDark = (data as any).darkMode || data.settings?.background === "dark";
  const align = data.settings?.textAlign || "left";

  return (
    <BlockWrapper settings={data.settings}>
      <div className={cn(
        "mx-auto max-w-3xl",
        align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"
      )}>
        <style dangerouslySetInnerHTML={{ __html: `
          /* Alignment overrides inside prose */
          .prose-content-custom [style*="text-align: center"] { text-align: center; }
          .prose-content-custom [style*="text-align: right"] { text-align: right; }
          .prose-content-custom [style*="text-align: justify"] { text-align: justify; }
          .prose-content-custom [style*="text-align: left"] { text-align: left; }
          
          /* Table Styles */
          .prose-content-custom table { border-collapse: collapse; table-layout: fixed; width: 100%; margin: 2rem 0; overflow: hidden; border-radius: 12px; border: 1px solid #e2e8f0; }
          .prose-content-custom table td, .prose-content-custom table th { min-width: 1em; border: 1px solid #e2e8f0; padding: 0.75rem 1rem; vertical-align: top; box-sizing: border-box; }
          .prose-content-custom table th { font-weight: bold; text-align: left; background-color: #f8fafc; color: #0f172a; }
          ${isDark ? `
            .prose-content-custom table th { background-color: #1e293b; color: #ffffff; border-color: #334155; }
            .prose-content-custom table td { border-color: #334155; }
          ` : ''}

          /* Task List Styles */
          .prose-content-custom ul[data-type="taskList"] { list-style: none; padding-left: 0.5rem; }
          .prose-content-custom ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.5rem; }
          .prose-content-custom ul[data-type="taskList"] li > label { flex: 0 0 auto; user-select: none; margin-top: 0.25rem; }
          .prose-content-custom ul[data-type="taskList"] li > div { flex: 1 1 auto; }
          .prose-content-custom ul[data-type="taskList"] input[type="checkbox"] { cursor: pointer; width: 1.1rem; height: 1.1rem; accent-color: #3b82f6; border-radius: 4px; border: 1px solid #cbd5e1; }

        `}} />
        <div 
          className={cn(
            "prose prose-slate prose-lg max-w-none prose-content-custom",
            "prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tight scroll-mt-32",
            "prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-12",
            "prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-10",
            "prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-8",
            "prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6",
            "prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6",
            "prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6",
            "prose-li:text-slate-600 prose-li:mb-2",
            "prose-img:rounded-[32px] prose-img:border prose-img:border-slate-100 prose-img:my-12",
            "prose-strong:text-slate-900 prose-strong:font-black",
            "prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline",
            "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-slate-50 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-3xl prose-blockquote:italic prose-blockquote:text-slate-700 prose-blockquote:my-10",
            isDark && "prose-invert prose-p:text-slate-400 prose-strong:text-white prose-blockquote:bg-slate-800/50 prose-li:text-slate-400"
          )}
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </div>
    </BlockWrapper>
  );
}
