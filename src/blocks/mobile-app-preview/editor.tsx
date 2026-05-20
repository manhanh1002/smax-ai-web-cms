"use client";
import React, { useState } from "react";
import { Field, Inp, BlockSettingsEditor, ActionPicker } from "@/components/cms/block-editors/shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function MobileAppPreviewEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const [tab, setTab] = useState("content");
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const updateFeature = (i: number, v: string) => { const f=[...(data.features??[])]; f[i]=v; set("features",f); };
  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-200 text-sm font-medium">
        {["content","design"].map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 capitalize ${tab===t?"border-b-2 border-violet-600 text-violet-600":"text-slate-500"}`}>{t}</button>)}
      </div>
      {tab === "content" ? (
        <div className="space-y-3">
          <Field label="Tiêu đề *"><Inp value={data.title} onChange={v => set("title", v)} /></Field>
          <Field label="Subtitle"><Inp value={data.subtitle ?? ""} onChange={v => set("subtitle", v)} /></Field>
          <Field label="Mockup Image *">
            <div className="flex gap-2"><Inp value={data.mockupImage} onChange={v => set("mockupImage", v)} /><MediaPicker onSelect={url => set("mockupImage", url)} /></div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Text App Store"><Inp value={data.appStoreText ?? ""} onChange={v => set("appStoreText", v)} placeholder="App Store" /></Field>
            <ActionPicker label="Action App Store" value={data.appStoreAction} onChange={v => set("appStoreAction", v)} />
            <Field label="Text Google Play"><Inp value={data.playStoreText ?? ""} onChange={v => set("playStoreText", v)} placeholder="Google Play" /></Field>
            <ActionPicker label="Action Google Play" value={data.playStoreAction} onChange={v => set("playStoreAction", v)} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Tính năng</span>
              <Button size="sm" variant="outline" onClick={() => set("features",[...(data.features??[]),"Tính năng mới"])}><Plus className="w-3 h-3"/>Thêm</Button>
            </div>
            {(data.features??[]).map((f: string, i: number) => (
              <div key={i} className="flex gap-2">
                <Inp value={f} onChange={v => updateFeature(i, v)} />
                <Button variant="ghost" size="sm" onClick={() => set("features",(data.features??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button>
              </div>
            ))}
          </div>
        </div>
      ) : <BlockSettingsEditor settings={data.settings} onChange={v => set("settings", v)} />}
    </div>
  );
}
