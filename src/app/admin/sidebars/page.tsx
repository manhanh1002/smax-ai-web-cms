"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import {
  Plus, Search, MoreHorizontal, Layout,
  Trash2, Edit3, Clock, Layers
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function AdminSidebarList() {
  const [sidebars, setSidebars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newSidebarName, setNewSidebarName] = useState("");
  const [creating, setCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchSidebars();
  }, []);

  async function fetchSidebars() {
    const { data, error } = await supabase
      .from("sidebars")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Không thể tải danh sách sidebar");
    } else {
      setSidebars(data || []);
    }
    setLoading(false);
  }

  async function createSidebar() {
    if (!newSidebarName.trim()) {
      toast.error("Vui lòng nhập tên sidebar");
      return;
    }

    setCreating(true);
    const { data, error } = await supabase
      .from("sidebars")
      .insert([{ name: newSidebarName, widgets: [] }])
      .select()
      .single();

    if (error) {
      toast.error("Có lỗi xảy ra: " + error.message);
    } else {
      toast.success("Đã tạo sidebar mới!");
      setIsModalOpen(false);
      setNewSidebarName("");
      fetchSidebars();
    }
    setCreating(false);
  }

  async function deleteSidebar(id: string) {
    const { error } = await supabase.from("sidebars").delete().eq("id", id);
    if (error) {
      toast.error("Không thể xoá: " + error.message);
    } else {
      toast.success("Đã xoá sidebar");
      fetchSidebars();
    }
  }

  const filteredSidebars = sidebars.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sidebar Builder</h1>
          <p className="text-slate-500 mt-1">Quản lý và thiết kế các thanh bên (sidebars) cho website.</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Tạo Sidebar mới
        </Button>
      </div>

      {/* Filter and stats */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Tìm kiếm sidebar..."
            className="pl-11 h-12 rounded-2xl border-slate-200 bg-white focus:ring-primary/10 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          <Badge variant="gray" className="rounded-xl px-3 py-1.5 h-auto font-bold">
            Tổng: {sidebars.length}
          </Badge>
        </div>
      </div>

      {/* Sidebar List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-white rounded-3xl border border-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filteredSidebars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSidebars.map((sidebar) => (
            <div
              key={sidebar.id}
              className="group bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/5 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Layout className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/admin/sidebars/${sidebar.id}`}>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100">
                      <Edit3 className="w-4 h-4 text-slate-500" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirm(sidebar.id)}
                    className="h-9 w-9 p-0 rounded-xl hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                  </Button>
                </div>
              </div>

              <Link href={`/admin/sidebars/${sidebar.id}`} className="flex-1">
                <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-primary transition-colors">
                  {sidebar.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    {sidebar.widgets?.length || 0} widgets
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(sidebar.updated_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </Link>

              <div className="mt-6 pt-5 border-t border-slate-50">
                <Link href={`/admin/sidebars/${sidebar.id}`}>
                  <Button variant="outline" className="w-full rounded-xl h-10 font-bold border-slate-100 text-slate-500 group-hover:border-primary group-hover:text-primary transition-all">
                    Thiết kế Sidebar
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] p-20 border border-slate-100 text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-slate-200">
            <Layout className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Chưa có sidebar nào</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            Hãy bắt đầu bằng việc tạo sidebar đầu tiên để chèn vào các Quản lý trang của bạn.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
          >
            Tạo Sidebar ngay
          </Button>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Plus className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Tạo Sidebar mới</h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Nhập tên để định danh sidebar này. Bạn có thể sử dụng cùng một sidebar cho nhiều trang khác nhau.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Tên Sidebar</label>
                  <Input
                    autoFocus
                    placeholder="Ví dụ: Sidebar Blog Tin tức"
                    className="h-14 rounded-2xl border-slate-200 focus:border-primary transition-all text-lg font-bold"
                    value={newSidebarName}
                    onChange={(e) => setNewSidebarName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createSidebar()}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-xl font-bold text-slate-500"
              >
                Huỷ bỏ
              </Button>
              <Button
                onClick={createSidebar}
                disabled={creating}
                className="flex-[2] rounded-xl font-bold shadow-lg shadow-primary/20"
              >
                {creating ? "Đang tạo..." : "Xác nhận tạo"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Xoá sidebar"
        description="Bạn có chắc chắn muốn xoá sidebar này? Hành động này không thể hoàn tác."
        confirmText="Xoá"
        onConfirm={() => deleteConfirm && deleteSidebar(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
