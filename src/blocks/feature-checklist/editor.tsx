"use client";
import React from "react";
import { Field, Inp } from "@/components/cms/block-editors/shared";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FeatureChecklistEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const updateCol = (side: "A"|"B", field: string, val: any) => {
    const col = side==="A" ? data.columnA : data.columnB;
    const updated = {...col, [field]: val};
    set(side==="A"?"columnA":"columnB", updated);
  };
  const updateItem = (side: "A"|"B", i: number, field: string, val: any) => {
    const col = side==="A" ? data.columnA : data.columnB;
    const items = [...(col.items??[])]; items[i]={...items[i],[field]:val};
    updateCol(side, "items", items);
  };
  return (
    <div className="space-y-3">
      <Field label="Section label"><Inp value={data.sectionLabel??""} onChange={v => set("sectionLabel",v)} /></Field>
      <Field label="Title *"><Inp value={data.title} onChange={v => set("title",v)} /></Field>
      <Field label="Subtitle"><Inp value={data.subtitle??""} onChange={v => set("subtitle",v)} /></Field>
      {(["A","B"] as const).map(side => {
        const col = side==="A" ? data.columnA : data.columnB;
        return (
          <div key={side} className="border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-sm">Cột {side}</h4>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Tiêu đề"><Inp value={col?.label??""} onChange={v => updateCol(side,"label",v)} /></Field>
              <Field label="Mô tả phụ"><Inp value={col?.sublabel??""} onChange={v => updateCol(side,"sublabel",v)} /></Field>
            </div>
            <div className="space-y-2">
              {(col?.items??[]).map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="checkbox" checked={item.checked} onChange={e => updateItem(side,i,"checked",e.target.checked)} />
                  <Inp value={item.text} onChange={v => updateItem(side,i,"text",v)} />
                  <Button variant="ghost" size="sm" onClick={() => updateCol(side,"items",(col.items??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button>
                </div>
              ))}
              <Button size="sm" variant="outline" className="w-full" onClick={() => updateCol(side,"items",[...(col?.items??[]),{text:"Tính năng",checked:true}])}><Plus className="w-3 h-3"/>Thêm</Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
