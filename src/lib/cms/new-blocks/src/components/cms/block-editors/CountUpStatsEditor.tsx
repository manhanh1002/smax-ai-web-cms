import React from "react";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { CountUpStatsData, StatItem } from "@/components/sections/CountUpStats";

const defaultStat = (): StatItem => ({ value: 10000, suffix: "+", prefix: "", label: "Khách hàng", description: "", icon: "" });

export function CountUpStatsEditor({ data, onChange }: { data: CountUpStatsData; onChange: (data: CountUpStatsData) => void }) {
  const update = (updates: Partial<CountUpStatsData>) => onChange({ ...data, ...updates });
  const updateStat = (i: number, field: keyof StatItem, value: any) => {
    const stats = [...(data.stats ?? [])];
    stats[i] = { ...stats[i], [field]: value };
    update({ stats });
  };
  const addStat = () => update({ stats: [...(data.stats ?? []), defaultStat()] });
  const removeStat = (i: number) => update({ stats: (data.stats ?? []).filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Section label</Label><Input value={data.sectionLabel ?? ""} onChange={(e) => update({ sectionLabel: e.target.value })} /></div>
        <div><Label>Title</Label><Input value={data.title ?? ""} onChange={(e) => update({ title: e.target.value })} /></div>
      </div>
      <div><Label>Subtitle</Label><Input value={data.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Số cột</Label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mt-1" value={data.columns ?? 3} onChange={(e) => update({ columns: Number(e.target.value) as 2|3|4 })}>
            <option value={2}>2 cột</option><option value={3}>3 cột</option><option value={4}>4 cột</option>
          </select>
        </div>
        <div>
          <Label>Kiểu hiển thị</Label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mt-1" value={data.layout ?? "cards"} onChange={(e) => update({ layout: e.target.value as "cards"|"minimal" })}>
            <option value="cards">Cards</option><option value="minimal">Tối giản</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Các số liệu</Label>
          <Button size="sm" variant="outline" onClick={addStat}>+ Thêm</Button>
        </div>
        {(data.stats ?? []).map((stat, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="flex justify-between"><span className="text-xs text-slate-500">Số liệu {i + 1}</span><button onClick={() => removeStat(i)} className="text-red-400 text-sm">Xóa</button></div>
            <div className="grid grid-cols-4 gap-2">
              <div><Label>Icon</Label><Input value={stat.icon ?? ""} onChange={(e) => updateStat(i, "icon", e.target.value)} placeholder="📈" /></div>
              <div><Label>Prefix</Label><Input value={stat.prefix ?? ""} onChange={(e) => updateStat(i, "prefix", e.target.value)} placeholder="+" /></div>
              <div><Label>Giá trị</Label><Input type="number" value={stat.value} onChange={(e) => updateStat(i, "value", Number(e.target.value))} /></div>
              <div><Label>Suffix</Label><Input value={stat.suffix ?? ""} onChange={(e) => updateStat(i, "suffix", e.target.value)} placeholder="+" /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Nhãn</Label><Input value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)} placeholder="Khách hàng" /></div>
              <div><Label>Mô tả phụ</Label><Input value={stat.description ?? ""} onChange={(e) => updateStat(i, "description", e.target.value)} /></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2"><Switch checked={data.darkMode ?? false} onCheckedChange={(v) => update({ darkMode: v })} /><Label>Dark mode</Label></div>
    </div>
  );
}
