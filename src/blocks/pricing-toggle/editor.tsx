"use client";
import React from "react";
import { Field, Inp, Txt, ActionPicker } from "@/components/cms/block-editors/shared";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PricingToggleEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const updatePlan = (i: number, f: string, v: any) => { const plans=[...(data.plans??[])]; plans[i]={...plans[i],[f]:v}; set("plans",plans); };
  const updateFeatures = (i: number, raw: string) => updatePlan(i,"features",raw.split("\n").filter(Boolean));
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Field label="Section label"><Inp value={data.sectionLabel??""} onChange={v => set("sectionLabel",v)} /></Field>
          <Field label="Title *"><Inp value={data.title} onChange={v => set("title",v)} /></Field>
        </div>
        <Field label="Subtitle"><Inp value={data.subtitle??""} onChange={v => set("subtitle",v)} /></Field>
        
        <div className="grid grid-cols-3 gap-2 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
          <Field label="Nhãn Tháng"><Inp value={data.monthlyLabel ?? "Tháng"} onChange={v => set("monthlyLabel",v)} /></Field>
          <Field label="Nhãn Năm"><Inp value={data.yearlyLabel ?? "Năm"} onChange={v => set("yearlyLabel",v)} /></Field>
          <Field label="Badge tiết kiệm"><Inp value={data.savingsBadge??""} onChange={v => set("savingsBadge",v)} placeholder="Tiết kiệm 20%" /></Field>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Gói dịch vụ</span>
            <Button size="sm" variant="outline" onClick={() => set("plans",[...(data.plans??[]),{name:"Gói mới",monthlyPrice:0,annualPrice:0,currency:"₫",features:[],ctaText:"Bắt đầu"}])}><Plus className="w-3 h-3"/>Thêm</Button>
          </div>
          {(data.plans??[]).map((plan: any, i: number) => (
            <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex justify-between"><span className="text-xs text-slate-500">{plan.name}</span><Button variant="ghost" size="sm" onClick={() => set("plans",(data.plans??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button></div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Tên gói"><Inp value={plan.name} onChange={v => updatePlan(i,"name",v)} /></Field>
                <Field label="Mô tả"><Inp value={plan.description??""} onChange={v => updatePlan(i,"description",v)} /></Field>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Field label="Ký hiệu tiền"><Inp value={plan.currency} onChange={v => updatePlan(i,"currency",v)} placeholder="₫" /></Field>
                <Field label="Giá tháng"><Inp type="number" value={plan.monthlyPrice} onChange={v => updatePlan(i,"monthlyPrice",Number(v))} /></Field>
                <Field label="Giá năm"><Inp type="number" value={plan.annualPrice} onChange={v => updatePlan(i,"annualPrice",Number(v))} /></Field>
              </div>
              <Field label="Tính năng (mỗi dòng 1 item)"><Txt value={(plan.features??[]).join("\n")} onChange={v => updateFeatures(i,v)} rows={4} /></Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Text CTA"><Inp value={plan.ctaText} onChange={v => updatePlan(i,"ctaText",v)} /></Field>
                <ActionPicker label="Action CTA" value={plan.ctaAction} onChange={v => updatePlan(i,"ctaAction",v)} />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={plan.popular??false} onChange={e => updatePlan(i,"popular",e.target.checked)} />Nổi bật</label>
                {plan.popular && <Field label="Badge text"><Inp value={plan.badge??""} onChange={v => updatePlan(i,"badge",v)} placeholder="Phổ biến nhất" /></Field>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
