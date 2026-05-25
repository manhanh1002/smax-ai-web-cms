"use client";
import React from "react";
import { Field, Inp } from "@/components/cms/block-editors/shared";
import { MediaPicker } from "@/components/cms/MediaPicker";

export function BeforeAfterEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-4">
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
        <Field label="Dòng hướng dẫn kéo"><Inp value={data.helperText ?? "Kéo để so sánh"} onChange={v => set("helperText", v)} /></Field>
      </div>
    </div>
  );
}
