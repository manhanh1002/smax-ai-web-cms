"use client";
import React, { useState } from "react";
import { Field, Inp, BlockSettingsEditor } from "@/components/cms/block-editors/shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ImageGalleryEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const [tab, setTab] = useState("content");
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const updateImg = (i: number, f: string, v: string) => { const imgs=[...(data.images??[])]; imgs[i]={...imgs[i],[f]:v}; set("images",imgs); };
  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-200 text-sm font-medium">
        {["content","design"].map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 capitalize ${tab===t?"border-b-2 border-violet-600 text-violet-600":"text-slate-500"}`}>{t}</button>)}
      </div>
      {tab === "content" ? (
        <div className="space-y-3">
          <Field label="Tiêu đề"><Inp value={data.title??""} onChange={v => set("title",v)} /></Field>
          <div className="grid grid-cols-3 gap-2">
            <Field label="Cột">
              <select className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm" value={data.columns??3} onChange={e => set("columns",Number(e.target.value))}>
                <option value={2}>2</option><option value={3}>3</option><option value={4}>4</option>
              </select>
            </Field>
            <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.showFilter??false} onChange={e => set("showFilter",e.target.checked)} />Filter</label></div>
            <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.enableLightbox??false} onChange={e => set("enableLightbox",e.target.checked)} />Lightbox</label></div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Ảnh</span>
              <Button size="sm" variant="outline" onClick={() => set("images",[...(data.images??[]),{src:"",alt:"Ảnh"}])}><Plus className="w-3 h-3"/>Thêm</Button>
            </div>
            {(data.images??[]).map((img: any, i: number) => (
              <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex justify-between"><span className="text-xs text-slate-500">{img.alt||`Ảnh ${i+1}`}</span><Button variant="ghost" size="sm" onClick={() => set("images",(data.images??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button></div>
                <Field label="URL ảnh *">
                  <div className="flex gap-2"><Inp value={img.src} onChange={v => updateImg(i,"src",v)} /><MediaPicker onSelect={url => updateImg(i,"src",url)} /></div>
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Alt text"><Inp value={img.alt} onChange={v => updateImg(i,"alt",v)} /></Field>
                  <Field label="Danh mục"><Inp value={img.category??""} onChange={v => updateImg(i,"category",v)} /></Field>
                </div>
                <Field label="Caption"><Inp value={img.caption??""} onChange={v => updateImg(i,"caption",v)} /></Field>
              </div>
            ))}
          </div>
        </div>
      ) : <BlockSettingsEditor settings={data.settings} onChange={v => set("settings", v)} />}
    </div>
  );
}
