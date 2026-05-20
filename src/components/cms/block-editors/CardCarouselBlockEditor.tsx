import React from "react";
import { Field, Inp, Txt, DarkToggle } from "./shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";

export function CardCarouselBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const cards = data.cards || [];
  const upCard = (i: number, patch: any) => { 
    const n = [...cards]; 
    n[i] = { ...n[i], ...patch }; 
    onChange({ ...data, cards: n }); 
  };
  
  return (
    <div className="space-y-6">
      <DarkToggle value={data.darkMode === true} onChange={v => onChange({ ...data, darkMode: v })} />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Badge"><Inp value={data.badge} onChange={v => onChange({ ...data, badge: v })} /></Field>
          <div className="col-span-2"><Field label="Tiêu đề"><Inp value={data.title} onChange={v => onChange({ ...data, title: v })} /></Field></div>
          <div className="col-span-2"><Field label="Mô tả phụ"><Txt value={data.subtitle} onChange={v => onChange({ ...data, subtitle: v })} rows={2} /></Field></div>
        </div>
        <div className="space-y-3">
          {cards.map((card: any, i: number) => (
            <div key={i} className="p-3 border border-slate-200 rounded-xl bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Card #{i + 1}</span>
                <button onClick={() => onChange({ ...data, cards: cards.filter((_: any, j: number) => j !== i) })}>
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Tag"><Inp value={card.tag} onChange={v => upCard(i, { tag: v })} /></Field>
                <Field label="Tiêu đề"><Inp value={card.title} onChange={v => upCard(i, { title: v })} /></Field>
              </div>
              <Field label="Mô tả"><Txt value={card.description} onChange={v => upCard(i, { description: v })} rows={2} /></Field>
              <Field label="Ảnh">
                <div className="flex gap-2">
                  <Inp value={card.image} onChange={v => upCard(i, { image: v })} />
                  <MediaPicker onSelect={url => upCard(i, { image: url })} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                </div>
              </Field>
            </div>
          ))}
          <button 
            onClick={() => onChange({ ...data, cards: [...cards, { title: "", description: "", image: "" }] })}
            className="w-full h-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-primary hover:text-primary text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Thêm Card
          </button>
        </div>
      </div>
    </div>
  );
}
