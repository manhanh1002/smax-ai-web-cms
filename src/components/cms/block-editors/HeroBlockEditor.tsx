import React from "react";
import { Field, Inp, Txt, DarkToggle } from "./shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function HeroBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });
  
  return (
    <div className="space-y-6">
      <DarkToggle value={data.darkMode === true} onChange={v => u("darkMode", v)} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Badge"><Inp value={data.badge} onChange={v => u("badge", v)} placeholder="Nền tảng..." /></Field>
        <Field label="Nút chính"><Inp value={data.primaryBtn} onChange={v => u("primaryBtn", v)} placeholder="Dùng thử miễn phí" /></Field>
        <Field label="Tiêu đề"><Inp value={data.title} onChange={v => u("title", v)} placeholder="Tiêu đề chính" /></Field>
        <Field label="URL nút chính"><Inp value={data.primaryBtnUrl} onChange={v => u("primaryBtnUrl", v)} placeholder="https://..." /></Field>
        <Field label="Highlight (màu cam)"><Inp value={data.highlight} onChange={v => u("highlight", v)} placeholder="từ khoá nổi bật" /></Field>
        <Field label="Nút phụ"><Inp value={data.secondaryBtn} onChange={v => u("secondaryBtn", v)} placeholder="Đặt lịch tư vấn" /></Field>
        <div className="md:col-span-2"><Field label="Mô tả ngắn"><Txt value={data.subtitle} onChange={v => u("subtitle", v)} placeholder="Mô tả..." rows={2} /></Field></div>
        <div className="md:col-span-2">
          <Field label="Ảnh Hero">
            <div className="flex gap-2">
              <Inp value={data.image} onChange={v => u("image", v)} placeholder="https://... hoặc chọn từ Media" />
              <MediaPicker onSelect={url => u("image", url)} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
            </div>
            {data.image && <img src={data.image} className="mt-2 h-24 object-contain rounded-xl bg-slate-50 border" alt="" />}
          </Field>
        </div>
      </div>
    </div>
  );
}
