"use client";
import React from "react";
import { Field, Inp, ActionPicker } from "@/components/cms/block-editors/shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PageHeaderEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const updateCrumb = (i: number, field: string, val: any) => { const b=[...(data.breadcrumbs??[])]; b[i]={...b[i],[field]:val}; set("breadcrumbs",b); };
  return (
    <div className="space-y-3">
      <Field label="Title *"><Inp value={data.title} onChange={v => set("title", v)} /></Field>
      <Field label="Subtitle"><Inp value={data.subtitle ?? ""} onChange={v => set("subtitle", v)} /></Field>
      <Field label="Tags (dấu phẩy)"><Inp value={(data.tags??[]).join(",")} onChange={v => set("tags", v.split(",").map((s:string)=>s.trim()).filter(Boolean))} /></Field>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Tên tác giả"><Inp value={data.authorName ?? ""} onChange={v => set("authorName", v)} /></Field>
        <Field label="Ngày đăng"><Inp value={data.publishDate ?? ""} onChange={v => set("publishDate", v)} /></Field>
        <Field label="Thời gian đọc"><Inp value={data.readTime ?? ""} onChange={v => set("readTime", v)} /></Field>
      </div>
      <Field label="Avatar tác giả">
        <div className="flex gap-2"><Inp value={data.authorAvatar ?? ""} onChange={v => set("authorAvatar", v)} /><MediaPicker onSelect={url => set("authorAvatar", url)} /></div>
      </Field>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>Breadcrumbs</span>
          <Button size="sm" variant="outline" onClick={() => set("breadcrumbs",[...(data.breadcrumbs??[]),{label:"Trang"}])}><Plus className="w-3 h-3"/>Thêm</Button>
        </div>
        {(data.breadcrumbs??[]).map((c:any,i:number) => (
          <div key={i} className="flex gap-2 items-center">
            <Inp value={c.label} onChange={v => updateCrumb(i,"label",v)} placeholder="Tên" />
            <ActionPicker label="" value={c.action} onChange={v => updateCrumb(i,"action",v)} />
            <Button variant="ghost" size="sm" onClick={() => set("breadcrumbs",(data.breadcrumbs??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button>
          </div>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.alignment==="center"} onChange={e => set("alignment",e.target.checked?"center":"left")} /> Căn giữa</label>
    </div>
  );
}
