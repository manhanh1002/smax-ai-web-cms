"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Plus, LayoutPanelTop, ToggleLeft, ToggleRight, Trash2, BarChart2, Eye, Pencil, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function NotificationBarsListPage() {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [bars, setBars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBars = async () => {
    const { data } = await supabase
      .from("notification_bars")
      .select("id, name, is_active, views_count, conversions_count, created_at, settings")
      .order("created_at", { ascending: false });
    setBars(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBars(); }, []);

  const createBar = async () => {
    const { data, error } = await supabase.from("notification_bars").insert({ name: "Notification Bar mới" }).select().single();
    if (error) { toast.error("Lỗi tạo notification bar: " + error.message); return; }
    if (data) window.location.href = `/admin/notification-bars/${data.id}`;
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("notification_bars").update({ is_active: !current }).eq("id", id);
    setBars(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p));
  };

  const deleteBar = async (id: string) => {
    await supabase.from("notification_bars").delete().eq("id", id);
    setBars(prev => prev.filter(p => p.id !== id));
    toast.success("Đã xoá thanh thông báo!");
  };

  const duplicateBar = async (bar: any) => {
    const { data, error } = await supabase.from("notification_bars").select("*").eq("id", bar.id).single();
    if (error) return;
    
    const { data: newBar } = await supabase.from("notification_bars").insert({
      name: `${data.name} (bản sao)`,
      content: data.content,
      settings: data.settings,
      conditions: data.conditions,
      is_active: false,
    }).select().single();
    if (newBar) fetchBars();
  };

  const totalViews = bars.reduce((s, p) => s + (p.views_count || 0), 0);
  const totalConversions = bars.reduce((s, p) => s + (p.conversions_count || 0), 0);

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
              <LayoutPanelTop className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Top Notification Bars</h1>
              <p className="text-sm text-slate-400 font-medium">Quản lý thanh thông báo nổi bật trên đầu trang</p>
            </div>
          </div>
        </div>
        <Button onClick={createBar} className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Tạo Bar mới
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Tổng số", value: bars.length, icon: LayoutPanelTop, color: "text-rose-500 bg-rose-50" },
          { label: "Đang hiển thị", value: bars.filter(p => p.is_active).length, icon: ToggleRight, color: "text-green-500 bg-green-50" },
          { label: "Lượt xem", value: totalViews.toLocaleString("vi"), icon: Eye, color: "text-blue-500 bg-blue-50" },
          { label: "Lượt click", value: `${totalConversions} (${totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(1) : 0}%)`, icon: BarChart2, color: "text-amber-500 bg-amber-50" },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", stat.color)}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : bars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-3xl gap-4">
          <LayoutPanelTop className="w-12 h-12 text-slate-200" />
          <p className="text-slate-400 font-bold">Chưa có thanh thông báo nào.</p>
          <Button onClick={createBar} className="rounded-2xl bg-primary hover:bg-primary-hover">
            <Plus className="w-4 h-4 mr-2" /> Tạo Bar đầu tiên
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {bars.map(bar => {
            const cvRate = bar.views_count > 0 ? ((bar.conversions_count / bar.views_count) * 100).toFixed(1) : "0.0";
            return (
              <div
                key={bar.id}
                className="group bg-white border border-slate-100 rounded-3xl px-6 py-4 hover:border-primary/30 hover:shadow-md transition-all flex items-center gap-5"
              >
                {/* Active Toggle */}
                <button
                  onClick={() => toggleActive(bar.id, bar.is_active)}
                  className="shrink-0"
                  title={bar.is_active ? "Đang bật - Click để tắt" : "Đang tắt - Click để bật"}
                >
                  {bar.is_active
                    ? <ToggleRight className="w-8 h-8 text-green-500" />
                    : <ToggleLeft className="w-8 h-8 text-slate-300" />
                  }
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-slate-900 text-sm truncate">{bar.name}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600">
                      {bar.settings?.layout === "marquee" ? "Marquee" : "Static"}
                    </span>
                    {bar.settings?.sticky && (
                      <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded-lg">
                        Sticky
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {bar.views_count || 0} lượt xem</span>
                    <span className="flex items-center gap-1"><BarChart2 className="w-3 h-3" /> {bar.conversions_count || 0} click</span>
                    <span className={cn("font-black", parseFloat(cvRate) >= 5 ? "text-green-500" : parseFloat(cvRate) >= 2 ? "text-amber-500" : "text-slate-400")}>
                      {cvRate}% CTR
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => duplicateBar(bar)}
                    title="Nhân bản"
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(bar.id)}
                    title="Xóa"
                    className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link href={`/admin/notification-bars/${bar.id}`}>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-primary transition-colors">
                      <Pencil className="w-3 h-3" /> Chỉnh sửa
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Xóa thanh thông báo"
        description="Bạn có chắc chắn muốn xóa thanh thông báo này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        onConfirm={() => deleteConfirm && deleteBar(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
