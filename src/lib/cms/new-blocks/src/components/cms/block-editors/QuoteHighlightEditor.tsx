import React from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { QuoteHighlightData } from "@/components/sections/QuoteHighlight";

export function QuoteHighlightEditor({ data, onChange }: { data: QuoteHighlightData; onChange: (data: QuoteHighlightData) => void }) {
  const update = (updates: Partial<QuoteHighlightData>) => onChange({ ...data, ...updates });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Nội dung trích dẫn *</Label>
        <Textarea value={data.quote} onChange={(e) => update({ quote: e.target.value })} rows={4} placeholder="Nhập nội dung trích dẫn nổi bật..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Tên tác giả</Label>
          <Input value={data.author ?? ""} onChange={(e) => update({ author: e.target.value })} placeholder="Nguyễn Văn A" />
        </div>
        <div className="space-y-1">
          <Label>Chức danh</Label>
          <Input value={data.role ?? ""} onChange={(e) => update({ role: e.target.value })} placeholder="CEO" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Công ty</Label>
          <Input value={data.company ?? ""} onChange={(e) => update({ company: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Avatar URL</Label>
          <Input value={data.avatar ?? ""} onChange={(e) => update({ avatar: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Màu accent</Label>
        <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={data.accentColor ?? "violet"} onChange={(e) => update({ accentColor: e.target.value as QuoteHighlightData["accentColor"] })}>
          <option value="violet">Tím</option>
          <option value="blue">Xanh dương</option>
          <option value="teal">Xanh lá</option>
          <option value="orange">Cam</option>
          <option value="rose">Hồng</option>
        </select>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={data.alignment === "center"} onCheckedChange={(v) => update({ alignment: v ? "center" : "left" })} />
          <Label>Căn giữa</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={data.darkMode ?? false} onCheckedChange={(v) => update({ darkMode: v })} />
          <Label>Dark mode</Label>
        </div>
      </div>
    </div>
  );
}
