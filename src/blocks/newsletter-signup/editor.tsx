"use client";
import React, { useState } from "react";
import { Field, Inp, BlockSettingsEditor } from "@/components/cms/block-editors/shared";

export function NewsletterSignupEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const [tab, setTab] = useState("content");
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-200 text-sm font-medium">
        {["content","design"].map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 capitalize ${tab===t?"border-b-2 border-violet-600 text-violet-600":"text-slate-500"}`}>{t}</button>)}
      </div>
      {tab === "content" ? (
        <div className="space-y-3">
          <Field label="Tiêu đề *"><Inp value={data.title} onChange={v => set("title", v)} /></Field>
          <Field label="Subtitle"><Inp value={data.subtitle ?? ""} onChange={v => set("subtitle", v)} /></Field>
          <Field label="Placeholder input"><Inp value={data.placeholder ?? ""} onChange={v => set("placeholder", v)} placeholder="Nhập email của bạn..." /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Text nút"><Inp value={data.submitText ?? ""} onChange={v => set("submitText", v)} placeholder="Đăng ký" /></Field>
            <Field label="Submit URL *"><Inp value={data.submitUrl} onChange={v => set("submitUrl", v)} placeholder="/api/newsletter" /></Field>
          </div>
          <Field label="Social proof"><Inp value={data.subscriberCount ?? ""} onChange={v => set("subscriberCount", v)} placeholder="10,000+ đã đăng ký" /></Field>
          <Field label="Kiểu nền">
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={data.bgStyle ?? "light"} onChange={e => set("bgStyle", e.target.value)}>
              <option value="light">Sáng</option><option value="dark">Tối</option><option value="gradient">Gradient</option>
            </select>
          </Field>
        </div>
      ) : (
        <BlockSettingsEditor settings={data.settings} onChange={v => set("settings", v)} />
      )}
    </div>
  );
}
