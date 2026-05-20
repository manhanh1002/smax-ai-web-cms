import React from "react";
import { Field, Inp, Txt, DarkToggle } from "./shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon } from "lucide-react";

export function HeroSecondaryBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });
  
  return (
    <div className="space-y-6">
      <DarkToggle value={data.darkMode === true} onChange={v => u("darkMode", v)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Badge"><Inp value={data.badge} onChange={v => u("badge", v)} /></Field>
        <Field label="Nút CTA"><Inp value={data.btnText} onChange={v => u("btnText", v)} /></Field>
        <Field label="Tiêu đề"><Inp value={data.title} onChange={v => u("title", v)} /></Field>
        <Field label="URL nút"><Inp value={data.btnUrl} onChange={v => u("btnUrl", v)} /></Field>
        <Field label="Highlight tiêu đề"><Inp value={data.titleHighlight} onChange={v => u("titleHighlight", v)} /></Field>
        <div className="md:col-span-2"><Field label="Mô tả"><Txt value={data.description} onChange={v => u("description", v)} rows={3} /></Field></div>
        <div className="md:col-span-2">
          <Field label="Ảnh (bên trái)">
            <div className="flex gap-2">
              <Inp value={data.image} onChange={v => u("image", v)} />
              <MediaPicker onSelect={url => u("image", url)} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
            </div>
          </Field>
        </div>
      </div>
    </div>
  );
}
