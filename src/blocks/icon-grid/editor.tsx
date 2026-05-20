"use client";
import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor } from "@/components/cms/block-editors/shared";
import { Type, LayoutTemplate, Plus, Trash2, Zap, AlignLeft, AlignCenter, AlignRight, Box, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconGridData } from "./definition";
import { BlockData } from "../types";
import { IconPicker } from "@/components/cms/IconPicker";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { cn } from "@/lib/utils";

export function IconGridEditor({ data, onChange }: { data: BlockData<IconGridData>; onChange: (d: BlockData<IconGridData>) => void }) {
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });
  
  const addItem = () => {
    const items = [...(data.items || [])];
    items.push({ title: "Tính năng mới", description: "Mô tả tính năng", icon: "Zap" });
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
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cấu hình hiển thị Items</h4>
            
            <Field label="Căn lề nội dung">
              <div className="flex bg-white rounded-xl border border-slate-200 p-1">
                {[
                  { id: 'left', icon: AlignLeft, label: 'Trái' },
                  { id: 'center', icon: AlignCenter, label: 'Giữa' },
                  { id: 'right', icon: AlignRight, label: 'Phải' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => u("itemAlign", item.id)}
                    className={cn(
                      "flex-1 h-9 flex items-center justify-center rounded-lg transition-all text-xs font-bold gap-2",
                      (data.itemAlign || "left") === item.id ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Kiểu hiển thị">
              <div className="flex bg-white rounded-xl border border-slate-200 p-1">
                {[
                  { id: 'standard', icon: LayoutTemplate, label: 'Tiêu chuẩn' },
                  { id: 'compact', icon: Box, label: 'Tối giản' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => u("itemStyle", item.id)}
                    className={cn(
                      "flex-1 h-9 flex items-center justify-center rounded-lg transition-all text-xs font-bold gap-2",
                      (data.itemStyle || "standard") === item.id ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Số cột hiển thị">
              <div className="flex bg-white rounded-xl border border-slate-200 p-1">
                {[3, 4, 5].map(col => (
                  <button
                    key={col}
                    onClick={() => u("columns", col)}
                    className={cn(
                      "flex-1 h-9 flex items-center justify-center rounded-lg transition-all text-xs font-bold gap-2",
                      (data.columns || 4) === col ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50"
                    )}
                  >
                    {col} Cột
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
            <div className="col-span-2"><Field label="Mô tả ngắn"><Txt value={data.description || ""} onChange={v => u("description", v)} rows={3} /></Field></div>
            <div className="col-span-2">
              <Field label="Ảnh/Media chính">
                <div className="flex gap-2">
                  <Inp value={data.image || ""} onChange={v => u("image", v)} placeholder="https://..." />
                  <MediaPicker 
                    onSelect={url => u("image", url)} 
                    trigger={
                      <Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    } 
                  />
                </div>
              </Field>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Danh sách Icons & Tính năng</label>
            <div className="grid grid-cols-1 gap-4">
              {(data.items || []).map((item: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative">
                  <Button variant="ghost" size="sm" onClick={() => removeItem(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4">
                      <Field label="Chọn Icon">
                        <IconPicker value={item.icon || "Zap"} onChange={v => updateItem(idx, "icon", v)} />
                      </Field>
                    </div>
                    <div className="md:col-span-8">
                      <Field label="Tiêu đề"><Inp value={item.title || ""} onChange={v => updateItem(idx, "title", v)} /></Field>
                    </div>
                  </div>
                  <Field label="Mô tả"><Txt value={item.description || ""} onChange={v => updateItem(idx, "description", v)} rows={2} /></Field>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full border-dashed" onClick={addItem}>
              <Plus className="w-4 h-4 mr-2" /> Thêm Tính năng mới
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
