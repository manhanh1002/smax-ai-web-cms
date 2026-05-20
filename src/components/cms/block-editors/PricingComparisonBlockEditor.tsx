import React from "react";
import { Field, Inp, Txt, DarkToggle } from "./shared";
import { Plus, Trash2 } from "lucide-react";

export function PricingComparisonBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const plans = data.plans || [];
  const upPlan = (i: number, patch: any) => { 
    const n = [...plans]; 
    n[i] = { ...n[i], ...patch }; 
    onChange({ ...data, plans: n }); 
  };
  
  return (
    <div className="space-y-6">
      <DarkToggle value={data.darkMode === true} onChange={v => onChange({ ...data, darkMode: v })} />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Badge"><Inp value={data.badge} onChange={v => onChange({ ...data, badge: v })} /></Field>
          <div className="col-span-2"><Field label="Tiêu đề"><Inp value={data.title} onChange={v => onChange({ ...data, title: v })} /></Field></div>
          <div className="col-span-2"><Field label="Mô tả phụ"><Txt value={data.subtitle} onChange={v => onChange({ ...data, subtitle: v })} rows={2} /></Field></div>
        </div>
        <div className="space-y-4">
          {plans.map((plan: any, i: number) => (
            <div key={i} className="p-4 border border-slate-200 rounded-2xl bg-white space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer">
                  <input type="checkbox" checked={plan.highlighted} onChange={e => upPlan(i, { highlighted: e.target.checked })} className="rounded text-primary" />
                  Nổi bật?
                </label>
                <button onClick={() => onChange({ ...data, plans: plans.filter((_: any, j: number) => j !== i) })}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Tên gói"><Inp value={plan.name} onChange={v => upPlan(i, { name: v })} /></Field>
                <Field label="Nút bấm"><Inp value={plan.btnText} onChange={v => upPlan(i, { btnText: v })} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Giá (VD: 500k)"><Inp value={plan.price} onChange={v => upPlan(i, { price: v })} /></Field>
                <Field label="Đơn vị (VD: tháng)"><Inp value={plan.period} onChange={v => upPlan(i, { period: v })} /></Field>
              </div>
              <Field label="Mô tả ngắn"><Txt value={plan.description} onChange={v => upPlan(i, { description: v })} rows={2} /></Field>
              <Field label="Các tính năng (dấu phẩy)">
                <Inp value={(plan.features || []).join(", ")} onChange={v => upPlan(i, { features: v.split(",").map((s: string) => s.trim()) })} />
              </Field>
            </div>
          ))}
          {plans.length < 3 && (
            <button 
              onClick={() => onChange({ ...data, plans: [...plans, { name: "", price: "", period: "", description: "", features: [], btnText: "Mua ngay" }] })}
              className="w-full h-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-primary hover:text-primary text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" /> Thêm Gói giá
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
