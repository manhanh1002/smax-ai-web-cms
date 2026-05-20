"use client";

import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor, ActionPicker } from "@/components/cms/block-editors/shared";
import { Type, LayoutTemplate, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { FeaturesBlockData } from "./definition";
import { BlockData } from "../types";

export function FeaturesBlockEditor({ data, onChange }: { data: BlockData<FeaturesBlockData>; onChange: (d: BlockData<FeaturesBlockData>) => void }) {
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });
  
  const addItem = () => {
    const items = [...(data.items || [])];
    items.push({ title: "Tính năng mới", points: [""], image: "" });
    u("items", items);
  };

  const removeItem = (index: number) => {
    const items = [...(data.items || [])];
    items.splice(index, 1);
    u("items", items);
  };

  const updateItem = (index: number, key: string, val: any) => {
    const items = [...(data.items || [])];
    items[index] = { ...items[index], [key]: val };
    u("items", items);
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
            <div className="col-span-2"><Field label="Mô tả"><Txt value={data.subtitle || ""} onChange={v => u("subtitle", v)} rows={2} /></Field></div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Danh sách hàng (Items)</label>
            {(data.items || []).map((item: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative">
                <Button variant="ghost" size="sm" onClick={() => removeItem(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Tag nhỏ"><Inp value={item.tag || ""} onChange={v => updateItem(idx, "tag", v)} /></Field>
                  <Field label="Tiêu đề hàng"><Inp value={item.title || ""} onChange={v => updateItem(idx, "title", v)} /></Field>
                  <div className="col-span-2">
                    <Field label="Ảnh minh hoạ">
                      <div className="flex gap-2">
                        <Inp value={item.image || ""} onChange={v => updateItem(idx, "image", v)} />
                        <MediaPicker onSelect={url => updateItem(idx, "image", url)} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                      </div>
                    </Field>
                  </div>
                  <div className="col-span-2">
                    <Field label="Điểm nổi bật (Bullet points)">
                      <div className="space-y-2">
                        {(item.points || []).map((point: string, pIdx: number) => (
                          <div key={pIdx} className="flex gap-2">
                            <Inp 
                              value={point} 
                              onChange={v => {
                                const newPoints = [...(item.points || [])];
                                newPoints[pIdx] = v;
                                updateItem(idx, "points", newPoints);
                              }} 
                              placeholder="Nhập tính năng..."
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                const newPoints = (item.points || []).filter((_: any, i: number) => i !== pIdx);
                                updateItem(idx, "points", newPoints);
                              }}
                              className="h-10 w-10 p-0 rounded-xl shrink-0 hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ))}
                        <button 
                          onClick={() => updateItem(idx, "points", [...(item.points || []), ""])}
                          className="flex items-center gap-1.5 text-[10px] font-black uppercase text-blue-600 hover:text-blue-700 tracking-wider px-1 pt-1"
                        >
                          <Plus className="w-3 h-3" /> Thêm điểm nổi bật
                        </button>
                      </div>
                    </Field>
                  </div>
                  <div className="col-span-2">
                    <Field label="Số liệu / Quote (HTML)"><Txt value={item.stat || ""} onChange={v => updateItem(idx, "stat", v)} rows={2} /></Field>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                      <div className="text-xs font-bold text-slate-700">Đảo ngược bố cục (Ảnh bên trái)</div>
                      <input 
                        type="checkbox" 
                        checked={item.reversed || false} 
                        onChange={e => updateItem(idx, "reversed", e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 accent-blue-600"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Field label="Chữ trên nút"><Inp value={item.btnText || ""} onChange={v => updateItem(idx, "btnText", v)} placeholder="Xem thêm" /></Field>
                  </div>
                  <div className="col-span-2">
                    <ActionPicker label="Hành động" value={item.url || ""} onChange={v => updateItem(idx, "url", v)} />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full border-dashed" onClick={addItem}>
              <Plus className="w-4 h-4 mr-2" /> Thêm hàng mới
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
