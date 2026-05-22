"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Edit2, Trash2, BookOpen, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { cn } from "@/lib/utils";

export default function CoursesListPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  async function fetchCourses() {
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("*, authors(name)")
      .order("created_at", { ascending: false });
    
    if (data) setCourses(data);
    setLoading(false);
  }

  async function deleteCourse(id: string) {
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (!error) fetchCourses();
  }

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            Quản lý Khoá học
          </h1>
          <p className="text-sm text-slate-400 mt-1">Tạo và chỉnh sửa khoá học, bài giảng.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/courses/new">
            <Button className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" />
              Thêm khoá học
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm khoá học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 bg-white border border-slate-200 rounded-2xl pl-11 pr-4 text-sm outline-none focus:border-primary transition-all shadow-sm"
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khoá học</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tác giả</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8">
                      <div className="h-4 bg-slate-100 rounded-full w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                    Chưa có khoá học nào. Hãy tạo khoá học đầu tiên!
                  </td>
                </tr>
              ) : (
                paginatedCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          {course.thumbnail_url ? (
                            <img src={course.thumbnail_url} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{course.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">/{course.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                        {course.authors?.name || "Chưa có tác giả"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        course.is_published 
                          ? "bg-green-50 text-green-600 border border-green-100" 
                          : "bg-slate-50 text-slate-400 border border-slate-100"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", course.is_published ? "bg-green-500" : "bg-slate-300")} />
                        {course.is_published ? "Đã đăng" : "Bản nháp"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/courses/${course.id}`}>
                          <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-primary transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => setDeleteConfirm(course.id)}
                          className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Xóa khoá học"
        description="Bạn có chắc chắn muốn xóa khoá học này không? Hành động này sẽ xóa toàn bộ bài giảng bên trong."
        confirmText="Xóa khoá học"
        onConfirm={() => deleteConfirm && deleteCourse(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
