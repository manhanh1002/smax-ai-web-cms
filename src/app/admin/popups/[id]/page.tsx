"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2, Eye, Settings2, Layout, Layers, Image as ImageIcon, FileText, Tag, Plus, Trash2, Monitor, Smartphone, Clock, ScrollText, LogOut, Zap, ClipboardList, AlignLeft, Globe, Home, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { PopupRenderer } from "@/components/sections/PopupRenderer";
import { FormSelect } from "@/components/cms/FormSelect";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { toast } from "sonner";

// ─── Default configs ──────────────────────────────────────────
const DEFAULT_SETTINGS = {
  theme: { primary_color: "#3b82f6", bg_color: "#ffffff", text_color: "#0f172a" },
  animation: "fade",
  backdrop: true,
  show_close: true,
  width: "md",
  corner_radius: "2xl",
};

const DEFAULT_CONDITIONS = {
  trigger: "time_delay",
  delay_seconds: 3,
  scroll_percent: 50,
  page_target: "all",
  page_urls: [] as string[],
  devices: ["desktop", "mobile"],
  frequency: "once_per_session",
  show_after_convert: false,
};

const DEFAULT_CONTENT = {
  layout: "1col",
  cols: [{ type: "form", form_id: null as string | null, heading: "Nhận tư vấn miễn phí", subheading: "Điền thông tin để chúng tôi liên hệ lại!" }],
};

