"use client";

import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor, ActionPicker } from "@/components/cms/block-editors/shared";
import { Type, LayoutTemplate, Plus, Trash2, Image as ImageIcon, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { HorizontalTabsBlockData } from "./definition";
import { BlockData } from "../types";

export function HorizontalTabsEditor({ data, onChange }: { data: BlockData<HorizontalTabsBlockData>; onChange: (d: BlockData<HorizontalTabsBlockData>) => void }) {
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });
  
  const addItem = () => {
    const tabs = [...(data.tabs || [])];
    tabs.push({ label: "Mới", title: "", description: "" });
    u("tabs", tabs);
  };

  const removeItem = (index: number) => {
    const tabs = [...(data.tabs || [])];
    tabs.splice(index, 1);
    u("tabs", tabs);
  };

  const updateItem = (index: number, key: string, val: any) => {
    const tabs = [...(data.tabs || [])];
    tabs[index] = { ...tabs[index], [key]: val };
    u("tabs", tabs);
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
            <div className="col-span-2"><Field label="Mô tả phụ (Subtitle)"><Txt value={data.subtitle || ""} onChange={v => u("subtitle", v)} rows={2} /></Field></div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Danh sách Tabs</label>
            {(data.tabs || []).map((item: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative">
                <Button variant="ghost" size="sm" onClick={() => removeItem(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nhãn (Tab)"><Inp value={item.label || ""} onChange={v => updateItem(idx, "label", v)} /></Field>
                  <Field label="Tiêu đề nội dung"><Inp value={item.title || ""} onChange={v => updateItem(idx, "title", v)} /></Field>
                </div>
                <Field label="Mô tả"><Txt value={item.description || ""} onChange={v => updateItem(idx, "description", v)} rows={2} /></Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Ảnh minh hoạ">
                    <div className="flex gap-2">
                      <Inp value={item.image || ""} onChange={v => updateItem(idx, "image", v)} />
                      <MediaPicker onSelect={url => updateItem(idx, "image", url)} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                    </div>
                  </Field>
                  <Field label="Tên nút (CTA)"><Inp value={item.btnText || ""} onChange={v => updateItem(idx, "btnText", v)} placeholder="Xem chi tiết..." /></Field>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider">
                    <MousePointer2 className="w-3 h-3" /> Hành động của nút
                  </div>
                  <ActionPicker label="Hành động" value={item.btnAction || { type: "url", url: "" }} onChange={v => updateItem(idx, "btnAction", v)} />
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full border-dashed" onClick={addItem}><Plus className="w-4 h-4 mr-2" /> Thêm Tab mới</Button>
          </div>
        </div>
      )}
    </div>
  );
}
