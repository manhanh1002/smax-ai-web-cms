"use client";

import React, { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, Search, Filter, Download, 
  Trash2, Eye, Calendar, Globe, Monitor, 
  Loader2, MoreHorizontal, MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
// Removed date-fns imports
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface Submission {
  id: string;
  created_at: string;
  form_id: string;
  data: any;
  page_url?: string;
  user_agent?: string;
  ip_address?: string;
  form?: { name: string };
}

function SubmissionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("form_id");

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [forms, setForms] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchForms();
    fetchSubmissions();
  }, [formId]);

  async function fetchForms() {
    const { data } = await supabase.from("forms").select("id, name");
    if (data) setForms(data);
  }

  async function fetchSubmissions() {
    setLoading(true);
    let query = supabase
      .from("form_submissions")
      .select("*, form:forms(name)")
      .order("created_at", { ascending: false });

    if (formId) {
      query = query.eq("form_id", formId);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching submissions:", error);
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  }

  async function deleteSubmission(id: string) {
    const { error } = await supabase.from("form_submissions").delete().eq("id", id);
    if (!error) {
      setSubmissions(submissions.filter(s => s.id !== id));
      if (selectedSubmission?.id === id) setSelectedSubmission(null);
      toast.success("Đã xoá phản hồi!");
    } else {
      toast.error("Lỗi khi xóa phản hồi: " + error.message);
    }
  }

  const filteredSubmissions = submissions.filter(s => {
    const searchStr = JSON.stringify(s.data).toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/forms">
            <button className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Phản hồi khách hàng</h1>
            <p className="text-slate-400 mt-1 font-medium">Danh sách các thông tin khách hàng đã gửi qua các form.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl gap-2 font-bold">
            <Download className="w-4 h-4" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="flex items-center gap-4">
            <select 
              value={formId || ""}
              onChange={(e) => {
                const val = e.target.value;
                router.push(val ? `/admin/submissions?form_id=${val}` : "/admin/submissions");
              }}
              className="h-11 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
            >
              <option value="">Tất cả Form</option>
              {forms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung..."
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
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold">Chưa có phản hồi nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Form</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Thông tin tiêu biểu</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Nguồn</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredSubmissions.map((sub) => {
                  const firstFields = Object.entries(sub.data || {}).slice(0, 2);
                  return (
                    <motion.tr 
                      key={sub.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">
                            {new Date(sub.created_at).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-slate-900">{sub.form?.name || "N/A"}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-wrap gap-2">
                          {firstFields.map(([key, val]: [string, any]) => (
                            <span key={key} className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 rounded text-slate-600 border border-slate-200/50">
                              <span className="font-bold uppercase opacity-60 mr-1">{key}:</span> {String(val)}
                            </span>
                          ))}
                          {Object.keys(sub.data || {}).length > 2 && (
                            <span className="text-[10px] font-black text-primary uppercase">+{Object.keys(sub.data || {}).length - 2} khác</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4 text-slate-300">
                          <span title={sub.page_url} className="cursor-help">
                            <Globe className="w-4 h-4 hover:text-primary transition-colors" />
                          </span>
                          <span title={sub.user_agent} className="cursor-help">
                            <Monitor className="w-4 h-4 hover:text-primary transition-colors" />
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setSelectedSubmission(sub)}
                            className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-primary transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm(sub.id)}
                            className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            onClick={() => setSelectedSubmission(null)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Chi tiết phản hồi</h3>
                <p className="text-xs text-slate-400 font-medium">Gửi lúc {new Date(selectedSubmission.created_at).toLocaleString("vi-VN")}</p>
              </div>
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 rotate-90" />
              </button>
            </div>
            
            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedSubmission.data || {}).map(([key, val]: [string, any]) => (
                  <div key={key} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{key}</p>
                    <p className="text-sm font-bold text-slate-900 whitespace-pre-wrap">{String(val)}</p>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Thông tin hệ thống</p>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                    <Globe className="w-4 h-4 shrink-0" />
                    <span className="font-medium truncate">Trang nguồn: {selectedSubmission.page_url}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                    <Monitor className="w-4 h-4 shrink-0" />
                    <span className="font-medium truncate">Thiết bị: {selectedSubmission.user_agent}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <Button onClick={() => setSelectedSubmission(null)} className="flex-1 rounded-xl font-bold">Đóng</Button>
              <Button 
                variant="outline" 
                onClick={() => setDeleteConfirm(selectedSubmission.id)}
                className="rounded-xl font-bold border-red-100 text-red-500 hover:bg-red-50"
              >
                Xóa phản hồi
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Xóa phản hồi"
        description="Bạn có chắc chắn muốn xóa phản hồi này? Hành động này không thể hoàn tác."
        confirmText="Xóa phản hồi"
        onConfirm={() => deleteConfirm && deleteSubmission(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
      />
    </div>
  );
}

export default function SubmissionsPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <SubmissionsContent />
    </Suspense>
  );
}
