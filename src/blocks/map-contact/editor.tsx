"use client";
import React from "react";
import { Field, Inp, Txt } from "@/components/cms/block-editors/shared";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function MapContactEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const updateOffice = (i: number, f: string, v: string) => { const offices=[...(data.offices??[])]; offices[i]={...offices[i],[f]:v}; set("offices",offices); };
  return (
    <div className="space-y-3">
      <Field label="Tiêu đề"><Inp value={data.title??""} onChange={v => set("title",v)} /></Field>
      <Field label="Google Maps Embed URL *">
        <Txt value={data.mapEmbedUrl} onChange={v => set("mapEmbedUrl",v)} rows={2} placeholder="https://www.google.com/maps/embed?pb=..." />
        <p className="text-xs text-slate-500 mt-1">Google Maps → Share → Embed → Copy iframe src</p>
      </Field>
      <Field label="Layout">
        <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={data.layout??"map-left"} onChange={e => set("layout",e.target.value)}>
          <option value="map-left">Map bên trái</option><option value="map-right">Map bên phải</option><option value="full-width">Full width</option>
        </select>
      </Field>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>Văn phòng</span>
          <Button size="sm" variant="outline" onClick={() => set("offices",[...(data.offices??[]),{name:"Văn phòng",address:"",phone:"",email:""}])}><Plus className="w-3 h-3"/>Thêm</Button>
        </div>
        {(data.offices??[]).map((o: any, i: number) => (
          <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
            <div className="flex justify-between"><span className="text-xs text-slate-500">{o.name}</span><Button variant="ghost" size="sm" onClick={() => set("offices",(data.offices??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button></div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Tên"><Inp value={o.name} onChange={v => updateOffice(i,"name",v)} /></Field>
              <Field label="Giờ hoạt động"><Inp value={o.hours??""} onChange={v => updateOffice(i,"hours",v)} placeholder="Mon-Fri 9-5" /></Field>
            </div>
            <Field label="Địa chỉ"><Inp value={o.address} onChange={v => updateOffice(i,"address",v)} /></Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="SĐT"><Inp value={o.phone} onChange={v => updateOffice(i,"phone",v)} /></Field>
              <Field label="Email"><Inp value={o.email} onChange={v => updateOffice(i,"email",v)} /></Field>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
