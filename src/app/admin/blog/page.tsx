"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { 
  Newspaper, Plus, Search, MoreVertical, 
  Eye, Edit2, Trash2, Globe, FileText, Calendar,
  Tag, Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ChevronDown, LayoutTemplate } from "lucide-react";

export default function BlogListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Categories state
  const [categories, setCategories] = useState<any[]>([]);
  const [filterCategoryId, setFilterCategoryId] = useState<string>("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategoryId]);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });
    
    if (data) setPosts(data);
    setLoading(false);
  }

  async function deletePost(id: string) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) fetchPosts();
  }

  async function fetchCategories() {
    const { data } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("name");
    if (data) setCategories(data);
  }

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategoryId === "all"
      ? true
      : filterCategoryId === "uncategorized"
        ? !p.category_id
        : p.category_id === filterCategoryId;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  const renderPageNumbers = () => {
    const pagesToShow: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pagesToShow.push(i);
    } else {
      pagesToShow.push(1);
      if (currentPage > 3) pagesToShow.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pagesToShow.push(i);
      }

      if (currentPage < totalPages - 2) pagesToShow.push("...");
      pagesToShow.push(totalPages);
    }

    return pagesToShow.map((pageVal, index) => {
      if (pageVal === "...") {
        return (
          <span key={`dots-${index}`} className="px-2 text-slate-400 font-bold">
            ...
          </span>
        );
      }
      return (
        <Button
          key={`page-${pageVal}`}
          variant={currentPage === pageVal ? "primary" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(pageVal as number)}
          className={cn(
            "rounded-xl h-10 w-10 p-0 font-bold",
            currentPage === pageVal
              ? "shadow-md shadow-primary/20"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          )}
        >
          {pageVal}
        </Button>
      );
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Newspaper className="w-6 h-6 text-primary" />
            </div>
            Blog & Tin tức
          </h1>
          <p className="text-sm text-slate-400 mt-1">Quản lý bài viết, chuyên mục và tối ưu GEO cho nội dung.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/blog/categories">
            <Button variant="outline" className="rounded-xl gap-2 font-bold">
              <Tag className="w-4 h-4" />
              Chuyên mục
            </Button>
          </Link>
          <Link href="/admin/blog/new">
            <Button className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" />
              Viết bài mới
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats & Search */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 bg-white border border-slate-200 rounded-2xl pl-11 pr-4 text-sm outline-none focus:border-primary transition-all shadow-sm"
          />
        </div>
        
        {/* Category Filter Dropdown */}
        <div className="relative shrink-0 w-full md:w-auto">
          <select
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
            className="w-full md:w-[200px] h-12 pl-4 pr-10 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 ring-primary/10 appearance-none cursor-pointer"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="uncategorized">Chưa phân loại</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl px-5 h-12 flex items-center justify-between shadow-sm shrink-0 w-full md:w-auto gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Đã xuất bản</span>
          <span className="text-xl font-black text-slate-900">{posts.filter(p => p.status === 'published').length}</span>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bài viết</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Chuyên mục</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày đăng</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8">
                      <div className="h-4 bg-slate-100 rounded-full w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    Chưa có bài viết nào. Hãy viết bài đầu tiên!
                  </td>
                </tr>
              ) : (
                paginatedPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          {post.featured_image ? (
                            <img src={post.featured_image} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{post.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                        {post.categories?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        post.status === 'published' 
                          ? 'bg-green-50 text-green-600 border border-green-100' 
                          : 'bg-slate-50 text-slate-400 border border-slate-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${post.status === 'published' ? 'bg-green-500' : 'bg-slate-300'}`} />
                        {post.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        {new Date(post.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/blog/${post.id}`}>
                          <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-primary transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </Link>
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-500 transition-colors">
                            <Globe className="w-4 h-4" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => setDeleteConfirm(post.id)}
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-5 bg-white border-t border-slate-100">
            <span className="text-sm font-bold text-slate-500">
              Hiển thị {startIndex + 1} - {Math.min(endIndex, filteredPosts.length)} trong tổng số {filteredPosts.length} bài viết
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="rounded-xl h-10 px-3 border-slate-200 text-slate-600 disabled:opacity-50"
              >
                Trước
              </Button>
              {renderPageNumbers()}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="rounded-xl h-10 px-3 border-slate-200 text-slate-600 disabled:opacity-50"
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Xóa bài viết"
        description="Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác."
        confirmText="Xóa bài viết"
        onConfirm={() => deleteConfirm && deletePost(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
