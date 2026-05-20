import React from "react";
import { Field, Inp, Txt, DarkToggle } from "./shared";
import { Plus, Trash2 } from "lucide-react";
import { IconPicker } from "@/components/cms/IconPicker";
import { Button } from "@/components/ui/Button";

export function FeatureIconGridEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const items = data.items || [];
  const upItem = (i: number, patch: any) => { 
    const n = [...items]; 
    n[i] = { ...n[i], ...patch }; 
    onChange({ ...data, items: n }); 
  };
  
  return (
    <div className="space-y-6">
      <DarkToggle value={data.darkMode === true} onChange={v => onChange({ ...data, darkMode: v })} />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Badge"><Inp value={data.badge} onChange={v => onChange({ ...data, badge: v })} /></Field>
          <div className="col-span-2"><Field label="Tiêu đề"><Inp value={data.title} onChange={v => onChange({ ...data, title: v })} /></Field></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item: any, i: number) => (
            <div key={i} className="p-3 border border-slate-200 rounded-xl bg-white space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-32">
                  <IconPicker value={item.icon} onChange={v => upItem(i, { icon: v })} />
                </div>
                <button onClick={() => onChange({ ...data, items: items.filter((_: any, j: number) => j !== i) })}>
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
              <Field label="Tiêu đề"><Inp value={item.title} onChange={v => upItem(i, { title: v })} /></Field>
              <Field label="Mô tả ngắn"><Txt value={item.description} onChange={v => upItem(i, { description: v })} rows={2} /></Field>
            </div>
          ))}
          <button 
            onClick={() => onChange({ ...data, items: [...items, { icon: "Zap", title: "", description: "" }] })}
            className="col-span-2 h-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-primary hover:text-primary text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Thêm Feature
          </button>
        </div>
      </div>
    </div>
  );
}
