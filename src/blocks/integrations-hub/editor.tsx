"use client";
import React, { useState } from "react";
import { Field, Inp, BlockSettingsEditor, ActionPicker } from "@/components/cms/block-editors/shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function IntegrationsHubEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const [tab, setTab] = useState("content");
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const updateInt = (i: number, f: string, v: any) => { const ints=[...(data.integrations??[])]; ints[i]={...ints[i],[f]:v}; set("integrations",ints); };
  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-200 text-sm font-medium">
        {["content","design"].map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 capitalize ${tab===t?"border-b-2 border-violet-600 text-violet-600":"text-slate-500"}`}>{t}</button>)}
      </div>
      {tab === "content" ? (
        <div className="space-y-3">
          <Field label="Title *"><Inp value={data.title} onChange={v => set("title",v)} /></Field>
          <Field label="Danh mục (dấu phẩy)"><Inp value={(data.categories??[]).join(",")} onChange={v => set("categories",v.split(",").map((s:string)=>s.trim()).filter(Boolean))} placeholder="Analytics, CRM, Payment" /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.showSearch??false} onChange={e => set("showSearch",e.target.checked)} />Hiện tìm kiếm</label>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Tích hợp</span>
              <Button size="sm" variant="outline" onClick={() => set("integrations",[...(data.integrations??[]),{name:"Tích hợp mới",logo:"",category:"",featured:false}])}><Plus className="w-3 h-3"/>Thêm</Button>
            </div>
            {(data.integrations??[]).map((item: any, i: number) => (
              <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex justify-between"><span className="text-xs text-slate-500">{item.name}</span><Button variant="ghost" size="sm" onClick={() => set("integrations",(data.integrations??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button></div>
                <div className="grid grid-cols-3 gap-2">
                  <Field label="Tên"><Inp value={item.name} onChange={v => updateInt(i,"name",v)} /></Field>
                  <Field label="Danh mục"><Inp value={item.category} onChange={v => updateInt(i,"category",v)} /></Field>
                  <Field label="Mô tả"><Inp value={item.description??""} onChange={v => updateInt(i,"description",v)} /></Field>
                </div>
                <Field label="Logo">
                  <div className="flex gap-2"><Inp value={item.logo} onChange={v => updateInt(i,"logo",v)} /><MediaPicker onSelect={url => updateInt(i,"logo",url)} /></div>
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <ActionPicker label="Action (click)" value={item.action} onChange={v => updateInt(i,"action",v)} />
                  <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={item.featured??false} onChange={e => updateInt(i,"featured",e.target.checked)} />Nổi bật</label></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : <BlockSettingsEditor settings={data.settings} onChange={v => set("settings", v)} />}
    </div>
  );
}
