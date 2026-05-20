import React from "react";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { HeroCenteredData } from "@/components/sections/HeroCentered";

export function HeroCenteredEditor({ data, onChange }: { data: HeroCenteredData; onChange: (data: HeroCenteredData) => void }) {
  const update = (updates: Partial<HeroCenteredData>) => onChange({ ...data, ...updates });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Badge text (optional)</Label>
        <Input value={data.badge ?? ""} onChange={(e) => update({ badge: e.target.value })} placeholder="Thông báo mới nhất" />
      </div>
      <div className="space-y-2">
        <Label>Eyebrow icon (emoji)</Label>
        <Input value={data.eyebrowIcon ?? ""} onChange={(e) => update({ eyebrowIcon: e.target.value })} placeholder="🚀" />
      </div>
      <div className="space-y-2">
        <Label>Title *</Label>
        <Input value={data.title} onChange={(e) => update({ title: e.target.value })} placeholder="Giải pháp tốt nhất cho" />
      </div>
      <div className="space-y-2">
        <Label>Highlighted text (màu nổi bật)</Label>
        <Input value={data.highlight ?? ""} onChange={(e) => update({ highlight: e.target.value })} placeholder="doanh nghiệp của bạn" />
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input value={data.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} placeholder="Mô tả ngắn gọn giá trị mang lại" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Primary button text</Label>
          <Input value={data.primaryBtn ?? ""} onChange={(e) => update({ primaryBtn: e.target.value })} placeholder="Dùng thử miễn phí" />
        </div>
        <div className="space-y-2">
          <Label>Primary button URL</Label>
          <Input value={data.primaryBtnUrl ?? ""} onChange={(e) => update({ primaryBtnUrl: e.target.value })} placeholder="/dung-thu" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Secondary button text</Label>
          <Input value={data.secondaryBtn ?? ""} onChange={(e) => update({ secondaryBtn: e.target.value })} placeholder="Xem demo" />
        </div>
        <div className="space-y-2">
          <Label>Secondary button URL</Label>
          <Input value={data.secondaryBtnUrl ?? ""} onChange={(e) => update({ secondaryBtnUrl: e.target.value })} placeholder="/demo" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Background gradient</Label>
        <select
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          value={data.bgGradient ?? "none"}
          onChange={(e) => update({ bgGradient: e.target.value as HeroCenteredData["bgGradient"] })}
        >
          <option value="none">Trắng (không gradient)</option>
          <option value="purple">Tím nhạt</option>
          <option value="blue">Xanh nhạt</option>
          <option value="teal">Xanh lá nhạt</option>
          <option value="orange">Cam nhạt</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={data.darkMode ?? false} onCheckedChange={(val) => update({ darkMode: val })} />
        <Label>Dark mode</Label>
      </div>
    </div>
  );
}
