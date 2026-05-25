"use client";
import React from "react";
import { Field, Inp, Txt, ActionPicker } from "@/components/cms/block-editors/shared";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function JobListingsEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const updateJob = (i: number, f: string, v: any) => { const jobs=[...(data.jobs??[])]; jobs[i]={...jobs[i],[f]:v}; set("jobs",jobs); };
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Field label="Section label"><Inp value={data.sectionLabel??""} onChange={v => set("sectionLabel",v)} /></Field>
          <Field label="Title *"><Inp value={data.title} onChange={v => set("title",v)} /></Field>
        </div>
        <Field label="Subtitle"><Inp value={data.subtitle??""} onChange={v => set("subtitle",v)} /></Field>
        <Field label="Phòng ban (dấu phẩy)"><Inp value={(data.departments??[]).join(",")} onChange={v => set("departments",v.split(",").map((s:string)=>s.trim()).filter(Boolean))} placeholder="Engineering, Design, Marketing" /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.showFilter??true} onChange={e => set("showFilter",e.target.checked)} />Hiện filter</label>

        <div className="grid grid-cols-2 gap-2 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
          <Field label="Nhãn filter Tất cả"><Inp value={data.allFilterLabel ?? "Tất cả"} onChange={v => set("allFilterLabel",v)} /></Field>
          <Field label="Văn bản khi danh sách trống"><Inp value={data.emptyStateText ?? "Không có vị trí nào"} onChange={v => set("emptyStateText",v)} /></Field>
          <div className="col-span-2">
            <Field label="Văn bản nút ứng tuyển (Apply)"><Inp value={data.applyBtnText ?? "Chi tiết →"} onChange={v => set("applyBtnText",v)} /></Field>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Vị trí tuyển dụng</span>
            <Button size="sm" variant="outline" onClick={() => set("jobs",[...(data.jobs??[]),{title:"Vị trí mới",department:"Engineering",location:"Hà Nội",type:"full-time"}])}><Plus className="w-3 h-3"/>Thêm</Button>
          </div>
          {(data.jobs??[]).map((job: any, i: number) => (
            <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex justify-between"><span className="text-xs text-slate-500">{job.title}</span><Button variant="ghost" size="sm" onClick={() => set("jobs",(data.jobs??[]).filter((_:any,j:number)=>j!==i))}><Trash2 className="w-3 h-3"/></Button></div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Chức danh"><Inp value={job.title} onChange={v => updateJob(i,"title",v)} /></Field>
                <Field label="Phòng ban"><Inp value={job.department} onChange={v => updateJob(i,"department",v)} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Địa điểm"><Inp value={job.location} onChange={v => updateJob(i,"location",v)} /></Field>
                <Field label="Loại">
                  <select className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm" value={job.type} onChange={e => updateJob(i,"type",e.target.value)}>
                    <option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="contract">Contract</option><option value="remote">Remote</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Lương"><Inp value={job.salary??""} onChange={v => updateJob(i,"salary",v)} /></Field>
                <ActionPicker label="Action (Apply)" value={job.applyAction} onChange={v => updateJob(i,"applyAction",v)} />
              </div>
              <Field label="Mô tả"><Txt value={job.description??""} onChange={v => updateJob(i,"description",v)} rows={2} /></Field>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
