import React from "react";
import { Field, Inp, Txt, DarkToggle } from "./shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";

export function TestimonialsBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
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
        <div className="space-y-3">
          {items.map((t: any, i: number) => (
            <div key={i} className="p-3 border border-slate-200 rounded-xl space-y-2 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Đánh giá #{i + 1}</span>
                <button onClick={() => onChange({ ...data, items: items.filter((_: any, j: number) => j !== i) })}>
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
              <Field label="Trích dẫn"><Txt value={t.quote} onChange={v => upItem(i, { quote: v })} rows={3} /></Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Tên"><Inp value={t.author} onChange={v => upItem(i, { author: v })} /></Field>
                <Field label="Vai trò"><Inp value={t.role} onChange={v => upItem(i, { role: v })} /></Field>
              </div>
              <Field label="Avatar">
                <div className="flex gap-2 items-center">
                  {t.avatar && <img src={t.avatar} className="w-8 h-8 rounded-full object-cover shrink-0 border" alt="" />}
                  <Inp value={t.avatar} onChange={v => upItem(i, { avatar: v })} placeholder="URL ảnh đại diện" />
                  <MediaPicker onSelect={url => upItem(i, { avatar: url })} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                </div>
              </Field>
            </div>
          ))}
          <button 
            onClick={() => onChange({ ...data, items: [...items, { quote: "", author: "", role: "", avatar: "" }] })}
            className="w-full h-9 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-primary hover:text-primary text-xs font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" /> Thêm đánh giá
          </button>
        </div>
      </div>
    </div>
  );
}
