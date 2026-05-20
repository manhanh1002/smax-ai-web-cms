import React from "react";
import { Field, Inp, Txt, DarkToggle } from "./shared";
import { FormSelect } from "../FormSelect";
import { Plus, Trash2 } from "lucide-react";

export function CTABlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const bullets: string[] = data.bullets || [];
  
  return (
    <div className="space-y-6">
      <DarkToggle value={data.darkMode === true} onChange={v => onChange({ ...data, darkMode: v })} />
      <div className="space-y-4">
        <Field label="Tiêu đề chính"><Txt value={data.title} onChange={v => onChange({ ...data, title: v })} rows={2} /></Field>
        <Field label="Mô tả phụ"><Txt value={data.subtitle} onChange={v => onChange({ ...data, subtitle: v })} rows={2} /></Field>
        <Field label="URL Form (iframe)"><Inp value={data.formUrl} onChange={v => onChange({ ...data, formUrl: v, nativeFormId: "" })} placeholder="https://crm.smax.ai/forms/..." /></Field>
        <Field label="Chiều cao form (px)"><Inp value={String(data.formHeight || 500)} onChange={v => onChange({ ...data, formHeight: Number(v) || 500 })} placeholder="500" /></Field>
        
        <div className="flex items-center gap-4 py-2">
          <div className="h-[1px] flex-1 bg-slate-100" />
          <span className="text-[10px] font-black text-slate-300 uppercase">Hoặc dùng Form nội bộ</span>
          <div className="h-[1px] flex-1 bg-slate-100" />
        </div>

        <Field label="Chọn Form đã build">
          <FormSelect value={data.nativeFormId} onChange={id => onChange({ ...data, nativeFormId: id, formUrl: "" })} />
        </Field>
        <Field label="Điểm chốt (bullets)">
          <div className="space-y-1.5">
            {bullets.map((b, i) => (
              <div key={i} className="flex gap-2">
                <Inp value={b} onChange={v => { const n = [...bullets]; n[i] = v; onChange({ ...data, bullets: n }); }} placeholder={`Điểm ${i + 1}...`} />
                <button onClick={() => onChange({ ...data, bullets: bullets.filter((_, j) => j !== i) })} className="shrink-0"><Trash2 className="w-4 h-4 text-red-300" /></button>
              </div>
            ))}
            <button 
              onClick={() => onChange({ ...data, bullets: [...bullets, ""] })}
              className="w-full h-9 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-primary hover:text-primary text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" /> Thêm điểm chốt
            </button>
          </div>
        </Field>
      </div>
    </div>
  );
}
