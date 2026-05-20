"use client";
import React, { useState } from "react";
import { Field, Inp, BlockSettingsEditor, ActionPicker } from "@/components/cms/block-editors/shared";

export function HeroCenteredEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const [tab, setTab] = useState("content");
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-200 text-sm font-medium">
        {["content","design"].map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 capitalize ${tab===t?"border-b-2 border-violet-600 text-violet-600":"text-slate-500"}`}>{t}</button>)}
      </div>
      {tab === "content" ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Badge"><Inp value={data.badge ?? ""} onChange={v => set("badge", v)} /></Field>
            <Field label="Eyebrow icon"><Inp value={data.eyebrowIcon ?? ""} onChange={v => set("eyebrowIcon", v)} placeholder="🚀" /></Field>
          </div>
          <Field label="Title *"><Inp value={data.title} onChange={v => set("title", v)} /></Field>
          <Field label="Highlight text (màu nổi bật)"><Inp value={data.highlight ?? ""} onChange={v => set("highlight", v)} /></Field>
          <Field label="Subtitle"><Inp value={data.subtitle ?? ""} onChange={v => set("subtitle", v)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Primary button"><Inp value={data.primaryBtnText ?? ""} onChange={v => set("primaryBtnText", v)} /></Field>
            <ActionPicker label="Primary action" value={data.primaryBtnAction} onChange={v => set("primaryBtnAction", v)} />
            <Field label="Secondary button"><Inp value={data.secondaryBtnText ?? ""} onChange={v => set("secondaryBtnText", v)} /></Field>
            <ActionPicker label="Secondary action" value={data.secondaryBtnAction} onChange={v => set("secondaryBtnAction", v)} />
          </div>
          <Field label="Background gradient">
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={data.bgGradient ?? "none"} onChange={e => set("bgGradient", e.target.value)}>
              <option value="none">Không gradient</option>
              {["purple","blue","teal","orange"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>
      ) : <BlockSettingsEditor settings={data.settings} onChange={v => set("settings", v)} />}
    </div>
  );
}
