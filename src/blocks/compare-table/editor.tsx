"use client";
import React from "react";
import { Field, Inp } from "@/components/cms/block-editors/shared";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CompareTableEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const colCount = (data.plans??[]).length;

  const updatePlan = (i: number, v: string) => { const p=[...(data.plans??[])]; p[i]=v; set("plans",p); };
  const updateCatName = (ci: number, v: string) => { const cats=[...(data.categories??[])]; cats[ci]={...cats[ci],name:v}; set("categories",cats); };
  const updateFeature = (ci: number, fi: number, field: string, v: any) => {
    const cats=[...(data.categories??[])];
    const feats=[...(cats[ci].features??[])];
    feats[fi]={...feats[fi],[field]:v};
    cats[ci]={...cats[ci],features:feats};
    set("categories",cats);
  };
  const updateValue = (ci: number, fi: number, vi: number, v: string) => {
    const cats=[...(data.categories??[])];
    const feats=[...(cats[ci].features??[])];
    const vals=[...(feats[fi].values??[])];
    vals[vi] = v==="true" ? true : v==="false" ? false : v;
    feats[fi]={...feats[fi],values:vals};
    cats[ci]={...cats[ci],features:feats};
    set("categories",cats);
  };
  const addFeature = (ci: number) => {
    const cats=[...(data.categories??[])];
    cats[ci]={...cats[ci],features:[...(cats[ci].features??[]),{label:"Tính năng",values:Array(colCount).fill("")}]};
    set("categories",cats);
  };
  const removeFeature = (ci: number, fi: number) => {
    const cats=[...(data.categories??[])];
    cats[ci]={...cats[ci],features:(cats[ci].features??[]).filter((_:any,i:number)=>i!==fi)};
    set("categories",cats);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Field label="Section label"><Inp value={data.sectionLabel??""} onChange={v => set("sectionLabel",v)} /></Field>
        <Field label="Title Highlight"><Inp value={data.titleHighlight??""} onChange={v => set("titleHighlight",v)} /></Field>
        <div className="col-span-2"><Field label="Title *"><Inp value={data.title} onChange={v => set("title",v)} /></Field></div>
        <div className="col-span-2"><Field label="Subtitle"><Inp value={data.subtitle??""} onChange={v => set("subtitle",v)} /></Field></div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>Gói / Cột</span>
          <Button size="sm" variant="outline" onClick={() => set("plans",[...(data.plans??[]),"Gói mới"])}><Plus className="w-3 h-3"/>Thêm</Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(data.plans??[]).map((plan: string, i: number) => (
            <div key={i} className="flex gap-1 items-center">
              <Inp value={plan} onChange={v => updatePlan(i,v)} placeholder="Tên gói" className="w-28" />
              <Button variant="ghost" size="sm" onClick={() => set("plans",(data.plans??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button>
            </div>
          ))}
        </div>
        <Field label="Highlight cột (số, bắt đầu từ 0)">
          <Inp type="number" value={data.highlightCol??0} onChange={v => set("highlightCol",parseInt(v))} min={0} max={Math.max(0,(data.plans?.length??1)-1)} />
        </Field>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>Danh mục tính năng</span>
          <Button size="sm" variant="outline" onClick={() => set("categories",[...(data.categories??[]),{name:"Danh mục",features:[]}])}><Plus className="w-3 h-3"/>Thêm</Button>
        </div>
        {(data.categories??[]).map((cat: any, ci: number) => (
          <div key={ci} className="border border-slate-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Inp value={cat.name} onChange={v => updateCatName(ci,v)} placeholder="Tên danh mục" className="flex-1 font-semibold" />
              <Button variant="ghost" size="sm" onClick={() => set("categories",(data.categories??[]).filter((_:any,i:number)=>i!==ci))}><Trash2 className="w-3 h-3"/></Button>
            </div>
            <div className="space-y-1.5 pl-2 border-l-2 border-slate-100">
              {(cat.features??[]).map((feat: any, fi: number) => (
                <div key={fi} className="space-y-1 bg-slate-50 rounded-lg p-2">
                  <div className="flex gap-2 items-center">
                    <Inp value={feat.label} onChange={v => updateFeature(ci,fi,"label",v)} placeholder="Tính năng" className="flex-1 text-xs" />
                    <Button variant="ghost" size="sm" onClick={() => removeFeature(ci,fi)}><Trash2 className="w-3 h-3"/></Button>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {(data.plans??[]).map((_: any, vi: number) => (
                      <Inp key={vi} value={String(feat.values?.[vi]??"")} onChange={v => updateValue(ci,fi,vi,v)}
                        placeholder={data.plans[vi]??`Cột ${vi+1}`} className="flex-1 min-w-[60px] text-xs" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">Nhập: true/false hoặc text tuỳ ý</p>
                </div>
              ))}
              <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => addFeature(ci)}><Plus className="w-3 h-3"/>Thêm tính năng</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
