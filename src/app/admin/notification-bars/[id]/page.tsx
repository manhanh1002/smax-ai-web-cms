"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TopNotificationBar } from "@/components/sections/TopNotificationBar";
import { 
  Save, ArrowLeft, Settings2, Palette, Link as LinkIcon, 
  Trash2, Plus, Type, Image as ImageIcon, Layout, Target, MousePointer2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IconPicker } from "@/components/cms/IconPicker";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { ActionPicker } from "@/components/cms/block-editors/shared";
import { toast } from "sonner";

const DEFAULT_SETTINGS = {
  layout: "static",
  sticky: true,
  show_close: true,
  height: 40,
  speed: 20,
  carousel_interval: 4000,
  theme: {
    bg_type: "color",
    bg_color: "#E25A49",
    bg_gradient: "linear-gradient(90deg, #E25A49 0%, #E36B53 100%)",
    bg_image: "",
    text_color: "#ffffff",
    primary_color: "#ffffff",
    primary_text_color: "#E25A49"
  }
};

const DEFAULT_CONTENT = {
  type: "single",
  items: [{ text: "Chào mừng bạn đến với Smax AI!", link: "" }],
  image_url: "",
  cta_label: "",
  cta_link: ""
};

const DEFAULT_CONDITIONS = {
  page_target: "all",
  page_urls: [],
  devices: ["desktop", "mobile"]
};

