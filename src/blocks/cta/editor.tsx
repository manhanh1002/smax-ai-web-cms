"use client";

import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor, ActionPicker } from "@/components/cms/block-editors/shared";
import { Type, LayoutTemplate, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CTABlockData } from "./definition";
import { BlockData } from "../types";

export function CTABlockEditor({ data, onChange }: { data: BlockData<CTABlockData>; onChange: (d: BlockData<CTABlockData>) => void }) {
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });
  
  const addBullet = () => {
    const bullets = [...(data.bullets || [])];
    bullets.push("");
    u("bullets", bullets);
  };

  const removeBullet = (index: number) => {
    const bullets = [...(data.bullets || [])];
    bullets.splice(index, 1);
    u("bullets", bullets);
  };

  const updateBullet = (index: number, val: string) => {
    const bullets = [...(data.bullets || [])];
    bullets[index] = val;
    u("bullets", bullets);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
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
          <BlockSettingsEditor 
            settings={data.settings} 
            onChange={v => onChange({ ...data, settings: v })} 
          />
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tiêu đề chính"><Inp value={data.title || ""} onChange={v => u("title", v)} placeholder="Sẵn sàng để bắt đầu?" /></Field>
              <Field label="Tiêu đề Highlight"><Inp value={data.titleHighlight || ""} onChange={v => u("titleHighlight", v)} placeholder="Đăng ký ngay" /></Field>
            </div>
            <Field label="Mô tả"><Txt value={data.subtitle || ""} onChange={v => u("subtitle", v)} placeholder="Mô tả ngắn..." rows={2} /></Field>
            <div className="grid grid-cols-2 gap-4">
               <Field label="URL Form Iframe"><Inp value={data.formUrl || ""} onChange={v => u("formUrl", v)} placeholder="https://..." /></Field>
               <Field label="Chiều cao Form (px)"><Inp value={data.formHeight?.toString() || "500"} onChange={v => u("formHeight", parseInt(v))} placeholder="500" /></Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <Field label="Chữ trên nút (Nếu không dùng Form)"><Inp value={data.btnText || ""} onChange={v => u("btnText", v)} placeholder="Bắt đầu ngay" /></Field>
               <ActionPicker label="Hành động khi nhấn nút" value={data.url || ""} onChange={v => u("url", v)} />
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Danh sách điểm nhấn (Bullets)</label>
              <div className="space-y-2">
                {(data.bullets || []).map((bullet: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <Inp value={bullet} onChange={v => updateBullet(idx, v)} placeholder="Nhập nội dung..." />
                    <Button variant="ghost" size="sm" onClick={() => removeBullet(idx)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addBullet} className="w-full border-dashed">
                  <Plus className="w-4 h-4 mr-2" /> Thêm điểm nhấn
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
