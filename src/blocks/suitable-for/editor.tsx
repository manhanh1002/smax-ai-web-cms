"use client";

import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor, ActionPicker } from "@/components/cms/block-editors/shared";
import { Type, LayoutTemplate, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { SuitableForBlockData } from "./definition";
import { BlockData } from "../types";

export function SuitableForEditor({ data, onChange }: { data: BlockData<SuitableForBlockData>; onChange: (d: BlockData<SuitableForBlockData>) => void }) {
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });
  
  const addCard = () => {
    const cards = [...(data.cards || [])];
    cards.push({ tag: "", title: "", description: "" });
    u("cards", cards);
  };

  const removeCard = (idx: number) => {
    const cards = [...(data.cards || [])];
    cards.splice(idx, 1);
    u("cards", cards);
  };

  const updateCard = (idx: number, key: string, val: any) => {
    const cards = [...(data.cards || [])];
    cards[idx] = { ...cards[idx], [key]: val };
    u("cards", cards);
  };

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
            <div className="col-span-2"><Field label="Mô tả phụ"><Inp value={data.subtitle || ""} onChange={v => u("subtitle", v)} /></Field></div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Danh sách Card</label>
            {(data.cards || []).map((card: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative">
                <Button variant="ghost" size="sm" onClick={() => removeCard(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                
                <Field label="Hình ảnh / Icon">
                  <div className="flex gap-2">
                    <Inp value={card.image || ""} onChange={v => updateCard(idx, "image", v)} placeholder="URL ảnh..." />
                    <MediaPicker onSelect={url => updateCard(idx, "image", url)} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                  </div>
                </Field>

                <div className="grid grid-cols-3 gap-4">
                  <Field label="Tag (Nhãn)"><Inp value={card.tag || ""} onChange={v => updateCard(idx, "tag", v)} /></Field>
                  <div className="col-span-2"><Field label="Tiêu đề card"><Inp value={card.title || ""} onChange={v => updateCard(idx, "title", v)} /></Field></div>
                </div>
                <Field label="Mô tả ngắn"><Txt value={card.description || ""} onChange={v => updateCard(idx, "description", v)} rows={2} /></Field>
                <ActionPicker label="Hành động khi nhấn" value={card.url || ""} onChange={v => updateCard(idx, "url", v)} />
              </div>
            ))}
            <Button variant="outline" className="w-full border-dashed" onClick={addCard}><Plus className="w-4 h-4 mr-2" /> Thêm card mới</Button>
          </div>
        </div>
      )}
    </div>
  );
}
