"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Tag, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PromptModal } from "@/components/ui/PromptModal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [createPromptOpen, setCreatePromptOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
    setLoading(false);
  }

  async function handleAddCategory(name: string) {
    if (!name) return;
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    
    await supabase.from("categories").insert([{ name, slug }]);
    fetchCategories();
  }

  async function deleteCategory(id: string) {
    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="ghost" size="sm" className="rounded-xl">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Chuyên mục Blog</h1>
        </div>
        <Button onClick={() => setCreatePromptOpen(true)} className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Thêm chuyên mục
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên chuyên mục</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Slug</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center">Đang tải...</td></tr>
            ) : categories.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 font-bold text-slate-900">{c.name}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-400">/{c.slug}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setDeleteConfirm(c.id)} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Xóa chuyên mục"
        description="Bạn có chắc chắn muốn xóa chuyên mục này không? Các bài viết thuộc chuyên mục này sẽ trở thành 'Uncategorized'."
        confirmText="Xóa chuyên mục"
        onConfirm={() => deleteConfirm && deleteCategory(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
      />

      <PromptModal
        isOpen={createPromptOpen}
        title="Thêm chuyên mục mới"
        description="Nhập tên chuyên mục bạn muốn tạo."
        placeholder="Tên chuyên mục"
        confirmText="Tạo mới"
        onConfirm={(name) => {
          handleAddCategory(name);
          setCreatePromptOpen(false);
        }}
        onClose={() => setCreatePromptOpen(false)}
      />
    </div>
  );
}
