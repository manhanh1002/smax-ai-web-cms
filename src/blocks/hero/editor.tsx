"use client";

import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor, ActionPicker } from "@/components/cms/block-editors/shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Image as ImageIcon, LayoutTemplate, Type } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { HeroBlockData } from "./definition";
import { BlockData } from "../types";

export function HeroBlockEditor({ data, onChange }: { data: BlockData<HeroBlockData>; onChange: (d: BlockData<HeroBlockData>) => void }) {
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });
  
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("content")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "content" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Type className="w-4 h-4" /> Nội dung
        </button>
        <button
          onClick={() => setActiveTab("design")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "design" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <LayoutTemplate className="w-4 h-4" /> Thiết kế
        </button>
      </div>

      {activeTab === "design" ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
            <p className="text-xs text-blue-600 font-medium leading-relaxed">
              Thiết kế của block này đang được quản lý tập trung bởi <strong>Giao diện hệ thống</strong>. 
              Mọi thay đổi về Theme, Font chữ và Padding sẽ được áp dụng đồng bộ từ trang <strong>Cấu hình Theme</strong>.
            </p>
          </div>
          

          <BlockSettingsEditor 
            settings={data.settings} 
            onChange={v => onChange({ ...data, settings: v })} 
          />
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/85">
              <Field label="Loại Badge">
                <div className="flex gap-2">
                  {[
                    { id: "text", label: "Chữ (Text Badge)" },
                    { id: "image", label: "Hình ảnh (Image Badge)" }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => u("badgeType", t.id as any)}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border",
                        (data.badgeType || "text") === t.id
                          ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </Field>

              {(data.badgeType || "text") === "text" ? (
                <Field label="Chữ Badge">
                  <Inp value={data.badge || ""} onChange={v => u("badge", v)} placeholder="Ví dụ: Nền tảng..." />
                </Field>
              ) : (
                <Field label="Ảnh Badge">
                  <div className="flex gap-2">
                    <Inp value={data.badgeImage || ""} onChange={v => u("badgeImage", v)} placeholder="https://... hoặc chọn ảnh" />
                    <MediaPicker onSelect={url => u("badgeImage", url)} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                  </div>
                  {data.badgeImage && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-slate-400">Xem trước:</span>
                      <img src={data.badgeImage} className="h-10 object-contain rounded bg-slate-50 border p-1" alt="" />
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 h-7 px-2 text-xs" onClick={() => u("badgeImage", "")}>Xoá ảnh</Button>
                    </div>
                  )}
                </Field>
              )}
            </div>
            <Field label="Nút chính"><Inp value={data.primaryBtn || ""} onChange={v => u("primaryBtn", v)} placeholder="Dùng thử miễn phí" /></Field>
            <Field label="Tiêu đề"><Inp value={data.title || ""} onChange={v => u("title", v)} placeholder="Tiêu đề chính" /></Field>
            <Field label="Highlight (màu cam/blue)"><Inp value={data.highlight || ""} onChange={v => u("highlight", v)} placeholder="từ khoá nổi bật" /></Field>
            <div className="md:col-span-2">
              <ActionPicker 
                label="Hành động nút chính" 
                value={data.primaryBtnUrl || ""} 
                onChange={v => u("primaryBtnUrl", v)} 
              />
            </div>
            <Field label="Nút phụ"><Inp value={data.secondaryBtn || ""} onChange={v => u("secondaryBtn", v)} placeholder="Đặt lịch tư vấn" /></Field>
            <div className="md:col-span-2">
              <ActionPicker 
                label="Hành động nút phụ" 
                value={data.secondaryBtnUrl || ""} 
                onChange={v => u("secondaryBtnUrl", v)} 
              />
            </div>
            <div className="md:col-span-2"><Field label="Mô tả ngắn"><Txt value={data.subtitle || ""} onChange={v => u("subtitle", v)} placeholder="Mô tả..." rows={2} /></Field></div>
            <div className="md:col-span-2">
              <Field label="Ảnh Hero">
                <div className="flex gap-2">
                  <Inp value={data.image || ""} onChange={v => u("image", v)} placeholder="https://... hoặc chọn từ Media" />
                  <MediaPicker onSelect={url => u("image", url)} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                </div>
                {data.image && <img src={data.image} className="mt-2 h-24 object-contain rounded-xl bg-slate-50 border" alt="" />}
              </Field>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
