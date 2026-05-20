"use client";
import React, { useState } from "react";
import { Field, Inp, BlockSettingsEditor } from "@/components/cms/block-editors/shared";
import { MediaPicker } from "@/components/cms/MediaPicker";

export function BeforeAfterEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const [tab, setTab] = useState("content");
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-200 text-sm font-medium">
        {["content","design"].map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 capitalize ${tab===t?"border-b-2 border-violet-600 text-violet-600":"text-slate-500"}`}>{t}</button>)}
      </div>
      {tab === "content" ? (
        <div className="space-y-3">
          <Field label="Tiêu đề"><Inp value={data.title ?? ""} onChange={v => set("title", v)} /></Field>
          <Field label="Ảnh Before *">
            <div className="flex gap-2"><Inp value={data.beforeImage} onChange={v => set("beforeImage", v)} /><MediaPicker onSelect={url => set("beforeImage", url)} /></div>
          </Field>
          <Field label="Ảnh After *">
            <div className="flex gap-2"><Inp value={data.afterImage} onChange={v => set("afterImage", v)} /><MediaPicker onSelect={url => set("afterImage", url)} /></div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Label Before"><Inp value={data.beforeLabel ?? ""} onChange={v => set("beforeLabel", v)} placeholder="Trước" /></Field>
            <Field label="Label After"><Inp value={data.afterLabel ?? ""} onChange={v => set("afterLabel", v)} placeholder="Sau" /></Field>
          </div>
        </div>
      ) : <BlockSettingsEditor settings={data.settings} onChange={v => set("settings", v)} />}
    </div>
  );
}