// ─── Mini sub-components ─────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">{children}</p>;
}
function Inp({ value, onChange, placeholder, type = "text" }: any) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
  );
}
function Sel({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ─── Column content editor ───────────────────────────────────
function ColEditor({ col, onChange }: { col: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Loại nội dung</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { value: "form", label: "Form đăng ký", icon: ClipboardList },
            { value: "image", label: "Hình ảnh", icon: ImageIcon },
            { value: "pricing_deal", label: "Ưu đãi giá", icon: Tag },
            { value: "text", label: "Văn bản", icon: AlignLeft },
          ].map(opt => (
            <button key={opt.value} type="button" onClick={() => onChange({ ...col, type: opt.value })}
              className={cn("flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all",
                col.type === opt.value ? "bg-primary text-white border-primary" : "border-slate-200 text-slate-500 hover:border-primary hover:text-primary")}>
              <opt.icon className="w-3.5 h-3.5 shrink-0" />{opt.label}
            </button>
          ))}
        </div>
      </div>

      {col.type === "form" && (
        <>
          <div><Label>Tiêu đề</Label><Inp value={col.heading || ""} onChange={(v: string) => onChange({ ...col, heading: v })} placeholder="Nhận tư vấn miễn phí" /></div>
          <div><Label>Phụ đề</Label><Inp value={col.subheading || ""} onChange={(v: string) => onChange({ ...col, subheading: v })} placeholder="Điền thông tin để được liên hệ..." /></div>
          <div>
            <Label>Chọn Form</Label>
            <FormSelect value={col.form_id || ""} onChange={(v: string) => onChange({ ...col, form_id: v })} />
          </div>
        </>
      )}

      {col.type === "image" && (
        <>
          <div>
            <Label>Hình ảnh</Label>
            {/* Thumbnail preview */}
            {col.image_url && (
              <div className="mb-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={col.image_url} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
            {/* MediaPicker trigger */}
            <MediaPicker
              onSelect={(url) => onChange({ ...col, image_url: url })}
              trigger={
                <button className="w-full flex items-center justify-center gap-2 h-10 px-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 text-primary text-xs font-bold hover:bg-primary/10 transition-colors">
                  <ImageIcon className="w-3.5 h-3.5" />
                  {col.image_url ? "Đổi ảnh từ Media" : "Chọn từ Media Library"}
                </button>
              }
            />
            {/* Manual URL input fallback */}
            <div className="mt-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Hoặc nhập URL trực tiếp</p>
              <Inp value={col.image_url || ""} onChange={(v: string) => onChange({ ...col, image_url: v })} placeholder="https://..." />
            </div>
          </div>
          <div><Label>Alt text</Label><Inp value={col.image_alt || ""} onChange={(v: string) => onChange({ ...col, image_alt: v })} placeholder="Mô tả hình ảnh" /></div>
          <div>
            <Label>Object Fit</Label>
            <Sel value={col.object_fit || "cover"} onChange={v => onChange({ ...col, object_fit: v })} options={[
              { value: "cover", label: "Cover (cắt vừa khung)" },
              { value: "contain", label: "Contain (hiện toàn bộ)" },
              { value: "fill", label: "Fill (kéo dãn)" },
            ]} />
          </div>
        </>
      )}

      {col.type === "pricing_deal" && (
        <>
          <div><Label>Badge text</Label><Inp value={col.badge || ""} onChange={(v: string) => onChange({ ...col, badge: v })} placeholder="🔥 Flash Sale - 50% OFF" /></div>
          <div><Label>Giá gốc</Label><Inp value={col.original_price || ""} onChange={(v: string) => onChange({ ...col, original_price: v })} placeholder="2.000.000đ" /></div>
          <div><Label>Giá ưu đãi</Label><Inp value={col.sale_price || ""} onChange={(v: string) => onChange({ ...col, sale_price: v })} placeholder="990.000đ" /></div>
          <div><Label>Mô tả ngắn</Label><Inp value={col.description || ""} onChange={(v: string) => onChange({ ...col, description: v })} placeholder="Gói tư vấn Premium..." /></div>
          <div><Label>Điểm nổi bật (mỗi dòng 1 điểm)</Label>
            <textarea value={(col.highlights || []).join("\n")} onChange={e => onChange({ ...col, highlights: e.target.value.split("\n").filter(Boolean) })}
              rows={3} placeholder="✅ Tư vấn 1-1 với chuyên gia&#10;✅ Hỗ trợ 24/7" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white resize-none" />
          </div>
          <div><Label>CTA Button text</Label><Inp value={col.cta_label || ""} onChange={(v: string) => onChange({ ...col, cta_label: v })} placeholder="Đăng ký ngay" /></div>
        </>
      )}

      {col.type === "text" && (
        <>
          <div><Label>Tiêu đề</Label><Inp value={col.heading || ""} onChange={(v: string) => onChange({ ...col, heading: v })} /></div>
          <div><Label>Nội dung</Label>
            <textarea value={col.body || ""} onChange={e => onChange({ ...col, body: e.target.value })}
              rows={4} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white resize-none" />
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function PopupEditorPage() {
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("Popup mới");
  const [type, setType] = useState("modal");
  const [position, setPosition] = useState("center");
  const [content, setContent] = useState<any>(DEFAULT_CONTENT);
  const [settings, setSettings] = useState<any>(DEFAULT_SETTINGS);
  const [conditions, setConditions] = useState<any>(DEFAULT_CONDITIONS);

  const [activeTab, setActiveTab] = useState<"content" | "conditions" | "display">("content");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const lastSavedRef = React.useRef<string>("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("popups").select("*").eq("id", id).single();
      if (data) {
        setName(data.name);
        setType(data.type);
        setPosition(data.position);
        setContent(data.content || DEFAULT_CONTENT);
        setSettings(data.settings || DEFAULT_SETTINGS);
        setConditions(data.conditions || DEFAULT_CONDITIONS);

        // Initialize lastSavedRef
        lastSavedRef.current = JSON.stringify({ 
          name: data.name, type: data.type, position: data.position, 
          content: data.content || DEFAULT_CONTENT, settings: data.settings || DEFAULT_SETTINGS, conditions: data.conditions || DEFAULT_CONDITIONS 
        });
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const save = async (silent = false) => {
    if (!silent) setSaving(true);
    const payload = { name, type, position, content, settings, conditions };
    const { error } = await supabase.from("popups").update(payload).eq("id", id);
    
    if (!error) {
      lastSavedRef.current = JSON.stringify(payload);
      if (!silent) {
        toast.success("Đã lưu popup thành công!");
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    }
    if (error && !silent) {
      toast.error("Lỗi khi lưu popup: " + error.message);
    }
    if (!silent) setSaving(false);
  };

  // Auto-save effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (saving || loading) return;
      
      const currentData = JSON.stringify({ name, type, position, content, settings, conditions });
      if (currentData !== lastSavedRef.current) {
        console.log("Auto-saving popup...");
        save(true);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [name, type, position, content, settings, conditions, saving, loading]);

  const updateCol = (index: number, col: any) => {
    const cols = [...(content.cols || [])];
    cols[index] = col;
    setContent({ ...content, cols });
  };

  const addCol = () => setContent({ ...content, cols: [...(content.cols || []), { type: "text", heading: "", body: "" }] });
  const removeCol = (i: number) => setContent({ ...content, cols: content.cols.filter((_: any, idx: number) => idx !== i) });

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  const previewPopup = { name, type, position, content, settings, conditions };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-slate-100 bg-white shrink-0">
        <Link href="/admin/popups"><button className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><ArrowLeft className="w-4 h-4" /></button></Link>
        <input value={name} onChange={e => setName(e.target.value)} className="flex-1 text-lg font-black text-slate-900 bg-transparent border-none focus:outline-none" />
        <Button onClick={() => save()} disabled={saving} className="rounded-xl h-9 px-5 text-sm">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? "✓ Đã lưu" : <><Save className="w-4 h-4 mr-2" />Lưu</>}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-[400px] shrink-0 border-r border-slate-100 bg-slate-50/50 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 bg-white sticky top-0 z-10">
            {([
              { id: "content", label: "Nội dung", icon: Layout },
              { id: "conditions", label: "Điều kiện", icon: Settings2 },
              { id: "display", label: "Hiển thị", icon: Eye },
            ] as const).map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn("flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all",
                  activeTab === tab.id ? "text-primary border-b-2 border-primary bg-white" : "text-slate-400 hover:text-slate-600")}>
                <tab.icon className="w-3 h-3" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5 space-y-6">
            {activeTab === "content" && (
              <>
                {/* Type & Position */}
                <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4 shadow-sm">
                  <p className="text-xs font-black text-slate-700 uppercase tracking-widest">Loại & Vị trí</p>
                  <div><Label>Loại Popup</Label>
                    <Sel value={type} onChange={setType} options={[
                      { value: "modal", label: "Modal (cửa sổ trung tâm)" },
                      { value: "slide-in", label: "Slide-in (trượt vào góc)" },
                      { value: "bar", label: "Bar (thanh dọc theo trang)" },
                    ]} />
                  </div>
                  <div><Label>Vị trí hiển thị</Label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { v: "top-left", l: "↖ TL" }, { v: "top-bar", l: "↑ Top Bar" }, { v: "top-right", l: "↗ TR" },
                        { v: "center", l: "⊙ Center" }, { v: "", l: "" }, { v: "", l: "" },
                        { v: "bottom-left", l: "↙ BL" }, { v: "bottom-bar", l: "↓ Bot Bar" }, { v: "bottom-right", l: "↘ BR" },
                      ].map((p, i) => p.v ? (
                        <button key={p.v} onClick={() => setPosition(p.v)}
                          className={cn("py-1.5 rounded-lg text-[10px] font-black transition-all border",
                            position === p.v ? "bg-primary text-white border-primary" : "border-slate-200 text-slate-500 hover:border-primary hover:text-primary")}>
                          {p.l}
                        </button>
                      ) : <div key={i} />)}
                    </div>
                  </div>
                </div>

                {/* Layout */}
                <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4 shadow-sm">
                  <p className="text-xs font-black text-slate-700 uppercase tracking-widest">Layout nội dung</p>
                  <div className="flex gap-2">
                    {["1col", "2col"].map(l => (
                      <button key={l} onClick={() => {
                        const cols = l === "2col" && (content.cols?.length || 0) < 2
                          ? [...(content.cols || []), { type: "image", image_url: "" }]
                          : content.cols?.slice(0, 1) || [];
                        setContent({ ...content, layout: l, cols: l === "2col" && cols.length < 2 ? [...cols, { type: "image", image_url: "" }] : cols });
                      }}
                        className={cn("flex-1 py-2.5 rounded-xl text-xs font-black border transition-all",
                          content.layout === l ? "bg-primary text-white border-primary" : "border-slate-200 text-slate-500 hover:border-primary")}>
                        {l === "1col" ? "1 Cột" : "2 Cột"}
                      </button>
                    ))}
                  </div>

                  {(content.cols || []).map((col: any, i: number) => (
                    <div key={i} className="border border-slate-100 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cột {i + 1}</p>
                        {content.layout === "2col" && <button onClick={() => removeCol(i)} className="text-red-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>}
                      </div>
                      <ColEditor col={col} onChange={c => updateCol(i, c)} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === "conditions" && (
              <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4 shadow-sm">
                <p className="text-xs font-black text-slate-700 uppercase tracking-widest">Điều kiện kích hoạt</p>
                <div><Label>Trigger</Label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { value: "time_delay", label: "Time Delay", icon: Clock },
                      { value: "scroll_depth", label: "Scroll Depth", icon: ScrollText },
                      { value: "exit_intent", label: "Exit Intent", icon: LogOut },
                      { value: "on_load", label: "On Load", icon: Zap },
                    ].map(opt => (
                      <button key={opt.value} type="button" onClick={() => setConditions({ ...conditions, trigger: opt.value })}
                        className={cn("flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all",
                          conditions.trigger === opt.value ? "bg-primary text-white border-primary" : "border-slate-200 text-slate-500 hover:border-primary hover:text-primary")}>
                        <opt.icon className="w-3.5 h-3.5 shrink-0" />{opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                {conditions.trigger === "time_delay" && (
                  <div><Label>Thời gian chờ (giây)</Label><Inp type="number" value={conditions.delay_seconds} onChange={(v: string) => setConditions({ ...conditions, delay_seconds: parseInt(v) || 0 })} /></div>
                )}
                {conditions.trigger === "scroll_depth" && (
                  <div><Label>Cuộn đến (%)</Label><Inp type="number" value={conditions.scroll_percent} onChange={(v: string) => setConditions({ ...conditions, scroll_percent: parseInt(v) || 50 })} /></div>
                )}

                <div><Label>Trang áp dụng</Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { value: "all", label: "Tất cả", icon: Globe },
                      { value: "home", label: "Trang chủ", icon: Home },
                      { value: "specific", label: "URL cụ thể", icon: SlidersHorizontal },
                    ].map(opt => (
                      <button key={opt.value} type="button" onClick={() => setConditions({ ...conditions, page_target: opt.value })}
                        className={cn("flex flex-col items-center gap-1 px-2 py-2 rounded-xl border text-[10px] font-bold transition-all",
                          conditions.page_target === opt.value ? "bg-primary text-white border-primary" : "border-slate-200 text-slate-500 hover:border-primary hover:text-primary")}>
                        <opt.icon className="w-3.5 h-3.5" />{opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                {conditions.page_target === "specific" && (
                  <div><Label>Danh sách URL (mỗi dòng 1 URL)</Label>
                    <textarea value={(conditions.page_urls || []).join("\n")} onChange={e => setConditions({ ...conditions, page_urls: e.target.value.split("\n").filter(Boolean) })}
                      rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white resize-none" placeholder="/giai-phap&#10;/bang-gia" />
                  </div>
                )}

                <div><Label>Thiết bị</Label>
                  <div className="flex gap-2">
                    {[
                      { id: "desktop", label: "Desktop", icon: Monitor },
                      { id: "mobile", label: "Mobile", icon: Smartphone },
                    ].map(({ id: d, label, icon: Icon }) => {
                      const active = (conditions.devices || []).includes(d);
                      return (
                        <button key={d} onClick={() => {
                          const devices = active ? conditions.devices.filter((x: string) => x !== d) : [...(conditions.devices || []), d];
                          setConditions({ ...conditions, devices });
                        }} className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black border transition-all",
                          active ? "bg-primary text-white border-primary" : "border-slate-200 text-slate-500 hover:border-primary")}>
                          <Icon className="w-3.5 h-3.5" /> {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div><Label>Tần suất hiển thị</Label>
                  <Sel value={conditions.frequency} onChange={v => setConditions({ ...conditions, frequency: v })} options={[
                    { value: "once_per_session", label: "1 lần / phiên làm việc" },
                    { value: "once_per_day", label: "1 lần / ngày" },
                    { value: "always", label: "Mỗi lần truy cập" },
                    { value: "once_ever", label: "1 lần duy nhất (vĩnh viễn)" },
                  ]} />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={conditions.show_after_convert} onChange={e => setConditions({ ...conditions, show_after_convert: e.target.checked })}
                    className="rounded" />
                  <span className="text-xs font-bold text-slate-600">Tiếp tục hiển thị dù đã chuyển đổi</span>
                </label>
              </div>
            )}

            {activeTab === "display" && (
              <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4 shadow-sm">
                <p className="text-xs font-black text-slate-700 uppercase tracking-widest">Giao diện & hiệu ứng</p>
                <div><Label>Màu nền</Label><Inp type="color" value={settings.theme?.bg_color || "#ffffff"} onChange={(v: string) => setSettings({ ...settings, theme: { ...settings.theme, bg_color: v } })} /></div>
                <div><Label>Màu chủ đạo (nút, accent)</Label><Inp type="color" value={settings.theme?.primary_color || "#3b82f6"} onChange={(v: string) => setSettings({ ...settings, theme: { ...settings.theme, primary_color: v } })} /></div>
                <div><Label>Hiệu ứng vào</Label>
                  <Sel value={settings.animation || "fade"} onChange={v => setSettings({ ...settings, animation: v })} options={[
                    { value: "fade", label: "Fade in" },
                    { value: "slide-up", label: "Slide up" },
                    { value: "slide-right", label: "Slide from right" },
                    { value: "zoom", label: "Zoom in" },
                  ]} />
                </div>
                <div><Label>Kích thước</Label>
                  <Sel value={settings.width || "md"} onChange={v => setSettings({ ...settings, width: v })} options={[
                    { value: "sm", label: "Nhỏ (400px)" },
                    { value: "md", label: "Vừa (560px)" },
                    { value: "lg", label: "Rộng (720px)" },
                    { value: "xl", label: "Rất rộng (900px)" },
                  ]} />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={settings.backdrop !== false} onChange={e => setSettings({ ...settings, backdrop: e.target.checked })} className="rounded" />
                  <span className="text-xs font-bold text-slate-600">Hiện overlay backdrop</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={settings.show_close !== false} onChange={e => setSettings({ ...settings, show_close: e.target.checked })} className="rounded" />
                  <span className="text-xs font-bold text-slate-600">Hiện nút đóng (✕)</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center p-8 overflow-auto">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Live Preview</p>
          <div className="bg-slate-300/50 rounded-3xl overflow-hidden w-full max-w-4xl aspect-video flex items-center justify-center relative shadow-2xl">
            {/* Simulated page background */}
            <div className="absolute inset-0 bg-white opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <PopupRenderer popup={previewPopup} preview />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-widest">Vị trí: {position} · Layout: {content.layout}</p>
        </div>
      </div>
    </div>
  );
}
