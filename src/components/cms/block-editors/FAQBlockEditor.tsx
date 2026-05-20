import React from "react";
import { Field, Inp, Txt, DarkToggle } from "./shared";
import { Plus, Trash2 } from "lucide-react";

export function FAQBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
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
          <Field label="Highlight tiêu đề"><Inp value={data.titleHighlight} onChange={v => onChange({ ...data, titleHighlight: v })} /></Field>
          <div className="col-span-2"><Field label="Tiêu đề"><Inp value={data.title} onChange={v => onChange({ ...data, title: v })} /></Field></div>
        </div>
        <div className="space-y-2">
          {items.map((item: any, i: number) => (
            <div key={i} className="p-3 border border-slate-200 rounded-xl space-y-2 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">#{i + 1}</span>
                <button onClick={() => onChange({ ...data, items: items.filter((_: any, j: number) => j !== i) })}>
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
              <Field label="Câu hỏi"><Inp value={item.question} onChange={v => upItem(i, { question: v })} /></Field>
              <Field label="Câu trả lời"><Txt value={item.answer} onChange={v => upItem(i, { answer: v })} rows={3} /></Field>
            </div>
          ))}
          <button 
            onClick={() => onChange({ ...data, items: [...items, { question: "", answer: "" }] })}
            className="w-full h-9 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-primary hover:text-primary text-xs font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" /> Thêm câu hỏi
          </button>
        </div>
      </div>
    </div>
  );
}
