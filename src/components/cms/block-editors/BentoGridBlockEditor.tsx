import React from "react";
import { Field, Inp, Txt, DarkToggle } from "./shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon } from "lucide-react";

export function BentoGridBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const cards: any[] = data.cards || Array(7).fill({ title: "", description: "", image: "" });
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
          <Field label="Highlight tiêu đề"><Inp value={data.titleHighlight} onChange={v => onChange({ ...data, titleHighlight: v })} /></Field>
          <div className="col-span-2"><Field label="Tiêu đề"><Inp value={data.title} onChange={v => onChange({ ...data, title: v })} /></Field></div>
          <div className="col-span-2"><Field label="Mô tả"><Inp value={data.subtitle} onChange={v => onChange({ ...data, subtitle: v })} /></Field></div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">7 Cards (cố định layout 2+1 / 3 / 1+2)</p>
        <div className="space-y-2">
          {cards.slice(0, 7).map((card: any, i: number) => (
            <div key={i} className="p-3 border border-slate-200 rounded-xl bg-white">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                  {card.image ? <img src={card.image} className="w-full h-full object-contain p-1" alt="" /> : <ImageIcon className="w-5 h-5 text-slate-300" />}
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <Field label={`Card ${i + 1}${i === 0 || i === 6 ? " (to)" : ""} – Tiêu đề`}>
                    <Inp value={card.title} onChange={v => upCard(i, { title: v })} />
                  </Field>
                </div>
                <MediaPicker onSelect={url => upCard(i, { image: url })} trigger={<Button variant="outline" className="h-8 w-8 p-0 rounded-lg shrink-0 mt-5"><ImageIcon className="w-3.5 h-3.5" /></Button>} />
              </div>
              <div className="mt-2">
                <Field label="Mô tả"><Txt value={card.description} onChange={v => upCard(i, { description: v })} rows={2} /></Field>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
