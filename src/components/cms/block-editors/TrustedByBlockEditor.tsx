import React from "react";
import { Field, Inp, DarkToggle } from "./shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, Trash2, Plus } from "lucide-react";

export function TrustedByBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const logos: string[] = data.logos || [];
  const setLogos = (l: string[]) => onChange({ ...data, logos: l });

  return (
    <div className="space-y-6">
      <DarkToggle value={data.darkMode === true} onChange={v => onChange({ ...data, darkMode: v })} />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nhãn"><Inp value={data.label} onChange={v => onChange({ ...data, label: v })} placeholder="Được tin dùng bởi" /></Field>
          <Field label="Số lượng nổi bật"><Inp value={data.highlight} onChange={v => onChange({ ...data, highlight: v })} placeholder="+20,000 doanh nghiệp" /></Field>
        </div>
        <Field label="Logo đối tác">
          <div className="grid grid-cols-3 gap-2">
            {logos.map((logo, i) => (
              <div key={i} className="relative group h-16 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center">
                <img src={logo} alt="" className="h-8 object-contain" />
                <button 
                  onClick={() => setLogos(logos.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 p-1 bg-white rounded-lg shadow opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </div>
            ))}
            <MediaPicker
              onSelect={url => setLogos([...logos, url])}
              trigger={
                <button className="h-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-blue-50 transition-colors text-slate-400">
                  <Plus className="w-4 h-4" />
                  <span className="text-[10px] font-bold">Thêm logo</span>
                </button>
              }
            />
          </div>
        </Field>
      </div>
    </div>
  );
}