export default function NotificationBarEditor() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [bar, setBar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'conditions'>('content');

  useEffect(() => {
    fetchBar();
  }, [id]);

  const fetchBar = async () => {
    const { data } = await supabase.from("notification_bars").select("*").eq("id", id).single();
    if (data) {
      setBar({
        ...data,
        content: { ...DEFAULT_CONTENT, ...(data.content || {}) },
        settings: { ...DEFAULT_SETTINGS, ...(data.settings || {}) },
        conditions: { ...DEFAULT_CONDITIONS, ...(data.conditions || {}) }
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("notification_bars")
      .update({
        name: bar.name,
        content: bar.content,
        settings: bar.settings,
        conditions: bar.conditions
      })
      .eq("id", id);
    
    setSaving(false);
    if (error) {
      toast.error("Lỗi khi lưu: " + error.message);
    } else {
      toast.success("Lưu thành công!");
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading editor...</div>;
  if (!bar) return <div className="p-10 text-center text-red-500">Không tìm thấy Notification Bar</div>;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Navbar */}
      <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/admin/notification-bars")}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <Input 
            value={bar.name} 
            onChange={e => setBar({...bar, name: e.target.value})}
            className="h-8 border-transparent hover:border-slate-200 focus:border-primary font-bold text-sm w-[250px] px-2 shadow-none"
            placeholder="Tên Notification Bar..."
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="h-9 px-5 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-sm"
          >
            {saving ? "Đang lưu..." : <><Save className="w-4 h-4 mr-2" /> Lưu thay đổi</>}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL - Editor */}
        <div className="w-[400px] bg-white border-r border-slate-200 flex flex-col shrink-0 relative z-10 overflow-y-auto custom-scrollbar">
          
          <div className="flex items-center gap-1 p-3 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
            {[
              { id: 'content', icon: Type, label: "Nội dung" },
              { id: 'design', icon: Palette, label: "Thiết kế" },
              { id: 'conditions', icon: Target, label: "Điều kiện" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-white text-primary shadow-sm border border-slate-200/50" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-8 pb-32">
            
            {/* CONTENT TAB */}
            {activeTab === 'content' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Loại hiển thị tin</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                      onClick={() => setBar({...bar, content: {...bar.content, type: "single"}})}
                      className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-all", bar.content.type === "single" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")}
                    >
                      Single Text
                    </button>
                    <button 
                      onClick={() => setBar({...bar, content: {...bar.content, type: "multi"}})}
                      className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-all", bar.content.type === "multi" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")}
                    >
                      Multi Carousel
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nội dung thông báo</label>
                    {bar.content.type === "multi" && (
                      <button 
                        onClick={() => setBar({...bar, content: {...bar.content, items: [...bar.content.items, { text: "Thông báo mới", link: "" }]}})}
                        className="text-[10px] font-bold text-primary flex items-center hover:underline"
                      >
                        <Plus className="w-3 h-3 mr-1" /> Thêm tin
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {bar.content.items.map((item: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-3 relative group">
                        {bar.content.type === "multi" && bar.content.items.length > 1 && (
                          <button 
                            onClick={() => {
                              const newItems = [...bar.content.items];
                              newItems.splice(idx, 1);
                              setBar({...bar, content: {...bar.content, items: newItems}});
                            }}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-100 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 flex items-center"><Type className="w-3 h-3 mr-1" /> Text</label>
                          <Input 
                            value={item.text} 
                            onChange={e => {
                              const newItems = [...bar.content.items];
                              newItems[idx].text = e.target.value;
                              setBar({...bar, content: {...bar.content, items: newItems}});
                            }}
                            className="h-8 text-xs bg-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 flex items-center"><LinkIcon className="w-3 h-3 mr-1" /> URL Link (Optional)</label>
                          <Input 
                            value={item.link || ""} 
                            onChange={e => {
                              const newItems = [...bar.content.items];
                              newItems[idx].link = e.target.value;
                              setBar({...bar, content: {...bar.content, items: newItems}});
                            }}
                            className="h-8 text-xs bg-white"
                            placeholder="https://"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Icon / Logo Thumbnail (Tùy chọn)</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <IconPicker 
                        value={bar.content.image_url} 
                        onChange={v => setBar({...bar, content: {...bar.content, image_url: v}})} 
                      />
                    </div>
                    <MediaPicker 
                      onSelect={url => setBar({...bar, content: {...bar.content, image_url: url}})} 
                      trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>}
                    />
                  </div>
                  {bar.content.image_url && (bar.content.image_url.startsWith('http') || bar.content.image_url.startsWith('/')) && (
                    <div className="w-10 h-10 border rounded bg-slate-50 flex items-center justify-center p-1 mt-2">
                      <img src={bar.content.image_url} alt="icon preview" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <MousePointer2 className="w-4 h-4 mr-2" /> CTA Button (Nút kêu gọi)
                  </label>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500">Nhãn nút (Để trống nếu không dùng)</label>
                      <Input 
                        value={bar.content.cta_label || ""} 
                        onChange={e => setBar({...bar, content: {...bar.content, cta_label: e.target.value}})}
                        className="h-8 text-xs bg-white"
                        placeholder="Ví dụ: Xem ngay"
                      />
                    </div>
                    {bar.content.cta_label && (
                      <ActionPicker 
                        label="Hành động khi click nút"
                        value={bar.content.cta_link}
                        onChange={v => setBar({...bar, content: {...bar.content, cta_link: v}})}
                      />
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* DESIGN TAB */}
            {activeTab === 'design' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <Layout className="w-4 h-4 mr-2" /> Kiểu Layout
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setBar({...bar, settings: {...bar.settings, layout: "static"}})}
                      className={cn("py-3 px-2 border rounded-xl flex flex-col items-center gap-2 transition-all", bar.settings.layout === "static" ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-500 hover:border-slate-300")}
                    >
                      <div className="w-16 h-3 bg-current opacity-20 rounded" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Static</span>
                    </button>
                    <button 
                      onClick={() => setBar({...bar, settings: {...bar.settings, layout: "marquee"}})}
                      className={cn("py-3 px-2 border rounded-xl flex flex-col items-center gap-2 transition-all", bar.settings.layout === "marquee" ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-500 hover:border-slate-300")}
                    >
                      <div className="w-16 h-3 flex gap-1"><div className="w-8 h-full bg-current opacity-20 rounded" /><div className="w-6 h-full bg-current opacity-20 rounded" /></div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Marquee</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-100 rounded-xl hover:bg-slate-50">
                    <input 
                      type="checkbox" 
                      checked={bar.settings.sticky}
                      onChange={e => setBar({...bar, settings: {...bar.settings, sticky: e.target.checked}})}
                      className="rounded text-primary focus:ring-primary w-4 h-4"
                    />
                    <div className="space-y-0.5">
                       <p className="text-xs font-bold text-slate-700">Sticky Top</p>
                       <p className="text-[9px] text-slate-400">Luôn dính trên top</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-100 rounded-xl hover:bg-slate-50">
                    <input 
                      type="checkbox" 
                      checked={bar.settings.show_close}
                      onChange={e => setBar({...bar, settings: {...bar.settings, show_close: e.target.checked}})}
                      className="rounded text-primary focus:ring-primary w-4 h-4"
                    />
                    <div className="space-y-0.5">
                       <p className="text-xs font-bold text-slate-700">Close Button</p>
                       <p className="text-[9px] text-slate-400">Cho phép tắt (✕)</p>
                    </div>
                  </label>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                   <div className="space-y-2">
                     <div className="flex justify-between">
                       <label className="text-[10px] font-bold text-slate-500">Chiều cao (Height: {bar.settings.height}px)</label>
                     </div>
                     <input 
                       type="range" min="30" max="80" step="2"
                       value={bar.settings.height}
                       onChange={e => setBar({...bar, settings: {...bar.settings, height: Number(e.target.value)}})}
                       className="w-full accent-primary"
                     />
                   </div>

                   {bar.settings.layout === "marquee" && (
                     <div className="space-y-2">
                       <div className="flex justify-between">
                         <label className="text-[10px] font-bold text-slate-500">Tốc độ chạy chữ ({bar.settings.speed}s)</label>
                       </div>
                       <input 
                         type="range" min="5" max="60" step="1"
                         value={bar.settings.speed}
                         onChange={e => setBar({...bar, settings: {...bar.settings, speed: Number(e.target.value)}})}
                         className="w-full accent-primary"
                         style={{ direction: "rtl" }} // Faster means smaller number
                       />
                     </div>
                   )}

                   {bar.settings.layout === "static" && bar.content.type === "multi" && (
                     <div className="space-y-2">
                       <div className="flex justify-between">
                         <label className="text-[10px] font-bold text-slate-500">Giây chuyển tin ({(bar.settings.carousel_interval/1000).toFixed(1)}s)</label>
                       </div>
                       <input 
                         type="range" min="1000" max="10000" step="500"
                         value={bar.settings.carousel_interval}
                         onChange={e => setBar({...bar, settings: {...bar.settings, carousel_interval: Number(e.target.value)}})}
                         className="w-full accent-primary"
                       />
                     </div>
                   )}
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <Palette className="w-4 h-4 mr-2" /> Theme & Màu sắc
                  </label>

                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    {["color", "gradient", "image"].map((t) => (
                      <button 
                        key={t}
                        onClick={() => setBar({...bar, settings: {...bar.settings, theme: {...bar.settings.theme, bg_type: t}}})}
                        className={cn("flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all capitalize", bar.settings.theme.bg_type === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {bar.settings.theme.bg_type === "color" && (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600">Background Color</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400">{bar.settings.theme.bg_color}</span>
                          <input type="color" value={bar.settings.theme.bg_color} onChange={e => setBar({...bar, settings: {...bar.settings, theme: {...bar.settings.theme, bg_color: e.target.value}}})} className="w-6 h-6 p-0 border-0 rounded cursor-pointer" />
                        </div>
                      </div>
                    )}
                    {bar.settings.theme.bg_type === "gradient" && (
                      <div className="space-y-4">
                        <span className="text-[11px] font-bold text-slate-600 block">Gradient Builder</span>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500">Màu 1 ({bar.settings.theme.gradient_start_pct || 0}%)</label>
                            <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-xl">
                              <input 
                                type="color" 
                                value={bar.settings.theme.gradient_start || "#E25A49"} 
                                onChange={e => {
                                  const start = e.target.value;
                                  const end = bar.settings.theme.gradient_end || "#E36B53";
                                  const angle = bar.settings.theme.gradient_angle || 90;
                                  const spct = bar.settings.theme.gradient_start_pct || 0;
                                  const epct = bar.settings.theme.gradient_end_pct || 100;
                                  setBar({...bar, settings: {...bar.settings, theme: {...bar.settings.theme, gradient_start: start, bg_gradient: `linear-gradient(${angle}deg, ${start} ${spct}%, ${end} ${epct}%)`}}})
                                }} 
                                className="w-6 h-6 rounded-md border-none bg-transparent cursor-pointer shrink-0" 
                              />
                              <input 
                                type="range" min="0" max="100" 
                                value={bar.settings.theme.gradient_start_pct || 0}
                                onChange={e => {
                                  const spct = Number(e.target.value);
                                  const start = bar.settings.theme.gradient_start || "#E25A49";
                                  const end = bar.settings.theme.gradient_end || "#E36B53";
                                  const angle = bar.settings.theme.gradient_angle || 90;
                                  const epct = bar.settings.theme.gradient_end_pct || 100;
                                  setBar({...bar, settings: {...bar.settings, theme: {...bar.settings.theme, gradient_start_pct: spct, bg_gradient: `linear-gradient(${angle}deg, ${start} ${spct}%, ${end} ${epct}%)`}}})
                                }}
                                className="w-full accent-primary h-1"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500">Màu 2 ({bar.settings.theme.gradient_end_pct || 100}%)</label>
                            <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-xl">
                              <input 
                                type="color" 
                                value={bar.settings.theme.gradient_end || "#E36B53"} 
                                onChange={e => {
                                  const end = e.target.value;
                                  const start = bar.settings.theme.gradient_start || "#E25A49";
                                  const angle = bar.settings.theme.gradient_angle || 90;
                                  const spct = bar.settings.theme.gradient_start_pct || 0;
                                  const epct = bar.settings.theme.gradient_end_pct || 100;
                                  setBar({...bar, settings: {...bar.settings, theme: {...bar.settings.theme, gradient_end: end, bg_gradient: `linear-gradient(${angle}deg, ${start} ${spct}%, ${end} ${epct}%)`}}})
                                }} 
                                className="w-6 h-6 rounded-md border-none bg-transparent cursor-pointer shrink-0" 
                              />
                              <input 
                                type="range" min="0" max="100" 
                                value={bar.settings.theme.gradient_end_pct || 100}
                                onChange={e => {
                                  const epct = Number(e.target.value);
                                  const start = bar.settings.theme.gradient_start || "#E25A49";
                                  const end = bar.settings.theme.gradient_end || "#E36B53";
                                  const angle = bar.settings.theme.gradient_angle || 90;
                                  const spct = bar.settings.theme.gradient_start_pct || 0;
                                  setBar({...bar, settings: {...bar.settings, theme: {...bar.settings.theme, gradient_end_pct: epct, bg_gradient: `linear-gradient(${angle}deg, ${start} ${spct}%, ${end} ${epct}%)`}}})
                                }}
                                className="w-full accent-primary h-1"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 flex justify-between">
                            <span>Góc xoay</span>
                            <span>{bar.settings.theme.gradient_angle || 90}°</span>
                          </label>
                          <input 
                            type="range" min="0" max="360" step="1"
                            value={bar.settings.theme.gradient_angle || 90}
                            onChange={e => {
                              const angle = Number(e.target.value);
                              const start = bar.settings.theme.gradient_start || "#E25A49";
                              const end = bar.settings.theme.gradient_end || "#E36B53";
                              const spct = bar.settings.theme.gradient_start_pct || 0;
                              const epct = bar.settings.theme.gradient_end_pct || 100;
                              setBar({...bar, settings: {...bar.settings, theme: {...bar.settings.theme, gradient_angle: angle, bg_gradient: `linear-gradient(${angle}deg, ${start} ${spct}%, ${end} ${epct}%)`}}})
                            }}
                            className="w-full accent-primary"
                          />
                        </div>
                      </div>
                    )}
                    {bar.settings.theme.bg_type === "image" && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-600">Background Image URL</span>
                        <Input 
                          value={bar.settings.theme.bg_image} 
                          onChange={e => setBar({...bar, settings: {...bar.settings, theme: {...bar.settings.theme, bg_image: e.target.value}}})}
                          className="h-8 text-xs bg-white"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                      <span className="text-[11px] font-bold text-slate-600">Text Color</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400">{bar.settings.theme.text_color}</span>
                        <input type="color" value={bar.settings.theme.text_color} onChange={e => setBar({...bar, settings: {...bar.settings, theme: {...bar.settings.theme, text_color: e.target.value}}})} className="w-6 h-6 p-0 border-0 rounded cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  {/* Button Colors */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <p className="text-[10px] font-black uppercase text-slate-400">CTA Button Colors</p>
                     <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-600">Button BG Color</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400">{bar.settings.theme.primary_color}</span>
                        <input type="color" value={bar.settings.theme.primary_color} onChange={e => setBar({...bar, settings: {...bar.settings, theme: {...bar.settings.theme, primary_color: e.target.value}}})} className="w-6 h-6 p-0 border-0 rounded cursor-pointer" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-600">Button Text Color</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400">{bar.settings.theme.primary_text_color}</span>
                        <input type="color" value={bar.settings.theme.primary_text_color} onChange={e => setBar({...bar, settings: {...bar.settings, theme: {...bar.settings.theme, primary_text_color: e.target.value}}})} className="w-6 h-6 p-0 border-0 rounded cursor-pointer" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* CONDITIONS TAB */}
            {activeTab === 'conditions' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Trang hiển thị</label>
                  <select
                    value={bar.conditions.page_target}
                    onChange={e => setBar({...bar, conditions: {...bar.conditions, page_target: e.target.value}})}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="all">Tất cả các trang</option>
                    <option value="home">Chỉ trang chủ</option>
                    <option value="specific">Các đường dẫn cụ thể...</option>
                  </select>

                  {bar.conditions.page_target === "specific" && (
                    <div className="space-y-2 mt-2">
                      <label className="text-[10px] font-bold text-slate-500">Danh sách URL (ngăn cách bằng dấu phẩy)</label>
                      <textarea 
                        value={(bar.conditions.page_urls || []).join(", ")}
                        onChange={e => setBar({...bar, conditions: {...bar.conditions, page_urls: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean)}})}
                        className="w-full h-24 p-3 bg-white border border-slate-200 rounded-xl text-xs resize-none focus:border-primary"
                        placeholder="/about, /pricing, /blog/*"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Thiết bị</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["desktop", "mobile"].map(device => {
                      const isSelected = bar.conditions.devices.includes(device);
                      return (
                        <label key={device} className="flex items-center gap-2 cursor-pointer p-3 border border-slate-100 rounded-xl hover:bg-slate-50">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={(e) => {
                              const newDevices = e.target.checked 
                                ? [...bar.conditions.devices, device]
                                : bar.conditions.devices.filter((d: string) => d !== device);
                              setBar({...bar, conditions: {...bar.conditions, devices: newDevices}});
                            }}
                            className="rounded text-primary focus:ring-primary w-4 h-4"
                          />
                          <span className="text-xs font-bold text-slate-700 capitalize">{device}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-[10px] font-medium text-amber-700 leading-relaxed text-center">
                    Note: Top Notification Bar Manager will automatically evaluate these conditions on client-side before rendering.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - Preview */}
        <div className="flex-1 bg-slate-100 overflow-y-auto relative p-8">
           <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden flex flex-col items-center">
             
             {/* Fake Browser Top */}
             <div className="w-full h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2">
               <div className="flex gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-red-400" />
                 <div className="w-3 h-3 rounded-full bg-amber-400" />
                 <div className="w-3 h-3 rounded-full bg-green-400" />
               </div>
               <div className="flex-1 max-w-sm mx-auto h-6 bg-white border border-slate-200 rounded-md flex items-center justify-center">
                 <span className="text-[10px] text-slate-400 font-medium">smax.ai</span>
               </div>
             </div>

             {/* Live Preview Container */}
             <div className="w-full relative min-h-[400px] bg-slate-50">
               <TopNotificationBar 
                 id={bar.id} 
                 content={bar.content} 
                 settings={bar.settings} 
                 isPreview={true} 
               />
               
               {/* Fake Page Content to demonstrate offset */}
               <div className="p-8 w-full">
                 <div className="max-w-4xl mx-auto space-y-6">
                   {/* Fake Header */}
                   <div className="w-full h-16 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center px-6 justify-between">
                     <div className="w-32 h-6 bg-slate-100 rounded-lg" />
                     <div className="flex gap-4">
                       <div className="w-16 h-4 bg-slate-100 rounded-md" />
                       <div className="w-16 h-4 bg-slate-100 rounded-md" />
                       <div className="w-16 h-4 bg-slate-100 rounded-md" />
                     </div>
                   </div>

                   {/* Fake Hero */}
                   <div className="w-full h-64 bg-white border border-slate-200 rounded-3xl flex flex-col items-center justify-center space-y-4">
                      <div className="w-64 h-8 bg-slate-100 rounded-xl" />
                      <div className="w-96 h-4 bg-slate-50 rounded-lg" />
                      <div className="w-80 h-4 bg-slate-50 rounded-lg" />
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
