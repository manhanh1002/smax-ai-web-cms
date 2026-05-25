"use client";
import React from "react";
import { Field, Inp } from "@/components/cms/block-editors/shared";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ContactFormEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const updateField = (i: number, f: string, v: any) => { const fields=[...(data.fields??[])]; fields[i]={...fields[i],[f]:v}; set("fields",fields); };
  const ci = data.contactInfo ?? {};
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Field label="Tiêu đề *"><Inp value={data.title} onChange={v => set("title",v)} /></Field>
        <Field label="Subtitle"><Inp value={data.subtitle??""} onChange={v => set("subtitle",v)} /></Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Submit URL *"><Inp value={data.submitUrl} onChange={v => set("submitUrl",v)} /></Field>
          <Field label="Text nút submit"><Inp value={data.submitText??""} onChange={v => set("submitText",v)} placeholder="Gửi" /></Field>
        </div>
        <Field label="Layout">
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" value={data.layout??"form-only"} onChange={e => set("layout",e.target.value)}>
            <option value="form-only">Chỉ form</option><option value="side-by-side">Form + Contact info</option>
          </select>
        </Field>
        {data.layout === "side-by-side" && (
          <div className="border border-slate-200 rounded-xl p-3 space-y-3">
            <p className="text-xs font-semibold text-slate-500">Thông tin liên hệ & Nhãn</p>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Nhãn Địa chỉ"><Inp value={data.addressLabel ?? "📍 Địa chỉ"} onChange={v => set("addressLabel", v)} /></Field>
              <Field label="Địa chỉ"><Inp value={ci.address??""} onChange={v => set("contactInfo",{...ci,address:v})} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Nhãn SĐT"><Inp value={data.phoneLabel ?? "☎️ SĐT"} onChange={v => set("phoneLabel", v)} /></Field>
              <Field label="SĐT"><Inp value={ci.phone??""} onChange={v => set("contactInfo",{...ci,phone:v})} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Nhãn Email"><Inp value={data.emailLabel ?? "✉️ Email"} onChange={v => set("emailLabel", v)} /></Field>
              <Field label="Email"><Inp value={ci.email??""} onChange={v => set("contactInfo",{...ci,email:v})} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Nhãn Giờ"><Inp value={data.hoursLabel ?? "🕐 Giờ"} onChange={v => set("hoursLabel", v)} /></Field>
              <Field label="Giờ hoạt động"><Inp value={ci.hours??""} onChange={v => set("contactInfo",{...ci,hours:v})} /></Field>
            </div>
          </div>
        )}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Form fields</span>
            <Button size="sm" variant="outline" onClick={() => set("fields",[...(data.fields??[]),{name:"field",label:"Field",type:"text",required:true}])}><Plus className="w-3 h-3"/>Thêm</Button>
          </div>
          {(data.fields??[]).map((f: any, i: number) => (
            <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex justify-between"><span className="text-xs text-slate-500">{f.label}</span><Button variant="ghost" size="sm" onClick={() => set("fields",(data.fields??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button></div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Field name"><Inp value={f.name} onChange={v => updateField(i,"name",v)} /></Field>
                <Field label="Label"><Inp value={f.label} onChange={v => updateField(i,"label",v)} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Type">
                  <select className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm" value={f.type} onChange={e => updateField(i,"type",e.target.value)}>
                    {["text","email","tel","textarea","select"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Placeholder"><Inp value={f.placeholder??""} onChange={v => updateField(i,"placeholder",v)} /></Field>
              </div>
              {f.type==="select" && <Field label="Options (dấu phẩy)"><Inp value={(f.options??[]).join(",")} onChange={v => updateField(i,"options",v.split(",").map((s:string)=>s.trim()))} /></Field>}
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.required} onChange={e => updateField(i,"required",e.target.checked)} />Bắt buộc</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
