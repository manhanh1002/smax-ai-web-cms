"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarRendererProps {
  sidebarId?: string;
}

export default function SidebarRenderer({ sidebarId }: SidebarRendererProps) {
  const [widgets, setWidgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sidebarId) {
      fetchSidebar();
    } else {
      setLoading(false);
    }
  }, [sidebarId]);

  async function fetchSidebar() {
    const { data } = await supabase
      .from("sidebars")
      .select("widgets")
      .eq("id", sidebarId)
      .single();
    
    if (data) {
      setWidgets(data.widgets || []);
    }
    setLoading(false);
  }

  if (loading) return <div className="space-y-6 animate-pulse">
    <div className="h-40 bg-slate-100 rounded-3xl" />
    <div className="h-60 bg-slate-100 rounded-3xl" />
  </div>;

  if (!sidebarId || widgets.length === 0) return null;

  return (
    <div className="space-y-10">
      {widgets.map((widget) => (
        <div key={widget.id} className="sidebar-widget">
          {widget.title && (
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {widget.title}
            </h3>
          )}
          
          <div className="widget-content">
            {renderWidget(widget)}
          </div>
        </div>
      ))}
    </div>
  );
}

function renderWidget(widget: any) {
  const { type, config } = widget;

  switch (type) {
    case 'search':
      return (
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder={config.placeholder || "Tìm kiếm..."}
            className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 ring-primary/10 focus:bg-white transition-all"
          />
        </div>
      );

    case 'categories':
      return (
        <ul className="space-y-1">
          {['Công nghệ AI', 'Digital Marketing', 'Tối ưu quảng cáo', 'Tự động hoá'].map((cat, i) => (
            <li key={i}>
              <a href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-primary font-medium transition-all group">
                <span className="text-sm">{cat}</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </a>
            </li>
          ))}
        </ul>
      );

    case 'promo-card':
      return (
        <div className="relative overflow-hidden rounded-[32px] group bg-slate-900 aspect-[4/5] flex flex-col justify-end p-6">
          {config.image && (
            <img 
              src={config.image} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
              alt={config.title}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="relative z-10">
            <h4 className="text-white font-black text-xl mb-2 leading-tight">{config.title}</h4>
            <p className="text-white/70 text-xs mb-5 line-clamp-2">{config.subtitle}</p>
            <a href={config.link || "#"}>
              <button className="w-full py-3 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                {config.buttonText || "Khám phá"}
              </button>
            </a>
          </div>
        </div>
      );

    case 'recent-posts':
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <a key={i} href="#" className="flex gap-3 group">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl shrink-0 overflow-hidden">
                <div className="w-full h-full bg-slate-200 animate-pulse" />
              </div>
              <div className="flex flex-col justify-center">
                <h5 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors">
                  Cách tối ưu Landing Page bằng AI hiệu quả 2026
                </h5>
                <span className="text-[10px] text-slate-400 mt-1 font-medium uppercase tracking-tighter">25 Tháng 4, 2026</span>
              </div>
            </a>
          ))}
        </div>
      );

    case 'image-links':
      return (
        <div className="space-y-3">
          {config.items?.map((item: any, i: number) => (
            <a key={i} href={item.link || "#"} className="block overflow-hidden rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
              <img src={item.image || "https://placehold.co/400x200/f8fafc/cbd5e1?text=No+Image"} className="w-full aspect-[2/1] object-cover" alt="Banner" />
            </a>
          ))}
        </div>
      );

    case 'custom-html':
      return (
        <div 
          className="text-sm text-slate-600 prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: config.html || "" }}
        />
      );

    default:
      return null;
  }
}
