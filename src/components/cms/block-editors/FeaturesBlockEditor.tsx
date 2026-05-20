import React from "react";
import { Field, Inp, Txt, DarkToggle } from "./shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, Plus, Trash2, ArrowLeftRight } from "lucide-react";
import { Toggle } from "@/components/ui/Toggle";

export function FeaturesBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const items = data.items || [];
  const upItem = (i: number, patch: any) => {
    const n = [...items]; 
    n[i] = { ...n[i], ...patch }; 
    onChange({ ...data, items: n });
  };
  const delItem = (i: number) => onChange({ ...data, items: items.filter((_: any, j: number) => j !== i) });
  const addItem = () => onChange({ ...data, items: [...items, { tag: "", title: "", points: [""], image: "" }] });

  return (
    <div className="space-y-6">
      <DarkToggle value={data.darkMode === true} onChange={v => onChange({ ...data, darkMode: v })} />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Badge"><Inp value={data.badge} onChange={v => onChange({ ...data, badge: v })} /></Field>
          <Field label="Highlight tiêu đề"><Inp value={data.titleHighlight} onChange={v => onChange({ ...data, titleHighlight: v })} /></Field>
          <div className="col-span-2"><Field label="Tiêu đề phần"><Inp value={data.title} onChange={v => onChange({ ...data, title: v })} /></Field></div>
          <div className="col-span-2"><Field label="Mô tả phần"><Txt value={data.subtitle} onChange={v => onChange({ ...data, subtitle: v })} rows={2} /></Field></div>
        </div>
        <div className="space-y-4">
          {items.map((item: any, i: number) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500">Tính năng #{i + 1}</span>
                  <div className="flex items-center gap-1.5 ml-2 border-l pl-3 border-slate-100">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Đổi vế</span>
                    <Toggle checked={item.reversed !== undefined ? item.reversed : i % 2 !== 0} onChange={v => upItem(i, { reversed: v })} size="sm" />
                  </div>
                </div>
                <button onClick={() => delItem(i)} className="hover:bg-red-50 p-1 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tag"><Inp value={item.tag} onChange={v => upItem(i, { tag: v })} /></Field>
                <Field label="Tiêu đề"><Inp value={item.title} onChange={v => upItem(i, { title: v })} /></Field>
              </div>
              <Field label="Điểm nổi bật">
                {(item.points || []).map((p: string, j: number) => (
                  <div key={j} className="flex gap-2 mb-1.5">
                    <Inp value={p} onChange={v => { const pts = [...(item.points || [])]; pts[j] = v; upItem(i, { points: pts }); }} placeholder={`Điểm ${j + 1}`} />
                    <button onClick={() => { const pts = (item.points || []).filter((_: any, k: number) => k !== j); upItem(i, { points: pts }); }} className="shrink-0"><Trash2 className="w-4 h-4 text-red-300" /></button>
                  </div>
                ))}
                <button onClick={() => upItem(i, { points: [...(item.points || []), ""] })} className="text-xs text-primary font-bold flex items-center gap-1 mt-1"><Plus className="w-3 h-3" />Thêm điểm</button>
              </Field>
              <Field label="Hiệu quả / Con số (Hỗ trợ HTML)">
                <Txt value={item.stat} onChange={v => upItem(i, { stat: v })} placeholder="Ví dụ: <b>+50%</b> tỉ lệ chuyển đổi..." rows={2} />
              </Field>
              <Field label="Ảnh">
                <div className="flex gap-2">
                  <Inp value={item.image} onChange={v => upItem(i, { image: v })} placeholder="URL ảnh..." />
                  <MediaPicker onSelect={url => upItem(i, { image: url })} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                </div>
              </Field>
            </div>
          ))}
          <button onClick={addItem} className="w-full h-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-primary hover:text-primary text-sm font-bold flex items-center justify-center gap-2 transition-colors"><Plus className="w-4 h-4" />Thêm tính năng</button>
        </div>
      </div>
    </div>
  );
}
