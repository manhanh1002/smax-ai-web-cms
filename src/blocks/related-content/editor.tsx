"use client";
import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor, ActionPicker } from "@/components/cms/block-editors/shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function RelatedContentEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const [tab, setTab] = useState("content");
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const updateItem = (i: number, f: string, v: any) => { const items=[...(data.items??[])]; items[i]={...items[i],[f]:v}; set("items",items); };
  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-200 text-sm font-medium">
        {["content","design"].map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 capitalize ${tab===t?"border-b-2 border-violet-600 text-violet-600":"text-slate-500"}`}>{t}</button>)}
      </div>
      {tab === "content" ? (
        <div className="space-y-3">
          <Field label="Tiêu đề"><Inp value={data.title??""} onChange={v => set("title",v)} /></Field>
          <div className="grid grid-cols-3 gap-2">
            <Field label="Cột">
              <select className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm" value={data.columns??3} onChange={e => set("columns",Number(e.target.value))}>
                <option value={2}>2</option><option value={3}>3</option>
              </select>
            </Field>
            <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.showType??false} onChange={e => set("showType",e.target.checked)} />Loại</label></div>
            <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.showDate??false} onChange={e => set("showDate",e.target.checked)} />Ngày</label></div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Nội dung</span>
              <Button size="sm" variant="outline" onClick={() => set("items",[...(data.items??[]),{type:"blog",title:"Tiêu đề",thumbnail:""}])}><Plus className="w-3 h-3"/>Thêm</Button>
            </div>
            {(data.items??[]).map((item: any, i: number) => (
              <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex justify-between"><span className="text-xs text-slate-500">{item.title}</span><Button variant="ghost" size="sm" onClick={() => set("items",(data.items??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button></div>
                <div className="grid grid-cols-3 gap-2">
                  <Field label="Loại">
                    <select className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm" value={item.type} onChange={e => updateItem(i,"type",e.target.value)}>
                      {["blog","case-study","video","resource"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Tiêu đề"><Inp value={item.title} onChange={v => updateItem(i,"title",v)} /></Field>
                  <Field label="Tag"><Inp value={item.tag??""} onChange={v => updateItem(i,"tag",v)} /></Field>
                </div>
                <Field label="Thumbnail">
                  <div className="flex gap-2"><Inp value={item.thumbnail} onChange={v => updateItem(i,"thumbnail",v)} /><MediaPicker onSelect={url => updateItem(i,"thumbnail",url)} /></div>
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  {data.showDate && <Field label="Ngày"><Inp value={item.date??""} onChange={v => updateItem(i,"date",v)} /></Field>}
                  <ActionPicker label="Action (link)" value={item.action} onChange={v => updateItem(i,"action",v)} />
                </div>
                <Field label="Excerpt"><Txt value={item.excerpt??""} onChange={v => updateItem(i,"excerpt",v)} rows={2} /></Field>
              </div>
            ))}
          </div>
        </div>
      ) : <BlockSettingsEditor settings={data.settings} onChange={v => set("settings", v)} />}
    </div>
  );
}
