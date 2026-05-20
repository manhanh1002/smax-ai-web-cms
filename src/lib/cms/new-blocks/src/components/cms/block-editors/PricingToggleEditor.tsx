import React from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { PricingToggleData, PricingPlan } from "@/components/sections/PricingToggle";

const defaultPlan = (): PricingPlan => ({
  name: "Gói Cơ Bản", monthlyPrice: 299000, annualPrice: 2990000,
  currency: "₫", description: "Dành cho cá nhân và nhóm nhỏ",
  features: ["5 người dùng", "10GB lưu trữ", "Hỗ trợ email"],
  ctaText: "Bắt đầu ngay", ctaUrl: "#", popular: false, badge: "",
});

export function PricingToggleEditor({ data, onChange }: { data: PricingToggleData; onChange: (data: PricingToggleData) => void }) {
  const update = (updates: Partial<PricingToggleData>) => onChange({ ...data, ...updates });
  const updatePlan = (i: number, field: keyof PricingPlan, value: any) => {
    const plans = [...(data.plans ?? [])];
    plans[i] = { ...plans[i], [field]: value };
    update({ plans });
  };
  const updateFeatures = (i: number, raw: string) => updatePlan(i, "features", raw.split("\n").filter(Boolean));
  const addPlan = () => update({ plans: [...(data.plans ?? []), defaultPlan()] });
  const removePlan = (i: number) => update({ plans: (data.plans ?? []).filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <div className="space-y-2"><Label>Section label</Label><Input value={data.sectionLabel ?? ""} onChange={(e) => update({ sectionLabel: e.target.value })} placeholder="Bảng giá" /></div>
      <div className="space-y-2"><Label>Title *</Label><Input value={data.title} onChange={(e) => update({ title: e.target.value })} /></div>
      <div className="space-y-2"><Label>Subtitle</Label><Input value={data.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} /></div>
      <div className="space-y-2"><Label>Badge tiết kiệm (khi chọn năm)</Label><Input value={data.savingsBadge ?? ""} onChange={(e) => update({ savingsBadge: e.target.value })} placeholder="Tiết kiệm 20%" /></div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Các gói dịch vụ</Label>
          <Button size="sm" variant="outline" onClick={addPlan}>+ Thêm gói</Button>
        </div>
        {(data.plans ?? []).map((plan, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="flex justify-between"><span className="text-xs font-semibold text-slate-500">Gói {i + 1}</span><button onClick={() => removePlan(i)} className="text-red-400 text-sm">Xóa</button></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Tên gói</Label><Input value={plan.name} onChange={(e) => updatePlan(i, "name", e.target.value)} /></div>
              <div><Label>Mô tả</Label><Input value={plan.description ?? ""} onChange={(e) => updatePlan(i, "description", e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div><Label>Ký hiệu tiền</Label><Input value={plan.currency} onChange={(e) => updatePlan(i, "currency", e.target.value)} placeholder="₫" /></div>
              <div><Label>Giá tháng</Label><Input type="number" value={plan.monthlyPrice} onChange={(e) => updatePlan(i, "monthlyPrice", Number(e.target.value))} /></div>
              <div><Label>Giá năm</Label><Input type="number" value={plan.annualPrice} onChange={(e) => updatePlan(i, "annualPrice", Number(e.target.value))} /></div>
            </div>
            <div><Label>Tính năng (mỗi dòng 1 tính năng)</Label><Textarea value={plan.features.join("\n")} onChange={(e) => updateFeatures(i, e.target.value)} rows={4} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Text nút CTA</Label><Input value={plan.ctaText} onChange={(e) => updatePlan(i, "ctaText", e.target.value)} /></div>
              <div><Label>URL nút CTA</Label><Input value={plan.ctaUrl ?? ""} onChange={(e) => updatePlan(i, "ctaUrl", e.target.value)} /></div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2"><Switch checked={plan.popular ?? false} onCheckedChange={(v) => updatePlan(i, "popular", v)} /><Label>Nổi bật</Label></div>
              {plan.popular && <Input value={plan.badge ?? ""} onChange={(e) => updatePlan(i, "badge", e.target.value)} placeholder="Phổ biến nhất" className="flex-1" />}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2"><Switch checked={data.darkMode ?? false} onCheckedChange={(v) => update({ darkMode: v })} /><Label>Dark mode</Label></div>
    </div>
  );
}
