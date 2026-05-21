"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  Save, ArrowLeft, Image as ImageIcon, 
  Settings, Globe, ShieldCheck, Zap,
  Search, Type, List, Quote, Code, Layout,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { BlockEditor } from "@/components/cms/BlockEditor";
import { toast } from "sonner";

interface PostEditorProps {
  id?: string;
}

export function PostEditor({ id }: PostEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [post, setPost] = useState({
    title: "",
    slug: "",
    summary: "",
    featured_image: "",
    blocks: [] as any[], // Changed from 'content' to 'blocks' to match BlockEditor
    status: "draft",
    category_id: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: [] as string[],
  });

  useEffect(() => {
    fetchCategories();
    if (id) fetchPost();
  }, [id]);

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
  }

  async function fetchPost() {
    const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
    if (data) {
      setPost({
        title: data.title || "",
        slug: data.slug || "",
        summary: data.summary || "",
        featured_image: data.featured_image || "",
        status: data.status || "draft",
        category_id: data.category_id || "",
        seo_title: data.seo_title || "",
        seo_description: data.seo_description || "",
        seo_keywords: Array.isArray(data.seo_keywords) ? data.seo_keywords : [],
        blocks: Array.isArray(data.content) ? data.content : []
      });
    }
    setLoading(false);
  }

  async function savePost() {
    setSaving(true);
    const slug = post.slug || post.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    
    const { blocks, category_id, ...rest } = post;
    const postData = { 
      ...rest, 
      slug, 
      content: blocks, // Mapping back to 'content' for DB
      category_id: category_id === "" ? null : category_id,
      updated_at: new Date().toISOString() 
    };
    
    let result;
    if (id) {
      result = await supabase.from("posts").update(postData).eq("id", id);
    } else {
      result = await supabase.from("posts").insert([postData]);
    }

    setSaving(false);
    if (!result.error) {
      router.push("/admin/blog");
    } else {
      console.error("Save Error:", result.error);
      toast.error("Lỗi khi lưu bài viết: " + result.error.message);
    }
  }

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold">Đang tải bài viết...</div>;

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="ghost" size="sm" className="rounded-xl">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="h-6 w-px bg-slate-100 mx-2" />
          <div>
            <h1 className="text-base font-black text-slate-900 leading-none">
              {id ? "Chỉnh sửa bài viết" : "Viết bài mới"}
            </h1>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-1">Smax AI Blog Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={post.status}
            onChange={(e) => setPost({ ...post, status: e.target.value })}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none focus:border-primary transition-all"
          >
            <option value="draft">Bản nháp</option>
            <option value="published">Xuất bản</option>
          </select>
          <Button onClick={savePost} disabled={saving} className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
            <Save className="w-4 h-4" />
            {saving ? "Đang lưu..." : "Lưu bài viết"}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Editor Area */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Title & Slug */}
            <div className="space-y-4">
              <textarea
                value={post.title || ""}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                placeholder="Tiêu đề bài viết..."
                className="w-full text-4xl font-black text-slate-900 bg-transparent border-none outline-none resize-none placeholder:text-slate-200 h-auto"
                rows={1}
                onInput={(e: any) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
              />
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-100/50 p-2 rounded-lg">
                <Globe className="w-3.5 h-3.5" />
                <span>/blog/</span>
                <input 
                  value={post.slug || ""}
                  onChange={(e) => setPost({ ...post, slug: e.target.value })}
                  placeholder="duong-dan-bai-viet"
                  className="bg-transparent border-none outline-none flex-1 font-bold text-slate-600"
                />
              </div>
            </div>

            {/* Blocks Area */}
            <div className="pb-20">
              <BlockEditor 
                blocks={post.blocks} 
                onChange={(blocks) => setPost({ ...post, blocks })} 
              />
            </div>
          </div>
        </div>

        {/* Settings Sidebar */}
        <aside className="w-[360px] bg-white border-l border-slate-200 p-8 overflow-y-auto custom-scrollbar space-y-10">
          {/* Main Config */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-900">
              <Settings className="w-4 h-4" />
              <h3 className="text-sm font-black uppercase tracking-widest">Cấu hình bài viết</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chuyên mục</label>
              <select 
                value={post.category_id || ""}
                onChange={(e) => setPost({ ...post, category_id: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 text-sm outline-none focus:border-primary transition-all"
              >
                <option value="">Chọn chuyên mục...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ảnh đại diện</label>
              <div className="relative group rounded-2xl overflow-hidden border-2 border-dashed border-slate-100 aspect-video flex items-center justify-center bg-slate-50">
                {post.featured_image ? (
                  <>
                    <img src={post.featured_image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <MediaPicker onSelect={(url) => setPost({ ...post, featured_image: url })} trigger={<Button variant="secondary" size="sm" className="rounded-full">Thay đổi</Button>} />
                    </div>
                  </>
                ) : (
                  <MediaPicker onSelect={(url) => setPost({ ...post, featured_image: url })} trigger={<Button variant="ghost" className="text-slate-300"><ImageIcon className="w-6 h-6" /></Button>} />
                )}
              </div>
            </div>
          </div>

          {/* GEO & SEO Config */}
          <div className="space-y-6 pt-10 border-t border-slate-50">
            <div className="flex items-center gap-2 text-primary">
              <Zap className="w-4 h-4" />
              <h3 className="text-sm font-black uppercase tracking-widest">GEO Optimization</h3>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Tối ưu cấu trúc dữ liệu để AI (Gemini, GPT, SearchGPT) dễ dàng quét và tóm tắt bài viết của bạn.</p>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tóm tắt bài viết (AI-Ready)</label>
              <textarea 
                value={post.summary || ""}
                onChange={(e) => setPost({ ...post, summary: e.target.value })}
                placeholder="Tóm tắt ngắn gọn nội dung chính cho AI..."
                className="w-full h-32 p-4 rounded-xl border border-slate-100 bg-slate-50 text-xs text-slate-600 outline-none focus:border-primary transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SEO Title</label>
              <input 
                value={post.seo_title || ""}
                onChange={(e) => setPost({ ...post, seo_title: e.target.value })}
                placeholder="Tiêu đề hiển thị trên Google..."
                className="w-full h-11 px-4 rounded-xl border border-slate-100 bg-slate-50 text-xs outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Keywords (Entity Mapping)</label>
              <input 
                value={(post.seo_keywords || []).join(", ")}
                onChange={(e) => setPost({ ...post, seo_keywords: e.target.value.split(",").map(s => s.trim()) })}
                placeholder="ai marketing, smax platform..."
                className="w-full h-11 px-4 rounded-xl border border-slate-100 bg-slate-50 text-xs outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
