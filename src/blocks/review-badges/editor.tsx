"use client";
import React from "react";
import { Field, Inp, ActionPicker } from "@/components/cms/block-editors/shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ReviewBadgesEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const updateBadge = (i: number, f: string, v: any) => { const b=[...(data.badges??[])]; b[i]={...b[i],[f]:v}; set("badges",b); };
  return (
    <div className="space-y-3">
      <Field label="Tiêu đề"><Inp value={data.title??""} onChange={v => set("title",v)} /></Field>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>Review Badges</span>
          <Button size="sm" variant="outline" onClick={() => set("badges",[...(data.badges??[]),{platform:"g2",rating:4.5,reviewCount:100}])}><Plus className="w-3 h-3"/>Thêm</Button>
        </div>
        {(data.badges??[]).map((b: any, i: number) => (
          <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
            <div className="flex justify-between"><span className="text-xs text-slate-500">{b.platform}</span><Button variant="ghost" size="sm" onClick={() => set("badges",(data.badges??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button></div>
            <div className="grid grid-cols-3 gap-2">
              <Field label="Nền tảng">
                <select className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm" value={b.platform} onChange={e => updateBadge(i,"platform",e.target.value)}>
                  {["g2","capterra","trustpilot","google","custom"].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Rating (0-5)"><Inp type="number" step="0.1" min="0" max="5" value={b.rating} onChange={v => updateBadge(i,"rating",parseFloat(v))} /></Field>
              <Field label="Số đánh giá"><Inp type="number" value={b.reviewCount} onChange={v => updateBadge(i,"reviewCount",parseInt(v))} /></Field>
            </div>
            <Field label="Badge Logo">
              <div className="flex gap-2"><Inp value={b.badgeUrl??""} onChange={v => updateBadge(i,"badgeUrl",v)} /><MediaPicker onSelect={url => updateBadge(i,"badgeUrl",url)} /></div>
            </Field>
            <ActionPicker label="Action (link)" value={b.action} onChange={v => updateBadge(i,"action",v)} />
          </div>
        ))}
      </div>
    </div>
  );
}
