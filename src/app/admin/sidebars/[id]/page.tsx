"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { 
  ArrowLeft, Save, Plus, Trash2, GripVertical, 
  Search, List, Image as ImageIcon, Link as LinkIcon, 
  Type, Layout, Settings, X, ChevronDown, ChevronUp,
  CreditCard, ExternalLink, Globe
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { MediaPicker } from "@/components/cms/MediaPicker";

const WIDGET_TYPES = [
  { id: 'search', label: 'Tìm kiếm', icon: Search, description: 'Ô tìm kiếm nội dung' },
  { id: 'categories', label: 'Danh mục', icon: List, description: 'Danh sách các chuyên mục' },
  { id: 'promo-card', label: 'Thẻ quảng cáo', icon: CreditCard, description: 'Ảnh + Text + Nút bấm' },
  { id: 'recent-posts', label: 'Bài viết mới', icon: Type, description: 'Danh sách bài viết gần đây' },
  { id: 'image-links', label: 'Ảnh liên kết', icon: ImageIcon, description: 'Banner ảnh có link' },
  { id: 'custom-html', label: 'HTML tuỳ chỉnh', icon: Globe, description: 'Chèn mã HTML hoặc Text' },
];

export default function SidebarEditor() {
  const { id } = useParams() as { id: string };

  const [sidebar, setSidebar] = useState<any>(null);
  const [widgets, setWidgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeWidget, setActiveWidget] = useState<number | null>(null);

  useEffect(() => {
    fetchSidebar();
  }, [id]);

  async function fetchSidebar() {
    const { data, error } = await supabase
      .from("sidebars")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Không thể tải thông tin sidebar");
    } else {
      setSidebar(data);
      setWidgets(data.widgets || []);
    }
    setLoading(false);
  }

  async function saveSidebar() {
    setSaving(true);
    const { error } = await supabase
      .from("sidebars")
      .update({ 
        widgets,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      toast.error("Có lỗi xảy ra: " + error.message);
    } else {
      toast.success("Đã lưu sidebar thành công!");
    }
    setSaving(false);
  }

  const addWidget = (type: string) => {
    const newWidget = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: type.toUpperCase(),
      config: getDefaultConfig(type)
    };
    setWidgets([...widgets, newWidget]);
    setActiveWidget(widgets.length);
  };

  const getDefaultConfig = (type: string) => {
    switch (type) {
      case 'search': return { placeholder: 'Tìm kiếm...' };
      case 'categories': return { postType: 'blog', showCount: true };
      case 'promo-card': return { image: '', title: 'Khám phá ngay', subtitle: 'Mô tả ngắn gọn', buttonText: 'Xem thêm', link: '#' };
      case 'recent-posts': return { postType: 'blog', limit: 5 };
      case 'image-links': return { items: [{ image: '', link: '#' }] };
      case 'custom-html': return { html: '<p>Nội dung tuỳ chỉnh</p>' };
      default: return {};
    }
  };

  const deleteWidget = (index: number) => {
    const newWidgets = [...widgets];
    newWidgets.splice(index, 1);
    setWidgets(newWidgets);
    setActiveWidget(null);
  };

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const newWidgets = [...widgets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newWidgets.length) return;
    
    [newWidgets[index], newWidgets[targetIndex]] = [newWidgets[targetIndex], newWidgets[index]];
    setWidgets(newWidgets);
    if (activeWidget === index) setActiveWidget(targetIndex);
    else if (activeWidget === targetIndex) setActiveWidget(index);
  };

  const updateWidgetConfig = (index: number, config: any) => {
    const newWidgets = [...widgets];
    newWidgets[index].config = { ...newWidgets[index].config, ...config };
    setWidgets(newWidgets);
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Đang tải...</div>;
  if (!sidebar) return <div className="p-8 text-center text-red-500">Sidebar không tồn tại</div>;

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-20 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/admin/sidebars">
            <Button variant="ghost" size="sm" className="rounded-xl">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-none">{sidebar.name}</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sidebar Builder Editor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={saveSidebar} disabled={saving} className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
            <Save className="w-4 h-4" />
            {saving ? "Đang lưu..." : "Lưu Sidebar"}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Widget Library */}
        <div className="w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto shrink-0">
          <h2 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-wider">Thư viện Widget</h2>
          <div className="grid grid-cols-1 gap-3">
            {WIDGET_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => addWidget(type.id)}
                className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-primary hover:bg-primary/[0.02] transition-all group text-left"
              >
                <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                  <type.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{type.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{type.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center Panel: Preview & Ordering */}
        <div className="flex-1 bg-slate-50 p-8 overflow-y-auto flex justify-center">
          <div className="w-[320px] space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Preview Sidebar</h2>
              <span className="text-[10px] text-slate-300 font-mono">Desktop Width</span>
            </div>

            <div className="space-y-3">
              {widgets.length === 0 && (
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center text-slate-300">
                  <Layout className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">Chưa có widget nào. Hãy chọn từ bên trái!</p>
                </div>
              )}

              {widgets.map((widget, index) => {
                const typeInfo = WIDGET_TYPES.find(t => t.id === widget.type);
                return (
                  <div 
                    key={widget.id}
                    className={cn(
                      "relative group bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 overflow-hidden",
                      activeWidget === index ? "ring-2 ring-primary border-transparent shadow-xl" : "hover:shadow-md"
                    )}
                    onClick={() => setActiveWidget(index)}
                  >
                    {/* Header bar for each widget */}
                    <div className={cn(
                      "flex items-center justify-between px-4 py-3 border-b transition-colors",
                      activeWidget === index ? "bg-primary text-white border-primary" : "bg-slate-50 border-slate-100"
                    )}>
                      <div className="flex items-center gap-2">
                        {typeInfo?.icon && <typeInfo.icon className="w-3.5 h-3.5" />}
                        <span className="text-[10px] font-black uppercase tracking-wider">{typeInfo?.label || widget.type}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); moveWidget(index, 'up'); }} className="p-1 hover:bg-black/5 rounded">
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); moveWidget(index, 'down'); }} className="p-1 hover:bg-black/5 rounded">
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); deleteWidget(index); }} className="p-1 hover:bg-red-500 rounded text-red-500 hover:text-white">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Simple Preview of Widget */}
                    <div className="p-4 bg-white">
                      <div className="text-xs text-slate-400 font-medium">
                        {widget.type === 'search' && <div className="h-8 bg-slate-50 rounded-lg flex items-center px-3 border border-slate-100">Tìm kiếm...</div>}
                        {widget.type === 'categories' && <div className="space-y-1.5 opacity-60"><div className="h-4 bg-slate-50 rounded-md w-3/4" /><div className="h-4 bg-slate-50 rounded-md w-2/3" /><div className="h-4 bg-slate-50 rounded-md w-1/2" /></div>}
                        {widget.type === 'promo-card' && (
                          <div className="space-y-2">
                            <div className="aspect-[4/3] bg-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                              {widget.config.image ? <img src={widget.config.image} className="w-full h-full object-cover rounded-xl" /> : <ImageIcon className="w-6 h-6" />}
                            </div>
                            <div className="h-4 bg-slate-50 rounded-md w-full font-black text-[10px] text-slate-900 flex items-center px-2">{widget.config.title}</div>
                          </div>
                        )}
                        {widget.type === 'recent-posts' && <div className="space-y-2 opacity-60"><div className="flex gap-2 items-center"><div className="w-6 h-6 bg-slate-100 rounded" /><div className="h-3 bg-slate-100 rounded-md w-2/3" /></div><div className="flex gap-2 items-center"><div className="w-6 h-6 bg-slate-100 rounded" /><div className="h-3 bg-slate-100 rounded-md w-1/2" /></div></div>}
                        {widget.type === 'image-links' && <div className="aspect-video bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-slate-200" /></div>}
                        {widget.type === 'custom-html' && <div className="text-[10px] font-mono p-2 bg-slate-50 rounded-lg border border-slate-100 line-clamp-3">{widget.config.html}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel: Settings for Active Widget */}
        <div className="w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto shrink-0">
          {activeWidget !== null ? (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" /> Cài đặt Widget
                </h2>
                <button onClick={() => setActiveWidget(null)} className="p-1 rounded hover:bg-slate-50">
                  <X className="w-4 h-4 text-slate-300" />
                </button>
              </div>

              {/* Specific Config Forms based on Type */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Tiêu đề Widget</Label>
                  <Input 
                    value={widgets[activeWidget].title} 
                    onChange={(e) => {
                      const newWidgets = [...widgets];
                      newWidgets[activeWidget].title = e.target.value;
                      setWidgets(newWidgets);
                    }}
                    className="rounded-xl border-slate-200 h-11"
                  />
                </div>

                {widgets[activeWidget].type === 'search' && (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Placeholder</Label>
                    <Input 
                      value={widgets[activeWidget].config.placeholder} 
                      onChange={(e) => updateWidgetConfig(activeWidget, { placeholder: e.target.value })}
                      className="rounded-xl border-slate-200 h-11"
                    />
                  </div>
                )}

                {widgets[activeWidget].type === 'categories' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Loại nội dung</Label>
                      <select 
                        value={widgets[activeWidget].config.postType}
                        onChange={(e) => updateWidgetConfig(activeWidget, { postType: e.target.value })}
                        className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 ring-primary/20"
                      >
                        <option value="blog">Blog / Tin tức</option>
                        <option value="product">Sản phẩm</option>
                        <option value="event">Sự kiện</option>
                      </select>
                    </div>
                  </div>
                )}

                {widgets[activeWidget].type === 'promo-card' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Ảnh banner</Label>
                      <MediaPicker 
                        onSelect={(url) => updateWidgetConfig(activeWidget, { image: url })}
                        trigger={
                          <div className="aspect-video bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-primary overflow-hidden transition-all group">
                            {widgets[activeWidget].config.image ? (
                              <img src={widgets[activeWidget].config.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            ) : (
                              <div className="text-center">
                                <ImageIcon className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                                <p className="text-[10px] text-gray-400 font-medium">Click to upload</p>
                              </div>
                            )}
                          </div>
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Tiêu đề Card</Label>
                      <Input value={widgets[activeWidget].config.title} onChange={(e) => updateWidgetConfig(activeWidget, { title: e.target.value })} className="rounded-xl border-slate-200 h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Text Nút bấm</Label>
                      <Input value={widgets[activeWidget].config.buttonText} onChange={(e) => updateWidgetConfig(activeWidget, { buttonText: e.target.value })} className="rounded-xl border-slate-200 h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Đường dẫn liên kết</Label>
                      <Input value={widgets[activeWidget].config.link} onChange={(e) => updateWidgetConfig(activeWidget, { link: e.target.value })} className="rounded-xl border-slate-200 h-11" />
                    </div>
                  </div>
                )}

                {widgets[activeWidget].type === 'custom-html' && (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Mã HTML / Text</Label>
                    <textarea 
                      value={widgets[activeWidget].config.html}
                      onChange={(e) => updateWidgetConfig(activeWidget, { html: e.target.value })}
                      className="w-full h-48 rounded-xl border border-slate-200 p-4 text-xs font-mono focus:outline-none focus:ring-2 ring-primary/20"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-300">
              <Settings className="w-12 h-12 mb-4 opacity-10" />
              <p className="text-xs font-medium">Chọn một widget trong danh sách Preview để bắt đầu cấu hình.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
