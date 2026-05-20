"use client";

import React, { useState, useEffect } from "react";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/utils";
import { BlockSettings, ButtonAction } from "@/blocks/types";
import { supabase } from "@/lib/supabase";
import {
  Link2, FileText, Anchor, MessageSquare, ExternalLink,
  Image as ImageIcon, AlignLeft, AlignCenter, AlignRight,
  Maximize, Minimize, Smartphone, Monitor, Hash, Zap, Box,
  Sun, Moon
} from "lucide-react";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Button } from "@/components/ui/Button";

// Shared helpers for all block editors
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
      {children}
    </div>
  );
}

export function Inp({ value, onChange, placeholder, type = "text", className, ...props }: { value: any; onChange: (v: string) => void; placeholder?: string; type?: string; className?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn("w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all", className)}
      {...props}
    />
  );
}

export function Txt({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
    />
  );
}


export function ActionPicker({
  label,
  value,
  onChange
}: {
  label: string;
  value: ButtonAction | string;
  onChange: (v: ButtonAction) => void
}) {
  const [pages, setPages] = useState<any[]>([]);
  const [popups, setPopups] = useState<any[]>([]);

  // Ensure value is a ButtonAction object
  const action: ButtonAction = typeof value === "string"
    ? { type: "url", url: value, target: "_self" }
    : value || { type: "url", url: "", target: "_self" };

  useEffect(() => {
    async function fetchData() {
      const [pagesRes, popupsRes] = await Promise.all([
        supabase.from("pages").select("title, slug"),
        supabase.from("popups").select("name, id").eq("is_active", true)
      ]);
      if (pagesRes.data) setPages(pagesRes.data);
      if (popupsRes.data) setPopups(popupsRes.data);
    }
    fetchData();
  }, []);

  const u = (updates: Partial<ButtonAction>) => onChange({ ...action, ...updates });

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest min-w-0 leading-tight">{label}</label>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
          {[
            { id: "url", icon: Link2, label: "Link" },
            { id: "page", icon: FileText, label: "Trang" },
            { id: "block", icon: Anchor, label: "Block" },
            { id: "popup", icon: MessageSquare, label: "Popup" }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => u({ type: tab.id as any })}
              className={cn(
                "p-1.5 rounded-md transition-all",
                action.type === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
              title={tab.label}
            >
              <tab.icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {action.type === "url" && (
          <div className="space-y-3">
            <Inp
              value={action.url || ""}
              onChange={v => u({ url: v })}
              placeholder="https://google.com..."
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="target-blank"
                checked={action.target === "_blank"}
                onChange={e => u({ target: e.target.checked ? "_blank" : "_self" })}
                className="rounded border-slate-300"
              />
              <label htmlFor="target-blank" className="text-xs text-slate-500 font-bold flex items-center gap-1 cursor-pointer">
                Mở tab mới <ExternalLink className="w-3 h-3" />
              </label>
            </div>
          </div>
        )}

        {action.type === "page" && (
          <select
            value={action.pageSlug || ""}
            onChange={e => u({ pageSlug: e.target.value })}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">-- Chọn trang --</option>
            {pages.map(p => (
              <option key={p.slug} value={p.slug}>{p.title}</option>
            ))}
          </select>
        )}

        {action.type === "block" && (
          <div className="space-y-2">
            <Inp
              value={action.blockId || ""}
              onChange={v => u({ blockId: v })}
              placeholder="Nhập Anchor ID của block..."
            />
            <p className="text-[10px] text-slate-400 font-medium italic">
              * Bạn có thể đặt Anchor ID trong tab Thiết kế của từng block.
            </p>
          </div>
        )}

        {action.type === "popup" && (
          <select
            value={action.popupId || ""}
            onChange={e => u({ popupId: e.target.value })}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">-- Chọn Popup --</option>
            {popups.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

export function DarkToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
      <div className="space-y-0.5">
        <div className="text-xs font-black text-[#0F1836]">Chế độ tối (Dark Mode)</div>
        <div className="text-[10px] text-slate-400">Bật để chuyển block sang giao diện tối</div>
      </div>
      <Toggle checked={value} onChange={onChange} />
    </div>
  );
}

export function ThemeSelector({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
            value === opt.value
              ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}


export function BlockSettingsEditor({ settings = {}, onChange }: { settings?: BlockSettings; onChange: (settings: BlockSettings) => void }) {
  const u = (key: keyof BlockSettings, val: any) => onChange({ ...settings, [key]: val });

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Cấu hình Layout & Hiển thị</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Padding Top">
            <select
              value={settings.paddingTop || ""}
              onChange={(e) => u("paddingTop", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
            >
              <option value="">Mặc định hệ thống</option>
              <option value="none">Không có (0px)</option>
              <option value="small">Nhỏ (32px)</option>
              <option value="medium">Vừa (64px)</option>
              <option value="large">Lớn (96px)</option>
              <option value="xlarge">Rất lớn (128px)</option>
            </select>
          </Field>
          <Field label="Padding Bottom">
            <select
              value={settings.paddingBottom || ""}
              onChange={(e) => u("paddingBottom", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
            >
              <option value="">Mặc định hệ thống</option>
              <option value="none">Không có (0px)</option>
              <option value="small">Nhỏ (32px)</option>
              <option value="medium">Vừa (64px)</option>
              <option value="large">Lớn (96px)</option>
              <option value="xlarge">Rất lớn (128px)</option>
            </select>
          </Field>
          <Field label="Chế độ màu sắc (Color Mode)">
            <div className="flex bg-white rounded-xl border border-slate-200 p-1">
              {[
                { id: 'light', icon: Sun, label: 'Sáng' },
                { id: 'dark', icon: Moon, label: 'Tối' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => u("colorMode", item.id as any)}
                  className={cn(
                    "flex-1 h-9 flex items-center justify-center rounded-lg transition-all text-xs font-bold gap-2",
                    (settings.colorMode || "light") === item.id ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Màu nền (Background)">
            <select
              value={settings.background || "default"}
              onChange={(e) => u("background", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
            >
              <option value="default">Trắng (Mặc định)</option>
              <option value="muted">Xám nhạt (Muted)</option>
              <option value="primary">Màu chủ đạo (Primary)</option>
              <option value="gradient">Gradient mờ</option>
              <option value="custom">Tuỳ chỉnh nâng cao...</option>
            </select>
          </Field>
          <Field label="Căn lề chữ (Text Align)">
            <div className="flex bg-white rounded-xl border border-slate-200 p-1">
              {[
                { id: 'left', icon: AlignLeft },
                { id: 'center', icon: AlignCenter },
                { id: 'right', icon: AlignRight }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => u("textAlign", item.id)}
                  className={cn(
                    "flex-1 h-8 flex items-center justify-center rounded-lg transition-all",
                    (settings.textAlign || "center") === item.id ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </Field>
        </div>

        {settings.background === "custom" && (
          <div className="space-y-4 pt-4 border-t border-slate-200 mt-4 animate-in slide-in-from-top-2 duration-300">
            <Field label="Loại nền tuỳ chỉnh">
              <div className="flex gap-2">
                {['color', 'image', 'gradient'].map(type => (
                  <button
                    key={type}
                    onClick={() => u("backgroundType", type)}
                    className={cn(
                      "flex-1 h-9 rounded-xl text-xs font-bold border transition-all",
                      (settings.backgroundType || "color") === type ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-500"
                    )}
                  >
                    {type === 'color' ? 'Màu sắc' : type === 'image' ? 'Hình ảnh' : 'Gradient'}
                  </button>
                ))}
              </div>
            </Field>

            {settings.backgroundType === 'image' ? (
              <Field label="Chọn ảnh nền">
                <div className="flex gap-2">
                  <Inp
                    value={settings.backgroundImage || ""}
                    onChange={v => u("backgroundImage", v)}
                    placeholder="https://... hoặc chọn Media"
                  />
                  <MediaPicker
                    onSelect={url => u("backgroundImage", url)}
                    trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>}
                  />
                </div>
                {settings.backgroundImage && (
                  <img src={settings.backgroundImage} className="mt-2 h-20 w-full object-cover rounded-xl border" alt="" />
                )}
              </Field>
            ) : settings.backgroundType === 'gradient' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Màu bắt đầu">
                    <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-xl">
                      <input
                        type="color"
                        value={settings.gradientStart || "#4facfe"}
                        onChange={e => u("gradientStart", e.target.value)}
                        className="w-6 h-6 rounded-md border-none bg-transparent cursor-pointer"
                      />
                      <Inp
                        value={settings.gradientStart || "#4facfe"}
                        onChange={v => u("gradientStart", v)}
                        placeholder="#4facfe"
                      />
                    </div>
                  </Field>
                  <Field label="Màu kết thúc">
                    <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-xl">
                      <input
                        type="color"
                        value={settings.gradientEnd || "#00f2fe"}
                        onChange={e => u("gradientEnd", e.target.value)}
                        className="w-6 h-6 rounded-md border-none bg-transparent cursor-pointer"
                      />
                      <Inp
                        value={settings.gradientEnd || "#00f2fe"}
                        onChange={v => u("gradientEnd", v)}
                        placeholder="#00f2fe"
                      />
                    </div>
                  </Field>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Field label={`Góc xoay (${settings.gradientAngle || 135}°)`}>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={settings.gradientAngle || 135}
                        onChange={e => u("gradientAngle", parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </Field>
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl border border-slate-200 shadow-sm shrink-0"
                    style={{ background: `linear-gradient(${settings.gradientAngle || 135}deg, ${settings.gradientStart || "#4facfe"} 0%, ${settings.gradientEnd || "#00f2fe"} 100%)` }}
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => u("customGradient", settings.customGradient ? "" : " ")}
                    className="text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center gap-1"
                  >
                    {settings.customGradient ? "← Quay lại trình chọn màu" : "⚙️ Chế độ nâng cao (Mã CSS)"}
                  </button>
                </div>

                {settings.customGradient !== undefined && settings.customGradient !== "" && (
                  <Field label="Mã Gradient CSS (Nâng cao)">
                    <Txt
                      value={settings.customGradient === " " ? "" : settings.customGradient}
                      onChange={v => u("customGradient", v)}
                      placeholder="linear-gradient(...)"
                      rows={2}
                    />
                  </Field>
                )}
              </div>
            ) : (
              <Field label="Chọn màu nền">
                <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
                  <input
                    type="color"
                    value={settings.customBackgroundColor || "#ffffff"}
                    onChange={e => u("customBackgroundColor", e.target.value)}
                    className="w-8 h-8 rounded-lg border-none bg-transparent cursor-pointer"
                  />
                  <Inp
                    value={settings.customBackgroundColor || "#ffffff"}
                    onChange={v => u("customBackgroundColor", v)}
                    placeholder="#ffffff"
                  />
                </div>
              </Field>
            )}
          </div>
        )}
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Cấu hình nâng cao</h4>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <Field label="Độ rộng nội dung">
            <div className="flex bg-white rounded-xl border border-slate-200 p-1">
              {[
                { id: 'boxed', icon: Box, label: 'Boxed' },
                { id: 'narrow', icon: Minimize, label: 'Narrow' },
                { id: 'full', icon: Maximize, label: 'Full Width' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => u("containerWidth", item.id as any)}
                  className={cn(
                    "flex-1 h-9 flex items-center justify-center rounded-lg transition-all text-xs font-bold gap-2",
                    (settings.containerWidth || "boxed") === item.id ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Hiệu ứng xuất hiện">
            <select
              value={settings.entranceAnimation || "none"}
              onChange={(e) => u("entranceAnimation", e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white font-medium"
            >
              <option value="none">Không có hiệu ứng</option>
              <option value="fadeUp">Trượt lên (Fade Up)</option>
              <option value="fadeIn">Mờ dần (Fade In)</option>
              <option value="slideIn">Trượt từ trái (Slide In)</option>
              <option value="zoomIn">Phóng to (Zoom In)</option>
            </select>
          </Field>

          <Field label="ID định danh (Anchor ID)">
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={settings.anchorId || ""}
                onChange={(e) => u("anchorId", e.target.value)}
                placeholder="vidu: san-pham-1"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-sm bg-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </Field>

          <Field label="Đổ bóng (Shadow)">
            <div className="grid grid-cols-5 gap-1 bg-white p-1 rounded-xl border border-slate-200">
              {['none', 'sm', 'md', 'lg', 'xl'].map(size => (
                <button
                  key={size}
                  onClick={() => u("shadowSize", size as any)}
                  className={cn(
                    "h-9 flex items-center justify-center rounded-lg text-[10px] font-black uppercase transition-all",
                    (settings.shadowSize || "none") === size ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-50"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Bo góc (Border Radius)">
            <div className="grid grid-cols-5 gap-1 bg-white p-1 rounded-xl border border-slate-200">
              {['none', 'md', 'lg', 'xl', 'full'].map(r => (
                <button
                  key={r}
                  onClick={() => u("borderRadius", r as any)}
                  className={cn(
                    "h-9 flex items-center justify-center rounded-lg text-[10px] font-black uppercase transition-all",
                    (settings.borderRadius || "none") === r ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-50"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Hiển thị trên thiết bị">
            <div className="flex gap-4">
              <button
                onClick={() => u("hideOnDesktop", !settings.hideOnDesktop)}
                className={cn(
                  "flex-1 h-12 rounded-xl border flex items-center justify-center gap-3 transition-all",
                  settings.hideOnDesktop ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                )}
              >
                <Monitor className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase leading-none">Desktop</div>
                  <div className="text-[8px] opacity-60 uppercase">{settings.hideOnDesktop ? 'Đã ẩn' : 'Đang hiện'}</div>
                </div>
              </button>
              <button
                onClick={() => u("hideOnMobile", !settings.hideOnMobile)}
                className={cn(
                  "flex-1 h-12 rounded-xl border flex items-center justify-center gap-3 transition-all",
                  settings.hideOnMobile ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                )}
              >
                <Smartphone className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase leading-none">Mobile</div>
                  <div className="text-[8px] opacity-60 uppercase">{settings.hideOnMobile ? 'Đã ẩn' : 'Đang hiện'}</div>
                </div>
              </button>
            </div>
          </Field>

          <Field label="Custom CSS (Nâng cao)">
            <Txt 
              value={settings.customCss || ""} 
              onChange={v => u("customCss", v)} 
              placeholder=".my-class { color: red; } - Sử dụng CSS để tùy biến sâu hơn."
              rows={4}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

