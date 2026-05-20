import React from "react";
import { cn } from "@/lib/utils";

export interface RichTextBlockData {
  content: string;
  darkMode?: boolean;
}

export function RichTextBlock({ data }: { data: RichTextBlockData }) {
  return (
    <section className={cn(
      "py-16 px-6",
      data.darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-800"
    )}>
      <div className="max-w-3xl mx-auto">
        <div 
          className={cn(
            "prose prose-slate prose-lg max-w-none",
            "prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tight scroll-mt-32",
            "prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-12",
            "prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-10",
            "prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6",
            "prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6",
            "prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6",
            "prose-li:text-slate-600 prose-li:mb-2",
            "prose-img:rounded-[32px] prose-img:shadow-2xl prose-img:border prose-img:border-slate-100 prose-img:my-12",
            "prose-strong:text-slate-900 prose-strong:font-black",
            "prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline",
            "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-slate-50 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-3xl prose-blockquote:italic prose-blockquote:text-slate-700 prose-blockquote:my-10",
            data.darkMode && "prose-invert prose-p:text-slate-400 prose-strong:text-white prose-blockquote:bg-slate-800/50 prose-li:text-slate-400"
          )}
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </div>
    </section>
  );
}
