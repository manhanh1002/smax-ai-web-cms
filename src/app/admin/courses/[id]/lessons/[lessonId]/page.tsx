"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { RichTextBlockEditor } from "@/components/cms/block-editors/RichTextBlockEditor";
import { 
  ArrowLeft, Save, BookOpen, Trash2, Edit2, Plus, 
  ArrowUp, ArrowDown, Video, Type, Image as ImageIcon,
  CheckCircle, Play, Film, ExternalLink, Sparkles, Eye, Info, Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Block = 
  | { id: string; type: "text"; text: string }
  | { id: string; type: "video"; videoType: "youtube" | "vimeo" | "media"; url: string };

export default function LessonComposePage() {
  const { id, lessonId } = useParams() as { id: string; lessonId: string };
  const router = useRouter();

  // Loading and Saving states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteBlockIndex, setDeleteBlockIndex] = useState<number | null>(null);

  // Data states
  const [course, setCourse] = useState<any | null>(null);
  const [lesson, setLesson] = useState<any | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isFreePreview, setIsFreePreview] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    fetchData();
  }, [id, lessonId]);

  async function fetchData() {
    setLoading(true);
    try {
      // 1. Fetch course details for breadcrumbs
      const { data: courseData, error: courseErr } = await supabase
        .from("courses")
        .select("title, slug")
        .eq("id", id)
        .single();
      
      if (courseErr) {
        toast.error("Không tìm thấy khoá học");
        router.push("/admin/courses");
        return;
      }
      setCourse(courseData);

      // 2. Fetch lesson details
      const { data: lessonData, error: lessonErr } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single();

      if (lessonErr || !lessonData) {
        toast.error("Không tìm thấy bài học");
        router.push(`/admin/courses/${id}`);
        return;
      }

      setLesson(lessonData);
      setTitle(lessonData.title);
      setSlug(lessonData.slug);
      setIsFreePreview(lessonData.is_free_preview);
      setBlocks(Array.isArray(lessonData.content) ? lessonData.content : []);
    } catch (err: any) {
      toast.error("Đã xảy ra lỗi khi tải dữ liệu: " + err.message);
    } finally {
      setLoading(false);
    }
  }

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  // --- YouTube & Vimeo Embed Helpers for Preview ---
  function getYouTubeEmbedUrl(url: string) {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0` 
      : url;
  }

  function getVimeoEmbedUrl(url: string) {
    if (!url) return "";
    const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
    const match = url.match(regExp);
    return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=0` : url;
  }

  // --- Block management actions ---
  const addTextBlock = () => {
    const newBlock: Block = {
      id: "text_" + Math.random().toString(36).substring(2, 11),
      type: "text",
      text: ""
    };
    setBlocks([...blocks, newBlock]);
    toast.success("Đã thêm khối văn bản mới");
  };

  const addVideoBlock = () => {
    const newBlock: Block = {
      id: "video_" + Math.random().toString(36).substring(2, 11),
      type: "video",
      videoType: "youtube",
      url: ""
    };
    setBlocks([...blocks, newBlock]);
    toast.success("Đã thêm khối video mới");
  };

  const updateBlockText = (index: number, text: string) => {
    setBlocks(prev => {
      const next = [...prev];
      if (next[index] && next[index].type === "text") {
        next[index] = { ...next[index], text };
      }
      return next;
    });
  };

  const updateVideoBlockField = (index: number, field: "videoType" | "url", value: string) => {
    setBlocks(prev => {
      const next = [...prev];
      if (next[index] && next[index].type === "video") {
        next[index] = { ...next[index], [field]: value };
      }
      return next;
    });
  };

  const deleteBlock = (index: number) => {
    setBlocks(prev => prev.filter((_, i) => i !== index));
    setDeleteBlockIndex(null);
    toast.info("Đã xóa khối nội dung");
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blocks.length - 1) return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const next = [...blocks];
    const temp = next[index];
    next[index] = next[swapIndex];
    next[swapIndex] = temp;
    setBlocks(next);
  };

  async function handleSaveLesson() {
    if (!title.trim() || !slug.trim()) {
      toast.error("Vui lòng điền tiêu đề và slug bài giảng");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("lessons")
        .update({
          title: title.trim(),
          slug: slug.trim(),
          is_free_preview: isFreePreview,
          content: blocks,
          updated_at: new Date().toISOString()
        })
        .eq("id", lessonId);

      if (error) {
        throw error;
      }

      toast.success("Cập nhật bài giảng thành công!");
    } catch (err: any) {
      toast.error("Lỗi khi lưu bài giảng: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-500">Đang tải cấu hình soạn thảo...</p>
        </div>
      </div>
    );
  }

  const textBlockCount = blocks.filter(b => b.type === "text").length;
  const videoBlockCount = blocks.filter(b => b.type === "video").length;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Sticky Header Workspace */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-4 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/admin/courses/${id}`}>
              <Button variant="outline" className="w-10 h-10 p-0 rounded-xl hover:bg-slate-50 border-slate-200">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Khóa học</span>
                <span>/</span>
                <span className="truncate max-w-[200px]">{course?.title}</span>
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
                <BookOpen className="w-5 h-5 text-primary" /> Soạn thảo bài giảng
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {course?.slug && slug && (
              <Link href={`/courses/${course.slug}/lessons/${slug}`} target="_blank">
                <Button variant="outline" className="rounded-xl gap-2 font-bold border-slate-200">
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                  Xem trang bài giảng
                </Button>
              </Link>
            )}
            <Button 
              onClick={handleSaveLesson} 
              disabled={saving} 
              className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20 px-6"
            >
              <Save className="w-4 h-4" />
              {saving ? "Đang lưu..." : "Lưu bài giảng"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Grid Compose Space */}
      <main className="max-w-[1600px] mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Metadata & Settings Column (Span 1) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm sticky top-28">
            <h2 className="text-md font-bold text-slate-950 border-b pb-4 border-slate-100 flex items-center gap-2">
              <Film className="w-4 h-4 text-slate-400" />
              Cấu hình bài giảng
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Tiêu đề bài giảng</label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="VD: Bài 1: Giới thiệu và thiết lập"
                  className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-primary transition-all font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Đường dẫn (Slug)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="VD: bai-1-gioi-thieu"
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-primary transition-all font-mono"
                />
              </div>

              {/* Free Preview Switch toggler */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-2">
                <div>
                  <span className="block text-xs font-bold text-slate-700">Xem thử miễn phí</span>
                  <span className="text-[10px] text-slate-400">Học viên không cần mua khóa vẫn học được</span>
                </div>
                <Toggle checked={isFreePreview} onChange={setIsFreePreview} />
              </div>
            </div>

            {/* Editor Stats Card */}
            <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100/80 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thông số nội dung</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-xl border border-slate-100 text-center">
                  <span className="block text-xl font-black text-slate-800">{textBlockCount}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Khối chữ</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100 text-center">
                  <span className="block text-xl font-black text-slate-800">{videoBlockCount}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Khối Video</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 leading-relaxed pt-2 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Nội dung bài viết sẽ hiển thị theo thứ tự từ trên xuống dưới trên trang học viên.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Blocks Editor (Span 3) */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Chi tiết khối nội dung</h2>
              <p className="text-xs text-slate-400 mt-0.5">Thêm, sắp xếp và biên tập nội dung bài giảng phong phú.</p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={addTextBlock} variant="outline" className="rounded-xl text-xs font-bold gap-1.5 h-10 border-slate-200 hover:bg-slate-50">
                <Type className="w-4 h-4 text-blue-500" />
                Thêm văn bản
              </Button>
              <Button onClick={addVideoBlock} variant="outline" className="rounded-xl text-xs font-bold gap-1.5 h-10 border-slate-200 hover:bg-slate-50">
                <Video className="w-4 h-4 text-rose-500" />
                Thêm video
              </Button>
            </div>
          </div>

          {/* Block list */}
          <div className="space-y-6">
            {blocks.length === 0 ? (
              <div className="bg-white rounded-[32px] border border-dashed border-slate-300 p-16 text-center text-slate-400 flex flex-col items-center justify-center min-h-[400px] shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                  <BookOpen className="w-8 h-8 text-slate-350" />
                </div>
                <h3 className="font-black text-slate-800 text-base">Bài giảng này chưa có nội dung nào</h3>
                <p className="text-xs text-slate-400 mt-1.5 max-w-[380px] leading-relaxed">
                  Hãy bắt đầu bằng việc nhấn <b>Thêm văn bản (Rich Text)</b> hoặc <b>Thêm video</b> ở góc trên hoặc bên dưới để xây dựng nội dung bài học.
                </p>
                <div className="flex gap-3 mt-6">
                  <Button onClick={addTextBlock} className="rounded-xl text-xs font-bold gap-1.5 shadow-sm px-5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50">
                    <Type className="w-4 h-4 text-blue-500" />
                    Thêm Văn bản
                  </Button>
                  <Button onClick={addVideoBlock} className="rounded-xl text-xs font-bold gap-1.5 shadow-sm px-5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50">
                    <Video className="w-4 h-4 text-rose-500" />
                    Thêm Video
                  </Button>
                </div>
              </div>
            ) : (
              blocks.map((block, idx) => {
                const isText = block.type === "text";
                return (
                  <div 
                    key={block.id} 
                    className="group border border-slate-200 rounded-[32px] bg-white overflow-hidden shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-300"
                  >
                    {/* Block Toolbar Header */}
                    <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-150 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-white border border-slate-200 text-slate-500 font-mono text-[10px] w-6 h-6 flex items-center justify-center rounded-lg font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          {isText ? (
                            <>
                              <Type className="w-3.5 h-3.5 text-blue-500" />
                              Khối Văn bản (Rich Text)
                            </>
                          ) : (
                            <>
                              <Video className="w-3.5 h-3.5 text-rose-500" />
                              Khối Video
                            </>
                          )}
                        </span>
                      </div>

                      {/* Block control buttons */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white border border-slate-250 rounded-lg p-0.5">
                          <button 
                            type="button"
                            onClick={() => moveBlock(idx, "up")}
                            disabled={idx === 0}
                            className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => moveBlock(idx, "down")}
                            disabled={idx === blocks.length - 1}
                            className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setDeleteBlockIndex(idx)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Block Editor Content */}
                    <div className="p-6 md:p-8">
                      {isText ? (
                        <div className="rich-text-wrapper">
                          <RichTextBlockEditor 
                            data={{ content: block.text || "" }} 
                            onChange={(newData) => updateBlockText(idx, newData.content)} 
                          />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            {/* Video type options */}
                            <div className="space-y-2 md:col-span-1">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loại video nguồn</label>
                              <select
                                value={block.videoType}
                                onChange={(e) => updateVideoBlockField(idx, "videoType", e.target.value as any)}
                                className="w-full h-11 bg-white border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-primary transition-all font-semibold"
                              >
                                <option value="youtube">YouTube Embed</option>
                                <option value="vimeo">Vimeo Embed</option>
                                <option value="media">Thư viện Media</option>
                              </select>
                            </div>

                            {/* URL and picker inputs */}
                            <div className="space-y-2 md:col-span-3">
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đường dẫn Video (URL)</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={block.url || ""}
                                  onChange={(e) => updateVideoBlockField(idx, "url", e.target.value)}
                                  placeholder={
                                    block.videoType === "youtube" ? "VD: https://www.youtube.com/watch?v=dQw4w9WgXcQ" :
                                    block.videoType === "vimeo" ? "VD: https://vimeo.com/148751763" : "Đường dẫn tệp mp4..."
                                  }
                                  className="flex-1 h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-primary transition-all font-semibold"
                                />
                                {block.videoType === "media" && (
                                  <MediaPicker 
                                    onSelect={(url) => updateVideoBlockField(idx, "url", url)}
                                    trigger={
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="h-11 rounded-xl font-bold gap-1 px-4 shrink-0 border-slate-200 hover:bg-slate-50"
                                      >
                                        <ImageIcon className="w-4 h-4" />
                                        Chọn video
                                      </Button>
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Live Video Preview Panel */}
                          {block.url && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Xem thử hiển thị video</span>
                              <div className="aspect-[16/9] max-w-2xl bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner relative">
                                {block.videoType === "youtube" ? (
                                  <iframe 
                                    src={getYouTubeEmbedUrl(block.url)}
                                    className="w-full h-full absolute inset-0 border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="YouTube preview"
                                  />
                                ) : block.videoType === "vimeo" ? (
                                  <iframe 
                                    src={getVimeoEmbedUrl(block.url)}
                                    className="w-full h-full absolute inset-0 border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="Vimeo preview"
                                  />
                                ) : (
                                  <video 
                                    src={block.url} 
                                    controls 
                                    className="w-full h-full object-contain"
                                  />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Adding Buttons */}
          {blocks.length > 0 && (
            <div className="flex justify-center gap-4 pt-4">
              <Button onClick={addTextBlock} variant="outline" className="rounded-xl text-xs font-bold gap-1.5 h-11 border-slate-250 bg-white hover:bg-slate-50 shadow-sm px-6">
                <Type className="w-4 h-4 text-blue-500" />
                Thêm khối văn bản
              </Button>
              <Button onClick={addVideoBlock} variant="outline" className="rounded-xl text-xs font-bold gap-1.5 h-11 border-slate-250 bg-white hover:bg-slate-50 shadow-sm px-6">
                <Video className="w-4 h-4 text-rose-500" />
                Thêm khối video
              </Button>
            </div>
          )}

        </div>
      </main>

      {/* Confirm deletion dialog */}
      <ConfirmModal
        isOpen={deleteBlockIndex !== null}
        title="Xoá khối nội dung"
        description="Bạn có chắc chắn muốn xoá khối nội dung này? Hành động này sẽ xoá văn bản hoặc video trong khối này và không thể hoàn tác."
        confirmText="Xoá khối"
        onConfirm={() => deleteBlockIndex !== null && deleteBlock(deleteBlockIndex)}
        onClose={() => setDeleteBlockIndex(null)}
      />
    </div>
  );
}
