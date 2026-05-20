import React from "react";
import { Field, Inp, DarkToggle } from "./shared";
import { Plus, Trash2 } from "lucide-react";

export function StatsCounterBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const items = data.items || [];
  const upItem = (i: number, patch: any) => { 
    const n = [...items]; 
    n[i] = { ...n[i], ...patch }; 
    onChange({ ...data, items: n }); 
  };
  
  return (
    <div className="space-y-6">
      <DarkToggle value={data.darkMode !== false} onChange={v => onChange({ ...data, darkMode: v })} />
      <div className="space-y-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4 Stats nổi bật</p>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item: any, i: number) => (
            <div key={i} className="p-3 border border-slate-200 rounded-xl bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Stat #{i + 1}</span>
                <button onClick={() => onChange({ ...data, items: items.filter((_: any, j: number) => j !== i) })}>
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
              <div className="flex gap-2">
                <div className="flex-1"><Field label="Số"><Inp value={item.value} onChange={v => upItem(i, { value: v })} /></Field></div>
                <div className="w-16"><Field label="Đuôi"><Inp value={item.suffix} onChange={v => upItem(i, { suffix: v })} placeholder="%, +" /></Field></div>
              </div>
              <Field label="Nhãn (VD: Khách hàng)"><Inp value={item.label} onChange={v => upItem(i, { label: v })} /></Field>
            </div>
          ))}
        </div>
        {items.length < 4 && (
          <button 
            onClick={() => onChange({ ...data, items: [...items, { value: "", label: "", suffix: "" }] })}
            className="w-full h-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-primary hover:text-primary text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Thêm Stat
          </button>
        )}
      </div>
    </div>
  );
}
