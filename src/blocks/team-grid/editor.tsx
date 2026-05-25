"use client";
import React from "react";
import { Field, Inp, Txt } from "@/components/cms/block-editors/shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function TeamGridEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const updateMember = (i: number, field: string, val: any) => { const members=[...(data.members??[])]; members[i]={...members[i],[field]:val}; set("members",members); };
  return (
    <div className="space-y-3">
      <Field label="Section label"><Inp value={data.sectionLabel ?? ""} onChange={v => set("sectionLabel", v)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Title *"><Inp value={data.title} onChange={v => set("title", v)} /></Field>
        <Field label="Title Highlight"><Inp value={data.titleHighlight??""} onChange={v => set("titleHighlight",v)} /></Field>
      </div>
      <Field label="Subtitle"><Inp value={data.subtitle ?? ""} onChange={v => set("subtitle", v)} /></Field>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Cột">
          <select className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm" value={data.columns??3} onChange={e => set("columns",Number(e.target.value))}>
            <option value={3}>3</option><option value={4}>4</option>
          </select>
        </Field>
        <Field label="Avatar">
          <select className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm" value={data.avatarShape??"circle"} onChange={e => set("avatarShape",e.target.value)}>
            <option value="circle">Tròn</option><option value="rounded">Vuông</option>
          </select>
        </Field>
        <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.showBio??false} onChange={e => set("showBio",e.target.checked)} />Bio</label></div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>Thành viên</span>
          <Button size="sm" variant="outline" onClick={() => set("members",[...(data.members??[]),{name:"Tên",role:"Chức danh"}])}><Plus className="w-3 h-3"/>Thêm</Button>
        </div>
        {(data.members??[]).map((m: any, i: number) => (
          <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
            <div className="flex justify-between"><span className="text-xs text-slate-500">{m.name}</span><Button variant="ghost" size="sm" onClick={() => set("members",(data.members??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button></div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Tên"><Inp value={m.name} onChange={v => updateMember(i,"name",v)} /></Field>
              <Field label="Chức danh"><Inp value={m.role} onChange={v => updateMember(i,"role",v)} /></Field>
            </div>
            <Field label="Avatar">
              <div className="flex gap-2"><Inp value={m.avatar??""} onChange={v => updateMember(i,"avatar",v)} /><MediaPicker onSelect={url => updateMember(i,"avatar",url)} /></div>
            </Field>
            {data.showBio && <Field label="Bio"><Txt value={m.bio??""} onChange={v => updateMember(i,"bio",v)} rows={2} /></Field>}
            <div className="grid grid-cols-2 gap-2">
              <Field label="LinkedIn"><Inp value={m.linkedin??""} onChange={v => updateMember(i,"linkedin",v)} /></Field>
              <Field label="Twitter"><Inp value={m.twitter??""} onChange={v => updateMember(i,"twitter",v)} /></Field>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
