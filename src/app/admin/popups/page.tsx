"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Plus, Layers, ToggleLeft, ToggleRight, Trash2, BarChart2, Eye, ArrowRight, Pencil, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

const TYPE_LABEL: Record<string, string> = {
  modal: "Modal",
  "slide-in": "Slide-in",
  bar: "Bar",
};

const TYPE_COLOR: Record<string, string> = {
  modal: "bg-blue-50 text-blue-600",
  "slide-in": "bg-purple-50 text-purple-600",
  bar: "bg-amber-50 text-amber-700",
};

const POSITION_LABEL: Record<string, string> = {
  center: "Trung tâm",
  "top-left": "Trên trái",
  "top-right": "Trên phải",
  "bottom-left": "Dưới trái",
  "bottom-right": "Dưới phải",
  "top-bar": "Thanh trên",
  "bottom-bar": "Thanh dưới",
};

export default function PopupsListPage() {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [popups, setPopups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPopups = async () => {
    const { data } = await supabase
      .from("popups")
      .select("id, name, type, position, is_active, views_count, conversions_count, created_at")
      .order("created_at", { ascending: false });
    setPopups(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPopups(); }, []);

  const createPopup = async () => {
    const { data, error } = await supabase.from("popups").insert({ name: "Popup mới" }).select().single();
    if (error) { toast.error("Lỗi tạo popup: " + error.message); return; }
    if (data) window.location.href = `/admin/popups/${data.id}`;
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("popups").update({ is_active: !current }).eq("id", id);
    setPopups(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p));
  };

  const deletePopup = async (id: string) => {
    await supabase.from("popups").delete().eq("id", id);
    setPopups(prev => prev.filter(p => p.id !== id));
    toast.success("Đã xoá popup!");
  };

  const duplicatePopup = async (popup: any) => {
    const { data } = await supabase.from("popups").insert({
      name: `${popup.name} (bản sao)`,
      type: popup.type,
      position: popup.position,
      content: popup.content,
      settings: popup.settings,
      conditions: popup.conditions,
      is_active: false,
    }).select().single();
    if (data) fetchPopups();
  };

  const totalViews = popups.reduce((s, p) => s + (p.views_count || 0), 0);
  const totalConversions = popups.reduce((s, p) => s + (p.conversions_count || 0), 0);

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Popup Builder</h1>
              <p className="text-sm text-slate-400 font-medium">Quản lý và tối ưu hóa chuyển đổi qua popup</p>
            </div>
          </div>
        </div>
        <Button onClick={createPopup} className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Tạo Popup mới
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Tổng Popups", value: popups.length, icon: Layers, color: "text-violet-500 bg-violet-50" },
          { label: "Đang kích hoạt", value: popups.filter(p => p.is_active).length, icon: ToggleRight, color: "text-green-500 bg-green-50" },
          { label: "Lượt hiển thị", value: totalViews.toLocaleString("vi"), icon: Eye, color: "text-blue-500 bg-blue-50" },
          { label: "Chuyển đổi", value: `${totalConversions} (${totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(1) : 0}%)`, icon: BarChart2, color: "text-amber-500 bg-amber-50" },
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
      ) : popups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-3xl gap-4">
          <Layers className="w-12 h-12 text-slate-200" />
          <p className="text-slate-400 font-bold">Chưa có popup nào. Tạo popup đầu tiên!</p>
          <Button onClick={createPopup} className="rounded-2xl">
            <Plus className="w-4 h-4 mr-2" /> Tạo Popup mới
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {popups.map(popup => {
            const cvRate = popup.views_count > 0 ? ((popup.conversions_count / popup.views_count) * 100).toFixed(1) : "0.0";
            return (
              <div
                key={popup.id}
                className="group bg-white border border-slate-100 rounded-3xl px-6 py-4 hover:border-primary/30 hover:shadow-md transition-all flex items-center gap-5"
              >
                {/* Active Toggle */}
                <button
                  onClick={() => toggleActive(popup.id, popup.is_active)}
                  className="shrink-0"
                  title={popup.is_active ? "Đang bật - Click để tắt" : "Đang tắt - Click để bật"}
                >
                  {popup.is_active
                    ? <ToggleRight className="w-8 h-8 text-green-500" />
                    : <ToggleLeft className="w-8 h-8 text-slate-300" />
                  }
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-slate-900 text-sm truncate">{popup.name}</h3>
                    <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg", TYPE_COLOR[popup.type] || "bg-slate-100 text-slate-500")}>
                      {TYPE_LABEL[popup.type] || popup.type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {POSITION_LABEL[popup.position] || popup.position}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {popup.views_count || 0} lượt xem</span>
                    <span className="flex items-center gap-1"><BarChart2 className="w-3 h-3" /> {popup.conversions_count || 0} chuyển đổi</span>
                    <span className={cn("font-black", parseFloat(cvRate) >= 5 ? "text-green-500" : parseFloat(cvRate) >= 2 ? "text-amber-500" : "text-slate-400")}>
                      {cvRate}% CVR
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => duplicatePopup(popup)}
                    title="Nhân bản"
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(popup.id)}
                    title="Xóa"
                    className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link href={`/admin/popups/${popup.id}`}>
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
        title="Xóa popup"
        description="Bạn có chắc chắn muốn xóa popup này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        onConfirm={() => deleteConfirm && deletePopup(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
