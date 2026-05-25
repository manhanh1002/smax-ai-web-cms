"use client";
import React from "react";
import { Field, Inp, Txt, ActionPicker } from "@/components/cms/block-editors/shared";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconPicker } from "@/components/cms/IconPicker";

export function PricingToggleEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const updatePlan = (i: number, f: string, v: any) => { const plans=[...(data.plans??[])]; plans[i]={...plans[i],[f]:v}; set("plans",plans); };
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Field label="Section label"><Inp value={data.sectionLabel??""} onChange={v => set("sectionLabel",v)} /></Field>
          <Field label="Title *"><Inp value={data.title} onChange={v => set("title",v)} /></Field>
        </div>
        <Field label="Subtitle"><Inp value={data.subtitle??""} onChange={v => set("subtitle",v)} /></Field>
        
        <div className="grid grid-cols-3 gap-2 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
          <Field label="Nhãn Tháng"><Inp value={data.monthlyLabel ?? ""} onChange={v => set("monthlyLabel",v)} placeholder="Tháng" /></Field>
          <Field label="Nhãn Năm"><Inp value={data.yearlyLabel ?? ""} onChange={v => set("yearlyLabel",v)} placeholder="Năm" /></Field>
          <Field label="Badge tiết kiệm"><Inp value={data.savingsBadge??""} onChange={v => set("savingsBadge",v)} placeholder="Tiết kiệm 20%" /></Field>
        </div>
 
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Gói dịch vụ</span>
            <Button size="sm" variant="outline" onClick={() => set("plans",[...(data.plans??[]),{name:"Gói mới",monthlyPrice:0,annualPrice:0,currency:"₫",features:[],ctaText:"Bắt đầu"}])}><Plus className="w-3 h-3"/>Thêm</Button>
          </div>
          {(data.plans??[]).map((plan: any, i: number) => {
            const rawFeatures = plan.features ?? [];
            const normalizedFeatures = rawFeatures.map((f: any) => {
              if (typeof f === "string") {
                return { text: f, icon: "Check" };
              }
              return { text: f.text || "", icon: f.icon || "Check" };
            });

            return (
              <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-3">
                <div className="flex justify-between"><span className="text-xs text-slate-500 font-bold">{plan.name}</span><Button variant="ghost" size="sm" onClick={() => set("plans",(data.plans??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button></div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Tên gói"><Inp value={plan.name} onChange={v => updatePlan(i,"name",v)} /></Field>
                  <Field label="Mô tả"><Inp value={plan.description??""} onChange={v => updatePlan(i,"description",v)} /></Field>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Field label="Ký hiệu tiền"><Inp value={plan.currency} onChange={v => updatePlan(i,"currency",v)} placeholder="₫" /></Field>
                  <Field label="Giá tháng"><Inp type="number" value={plan.monthlyPrice} onChange={v => updatePlan(i,"monthlyPrice",Number(v))} /></Field>
                  <Field label="Giá năm"><Inp type="number" value={plan.annualPrice} onChange={v => updatePlan(i,"annualPrice",Number(v))} /></Field>
                </div>

                {/* Features Editor */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Danh sách tính năng</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      type="button"
                      className="h-7 text-[10px] uppercase font-black text-primary gap-1"
                      onClick={() => {
                        updatePlan(i, "features", [...normalizedFeatures, { text: "", icon: "Check" }]);
                      }}
                    >
                      <Plus className="w-3.5 h-3.5"/> Thêm tính năng
                    </Button>
                  </div>
                  {normalizedFeatures.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Chưa có tính năng nào</p>
                  ) : (
                    <div className="space-y-2">
                      {normalizedFeatures.map((feat: any, idx: number) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <div className="w-36 shrink-0">
                            <IconPicker 
                              value={feat.icon || "Check"} 
                              onChange={iconVal => {
                                const nextFeats = [...normalizedFeatures];
                                nextFeats[idx] = { ...nextFeats[idx], icon: iconVal };
                                updatePlan(i, "features", nextFeats);
                              }} 
                            />
                          </div>
                          <div className="flex-1">
                            <Inp 
                              value={feat.text} 
                              placeholder="Nhập tính năng..." 
                              className="h-9 text-xs px-2"
                              onChange={textVal => {
                                const nextFeats = [...normalizedFeatures];
                                nextFeats[idx] = { ...nextFeats[idx], text: textVal };
                                updatePlan(i, "features", nextFeats);
                              }} 
                            />
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            type="button"
                            className="h-9 w-9 text-red-500 hover:text-red-600 p-0"
                            onClick={() => {
                              const nextFeats = normalizedFeatures.filter((_: any, k: number) => k !== idx);
                              updatePlan(i, "features", nextFeats);
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5"/>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <Field label="Text CTA"><Inp value={plan.ctaText} onChange={v => updatePlan(i,"ctaText",v)} /></Field>
                  <ActionPicker label="Action CTA" value={plan.ctaAction} onChange={v => updatePlan(i,"ctaAction",v)} />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={plan.popular??false} onChange={e => updatePlan(i,"popular",e.target.checked)} />Nổi bật</label>
                  {plan.popular && <Field label="Badge text"><Inp value={plan.badge??""} onChange={v => updatePlan(i,"badge",v)} placeholder="Phổ biến nhất" /></Field>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
