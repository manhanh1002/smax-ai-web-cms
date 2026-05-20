"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Plus, FileText, MoreHorizontal, Search, 
  ArrowUpRight, Users, MessageSquare, Trash2, Edit3, 
  Loader2, Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
// Removed date-fns imports

interface Form {
  id: string;
  name: string;
  description: string;
  created_at: string;
  settings: any;
  submission_count?: number;
}

export default function FormsAdminPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchForms();
  }, []);

  async function fetchForms() {
    setLoading(true);
    const { data: formsData, error } = await supabase
      .from("forms")
      .select("*, form_submissions(count)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching forms:", error);
    } else {
      setForms(formsData.map(f => ({
        ...f,
        submission_count: f.form_submissions?.[0]?.count || 0
      })));
    }
    setLoading(false);
  }

  async function deleteForm(id: string) {
    const { error } = await supabase.from("forms").delete().eq("id", id);
    if (error) {
      toast.error("Lỗi khi xóa form: " + error.message);
    } else {
      setForms(forms.filter(f => f.id !== id));
      toast.success("Đã xoá form thành công!");
    }
  }

  const filteredForms = forms.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý Form</h1>
          <p className="text-slate-400 mt-1 font-medium">Tạo và quản lý các form thu thập thông tin trên toàn hệ thống.</p>
        </div>
        <Link href="/admin/forms/new">
          <Button className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            Tạo Form mới
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tổng số Form</p>
            <h3 className="text-2xl font-black text-slate-900">{forms.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Phản hồi mới</p>
            <h3 className="text-2xl font-black text-slate-900">
              {forms.reduce((acc, f) => acc + (f.submission_count || 0), 0)}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tỉ lệ chuyển đổi</p>
            <h3 className="text-2xl font-black text-slate-900">24.5%</h3>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Danh sách Forms</h3>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm form..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Đang tải dữ liệu...</p>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold">Không tìm thấy form nào.</p>
            <Link href="/admin/forms/new">
              <Button variant="outline" className="rounded-xl">Tạo form đầu tiên</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên Form</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Phản hồi</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Loại</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày tạo</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredForms.map((form) => (
                  <motion.tr 
                    key={form.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{form.name}</span>
                        <span className="text-xs text-slate-400 mt-0.5 line-clamp-1">{form.description || "Không có mô tả"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 font-bold text-xs">
                          {form.submission_count}
                        </div>
                        <Link href={`/admin/submissions?form_id=${form.id}`} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                          Xem chi tiết
                        </Link>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        form.settings?.type === "multistep" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                      )}>
                        {form.settings?.type === "multistep" ? "Nhiều bước" : "Một bước"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">
                          {new Date(form.created_at).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/forms/${form.id}`}>
                          <button className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-primary transition-all">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => setDeleteConfirm(form.id)}
                          className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-8 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Hệ thống quản lý dữ liệu người dùng Smax AI</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-all">1</button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary transition-all">2</button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Xóa Form"
        description="Bạn có chắc chắn muốn xóa form này? Toàn bộ dữ liệu liên quan sẽ bị xóa."
        confirmText="Xóa Form"
        onConfirm={() => deleteConfirm && deleteForm(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
