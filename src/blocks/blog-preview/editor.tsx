"use client";

import React, { useState } from "react";
import { Field, Inp, BlockSettingsEditor } from "@/components/cms/block-editors/shared";
import { Type, LayoutTemplate } from "lucide-react";
import { BlogPreviewBlockData } from "./definition";
import { BlockData } from "../types";

export function BlogPreviewEditor({ data, onChange }: { data: BlockData<BlogPreviewBlockData>; onChange: (d: BlockData<BlogPreviewBlockData>) => void }) {
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });
  
  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200">
        <button onClick={() => setActiveTab("content")} className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "content" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}><Type className="w-4 h-4" /> Nội dung</button>
        <button onClick={() => setActiveTab("design")} className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "design" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}><LayoutTemplate className="w-4 h-4" /> Thiết kế</button>
      </div>

      {activeTab === "design" ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <BlockSettingsEditor settings={data.settings} onChange={v => onChange({ ...data, settings: v })} />
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Badge"><Inp value={data.badge || ""} onChange={v => u("badge", v)} /></Field>
            <Field label="Tiêu đề Highlight"><Inp value={data.titleHighlight || ""} onChange={v => u("titleHighlight", v)} /></Field>
            <div className="col-span-2"><Field label="Tiêu đề chính"><Inp value={data.title || ""} onChange={v => u("title", v)} /></Field></div>
            
            <Field label="Số lượng bài viết"><Inp value={data.limit?.toString() || "3"} onChange={v => u("limit", parseInt(v) || 3)} type="number" /></Field>
            <Field label="Slug Chuyên mục (Tuỳ chọn)"><Inp value={data.categorySlug || ""} onChange={v => u("categorySlug", v)} /></Field>
          </div>
        </div>
      )}
    </div>
  );
}
