import React from "react";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { AnnouncementBarData } from "@/components/sections/AnnouncementBar";

export function AnnouncementBarEditor({ data, onChange }: { data: AnnouncementBarData; onChange: (data: AnnouncementBarData) => void }) {
  const update = (updates: Partial<AnnouncementBarData>) => onChange({ ...data, ...updates });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Nội dung thông báo *</Label>
        <Input value={data.message} onChange={(e) => update({ message: e.target.value })} placeholder="🎉 Ưu đãi đặc biệt! Giảm 30% tất cả gói trong tháng này." />
      </div>
      <div className="space-y-2">
        <Label>Icon (emoji, để trống nếu không dùng)</Label>
        <Input value={data.icon ?? ""} onChange={(e) => update({ icon: e.target.value })} placeholder="🎉" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Text nút CTA</Label>
          <Input value={data.ctaText ?? ""} onChange={(e) => update({ ctaText: e.target.value })} placeholder="Xem ngay" />
        </div>
        <div className="space-y-2">
          <Label>URL nút CTA</Label>
          <Input value={data.ctaUrl ?? ""} onChange={(e) => update({ ctaUrl: e.target.value })} placeholder="/uu-dai" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Màu nền</Label>
        <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={data.bgColor ?? "violet"} onChange={(e) => update({ bgColor: e.target.value as AnnouncementBarData["bgColor"] })}>
          <option value="violet">Tím</option>
          <option value="blue">Xanh dương</option>
          <option value="emerald">Xanh lá</option>
          <option value="amber">Cam vàng</option>
          <option value="rose">Hồng đỏ</option>
          <option value="slate">Xám tối</option>
        </select>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={data.dismissible ?? false} onCheckedChange={(v) => update({ dismissible: v })} />
          <Label>Có thể đóng</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={data.openInNewTab ?? false} onCheckedChange={(v) => update({ openInNewTab: v })} />
          <Label>Mở tab mới</Label>
        </div>
      </div>
    </div>
  );
}
