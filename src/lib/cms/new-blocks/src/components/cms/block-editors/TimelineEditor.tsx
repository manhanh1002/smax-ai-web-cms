import React from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { TimelineData, TimelineItem } from "@/components/sections/Timeline";

const defaultItem = (): TimelineItem => ({ year: "2024", title: "Mốc quan trọng", description: "Mô tả ngắn gọn về sự kiện này.", icon: "", highlight: false });

export function TimelineEditor({ data, onChange }: { data: TimelineData; onChange: (data: TimelineData) => void }) {
  const update = (updates: Partial<TimelineData>) => onChange({ ...data, ...updates });

  const updateItem = (i: number, field: keyof TimelineItem, value: any) => {
    const items = [...(data.items ?? [])];
    items[i] = { ...items[i], [field]: value };
    update({ items });
  };

  const addItem = () => update({ items: [...(data.items ?? []), defaultItem()] });
  const removeItem = (i: number) => update({ items: (data.items ?? []).filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Section label (nhỏ phía trên)</Label>
        <Input value={data.sectionLabel ?? ""} onChange={(e) => update({ sectionLabel: e.target.value })} placeholder="Hành trình phát triển" />
      </div>
      <div className="space-y-2">
        <Label>Title *</Label>
        <Input value={data.title} onChange={(e) => update({ title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input value={data.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Hướng hiển thị</Label>
        <select
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          value={data.orientation ?? "vertical"}
          onChange={(e) => update({ orientation: e.target.value as "vertical" | "horizontal" })}
        >
          <option value="vertical">Dọc</option>
          <option value="horizontal">Ngang (scroll)</option>
        </select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Các mốc thời gian</Label>
          <Button size="sm" variant="outline" onClick={addItem}>+ Thêm mốc</Button>
        </div>
        {(data.items ?? []).map((item, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500">Mốc {i + 1}</span>
              <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 text-sm">Xóa</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label>Năm/Ngày</Label>
                <Input value={item.year} onChange={(e) => updateItem(i, "year", e.target.value)} placeholder="2024" />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>Tiêu đề</Label>
                <Input value={item.title} onChange={(e) => updateItem(i, "title", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Mô tả</Label>
              <Textarea value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} rows={2} />
            </div>
            <div className="flex gap-3 items-center">
              <div className="flex-1 space-y-1">
                <Label>Icon (emoji)</Label>
                <Input value={item.icon ?? ""} onChange={(e) => updateItem(i, "icon", e.target.value)} placeholder="🚀" />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <Switch checked={item.highlight ?? false} onCheckedChange={(v) => updateItem(i, "highlight", v)} />
                <Label>Nổi bật</Label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={data.darkMode ?? false} onCheckedChange={(v) => update({ darkMode: v })} />
        <Label>Dark mode</Label>
      </div>
    </div>
  );
}
