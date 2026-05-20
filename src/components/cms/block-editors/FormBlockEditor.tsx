"use client";

import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor } from "./shared";
import { FormSelect } from "../FormSelect";
import { IconPicker } from "../IconPicker";
import { Type, LayoutTemplate, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FormBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Form Layout Settings - Moved here because they are form-specific */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cấu hình Layout Form</label>
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Chế độ hiển thị</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Kiểu Layout">
            <select 
              value={data.layout || "centered"} 
              onChange={e => u("layout", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
            >
              <option value="centered">Căn giữa (Centered)</option>
              <option value="split">Chia đôi (Split)</option>
            </select>
          </Field>
          <Field label="Độ rộng tối đa">
            <select 
              value={data.maxWidth || "md"} 
              onChange={e => u("maxWidth", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
            >
              <option value="sm">Nhỏ (768px)</option>
              <option value="md">Vừa (896px)</option>
              <option value="lg">Lớn (1024px)</option>
              <option value="xl">Rất lớn (1280px)</option>
            </select>
          </Field>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nội dung văn bản</label>
          <Field label="Nhãn (Badge)"><Inp value={data.badge || ""} onChange={v => u("badge", v)} placeholder="LIÊN HỆ" /></Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Tiêu đề chính"><Inp value={data.title || ""} onChange={v => u("title", v)} placeholder="Sẵn sàng bắt đầu" /></Field>
            <Field label="Tiêu đề Highlight"><Inp value={data.titleHighlight || ""} onChange={v => u("titleHighlight", v)} placeholder="Cùng Smax AI?" /></Field>
          </div>
          <Field label="Mô tả"><Txt value={data.subtitle || ""} onChange={v => u("subtitle", v)} placeholder="Mô tả phụ..." rows={2} /></Field>
        </div>
        
        {data.layout === "split" && (
          <div className="space-y-4 pt-6 border-t border-slate-100 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tiện ích bổ sung (Split Layout)</label>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Hiện bên trái Form</span>
            </div>
            {(data.features || []).map((feat: any, idx: number) => (
              <div key={idx} className="flex gap-2 items-start bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-20 shrink-0">
                  <IconPicker 
                    value={feat.icon || "CheckCircle"} 
                    onChange={v => {
                      const next = [...(data.features || [])];
                      next[idx] = { ...next[idx], icon: v };
                      u("features", next);
                    }} 
                  />
                </div>
                <div className="flex-1">
                  <Inp value={feat.text || ""} onChange={v => {
                    const next = [...(data.features || [])];
                    next[idx] = { ...next[idx], text: v };
                    u("features", next);
                  }} placeholder="Nội dung tiện ích..." className="border-none bg-slate-50 focus:bg-white" />
                </div>
                <button 
                  onClick={() => {
                    const next = [...(data.features || [])];
                    next.splice(idx, 1);
                    u("features", next);
                  }}
                  className="h-10 w-10 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-dashed rounded-xl h-12 text-slate-500"
              onClick={() => u("features", [...(data.features || []), { text: "Tính năng mới", icon: "CheckCircle" }])}
            >
              <Plus className="w-4 h-4 mr-2" /> Thêm tiện ích
            </Button>
          </div>
        )}

        <div className="pt-6 border-t border-slate-100">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block">Kết nối dữ liệu</label>
          <Field label="Chọn Form hiển thị">
            <FormSelect value={data.formId} onChange={id => u("formId", id)} />
          </Field>
        </div>
      </div>
    </div>
  );
}
