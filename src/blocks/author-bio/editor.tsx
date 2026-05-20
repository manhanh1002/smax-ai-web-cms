"use client";
import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor } from "@/components/cms/block-editors/shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const PLATFORMS = ["linkedin","twitter","facebook","website","github"];

export function AuthorBioEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const [tab, setTab] = useState("content");
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });

  const updateSocial = (i: number, field: string, value: string) => {
    const socials = [...(data.socials ?? [])];
    socials[i] = { ...socials[i], [field]: value };
    set("socials", socials);
  };

  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-200 text-sm font-medium">
        {["content","design"].map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 capitalize ${tab===t?"border-b-2 border-violet-600 text-violet-600":"text-slate-500"}`}>{t}</button>)}
      </div>
      {tab === "content" ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tên *"><Inp value={data.name} onChange={v => set("name", v)} /></Field>
            <Field label="Avatar">
              <div className="flex gap-2">
                <Inp value={data.avatar ?? ""} onChange={v => set("avatar", v)} />
                <MediaPicker onSelect={url => set("avatar", url)} />
              </div>
            </Field>
            <Field label="Chức danh"><Inp value={data.title ?? ""} onChange={v => set("title", v)} /></Field>
            <Field label="Công ty"><Inp value={data.company ?? ""} onChange={v => set("company", v)} /></Field>
          </div>
          <Field label="Tiểu sử"><Txt value={data.bio} onChange={v => set("bio", v)} rows={3} /></Field>
          <Field label="Layout">
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={data.layout ?? "horizontal"} onChange={e => set("layout", e.target.value)}>
              <option value="horizontal">Ngang</option><option value="vertical">Dọc (căn giữa)</option>
            </select>
          </Field>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Mạng xã hội</span>
              <Button size="sm" variant="outline" onClick={() => set("socials", [...(data.socials??[]), {platform:"linkedin",url:""}])}><Plus className="w-3 h-3" /> Thêm</Button>
            </div>
            {(data.socials ?? []).map((s: any, i: number) => (
              <div key={i} className="flex gap-2">
                <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm" value={s.platform} onChange={e => updateSocial(i,"platform",e.target.value)}>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <Inp value={s.url} onChange={v => updateSocial(i,"url",v)} placeholder="https://..." />
                <Button variant="ghost" size="sm" onClick={() => set("socials",(data.socials??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3" /></Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <BlockSettingsEditor settings={data.settings} onChange={v => set("settings", v)} />
      )}
    </div>
  );
}
