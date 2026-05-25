"use client";
import React from "react";
import { Field, Inp, Txt } from "@/components/cms/block-editors/shared";
import { MediaPicker } from "@/components/cms/MediaPicker";

export function QuoteHighlightEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });

  return (
    <div className="space-y-3">
      <Field label="Nội dung trích dẫn *"><Txt value={data.quote} onChange={v => set("quote", v)} rows={4} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tên tác giả"><Inp value={data.author ?? ""} onChange={v => set("author", v)} /></Field>
        <Field label="Chức danh"><Inp value={data.role ?? ""} onChange={v => set("role", v)} /></Field>
        <Field label="Công ty"><Inp value={data.company ?? ""} onChange={v => set("company", v)} /></Field>
        <Field label="Avatar">
          <div className="flex gap-2">
            <Inp value={data.avatar ?? ""} onChange={v => set("avatar", v)} />
            <MediaPicker onSelect={url => set("avatar", url)} />
          </div>
        </Field>
      </div>
      <Field label="Màu accent">
        <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={data.accentColor ?? "violet"} onChange={e => set("accentColor", e.target.value)}>
          {["violet","blue","teal","orange","rose"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={data.alignment === "center"} onChange={e => set("alignment", e.target.checked ? "center" : "left")} />
        Căn giữa
      </label>
    </div>
  );
}
