"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { X, Home, AlertCircle, Layout, Columns, PanelLeft, PanelRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface PageSettingsModalProps {
  page: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPage: any) => void;
  categories: any[];
  availableSidebars: any[];
}

export function PageSettingsModal({ page, isOpen, onClose, onSave, categories, availableSidebars }: PageSettingsModalProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isHome, setIsHome] = useState(false);
  const [is404, setIs404] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [layoutType, setLayoutType] = useState<"full" | "left-sidebar" | "right-sidebar" | "double-sidebar">("full");
  const [hideHeader, setHideHeader] = useState(false);
  const [hideFooter, setHideFooter] = useState(false);
  const [sidebarLeftId, setSidebarLeftId] = useState<string | null>(null);
  const [sidebarRightId, setSidebarRightId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (page && isOpen) {
      setTitle(page.title || "");
      setSlug(page.slug || "");
      setIsHome(page.is_home || false);
      setIs404(page.is_404 || false);
      setStatus(page.status || "draft");
      setLayoutType(page.layout_type || "full");
      setHideHeader(page.hide_header || false);
      setHideFooter(page.hide_footer || false);
      setSidebarLeftId(page.sidebar_left_id || null);
      setSidebarRightId(page.sidebar_right_id || null);
      setCategoryId(page.category_id || null);
    }
  }, [page, isOpen]);

  if (!isOpen) return null;

  async function handleSave() {
    setSaving(true);
    
    // Unset others if this is set to home or 404
    if (isHome && !page.is_home) {
      await supabase.from("pages").update({ is_home: false }).eq("is_home", true);
    }
    if (is404 && !page.is_404) {
      await supabase.from("pages").update({ is_404: false }).eq("is_404", true);
    }

    const updates = {
      title,
      slug,
      is_home: isHome,
      is_404: is404,
      status,
      layout_type: layoutType,
      hide_header: hideHeader,
      hide_footer: hideFooter,
      sidebar_left_id: sidebarLeftId,
      sidebar_right_id: sidebarRightId,
      category_id: categoryId,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("pages")
      .update(updates)
      .eq("id", page.id)
      .select("*, page_categories(id, name)")
      .single();

    if (error) {
      toast.error("Lỗi khi lưu cài đặt: " + error.message);
    } else {
      toast.success("Đã lưu cài đặt trang!");
      onSave(data);
      onClose();
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-900">Cấu hình trang</h2>
            <p className="text-xs text-slate-400 mt-0.5">Thiết lập thông tin và giao diện của trang.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[80vh]">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tiêu đề trang</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl h-12" />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Đường dẫn (Alias)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono">/</span>
                <Input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""))} className="pl-8 rounded-xl h-12" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Danh mục trang</Label>
              <select
                value={categoryId || ""}
                onChange={(e) => setCategoryId(e.target.value || null)}
                className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 ring-primary/20"
              >
                <option value="">-- Không có danh mục --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="pt-2 space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-xl", status === 'published' ? "bg-green-100 text-green-600" : "bg-white text-slate-300")}>
                    <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                      <div className={cn("w-2 h-2 rounded-full", status === 'published' ? "bg-green-600" : "bg-slate-300")} />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}</p>
                </div>
                <Toggle checked={status === 'published'} onChange={(checked) => setStatus(checked ? 'published' : 'draft')} />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 text-slate-900">
                  <Home className={cn("w-5 h-5", isHome ? "text-amber-500" : "text-slate-300")} />
                  <p className="text-sm font-bold">Đặt làm Trang chủ</p>
                </div>
                <Toggle checked={isHome} onChange={setIsHome} />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 text-slate-900">
                  <AlertCircle className={cn("w-5 h-5", is404 ? "text-red-500" : "text-slate-300")} />
                  <p className="text-sm font-bold">Đặt làm Trang 404</p>
                </div>
                <Toggle checked={is404} onChange={setIs404} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Bố cục trang (Layout)</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'full', icon: Layout, label: 'No Sidebar' },
                  { id: 'left-sidebar', icon: PanelLeft, label: 'Left Sidebar' },
                  { id: 'right-sidebar', icon: PanelRight, label: 'Right Sidebar' },
                  { id: 'double-sidebar', icon: Columns, label: 'Double Side' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setLayoutType(item.id as any)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                      layoutType === item.id ? "border-primary bg-primary/5 text-primary" : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                    )}
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="text-[10px] font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Gán Sidebar</Label>
              <div className="grid grid-cols-1 gap-4">
                {(layoutType === 'left-sidebar' || layoutType === 'double-sidebar') && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-400">Sidebar Bên Trái</Label>
                    <select 
                      value={sidebarLeftId || ""} 
                      onChange={(e) => setSidebarLeftId(e.target.value || null)}
                      className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 ring-primary/20"
                    >
                      <option value="">-- Mặc định --</option>
                      {availableSidebars.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                )}
                {(layoutType === 'right-sidebar' || layoutType === 'double-sidebar') && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-400">Sidebar Bên Phải</Label>
                    <select 
                      value={sidebarRightId || ""} 
                      onChange={(e) => setSidebarRightId(e.target.value || null)}
                      className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 ring-primary/20"
                    >
                      <option value="">-- Mặc định --</option>
                      {availableSidebars.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                )}
                {layoutType === 'full' && (
                  <p className="text-[10px] text-slate-400 italic">Chọn kiểu layout có Sidebar để kích hoạt tính năng này.</p>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Hiển thị (Landing Page)</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-sm font-bold text-slate-900">Ẩn Header</p>
                  <Toggle checked={hideHeader} onChange={setHideHeader} />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-sm font-bold text-slate-900">Ẩn Footer</p>
                  <Toggle checked={hideFooter} onChange={setHideFooter} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold">Huỷ</Button>
          <Button onClick={handleSave} disabled={saving} className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
            {saving ? "Đang lưu..." : "Lưu cài đặt"}
          </Button>
        </div>
      </div>
    </div>
  );
}
