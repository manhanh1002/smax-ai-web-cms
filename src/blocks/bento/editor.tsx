"use client";

import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor, ActionPicker } from "@/components/cms/block-editors/shared";
import { Type, LayoutTemplate, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { BentoBlockData } from "./definition";
import { BlockData } from "../types";

export function BentoBlockEditor({ data, onChange }: { data: BlockData<BentoBlockData>; onChange: (d: BlockData<BentoBlockData>) => void }) {
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });
  
  const addItem = () => {
    const cards = [...(data.cards || [])];
    cards.push({ title: "", description: "", size: "small" });
    u("cards", cards);
  };

  const removeItem = (index: number) => {
    const cards = [...(data.cards || [])];
    cards.splice(index, 1);
    u("cards", cards);
  };

  const updateItem = (index: number, key: string, val: any) => {
    const cards = [...(data.cards || [])];
    cards[index] = { ...cards[index], [key]: val };
    u("cards", cards);
  };

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
          <div className="grid grid-cols-2 gap-4">
            <Field label="Badge"><Inp value={data.badge || ""} onChange={v => u("badge", v)} /></Field>
            <Field label="Tiêu đề Highlight"><Inp value={data.titleHighlight || ""} onChange={v => u("titleHighlight", v)} /></Field>
            <div className="col-span-2"><Field label="Tiêu đề chính"><Inp value={data.title || ""} onChange={v => u("title", v)} /></Field></div>
            <div className="col-span-2"><Field label="Mô tả phụ"><Inp value={data.subtitle || ""} onChange={v => u("subtitle", v)} /></Field></div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Danh sách Cards (Bento)</label>
            <div className="grid grid-cols-1 gap-4">
              {(data.cards || []).map((card: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative">
                  <Button variant="ghost" size="sm" onClick={() => removeItem(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Field label="Tiêu đề card"><Inp value={card.title || ""} onChange={v => updateItem(idx, "title", v)} /></Field>
                    </div>
                    <Field label="Kích thước">
                      <select 
                        value={card.size || "small"} 
                        onChange={e => updateItem(idx, "size", e.target.value)}
                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                      >
                        <option value="small">Small (1/4)</option>
                        <option value="medium">Medium (1/2)</option>
                        <option value="large">Large (Full Height)</option>
                      </select>
                    </Field>
                  </div>
                  
                  <Field label="Mô tả ngắn"><Txt value={card.description || ""} onChange={v => updateItem(idx, "description", v)} rows={2} /></Field>
                  
                  <Field label="Ảnh minh hoạ (Tuỳ chọn)">
                    <div className="flex gap-2">
                      <Inp value={card.image || ""} onChange={v => updateItem(idx, "image", v)} />
                      <MediaPicker onSelect={url => updateItem(idx, "image", url)} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                    </div>
                  </Field>

                  <ActionPicker 
                    label="Hành động khi click card" 
                    value={card.url || ""} 
                    onChange={v => updateItem(idx, "url", v)} 
                  />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full border-dashed" onClick={addItem}>
              <Plus className="w-4 h-4 mr-2" /> Thêm Card mới
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
