"use client";

import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor, ActionPicker } from "@/components/cms/block-editors/shared";
import { Type, LayoutTemplate, Image as ImageIcon, AlignLeft, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { HeroSecondaryData } from "./definition";
import { BlockData } from "../types";

export function HeroSecondaryEditor({ data, onChange }: { data: BlockData<HeroSecondaryData>; onChange: (d: BlockData<HeroSecondaryData>) => void }) {
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });
  
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
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <Field label="Vị trí ảnh">
              <div className="flex bg-white rounded-xl border border-slate-200 p-1">
                {[
                  { id: 'left', label: 'Ảnh bên trái', icon: AlignLeft },
                  { id: 'right', label: 'Ảnh bên phải', icon: AlignRight }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => u("imagePosition", item.id)}
                    className={cn(
                      "flex-1 h-9 flex items-center justify-center rounded-lg transition-all text-xs font-bold gap-2",
                      (data.imagePosition || "left") === item.id ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <BlockSettingsEditor settings={data.settings} onChange={v => onChange({ ...data, settings: v })} />
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Badge"><Inp value={data.badge || ""} onChange={v => u("badge", v)} /></Field>
            <Field label="Tiêu đề Highlight"><Inp value={data.titleHighlight || ""} onChange={v => u("titleHighlight", v)} /></Field>
            <div className="col-span-2"><Field label="Tiêu đề chính"><Inp value={data.title || ""} onChange={v => u("title", v)} /></Field></div>
            <div className="col-span-2"><Field label="Mô tả"><Txt value={data.subtitle || ""} onChange={v => u("subtitle", v)} rows={2} /></Field></div>
            
            <div className="col-span-2">
              <Field label="Ảnh minh hoạ">
                <div className="flex gap-2">
                  <Inp value={data.image || ""} onChange={v => u("image", v)} />
                  <MediaPicker onSelect={url => u("image", url)} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                </div>
              </Field>
            </div>

            <Field label="Tên nút bấm"><Inp value={data.primaryBtn || ""} onChange={v => u("primaryBtn", v)} /></Field>
            <div className="col-span-2">
              <ActionPicker 
                label="Hành động nút bấm" 
                value={data.primaryBtnUrl || ""} 
                onChange={v => u("primaryBtnUrl", v)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
