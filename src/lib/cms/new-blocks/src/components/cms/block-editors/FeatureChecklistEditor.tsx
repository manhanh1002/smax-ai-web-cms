import React from "react";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { FeatureChecklistData, ChecklistColumn } from "@/components/sections/FeatureChecklist";

const defaultColumn = (): ChecklistColumn => ({
  label: "Gói A", sublabel: "Dành cho cá nhân",
  items: [
    { text: "5GB lưu trữ", checked: true },
    { text: "Hỗ trợ 24/7", checked: false },
  ]
});

export function FeatureChecklistEditor({ data, onChange }: { data: FeatureChecklistData; onChange: (data: FeatureChecklistData) => void }) {
  const update = (updates: Partial<FeatureChecklistData>) => onChange({ ...data, ...updates });

  const updateColumn = (side: "A" | "B", field: keyof ChecklistColumn, value: any) => {
    const col = side === "A" ? data.columnA : data.columnB;
    const updated = { ...col, [field]: value };
    update(side === "A" ? { columnA: updated } : { columnB: updated });
  };

  const updateItem = (side: "A" | "B", i: number, field: string, value: any) => {
    const col = side === "A" ? data.columnA : data.columnB;
    const items = [...(col.items ?? [])];
    items[i] = { ...items[i], [field]: value };
    updateColumn(side, "items", items);
  };

  const addItem = (side: "A" | "B") => {
    const col = side === "A" ? data.columnA : data.columnB;
    updateColumn(side, "items", [...(col.items ?? []), { text: "Tính năng mới", checked: true }]);
  };

  const removeItem = (side: "A" | "B", i: number) => {
    const col = side === "A" ? data.columnA : data.columnB;
    updateColumn(side, "items", (col.items ?? []).filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Section label</Label><Input value={data.sectionLabel ?? ""} onChange={(e) => update({ sectionLabel: e.target.value })} placeholder="So sánh" /></div>
        <div><Label>Title *</Label><Input value={data.title} onChange={(e) => update({ title: e.target.value })} /></div>
      </div>
      <div><Label>Subtitle</Label><Input value={data.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} /></div>

      {["A", "B"].map((side) => {
        const col = side === "A" ? data.columnA : data.columnB;
        return (
          <div key={side} className="border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Cột {side}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Tiêu đề</Label><Input value={col?.label ?? ""} onChange={(e) => updateColumn(side as "A"|"B", "label", e.target.value)} /></div>
              <div><Label>Mô tả phụ</Label><Input value={col?.sublabel ?? ""} onChange={(e) => updateColumn(side as "A"|"B", "sublabel", e.target.value)} /></div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Tính năng</Label>
                <Button size="sm" variant="outline" onClick={() => addItem(side as "A"|"B")}>+ Thêm</Button>
              </div>
              {(col?.items ?? []).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="checkbox" checked={item.checked} onChange={(e) => updateItem(side as "A"|"B", i, "checked", e.target.checked)} className="w-4 h-4" />
                  <Input value={item.text} onChange={(e) => updateItem(side as "A"|"B", i, "text", e.target.value)} placeholder="Tính năng..." className="flex-1" />
                  <button onClick={() => removeItem(side as "A"|"B", i)} className="text-red-400 hover:text-red-600 text-sm">Xóa</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex items-center gap-2"><Switch checked={data.darkMode ?? false} onCheckedChange={(v) => update({ darkMode: v })} /><Label>Dark mode</Label></div>
    </div>
  );
}
