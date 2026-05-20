import React from "react";
import { Field, Inp, Txt, DarkToggle } from "./shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";

export function VerticalTabsBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const tabs = data.tabs || [];
  const upTab = (i: number, patch: any) => { 
    const n = [...tabs]; 
    n[i] = { ...n[i], ...patch }; 
    onChange({ ...data, tabs: n }); 
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
          {tabs.map((tab: any, i: number) => (
            <div key={i} className="p-4 border border-slate-200 rounded-2xl bg-white space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Tab #{i + 1}</span>
                <button onClick={() => onChange({ ...data, tabs: tabs.filter((_: any, j: number) => j !== i) })}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tag nhỏ"><Inp value={tab.tag} onChange={v => upTab(i, { tag: v })} /></Field>
                <Field label="Tiêu đề Tab"><Inp value={tab.title} onChange={v => upTab(i, { title: v })} /></Field>
              </div>
              <Field label="Mô tả / Quote"><Txt value={tab.description} onChange={v => upTab(i, { description: v })} rows={2} /></Field>
              <Field label="Ảnh minh hoạ">
                <div className="flex gap-2">
                  <Inp value={tab.image} onChange={v => upTab(i, { image: v })} />
                  <MediaPicker onSelect={url => upTab(i, { image: url })} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                </div>
              </Field>
            </div>
          ))}
          <button 
            onClick={() => onChange({ ...data, tabs: [...tabs, { tag: "", title: "", description: "", image: "" }] })}
            className="w-full h-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-primary hover:text-primary text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Thêm Tab
          </button>
        </div>
      </div>
    </div>
  );
}
