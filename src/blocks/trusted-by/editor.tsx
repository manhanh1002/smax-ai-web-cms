"use client";

import React, { useState } from "react";
import { Field, Inp, BlockSettingsEditor } from "@/components/cms/block-editors/shared";
import { Type, LayoutTemplate, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { TrustedByBlockData } from "./definition";
import { BlockData } from "../types";

export function TrustedByBlockEditor({ data, onChange }: { data: BlockData<TrustedByBlockData>; onChange: (d: BlockData<TrustedByBlockData>) => void }) {
  const u = (key: string, val: any) => onChange({ ...data, [key]: val });
  
  const addLogo = () => {
    const logos = [...(data.logos || [])];
    logos.push("");
    u("logos", logos);
  };

  const removeLogo = (index: number) => {
    const logos = [...(data.logos || [])];
    logos.splice(index, 1);
    u("logos", logos);
  };

  const updateLogo = (index: number, val: string) => {
    const logos = [...(data.logos || [])];
    logos[index] = val;
    u("logos", logos);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nhãn (Label)"><Inp value={data.label || ""} onChange={v => u("label", v)} /></Field>
            <Field label="Điểm nhấn (Highlight)"><Inp value={data.highlight || ""} onChange={v => u("highlight", v)} /></Field>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Danh sách Logo đối tác</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(data.logos || []).map((logo: string, idx: number) => (
                <div key={idx} className="flex gap-2 items-center p-3 bg-slate-50 border border-slate-200 rounded-xl relative group">
                  <div className="w-12 h-12 bg-white rounded-lg border flex items-center justify-center shrink-0 overflow-hidden">
                    {logo ? <img src={logo} className="w-full h-full object-contain" alt="" /> : <ImageIcon className="w-4 h-4 text-slate-300" />}
                  </div>
                  <Inp value={logo} onChange={v => updateLogo(idx, v)} placeholder="URL logo..." />
                  <MediaPicker onSelect={url => updateLogo(idx, url)} trigger={<Button variant="ghost" size="sm" className="shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                  <Button variant="ghost" size="sm" onClick={() => removeLogo(idx)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full border-dashed" onClick={addLogo}>
              <Plus className="w-4 h-4 mr-2" /> Thêm Logo mới
            </Button>
          </div>
        </div>
    </div>
  );
}
