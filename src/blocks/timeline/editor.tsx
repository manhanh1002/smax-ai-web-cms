"use client";
import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor } from "@/components/cms/block-editors/shared";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function TimelineEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const [tab, setTab] = useState("content");
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const updateItem = (i: number, field: string, val: any) => { const items=[...(data.items??[])]; items[i]={...items[i],[field]:val}; set("items",items); };
  const addItem = () => set("items",[...(data.items??[]),{year:"2025",title:"Mốc mới",description:"",icon:"",highlight:false}]);
  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-200 text-sm font-medium">
        {["content","design"].map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 capitalize ${tab===t?"border-b-2 border-violet-600 text-violet-600":"text-slate-500"}`}>{t}</button>)}
      </div>
      {tab === "content" ? (
        <div className="space-y-3">
          <Field label="Section label"><Inp value={data.sectionLabel ?? ""} onChange={v => set("sectionLabel", v)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Title *"><Inp value={data.title} onChange={v => set("title", v)} /></Field>
            <Field label="Title Highlight"><Inp value={data.titleHighlight??""} onChange={v => set("titleHighlight",v)} /></Field>
          </div>
          <Field label="Subtitle"><Inp value={data.subtitle ?? ""} onChange={v => set("subtitle", v)} /></Field>
          <Field label="Hướng">
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={data.orientation ?? "vertical"} onChange={e => set("orientation",e.target.value)}>
              <option value="vertical">Dọc</option><option value="horizontal">Ngang</option>
            </select>
          </Field>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Các mốc</span>
              <Button size="sm" variant="outline" onClick={addItem}><Plus className="w-3 h-3"/>Thêm</Button>
            </div>
            {(data.items??[]).map((item: any, i: number) => (
              <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-center"><span className="text-xs text-slate-500">Mốc {i+1}</span><Button variant="ghost" size="sm" onClick={() => set("items",(data.items??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button></div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Năm/Ngày"><Inp value={item.year} onChange={v => updateItem(i,"year",v)} /></Field>
                  <Field label="Tiêu đề"><Inp value={item.title} onChange={v => updateItem(i,"title",v)} /></Field>
                </div>
                <Field label="Mô tả"><Txt value={item.description} onChange={v => updateItem(i,"description",v)} rows={2} /></Field>
                <div className="flex gap-3 items-center">
                  <Field label="Icon"><Inp value={item.icon ?? ""} onChange={v => updateItem(i,"icon",v)} placeholder="🚀" /></Field>
                  <label className="flex items-center gap-2 text-sm pt-5"><input type="checkbox" checked={item.highlight??false} onChange={e => updateItem(i,"highlight",e.target.checked)} />Nổi bật</label>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : <BlockSettingsEditor settings={data.settings} onChange={v => set("settings", v)} />}
    </div>
  );
}
