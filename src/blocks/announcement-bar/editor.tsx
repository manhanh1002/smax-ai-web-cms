"use client";
import React from "react";
import { Field, Inp, ActionPicker } from "@/components/cms/block-editors/shared";

export function AnnouncementBarEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });

  return (
    <div className="space-y-3">
      <Field label="Nội dung *"><Inp value={data.message} onChange={v => set("message", v)} /></Field>
      <Field label="Icon (emoji)"><Inp value={data.icon ?? ""} onChange={v => set("icon", v)} /></Field>
      <Field label="Text nút CTA"><Inp value={data.ctaText ?? ""} onChange={v => set("ctaText", v)} /></Field>
      <ActionPicker label="Hành động CTA" value={data.ctaAction} onChange={v => set("ctaAction", v)} />
      <Field label="Màu nền">
        <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={data.bgColor ?? "violet"} onChange={e => set("bgColor", e.target.value)}>
          {["violet","blue","emerald","amber","rose","slate"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={data.dismissible ?? false} onChange={e => set("dismissible", e.target.checked)} />
        Có thể đóng
      </label>
    </div>
  );
}
