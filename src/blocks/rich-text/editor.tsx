"use client";

import React, { useState } from "react";
import { BlockSettingsEditor } from "@/components/cms/block-editors/shared";
import { RichTextBlockEditor as TiptapEditor } from "@/components/cms/block-editors/RichTextBlockEditor";
import { Type, LayoutTemplate } from "lucide-react";
import { RichTextBlockData } from "./definition";
import { BlockData } from "../types";

export function RichTextBlockEditor({ data, onChange }: { data: BlockData<RichTextBlockData>; onChange: (d: BlockData<RichTextBlockData>) => void }) {
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  
  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("content")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "content" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Type className="w-4 h-4" /> Nội dung
        </button>
        <button
          onClick={() => setActiveTab("design")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "design" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <LayoutTemplate className="w-4 h-4" /> Thiết kế
        </button>
      </div>

      {activeTab === "design" ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <BlockSettingsEditor settings={data.settings} onChange={v => onChange({ ...data, settings: v })} />
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-200">
          <TiptapEditor 
            data={{ 
              content: data.content || "", 
              darkMode: data.darkMode 
            }} 
            onChange={(newData) => onChange({ 
              ...data, 
              content: newData.content, 
              darkMode: newData.darkMode 
            })} 
          />
        </div>
      )}
    </div>
  );
}
