"use client";

import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor } from "@/components/cms/block-editors/shared";
import { Type, LayoutTemplate, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { TestimonialsBlockData } from "./definition";
import { BlockData } from "../types";

export function TestimonialsBlockEditor({ data, onChange }: { data: BlockData<TestimonialsBlockData>; onChange: (d: BlockData<TestimonialsBlockData>) => void }) {
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });

  const addItem = () => {
    const items = [...(data.items || [])];
    items.push({ quote: "", author: "", role: "", avatar: "", rating: 0 });
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
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "content" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
        >
          <Type className="w-4 h-4" /> Nội dung
        </button>
        <button
          onClick={() => setActiveTab("design")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "design" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
        >
          <LayoutTemplate className="w-4 h-4" /> Thiết kế
        </button>
      </div>

      {activeTab === "design" ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Cấu hình chung</h4>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Kiểu hiển thị">
                <select
                  value={data.displayMode || "grid"}
                  onChange={e => u("displayMode", e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="grid">Lưới (Grid)</option>
                  <option value="slider">Slide chạy (Slider)</option>
                  <option value="marquee">Chạy liên tục (Marquee)</option>
                </select>
              </Field>
              <Field label="Số hàng">
                <select
                  value={data.rows || 1}
                  onChange={e => u("rows", parseInt(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value={1}>1 hàng</option>
                  <option value={2}>2 hàng</option>
                  <option value={3}>3 hàng</option>
                </select>
              </Field>
            </div>
          </div>
          <BlockSettingsEditor settings={data.settings} onChange={v => onChange({ ...data, settings: v })} />
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Badge"><Inp value={data.badge || ""} onChange={v => u("badge", v)} /></Field>
            <Field label="Tiêu đề Highlight"><Inp value={data.titleHighlight || ""} onChange={v => u("titleHighlight", v)} /></Field>
            <div className="col-span-2"><Field label="Tiêu đề chính"><Inp value={data.title || ""} onChange={v => u("title", v)} /></Field></div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Danh sách đánh giá</label>
            {(data.items || []).map((item: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative">
                <Button variant="ghost" size="sm" onClick={() => removeItem(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>

                <Field label="Lời chứng thực (Quote)"><Txt value={item.quote || ""} onChange={v => updateItem(idx, "quote", v)} rows={3} /></Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Số sao (Rating)">
                    <select
                      value={item.rating ?? 0}
                      onChange={e => updateItem(idx, "rating", parseInt(e.target.value))}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                    >
                      <option value={0}>Không đánh giá</option>
                      {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} sao</option>)}
                    </select>
                  </Field>
                  <Field label="Tên tác giả"><Inp value={item.author || ""} onChange={v => updateItem(idx, "author", v)} /></Field>
                  <Field label="Chức vụ/Công ty"><Inp value={item.role || ""} onChange={v => updateItem(idx, "role", v)} /></Field>
                  <div className="col-span-2">
                    <Field label="Ảnh đại diện (Avatar)">
                      <div className="flex gap-2">
                        <Inp value={item.avatar || ""} onChange={v => updateItem(idx, "avatar", v)} />
                        <MediaPicker onSelect={url => updateItem(idx, "avatar", url)} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                      </div>
                    </Field>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full border-dashed" onClick={addItem}>
              <Plus className="w-4 h-4 mr-2" /> Thêm đánh giá mới
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
