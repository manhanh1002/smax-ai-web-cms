"use client";

import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor } from "@/components/cms/block-editors/shared";
import { Type, LayoutTemplate, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatsBlockData } from "./definition";
import { BlockData } from "../types";

export function StatsBlockEditor({ data, onChange }: { data: BlockData<StatsBlockData>; onChange: (d: BlockData<StatsBlockData>) => void }) {
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  
  const addItem = () => {
    const items = [...(data.items || [])];
    items.push({ value: "0", suffix: "", label: "Tiêu đề" });
    onChange({ ...data, items });
  };

  const removeItem = (index: number) => {
    const items = [...(data.items || [])];
    items.splice(index, 1);
    onChange({ ...data, items });
  };

  const updateItem = (index: number, key: string, val: any) => {
    const items = [...(data.items || [])];
    items[index] = { ...items[index], [key]: val };
    onChange({ ...data, items });
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
          <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Cấu hình chung</label>
            <Field label="Số cột hiển thị">
              <select 
                value={data.columns || 3} 
                onChange={e => onChange({ ...data, columns: parseInt(e.target.value) })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value={1}>1 cột</option>
                <option value={2}>2 cột</option>
                <option value={3}>3 cột</option>
                <option value={4}>4 cột</option>
              </select>
            </Field>
          </div>
          <BlockSettingsEditor settings={data.settings} onChange={v => onChange({ ...data, settings: v })} />
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 gap-4">
            <Field label="Nhãn (Badge)"><Inp value={data.badge || ""} onChange={v => onChange({ ...data, badge: v })} placeholder="Số liệu" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tiêu đề chính"><Inp value={data.title || ""} onChange={v => onChange({ ...data, title: v })} placeholder="Sức mạnh từ" /></Field>
              <Field label="Tiêu đề Highlight"><Inp value={data.titleHighlight || ""} onChange={v => onChange({ ...data, titleHighlight: v })} placeholder="Những con số" /></Field>
            </div>
            <Field label="Mô tả"><Txt value={data.subtitle || ""} onChange={v => onChange({ ...data, subtitle: v })} placeholder="Mô tả ngắn..." rows={2} /></Field>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Danh sách số liệu</label>
            <div className="grid grid-cols-1 gap-4">
              {(data.items || []).map((item: any, idx: number) => (
                <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 relative shadow-sm hover:shadow-md transition-shadow">
                  <Button variant="ghost" size="sm" onClick={() => removeItem(idx)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Tiền tố"><Inp value={item.prefix || ""} onChange={v => updateItem(idx, "prefix", v)} placeholder="Ví dụ: +" /></Field>
                    <Field label="Giá trị số"><Inp value={item.value || ""} onChange={v => updateItem(idx, "value", v)} placeholder="20000" /></Field>
                    <Field label="Hậu tố"><Inp value={item.suffix || ""} onChange={v => updateItem(idx, "suffix", v)} placeholder="Ví dụ: +" /></Field>
                  </div>
                  
                  <Field label="Nhãn mô tả chính"><Inp value={item.label || ""} onChange={v => updateItem(idx, "label", v)} placeholder="Người dùng tin dùng" /></Field>
                  <Field label="Mô tả chi tiết (không bắt buộc)"><Txt value={item.description || ""} onChange={v => updateItem(idx, "description", v)} placeholder="Mô tả chi tiết..." rows={1} /></Field>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full border-dashed h-12" onClick={addItem}>
              <Plus className="w-4 h-4 mr-2" /> Thêm số liệu mới
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
