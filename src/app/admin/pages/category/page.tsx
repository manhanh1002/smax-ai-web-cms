"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { Tag, Plus, Trash2, ArrowLeft, Edit2, Check, X, FolderOpen } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PromptModal } from "@/components/ui/PromptModal";

export default function PageCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [createPromptOpen, setCreatePromptOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [pageCounts, setPageCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data } = await supabase
      .from("page_categories")
      .select("*")
      .order("name");
    if (data) {
      setCategories(data);
      fetchPageCounts(data.map((c) => c.id));
    }
    setLoading(false);
  }

  async function fetchPageCounts(categoryIds: string[]) {
    if (!categoryIds.length) return;
    const { data } = await supabase
      .from("pages")
      .select("category_id")
      .in("category_id", categoryIds);
    if (data) {
      const counts: Record<string, number> = {};
      data.forEach((row) => {
        if (row.category_id) {
          counts[row.category_id] = (counts[row.category_id] || 0) + 1;
        }
      });
      setPageCounts(counts);
    }
  }

  async function handleAddCategory(name: string) {
    if (!name.trim()) return;
    const slug = name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const { error } = await supabase.from("page_categories").insert([{ name: name.trim(), slug }]);

    if (error) {
      toast.error("Lỗi khi tạo danh mục: " + error.message);
    } else {
      toast.success("Đã tạo danh mục mới!");
      fetchCategories();
    }
  }

  async function handleEditSave(id: string) {
    if (!editingName.trim()) return;
    const slug = editingName
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const { error } = await supabase
      .from("page_categories")
      .update({ name: editingName.trim(), slug })
      .eq("id", id);

    if (error) {
      toast.error("Lỗi khi cập nhật: " + error.message);
    } else {
      toast.success("Đã cập nhật danh mục!");
      setEditingId(null);
      fetchCategories();
    }
  }

  async function deleteCategory(id: string) {
    const { error } = await supabase.from("page_categories").delete().eq("id", id);
    if (error) {
      toast.error("Lỗi khi xoá: " + error.message);
    } else {
      toast.success("Đã xoá danh mục!");
      fetchCategories();
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages">
            <Button variant="ghost" size="sm" className="rounded-xl h-10 w-10 p-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Chuyên mục trang
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Phân loại và tổ chức các trang nội dung.
            </p>
          </div>
        </div>
        <Button
          onClick={() => setCreatePromptOpen(true)}
          className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Thêm danh mục
        </Button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-2xl px-4 py-2.5 shadow-sm">
          <Tag className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-slate-700">
            {categories.length} danh mục
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/40">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Tên danh mục
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Slug
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Số trang
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-8 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
                    <span className="text-sm font-bold text-slate-400">Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center">
                      <FolderOpen className="w-8 h-8 text-slate-200" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-400">Chưa có danh mục nào</p>
                      <p className="text-xs text-slate-300 mt-1">
                        Bấm "Thêm danh mục" để bắt đầu phân loại trang.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-4">
                    {editingId === cat.id ? (
                      <Input
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditSave(cat.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="h-9 rounded-xl text-sm font-bold max-w-[220px]"
                      />
                    ) : (
                      <span className="font-bold text-slate-900">{cat.name}</span>
                    )}
                  </td>
                  <td className="px-8 py-4">
                    <code className="text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 tracking-tight italic">
                      /{cat.slug}
                    </code>
                  </td>
                  <td className="px-8 py-4">
                    <Badge variant="gray" className="rounded-xl px-3 py-1 font-bold">
                      {pageCounts[cat.id] || 0} trang
                    </Badge>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId === cat.id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 rounded-xl hover:bg-green-50 hover:text-green-600"
                            onClick={() => handleEditSave(cat.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100"
                            onClick={() => setEditingId(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 rounded-xl hover:bg-white hover:shadow-md transition-all"
                            onClick={() => {
                              setEditingId(cat.id);
                              setEditingName(cat.name);
                            }}
                          >
                            <Edit2 className="w-4 h-4 text-slate-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                            onClick={() => setDeleteConfirm(cat.id)}
                          >
                            <Trash2 className="w-4 h-4 text-slate-400" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Xóa danh mục"
        description="Bạn có chắc chắn muốn xóa danh mục này? Các trang thuộc danh mục này sẽ trở thành chưa phân loại."
        confirmText="Xóa danh mục"
        onConfirm={() => deleteConfirm && deleteCategory(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
      />

      <PromptModal
        isOpen={createPromptOpen}
        title="Thêm danh mục mới"
        description="Nhập tên danh mục bạn muốn tạo."
        placeholder="VD: Landing Pages, Blog, Chiến dịch..."
        confirmText="Tạo danh mục"
        onConfirm={(name) => {
          handleAddCategory(name);
          setCreatePromptOpen(false);
        }}
        onClose={() => setCreatePromptOpen(false)}
      />
    </div>
  );
}
