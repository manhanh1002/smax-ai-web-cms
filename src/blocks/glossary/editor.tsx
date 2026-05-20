"use client";
import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor } from "@/components/cms/block-editors/shared";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function GlossaryEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const [tab, setTab] = useState("content");
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const updateTerm = (i: number, f: string, v: string) => { const terms=[...(data.terms??[])]; terms[i]={...terms[i],[f]:v}; set("terms",terms); };
  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-200 text-sm font-medium">
        {["content","design"].map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 capitalize ${tab===t?"border-b-2 border-violet-600 text-violet-600":"text-slate-500"}`}>{t}</button>)}
      </div>
      {tab === "content" ? (
        <div className="space-y-3">
          <Field label="Tiêu đề *"><Inp value={data.title} onChange={v => set("title",v)} /></Field>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.showSearch??false} onChange={e => set("showSearch",e.target.checked)} />Tìm kiếm</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.showFilter??false} onChange={e => set("showFilter",e.target.checked)} />Filter</label>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Thuật ngữ</span>
              <Button size="sm" variant="outline" onClick={() => set("terms",[...(data.terms??[]),{term:"Thuật ngữ",definition:""}])}><Plus className="w-3 h-3"/>Thêm</Button>
            </div>
            {(data.terms??[]).map((t: any, i: number) => (
              <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex justify-between"><span className="text-xs text-slate-500">{t.term}</span><Button variant="ghost" size="sm" onClick={() => set("terms",(data.terms??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button></div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Thuật ngữ"><Inp value={t.term} onChange={v => updateTerm(i,"term",v)} /></Field>
                  <Field label="Danh mục"><Inp value={t.category??""} onChange={v => updateTerm(i,"category",v)} /></Field>
                </div>
                <Field label="Định nghĩa *"><Txt value={t.definition} onChange={v => updateTerm(i,"definition",v)} rows={3} /></Field>
                <Field label="Ví dụ"><Txt value={t.example??""} onChange={v => updateTerm(i,"example",v)} rows={2} /></Field>
              </div>
            ))}
          </div>
        </div>
      ) : <BlockSettingsEditor settings={data.settings} onChange={v => set("settings", v)} />}
    </div>
  );
}
