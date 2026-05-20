import React from "react";
import { Field, Inp, Txt, DarkToggle } from "./shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";

export function CaseStudySliderBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
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
        <div className="grid grid-cols-2 gap-3">
          <Field label="Badge"><Inp value={data.badge} onChange={v => onChange({ ...data, badge: v })} /></Field>
          <div className="col-span-2"><Field label="Tiêu đề chung"><Inp value={data.title} onChange={v => onChange({ ...data, title: v })} /></Field></div>
        </div>
        <div className="space-y-3">
          {items.map((item: any, i: number) => (
            <div key={i} className="p-4 border border-slate-200 rounded-2xl bg-white space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Case Study #{i + 1}</span>
                <button onClick={() => onChange({ ...data, items: items.filter((_: any, j: number) => j !== i) })}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tên công ty"><Inp value={item.companyName} onChange={v => upItem(i, { companyName: v })} /></Field>
                <Field label="Logo (trắng/âm bản)">
                  <div className="flex gap-1">
                    <Inp value={item.logo} onChange={v => upItem(i, { logo: v })} />
                    <MediaPicker onSelect={url => upItem(i, { logo: url })} trigger={<Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-3.5 h-3.5" /></Button>} />
                  </div>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Số liệu (VD: 200%)"><Inp value={item.statValue} onChange={v => upItem(i, { statValue: v })} /></Field>
                <Field label="Nhãn số liệu"><Inp value={item.statLabel} onChange={v => upItem(i, { statLabel: v })} /></Field>
              </div>
              <Field label="Quote khách hàng"><Txt value={item.quote} onChange={v => upItem(i, { quote: v })} rows={3} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tên người quote"><Inp value={item.author} onChange={v => upItem(i, { author: v })} /></Field>
                <Field label="Vai trò"><Inp value={item.role} onChange={v => upItem(i, { role: v })} /></Field>
              </div>
              <Field label="Ảnh dự án (đứng 4:5)">
                <div className="flex gap-2">
                  <Inp value={item.image} onChange={v => upItem(i, { image: v })} />
                  <MediaPicker onSelect={url => upItem(i, { image: url })} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                </div>
              </Field>
            </div>
          ))}
          <button 
            onClick={() => onChange({ ...data, items: [...items, { companyName: "", statValue: "", statLabel: "", quote: "", author: "", role: "", image: "" }] })}
            className="w-full h-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-primary hover:text-primary text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Thêm Case Study
          </button>
        </div>
      </div>
    </div>
  );
}
