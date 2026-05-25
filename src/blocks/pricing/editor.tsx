"use client";

import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor, ActionPicker } from "@/components/cms/block-editors/shared";
import { Type, LayoutTemplate, Plus, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { PricingBlockData } from "./definition";
import { BlockData } from "../types";

export function PricingEditor({ data, onChange }: { data: BlockData<PricingBlockData>; onChange: (d: BlockData<PricingBlockData>) => void }) {
  const [activeCatIdx, setActiveCatIdx] = useState(0);
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });
  
  const categories = data.categories || [];
  const currentCategory = categories[activeCatIdx] || categories[0];

  const addCategory = () => {
    const next = [...categories];
    next.push({
      id: Math.random().toString(36).substr(2, 9),
      name: "Dịch vụ mới",
      plans: []
    });
    u("categories", next);
    setActiveCatIdx(next.length - 1);
  };

  const removeCategory = (idx: number) => {
    if (categories.length <= 1) return;
    const next = [...categories];
    next.splice(idx, 1);
    u("categories", next);
    setActiveCatIdx(0);
  };

  const updateCategory = (idx: number, key: string, val: any) => {
    const next = [...categories];
    next[idx] = { ...next[idx], [key]: val };
    u("categories", next);
  };

  const addPlan = () => {
    if (!currentCategory) return;
    const nextCats = [...categories];
    const plans = [...(currentCategory.plans || [])];
    plans.push({ name: "Gói mới", priceMonthly: "0", priceYearly: "0", features: [], btnText: "Mua ngay" });
    nextCats[activeCatIdx] = { ...currentCategory, plans };
    u("categories", nextCats);
  };

  const removePlan = (pIdx: number) => {
    const nextCats = [...categories];
    const plans = [...(currentCategory.plans || [])];
    plans.splice(pIdx, 1);
    nextCats[activeCatIdx] = { ...currentCategory, plans };
    u("categories", nextCats);
  };

  const updatePlan = (pIdx: number, key: string, val: any) => {
    const nextCats = [...categories];
    const plans = [...(currentCategory.plans || [])];
    plans[pIdx] = { ...plans[pIdx], [key]: val };
    nextCats[activeCatIdx] = { ...currentCategory, plans };
    u("categories", nextCats);
  };

  return (
    <div className="space-y-6">
      {/* Pricing switcher configuration */}
      <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
        <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Cấu hình chung</label>
        <div className="flex items-center gap-2 mb-4">
          <input 
            type="checkbox" 
            checked={!!data.showSwitcher} 
            onChange={e => u("showSwitcher", e.target.checked)} 
            id="show-switcher" 
            className="w-4 h-4"
          />
          <label htmlFor="show-switcher" className="text-sm font-bold">Hiển thị nút gạt Tháng/Năm</label>
        </div>
        
        {data.showSwitcher && (
          <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
            <Field label="Nhãn Tháng"><Inp value={data.monthlyLabel || ""} onChange={v => u("monthlyLabel", v)} /></Field>
            <Field label="Nhãn Năm"><Inp value={data.yearlyLabel || ""} onChange={v => u("yearlyLabel", v)} /></Field>
            <div className="col-span-2">
              <Field label="Nhãn giảm giá (nếu có)"><Inp value={data.discountLabel || ""} onChange={v => u("discountLabel", v)} placeholder="Tiết kiệm 20%" /></Field>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 gap-4">
            <Field label="Badge"><Inp value={data.badge || ""} onChange={v => u("badge", v)} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tiêu đề chính"><Inp value={data.title || ""} onChange={v => u("title", v)} /></Field>
              <Field label="Tiêu đề Highlight"><Inp value={data.titleHighlight || ""} onChange={v => u("titleHighlight", v)} /></Field>
            </div>
            <Field label="Mô tả phụ"><Txt value={data.subtitle || ""} onChange={v => u("subtitle", v)} rows={2} /></Field>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Danh mục Dịch vụ</label>
              <Button variant="ghost" size="sm" onClick={addCategory} className="text-blue-600 font-bold h-8"><Plus className="w-3.5 h-3.5 mr-1" /> Thêm danh mục</Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((cat: any, idx: number) => (
                <div key={cat.id} className="group relative">
                  <button
                    onClick={() => setActiveCatIdx(idx)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2",
                      activeCatIdx === idx ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                    )}
                  >
                    {cat.name}
                  </button>
                  {categories.length > 1 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeCategory(idx); }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full items-center justify-center hidden group-hover:flex shadow-lg"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {currentCategory && (
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-6 animate-in slide-in-from-top-2 duration-300">
                <Field label="Tên danh mục hiển thị">
                  <Inp value={currentCategory.name} onChange={v => updateCategory(activeCatIdx, "name", v)} />
                </Field>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Gói giá trong "{currentCategory.name}"</label>
                  </div>
                  
                  {currentCategory.plans?.map((plan: any, pIdx: number) => (
                    <div key={pIdx} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 relative shadow-sm">
                      <Button variant="ghost" size="sm" onClick={() => removePlan(pIdx)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Tên gói"><Inp value={plan.name || ""} onChange={v => updatePlan(pIdx, "name", v)} /></Field>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 pt-6">
                            <input type="checkbox" checked={!!plan.isPopular} onChange={e => updatePlan(pIdx, "isPopular", e.target.checked)} id={`pop-${activeCatIdx}-${pIdx}`} />
                            <label htmlFor={`pop-${activeCatIdx}-${pIdx}`} className="text-xs font-bold">Gói nổi bật?</label>
                          </div>
                          {plan.isPopular && (
                            <Inp value={plan.popularText || ""} onChange={v => updatePlan(pIdx, "popularText", v)} placeholder="PHỔ BIẾN NHẤT" />
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Giá theo Tháng"><Inp value={plan.priceMonthly || ""} onChange={v => updatePlan(pIdx, "priceMonthly", v)} /></Field>
                        <Field label="Giá theo Năm"><Inp value={plan.priceYearly || ""} onChange={v => updatePlan(pIdx, "priceYearly", v)} /></Field>
                      </div>

                      <Field label="Mô tả gói"><Inp value={plan.description || ""} onChange={v => updatePlan(pIdx, "description", v)} /></Field>

                      <Field label="Tính năng (Mỗi dòng 1 tính năng)">
                        <Txt value={(plan.features || []).join('\n')} onChange={v => updatePlan(pIdx, "features", v.split('\n'))} rows={3} />
                      </Field>

                      <div className="grid grid-cols-1 gap-4 pt-2 border-t border-slate-100">
                        <Field label="Tên nút bấm"><Inp value={plan.btnText || ""} onChange={v => updatePlan(pIdx, "btnText", v)} /></Field>
                        <ActionPicker label="Hành động khi nhấn nút" value={plan.btnUrl || ""} onChange={v => updatePlan(pIdx, "btnUrl", v)} />
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full border-dashed h-12 bg-white" onClick={addPlan}>
                    <Plus className="w-4 h-4 mr-2" /> Thêm Gói mới cho {currentCategory.name}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
