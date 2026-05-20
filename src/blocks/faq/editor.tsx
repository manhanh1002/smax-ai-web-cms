"use client";

import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor } from "@/components/cms/block-editors/shared";
import { Type, LayoutTemplate, Plus, Trash2, Columns, Square } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FAQBlockData } from "./definition";
import { BlockData } from "../types";

export function FAQBlockEditor({ data, onChange }: { data: BlockData<FAQBlockData>; onChange: (d: BlockData<FAQBlockData>) => void }) {
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });
  
  const addItem = () => {
    const items = [...(data.items || [])];
    items.push({ question: "", answer: "" });
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
          {/* Columns layout selector */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3">Bố cục cột</label>
            <div className="grid grid-cols-2 gap-2">
              {([1, 2] as const).map((col) => (
                <button
                  key={col}
                  onClick={() => u("columns", col)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-semibold ${
                    (data.columns ?? 1) === col
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {col === 1 ? <Square className="w-5 h-5" /> : <Columns className="w-5 h-5" />}
                  {col === 1 ? "1 cột" : "2 cột"}
                </button>
              ))}
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
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Danh sách câu hỏi</label>
            {(data.items || []).map((item: { question: string; answer: string }, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative">
                <Button variant="ghost" size="sm" onClick={() => removeItem(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
                
                <Field label="Câu hỏi"><Inp value={item.question || ""} onChange={v => updateItem(idx, "question", v)} /></Field>
                <Field label="Câu trả lời"><Txt value={item.answer || ""} onChange={v => updateItem(idx, "answer", v)} rows={3} /></Field>
              </div>
            ))}
            <Button variant="outline" className="w-full border-dashed" onClick={addItem}>
              <Plus className="w-4 h-4 mr-2" /> Thêm câu hỏi mới
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
