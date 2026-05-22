"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Plus, Edit2, ExternalLink, Trash2, X,
  Presentation, Search, Layers
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function AdminSlidesList() {
  const router = useRouter();
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("type", "slide")
      .order("updated_at", { ascending: false });

    if (data) setSlides(data);
    setLoading(false);
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setNewTitle(title);
    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    setNewSlug(slug);
  };

  async function handleCreateSlide() {
    if (!newTitle.trim() || !newSlug.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và slug");
      return;
    }

    setIsCreating(true);

    const { data, error } = await supabase
      .from("pages")
      .insert([
        {
          title: newTitle,
          slug: newSlug,
          type: "slide",
          layout_type: "full",
          hide_header: true,
          hide_footer: true,
          content_config: { blocks: [] },
          status: "draft",
        },
      ])
      .select()
      .single();

    if (error) {
      toast.error("Lỗi khi tạo slide: " + error.message);
    } else {
      toast.success("Đã tạo bài thuyết trình mới!");
      setIsModalOpen(false);
      setNewTitle("");
      setNewSlug("");
      fetchSlides();
      router.push(`/admin/slides/${data.id}`);
    }
    setIsCreating(false);
  }

  async function deleteSlide(id: string) {
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (!error) {
      toast.success("Đã xoá bài thuyết trình");
      fetchSlides();
    }
  }

  const filteredSlides = slides.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Presentation className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Slide Builder
              </h1>
              <p className="text-slate-500 mt-0.5 text-sm">
                Tạo và quản lý các bài thuyết trình tương tác.
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Tạo thuyết trình mới
        </Button>
      </div>

      {/* Filter and stats */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Tìm kiếm theo tiêu đề hoặc đường dẫn..."
            className="pl-11 h-12 rounded-2xl border-slate-200 bg-white focus:ring-primary/10 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm shrink-0">
          <Badge
            variant="gray"
            className="rounded-xl px-3 py-1.5 h-auto font-bold"
          >
            Tổng: {slides.length}
          </Badge>
          <Badge
            variant="success"
            className="rounded-xl px-3 py-1.5 h-auto font-bold"
          >
            Live: {slides.filter((s) => s.status === "published").length}
          </Badge>
        </div>
      </div>

      {/* Slides Grid */}
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
          <span className="text-sm font-bold text-slate-400">
            Đang tải dữ liệu...
          </span>
        </div>
      ) : filteredSlides.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Layers className="w-10 h-10 text-slate-200" />
          </div>
          <p className="text-slate-400 font-bold text-lg">
            Chưa có bài thuyết trình nào
          </p>
          <p className="text-slate-300 text-sm font-medium mt-1 max-w-sm">
            Nhấn &quot;Tạo thuyết trình mới&quot; để bắt đầu xây dựng slide
            deck đầu tiên.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSlides.map((slide) => {
            const blockCount =
              slide.content_config?.blocks?.length || 0;
            return (
              <div
                key={slide.id}
                className="group bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/40 overflow-hidden hover:shadow-xl hover:shadow-slate-300/30 transition-all duration-300"
              >
                {/* Slide thumbnail preview */}
                <Link href={`/admin/slides/${slide.id}`}>
                  <div className="relative aspect-video bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden cursor-pointer">
                    <div className="text-center">
                      <Presentation className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                        {blockCount} slide{blockCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <span className="text-white text-sm font-bold flex items-center gap-2">
                        <Edit2 className="w-4 h-4" /> Mở Editor
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Slide info */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-base font-black text-slate-900 truncate">
                        {slide.title}
                      </h3>
                      <code className="text-[10px] font-bold text-slate-400 tracking-tight">
                        /{slide.slug}
                      </code>
                    </div>
                    <Badge
                      variant={
                        slide.status === "published" ? "success" : "gray"
                      }
                      className="rounded-xl px-2.5 py-1 font-bold shrink-0"
                    >
                      {slide.status === "published" ? "Live" : "Draft"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                    <Link href={`/admin/slides/${slide.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-xl gap-2 font-bold text-xs h-9"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Chỉnh sửa
                      </Button>
                    </Link>
                    <a
                      href={`/presentation/${slide.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </Button>
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                      onClick={() => setDeleteConfirm(slide.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-[24px] flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <Presentation className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 leading-none">
                      Thuyết trình mới
                    </h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium">
                      Tạo bài trình bày với các blocks có sẵn.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-2xl hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                    Tiêu đề
                  </Label>
                  <Input
                    autoFocus
                    placeholder="Ví dụ: Báo cáo Q3 2026"
                    className="h-14 rounded-2xl border-slate-200 focus:border-primary transition-all text-lg font-bold"
                    value={newTitle}
                    onChange={handleTitleChange}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateSlide()}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                    Đường dẫn chia sẻ (Slug)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-mono text-sm">
                      /presentation/
                    </span>
                    <Input
                      placeholder="bao-cao-q3"
                      className="pl-28 h-14 rounded-2xl border-slate-200 focus:border-primary transition-all font-mono"
                      value={newSlug}
                      onChange={(e) =>
                        setNewSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/ /g, "-")
                            .replace(/[^\w-]+/g, "")
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 flex gap-4">
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-2xl h-14 font-bold text-slate-500 text-base hover:bg-slate-100"
              >
                Huỷ bỏ
              </Button>
              <Button
                onClick={handleCreateSlide}
                disabled={isCreating}
                className="flex-[2] rounded-xl h-14 font-bold shadow-lg shadow-primary/20 text-base"
              >
                {isCreating ? "Đang khởi tạo..." : "Tạo thuyết trình"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Xóa bài thuyết trình"
        description="Bạn có chắc chắn muốn xóa bài thuyết trình này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        onConfirm={() => deleteConfirm && deleteSlide(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
