"use client";
import React from "react";
import { Field, Inp, Txt, ActionPicker } from "@/components/cms/block-editors/shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function DownloadCardsEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const updateRes = (i: number, f: string, v: any) => { const res=[...(data.resources??[])]; res[i]={...res[i],[f]:v}; set("resources",res); };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Field label="Section label"><Inp value={data.sectionLabel??""} onChange={v => set("sectionLabel",v)} /></Field>
        <Field label="Title *"><Inp value={data.title} onChange={v => set("title",v)} /></Field>
      </div>
      <Field label="Subtitle"><Inp value={data.subtitle??""} onChange={v => set("subtitle",v)} /></Field>
      <Field label="Cột">
        <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={data.columns??3} onChange={e => set("columns",Number(e.target.value))}>
          <option value={2}>2</option><option value={3}>3</option>
        </select>
      </Field>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>Tài nguyên</span>
          <Button size="sm" variant="outline" onClick={() => set("resources",[...(data.resources??[]),{title:"Tài nguyên mới",description:"",fileType:"pdf",fileSize:"1 MB"}])}><Plus className="w-3 h-3"/>Thêm</Button>
        </div>
        {(data.resources??[]).map((r: any, i: number) => (
          <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
            <div className="flex justify-between"><span className="text-xs text-slate-500">{r.title}</span><Button variant="ghost" size="sm" onClick={() => set("resources",(data.resources??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button></div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Tiêu đề"><Inp value={r.title} onChange={v => updateRes(i,"title",v)} /></Field>
              <Field label="Loại file">
                <select className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm" value={r.fileType} onChange={e => updateRes(i,"fileType",e.target.value)}>
                  {["pdf","doc","xls","zip","video"].map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Mô tả"><Txt value={r.description} onChange={v => updateRes(i,"description",v)} rows={2} /></Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Dung lượng"><Inp value={r.fileSize} onChange={v => updateRes(i,"fileSize",v)} placeholder="2.4 MB" /></Field>
              <ActionPicker label="Download action" value={r.downloadAction} onChange={v => updateRes(i,"downloadAction",v)} />
            </div>
            <Field label="Thumbnail">
              <div className="flex gap-2"><Inp value={r.thumbnailUrl??""} onChange={v => updateRes(i,"thumbnailUrl",v)} /><MediaPicker onSelect={url => updateRes(i,"thumbnailUrl",url)} /></div>
            </Field>
          </div>
        ))}
      </div>
    </div>
  );
}
