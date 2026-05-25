"use client";

import React, { useState } from "react";
import { Field, Inp, BlockSettingsEditor } from "@/components/cms/block-editors/shared";
import { Type, LayoutTemplate, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { CardCarouselBlockData } from "./definition";
import { BlockData } from "../types";

export function CardCarouselEditor({ data, onChange }: { data: BlockData<CardCarouselBlockData>; onChange: (d: BlockData<CardCarouselBlockData>) => void }) {
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });

  const addCard = () => {
    const cards = [...(data.cards || [])];
    cards.push({ title: "", subtitle: "", image: "", description: "", features: [] });
    u("cards", cards);
  };

  const removeCard = (idx: number) => {
    const cards = [...(data.cards || [])];
    cards.splice(idx, 1);
    u("cards", cards);
  };

  const updateCard = (idx: number, key: string, val: any) => {
    const cards = [...(data.cards || [])];
    cards[idx] = { ...cards[idx], [key]: val };
    u("cards", cards);
  };

  return (
    <div className="space-y-6">
      {/* Slider Configuration */}
      <div className="p-4 bg-slate-50 rounded-2xl space-y-4">
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Cấu hình Slider</h4>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tự động chạy">
            <select
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm"
              value={data.autoplay ? "true" : "false"}
              onChange={e => u("autoplay", e.target.value === "true")}
            >
              <option value="true">Bật</option>
              <option value="false">Tắt</option>
            </select>
          </Field>
          <Field label="Tốc độ (ms)"><Inp type="number" value={data.autoplayInterval || 5000} onChange={v => u("autoplayInterval", parseInt(v))} /></Field>
          <Field label="Hiển thị mũi tên">
            <select
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm"
              value={data.showArrows !== false ? "true" : "false"}
              onChange={e => u("showArrows", e.target.value === "true")}
            >
              <option value="true">Hiện</option>
              <option value="false">Ẩn</option>
            </select>
          </Field>
          <Field label="Hiển thị thanh trượt">
            <select
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm"
              value={data.showPagination !== false ? "true" : "false"}
              onChange={e => u("showPagination", e.target.value === "true")}
            >
              <option value="true">Hiện</option>
              <option value="false">Ẩn</option>
            </select>
          </Field>
          <Field label="Hiển thị ảnh">
            <select
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm"
              value={data.imageFit || "cover"}
              onChange={e => u("imageFit", e.target.value)}
            >
              <option value="cover">Cover (Đầy khung)</option>
              <option value="contain">Contain (Giữ nguyên tỉ lệ)</option>
            </select>
          </Field>
        </div>
      </div>

      <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Badge"><Inp value={data.badge || ""} onChange={v => u("badge", v)} /></Field>
            <div className="col-span-2"><Field label="Tiêu đề chính"><Inp value={data.title || ""} onChange={v => u("title", v)} /></Field></div>
            <div className="col-span-2"><Field label="Tiêu đề nổi bật"><Inp value={data.titleHighlight || ""} onChange={v => u("titleHighlight", v)} /></Field></div>
            <div className="col-span-2"><Field label="Mô tả phụ"><Inp value={data.subtitle || ""} onChange={v => u("subtitle", v)} /></Field></div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Danh sách Cards (Carousel)</label>
            {(data.cards || []).map((card: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative">
                <Button variant="ghost" size="sm" onClick={() => removeCard(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Tiêu đề card"><Inp value={card.title || ""} onChange={v => updateCard(idx, "title", v)} /></Field>
                  <Field label="Tag / Lĩnh vực"><Inp value={card.subtitle || ""} onChange={v => updateCard(idx, "subtitle", v)} /></Field>
                  <div className="col-span-2">
                    <Field label="Mô tả chi tiết"><Inp value={card.description || ""} onChange={v => updateCard(idx, "description", v)} /></Field>
                  </div>
                  <div className="col-span-2">
                    <Field label="Danh sách tính năng (phân cách bằng dấu chấm phẩy)">
                      <Inp
                        value={(card.features || []).join("; ")}
                        onChange={v => updateCard(idx, "features", v.split(";").map((s: string) => s.trim()).filter(Boolean))}
                      />
                    </Field>
                  </div>
                </div>
                <Field label="Ảnh minh hoạ">
                  <div className="flex gap-2">
                    <Inp value={card.image || ""} onChange={v => updateCard(idx, "image", v)} />
                    <MediaPicker onSelect={url => updateCard(idx, "image", url)} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                  </div>
                </Field>
              </div>
            ))}
            <Button variant="outline" className="w-full border-dashed" onClick={addCard}><Plus className="w-4 h-4 mr-2" /> Thêm Card mới</Button>
          </div>
        </div>
    </div>
  );
}
