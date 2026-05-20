import React from "react";
import { Field, Inp, Txt, DarkToggle } from "./shared";
import { Plus, Trash2 } from "lucide-react";

export function SuitableForBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const cards = data.cards || [];
  const upCard = (i: number, patch: any) => { 
    const n = [...cards]; 
    n[i] = { ...n[i], ...patch }; 
    onChange({ ...data, cards: n }); 
  };
  
  return (
    <div className="space-y-6">
      <DarkToggle value={data.darkMode !== false} onChange={v => onChange({ ...data, darkMode: v })} />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Badge"><Inp value={data.badge} onChange={v => onChange({ ...data, badge: v })} /></Field>
          <Field label="Highlight tiêu đề"><Inp value={data.titleHighlight} onChange={v => onChange({ ...data, titleHighlight: v })} /></Field>
          <div className="col-span-2"><Field label="Tiêu đề"><Inp value={data.title} onChange={v => onChange({ ...data, title: v })} /></Field></div>
          <div className="col-span-2"><Field label="Mô tả"><Txt value={data.subtitle} onChange={v => onChange({ ...data, subtitle: v })} rows={2} /></Field></div>
        </div>
        <Field label="Cards (tối đa 3)">
          <div className="space-y-3">
            {cards.map((card: any, i: number) => (
              <div key={i} className="p-3 border border-slate-200 rounded-xl space-y-2 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-400">Card #{i + 1}</span>
                  <button onClick={() => onChange({ ...data, cards: cards.filter((_: any, j: number) => j !== i) })}>
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
                <Field label="Tag"><Inp value={card.tag} onChange={v => upCard(i, { tag: v })} /></Field>
                <Field label="Tiêu đề"><Inp value={card.title} onChange={v => upCard(i, { title: v })} /></Field>
                <Field label="Mô tả"><Txt value={card.description} onChange={v => upCard(i, { description: v })} rows={2} /></Field>
              </div>
            ))}
            {cards.length < 3 && (
              <button 
                onClick={() => onChange({ ...data, cards: [...cards, { tag: "", title: "", description: "" }] })}
                className="w-full h-9 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-primary hover:text-primary text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> Thêm card
              </button>
            )}
          </div>
        </Field>
      </div>
    </div>
  );
}
