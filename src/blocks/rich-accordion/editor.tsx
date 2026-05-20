"use client";
import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor } from "@/components/cms/block-editors/shared";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function RichAccordionEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const [tab, setTab] = useState("content");
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const update = (i: number, f: string, v: any) => { const items=[...(data.items??[])]; items[i]={...items[i],[f]:v}; set("items",items); };
  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-200 text-sm font-medium">
        {["content","design"].map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 capitalize ${tab===t?"border-b-2 border-violet-600 text-violet-600":"text-slate-500"}`}>{t}</button>)}
      </div>
      {tab === "content" ? (
        <div className="space-y-3">
          <Field label="Section label"><Inp value={data.sectionLabel??""} onChange={v => set("sectionLabel",v)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Title"><Inp value={data.title??""} onChange={v => set("title",v)} /></Field>
            <Field label="Title Highlight"><Inp value={data.titleHighlight??""} onChange={v => set("titleHighlight",v)} /></Field>
          </div>
          <Field label="Subtitle"><Inp value={data.subtitle??""} onChange={v => set("subtitle",v)} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.allowMultiple??false} onChange={e => set("allowMultiple",e.target.checked)} />Cho phép mở nhiều mục</label>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Các mục</span>
              <Button size="sm" variant="outline" onClick={() => set("items",[...(data.items??[]),{heading:"Tiêu đề",body:"Nội dung"}])}><Plus className="w-3 h-3"/>Thêm</Button>
            </div>
            {(data.items??[]).map((item: any, i: number) => (
              <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex justify-between"><span className="text-xs text-slate-500">{item.heading}</span><Button variant="ghost" size="sm" onClick={() => set("items",(data.items??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button></div>
                <div className="grid grid-cols-4 gap-2">
                  <Field label="Icon"><Inp value={item.icon??""} onChange={v => update(i,"icon",v)} placeholder="💡" /></Field>
                  <div className="col-span-3"><Field label="Tiêu đề"><Inp value={item.heading} onChange={v => update(i,"heading",v)} /></Field></div>
                </div>
                <Field label="Nội dung"><Txt value={item.body} onChange={v => update(i,"body",v)} rows={3} /></Field>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={item.defaultOpen??false} onChange={e => update(i,"defaultOpen",e.target.checked)} />Mở mặc định</label>
              </div>
            ))}
          </div>
        </div>
      ) : <BlockSettingsEditor settings={data.settings} onChange={v => set("settings", v)} />}
    </div>
  );
}
