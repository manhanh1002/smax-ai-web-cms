"use client";

import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor, ActionPicker } from "@/components/cms/block-editors/shared";
import { Type, LayoutTemplate, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { IconPicker } from "@/components/cms/IconPicker";
import { CaseStudyBlockData } from "./definition";
import { BlockData } from "../types";

export function CaseStudyEditor({ data, onChange }: { data: BlockData<CaseStudyBlockData>; onChange: (d: BlockData<CaseStudyBlockData>) => void }) {
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });
  
  const addItem = () => {
    const items = [...(data.items || [])];
    items.push({ title: "", description: "", highlights: [], quote: "", author: "" });
    u("items", items);
  };

  const removeItem = (idx: number) => {
    const items = [...(data.items || [])];
    items.splice(idx, 1);
    u("items", items);
  };

  const updateItem = (idx: number, key: string, val: any) => {
    const items = [...(data.items || [])];
    items[idx] = { ...items[idx], [key]: val };
    u("items", items);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Badge"><Inp value={data.badge || ""} onChange={v => u("badge", v)} /></Field>
            <div className="col-span-2"><Field label="Tiêu đề chính"><Inp value={data.title || ""} onChange={v => u("title", v)} /></Field></div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Danh sách Case Studies</label>
            {(data.items || []).map((item: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative">
                <Button variant="ghost" size="sm" onClick={() => removeItem(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                
                <Field label="Tiêu đề dự án"><Inp value={item.title || ""} onChange={v => updateItem(idx, "title", v)} /></Field>
                <Field label="Mô tả"><Txt value={item.description || ""} onChange={v => updateItem(idx, "description", v)} rows={2} /></Field>
                
                <Field label="Ảnh minh hoạ">
                  <div className="flex gap-2">
                    <Inp value={item.image || ""} onChange={v => updateItem(idx, "image", v)} />
                    <MediaPicker onSelect={url => updateItem(idx, "image", url)} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Trích dẫn (Quote)"><Txt value={item.quote || ""} onChange={v => updateItem(idx, "quote", v)} rows={2} /></Field>
                  <Field label="Tác giả quote"><Inp value={item.author || ""} onChange={v => updateItem(idx, "author", v)} /></Field>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    ✨ Điểm nhấn (Dùng khi không có ảnh)
                  </label>
                  <div className="space-y-2">
                    {(item.highlights || []).map((hl: any, hIdx: number) => (
                      <div key={hIdx} className="flex gap-2 items-center bg-white p-2 rounded-xl border border-slate-200">
                        <div className="w-32 shrink-0">
                          <IconPicker value={hl.icon} onChange={v => {
                            const h = [...(item.highlights || [])];
                            h[hIdx] = { ...h[hIdx], icon: v };
                            updateItem(idx, "highlights", h);
                          }} />
                        </div>
                        <Inp placeholder="Nội dung điểm nhấn" value={hl.text} onChange={v => {
                          const h = [...(item.highlights || [])];
                          h[hIdx] = { ...h[hIdx], text: v };
                          updateItem(idx, "highlights", h);
                        }} className="h-10 text-xs" />
                        <Button variant="ghost" size="sm" onClick={() => {
                          const h = [...(item.highlights || [])];
                          h.splice(hIdx, 1);
                          updateItem(idx, "highlights", h);
                        }} className="h-10 w-10 p-0 text-slate-400 hover:text-red-500 shrink-0"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => {
                      const h = [...(item.highlights || [])];
                      h.push({ icon: "Zap", text: "" });
                      updateItem(idx, "highlights", h);
                    }} className="h-10 text-xs border-dashed w-full"><Plus className="w-4 h-4 mr-1" /> Thêm điểm nhấn</Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Chữ nút bấm"><Inp value={item.btnText || ""} onChange={v => updateItem(idx, "btnText", v)} placeholder="Xem chi tiết" /></Field>
                  <ActionPicker 
                    label="Hành động khi nhấn nút" 
                    value={item.url || ""} 
                    onChange={v => updateItem(idx, "url", v)} 
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full border-dashed" onClick={addItem}><Plus className="w-4 h-4 mr-2" /> Thêm Case Study mới</Button>
          </div>
        </div>
    </div>
  );
}
