"use client";
import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor } from "@/components/cms/block-editors/shared";
import { MediaPicker } from "@/components/cms/MediaPicker";

export function VideoSectionEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const [tab, setTab] = useState("content");
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-200 text-sm font-medium">
        {["content","design"].map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 capitalize ${tab===t?"border-b-2 border-violet-600 text-violet-600":"text-slate-500"}`}>{t}</button>)}
      </div>
      {tab === "content" ? (
        <div className="space-y-3">
          <Field label="Video URL * (YouTube / Vimeo)"><Inp value={data.videoUrl} onChange={v => set("videoUrl", v)} placeholder="https://youtube.com/watch?v=..." /></Field>
          <Field label="Thumbnail (ảnh preview)">
            <div className="flex gap-2"><Inp value={data.thumbnailUrl ?? ""} onChange={v => set("thumbnailUrl", v)} /><MediaPicker onSelect={url => set("thumbnailUrl", url)} /></div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tiêu đề *"><Inp value={data.title} onChange={v => set("title", v)} /></Field>
            <Field label="Tiêu đề Highlight"><Inp value={data.titleHighlight??""} onChange={v => set("titleHighlight",v)} /></Field>
          </div>
          <Field label="Mô tả"><Txt value={data.description ?? ""} onChange={v => set("description", v)} rows={3} /></Field>
          <Field label="Layout">
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={data.layout ?? "centered"} onChange={e => set("layout", e.target.value)}>
              <option value="centered">Căn giữa</option><option value="split">Video + Text ngang</option>
            </select>
          </Field>
        </div>
      ) : <BlockSettingsEditor settings={data.settings} onChange={v => set("settings", v)} />}
    </div>
  );
}
