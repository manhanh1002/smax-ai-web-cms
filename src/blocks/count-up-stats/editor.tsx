"use client";
import React from "react";
import { Field, Inp } from "@/components/cms/block-editors/shared";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CountUpStatsEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const updateStat = (i: number, f: string, v: any) => { const s=[...(data.stats??[])]; s[i]={...s[i],[f]:v}; set("stats",s); };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Field label="Section label"><Inp value={data.sectionLabel??""} onChange={v => set("sectionLabel",v)} /></Field>
        <Field label="Title Highlight"><Inp value={data.titleHighlight??""} onChange={v => set("titleHighlight",v)} /></Field>
        <div className="col-span-2"><Field label="Title"><Inp value={data.title??""} onChange={v => set("title",v)} /></Field></div>
      </div>
      <Field label="Subtitle"><Inp value={data.subtitle??""} onChange={v => set("subtitle",v)} /></Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Cột">
          <select className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm" value={data.columns??3} onChange={e => set("columns",Number(e.target.value))}>
            <option value={2}>2</option><option value={3}>3</option><option value={4}>4</option>
          </select>
        </Field>
        <Field label="Kiểu">
          <select className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm" value={data.layout??"cards"} onChange={e => set("layout",e.target.value)}>
            <option value="cards">Cards</option><option value="minimal">Tối giản</option>
          </select>
        </Field>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>Số liệu</span>
          <Button size="sm" variant="outline" onClick={() => set("stats",[...(data.stats??[]),{value:1000,suffix:"+",label:"Khách hàng"}])}><Plus className="w-3 h-3"/>Thêm</Button>
        </div>
        {(data.stats??[]).map((s: any, i: number) => (
          <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
            <div className="flex justify-between"><span className="text-xs text-slate-500">Số liệu {i+1}</span><Button variant="ghost" size="sm" onClick={() => set("stats",(data.stats??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button></div>
            <div className="grid grid-cols-4 gap-2">
              <Field label="Icon"><Inp value={s.icon??""} onChange={v => updateStat(i,"icon",v)} placeholder="📈" /></Field>
              <Field label="Prefix"><Inp value={s.prefix??""} onChange={v => updateStat(i,"prefix",v)} /></Field>
              <Field label="Giá trị"><Inp type="number" value={s.value} onChange={v => updateStat(i,"value",Number(v))} /></Field>
              <Field label="Suffix"><Inp value={s.suffix??""} onChange={v => updateStat(i,"suffix",v)} placeholder="+" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Nhãn"><Inp value={s.label} onChange={v => updateStat(i,"label",v)} /></Field>
              <Field label="Mô tả phụ"><Inp value={s.description??""} onChange={v => updateStat(i,"description",v)} /></Field>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
