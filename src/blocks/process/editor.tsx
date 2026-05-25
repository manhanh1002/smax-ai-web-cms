"use client";

import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor, ActionPicker } from "@/components/cms/block-editors/shared";
import { Type, LayoutTemplate, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { ProcessBlockData } from "./definition";
import { BlockData } from "../types";

export function ProcessEditor({ data, onChange }: { data: BlockData<ProcessBlockData>; onChange: (d: BlockData<ProcessBlockData>) => void }) {
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });
  
  const addItem = () => {
    const steps = [...(data.steps || [])];
    steps.push({ title: "", description: "", image: "" });
    u("steps", steps);
  };

  const removeItem = (index: number) => {
    const steps = [...(data.steps || [])];
    steps.splice(index, 1);
    u("steps", steps);
  };

  const updateItem = (index: number, key: string, val: any) => {
    const steps = [...(data.steps || [])];
    steps[index] = { ...steps[index], [key]: val };
    u("steps", steps);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Badge"><Inp value={data.badge || ""} onChange={v => u("badge", v)} /></Field>
            <Field label="Tiêu đề Highlight"><Inp value={data.titleHighlight || ""} onChange={v => u("titleHighlight", v)} /></Field>
            <div className="col-span-2"><Field label="Tiêu đề chính"><Inp value={data.title || ""} onChange={v => u("title", v)} /></Field></div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Danh sách các Bước</label>
            {(data.steps || []).map((item: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative">
                <Button variant="ghost" size="sm" onClick={() => removeItem(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                <Field label="Tiêu đề bước"><Inp value={item.title || ""} onChange={v => updateItem(idx, "title", v)} /></Field>
                <Field label="Mô tả"><Txt value={item.description || ""} onChange={v => updateItem(idx, "description", v)} rows={2} /></Field>
                <Field label="Ảnh minh hoạ">
                  <div className="flex gap-2">
                    <Inp value={item.image || ""} onChange={v => updateItem(idx, "image", v)} />
                    <MediaPicker onSelect={url => updateItem(idx, "image", url)} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                  </div>
                </Field>
                <ActionPicker label="Hành động khi nhấn" value={item.url || ""} onChange={v => updateItem(idx, "url", v)} />
              </div>
            ))}
            <Button variant="outline" className="w-full border-dashed" onClick={addItem}><Plus className="w-4 h-4 mr-2" /> Thêm Bước mới</Button>
          </div>
        </div>
    </div>
  );
}
