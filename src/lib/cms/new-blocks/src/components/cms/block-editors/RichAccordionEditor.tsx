import React from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { RichAccordionData, AccordionItem } from "@/components/sections/RichAccordion";

const defaultItem = (): AccordionItem => ({ heading: "Tiêu đề mục", body: "Nội dung chi tiết...", icon: "", defaultOpen: false });

export function RichAccordionEditor({ data, onChange }: { data: RichAccordionData; onChange: (data: RichAccordionData) => void }) {
  const update = (updates: Partial<RichAccordionData>) => onChange({ ...data, ...updates });
  const updateItem = (i: number, field: keyof AccordionItem, value: any) => {
    const items = [...(data.items ?? [])];
    items[i] = { ...items[i], [field]: value };
    update({ items });
  };
  const addItem = () => update({ items: [...(data.items ?? []), defaultItem()] });
  const removeItem = (i: number) => update({ items: (data.items ?? []).filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Section label</Label>
        <Input value={data.sectionLabel ?? ""} onChange={(e) => update({ sectionLabel: e.target.value })} placeholder="Hỏi đáp" />
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={data.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input value={data.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Các mục nội dung</Label>
          <Button size="sm" variant="outline" onClick={addItem}>+ Thêm mục</Button>
        </div>
        {(data.items ?? []).map((item, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500">Mục {i + 1}</span>
              <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 text-sm">Xóa</button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1">
                <Label>Icon</Label>
                <Input value={item.icon ?? ""} onChange={(e) => updateItem(i, "icon", e.target.value)} placeholder="💡" />
              </div>
              <div className="col-span-3 space-y-1">
                <Label>Tiêu đề</Label>
                <Input value={item.heading} onChange={(e) => updateItem(i, "heading", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Nội dung (hỗ trợ xuống dòng)</Label>
              <Textarea value={item.body} onChange={(e) => updateItem(i, "body", e.target.value)} rows={3} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={item.defaultOpen ?? false} onCheckedChange={(v) => updateItem(i, "defaultOpen", v)} />
              <Label>Mở mặc định</Label>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={data.allowMultiple ?? false} onCheckedChange={(v) => update({ allowMultiple: v })} />
          <Label>Mở nhiều mục cùng lúc</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={data.darkMode ?? false} onCheckedChange={(v) => update({ darkMode: v })} />
          <Label>Dark mode</Label>
        </div>
      </div>
    </div>
  );
}
