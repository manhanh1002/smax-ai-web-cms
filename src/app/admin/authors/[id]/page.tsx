"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Save, User, ImageIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { MediaPicker } from "@/components/cms/MediaPicker";

export default function AuthorEditPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [author, setAuthor] = useState({
    name: "",
    slug: "",
    bio: "",
    avatar_url: "",
    social_links: {}
  });

  useEffect(() => {
    if (!isNew) {
      fetchAuthor();
    }
  }, [id]);

  async function fetchAuthor() {
    setLoading(true);
    const { data, error } = await supabase
      .from("authors")
      .select("*")
      .eq("id", id)
      .single();
    
    if (data) {
      setAuthor({
        name: data.name,
        slug: data.slug,
        bio: data.bio || "",
        avatar_url: data.avatar_url || "",
        social_links: data.social_links || {}
      });
    } else {
      toast.error("Không tìm thấy tác giả");
      router.push("/admin/authors");
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!author.name || !author.slug) {
      toast.error("Vui lòng điền Tên và Đường dẫn (Slug)");
      return;
    }

    setSaving(true);
    
    const payload = {
      name: author.name,
      slug: author.slug,
      bio: author.bio,
      avatar_url: author.avatar_url,
      social_links: author.social_links,
      updated_at: new Date().toISOString()
    };

    if (isNew) {
      const { data, error } = await supabase.from("authors").insert([payload]).select().single();
      if (error) {
        toast.error("Lỗi: " + error.message);
      } else {
        toast.success("Tạo tác giả thành công!");
        router.push(`/admin/authors/${data.id}`);
      }
    } else {
      const { error } = await supabase.from("authors").update(payload).eq("id", id);
      if (error) {
        toast.error("Lỗi: " + error.message);
      } else {
        toast.success("Cập nhật thành công!");
      }
    }
    
    setSaving(false);
  }

  // Auto-generate slug from name
  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setAuthor(prev => {
      // If it's a new author, auto update slug
      if (isNew) {
        return { ...prev, name: newName, slug: generateSlug(newName) };
      }
      return { ...prev, name: newName };
    });
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Đang tải...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-[1000px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/authors">
            <Button variant="outline" className="w-10 h-10 p-0 rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <User className="w-6 h-6 text-primary" />
              </div>
              {isNew ? "Thêm tác giả mới" : "Chỉnh sửa tác giả"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving} className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
            <Save className="w-4 h-4" />
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 md:col-span-2">
            <label className="block text-sm font-bold text-slate-700">Tên tác giả</label>
            <input
              type="text"
              value={author.name}
              onChange={handleNameChange}
              placeholder="VD: Nguyễn Văn A"
              className="w-full h-12 bg-white border border-slate-200 rounded-2xl px-4 text-sm outline-none focus:border-primary transition-all shadow-sm font-semibold"
            />
          </div>

          <div className="space-y-4 md:col-span-2">
            <label className="block text-sm font-bold text-slate-700">Đường dẫn (Slug)</label>
            <input
              type="text"
              value={author.slug}
              onChange={(e) => setAuthor({ ...author, slug: e.target.value })}
              placeholder="nguyen-van-a"
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-2xl px-4 text-sm outline-none focus:border-primary transition-all font-mono"
            />
          </div>

          <div className="space-y-4 md:col-span-2">
            <label className="block text-sm font-bold text-slate-700">Tiểu sử ngắn</label>
            <textarea
              value={author.bio}
              onChange={(e) => setAuthor({ ...author, bio: e.target.value })}
              placeholder="Vài dòng giới thiệu về tác giả..."
              rows={4}
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all shadow-sm"
            />
          </div>

          <div className="space-y-4 md:col-span-2">
            <label className="block text-sm font-bold text-slate-700">Ảnh đại diện (Avatar)</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                {author.avatar_url ? (
                  <img src={author.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <MediaPicker 
                  onSelect={(url: string) => setAuthor({ ...author, avatar_url: url })}
                  trigger={
                    <Button 
                      type="button"
                      variant="outline" 
                      className="rounded-xl gap-2 font-bold animate-hover"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Chọn ảnh từ Media
                    </Button>
                  }
                />
                {author.avatar_url && (
                  <Button 
                    onClick={() => setAuthor({ ...author, avatar_url: "" })}
                    variant="ghost" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    Gỡ ảnh
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
