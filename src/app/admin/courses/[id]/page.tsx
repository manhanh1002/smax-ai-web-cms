"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { 
  ArrowLeft, Save, BookOpen, Trash2, Edit2, Plus, 
  ArrowUp, ArrowDown, Video, Type, Image as ImageIcon,
  CheckCircle, Play, Film, ExternalLink, Sparkles
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { cn } from "@/lib/utils";
import { IconPicker } from "@/components/cms/IconPicker";

type Block = 
  | { id: string; type: "text"; text: string }
  | { id: string; type: "video"; videoType: "youtube" | "vimeo" | "media"; url: string };

export default function CourseEditPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const isNew = id === "new";

  // Loading and UI states
  const [loading, setLoading] = useState(!isNew);
  const [savingCourse, setSavingCourse] = useState(false);
  
  // Dialogs
  const [deleteLessonConfirm, setDeleteLessonConfirm] = useState<string | null>(null);
  const [showLessonAdd, setShowLessonAdd] = useState(false);

  // Entities
  const [authors, setAuthors] = useState<any[]>([]);
  const [course, setCourse] = useState({
    title: "",
    slug: "",
    description: "",
    thumbnail_url: "",
    author_id: "",
    is_published: false,
    price: 0,
    benefits: [] as { icon: string; text: string }[]
  });
  const [lessons, setLessons] = useState<any[]>([]);

  // New Lesson form state
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonSlug, setNewLessonSlug] = useState("");
  const [newLessonFree, setNewLessonFree] = useState(false);

  useEffect(() => {
    fetchAuthors();
    if (!isNew) {
      fetchCourse();
      fetchLessons();
    }
  }, [id]);

  async function fetchAuthors() {
    const { data } = await supabase.from("authors").select("id, name").order("name");
    if (data) setAuthors(data);
  }

  async function fetchCourse() {
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();
    
    if (data) {
      setCourse({
        title: data.title,
        slug: data.slug,
        description: data.description || "",
        thumbnail_url: data.thumbnail_url || "",
        author_id: data.author_id || "",
        is_published: data.is_published,
        price: Number(data.price) || 0,
        benefits: Array.isArray(data.benefits) ? data.benefits : []
      });
    } else {
      toast.error("Không tìm thấy khoá học");
      router.push("/admin/courses");
    }
    setLoading(false);
  }

  async function fetchLessons() {
    const { data } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", id)
      .order("order_index", { ascending: true });
    
    if (data) setLessons(data);
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
    setCourse(prev => {
      if (isNew) {
        return { ...prev, title: newTitle, slug: generateSlug(newTitle) };
      }
      return { ...prev, title: newTitle };
    });
  };

  const handleNewLessonTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setNewLessonTitle(title);
    setNewLessonSlug(generateSlug(title));
  };

  const addBenefit = () => {
    setCourse(prev => ({
      ...prev,
      benefits: [...(prev.benefits || []), { icon: "CheckCircle", text: "" }]
    }));
  };

  const removeBenefit = (index: number) => {
    setCourse(prev => ({
      ...prev,
      benefits: (prev.benefits || []).filter((_, i) => i !== index)
    }));
  };

  const updateBenefit = (index: number, fields: Partial<{ icon: string; text: string }>) => {
    setCourse(prev => ({
      ...prev,
      benefits: (prev.benefits || []).map((b, i) => i === index ? { ...b, ...fields } : b)
    }));
  };

  const moveBenefit = (index: number, direction: "up" | "down") => {
    const list = [...(course.benefits || [])];
    if (direction === "up" && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === "down" && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }
    setCourse(prev => ({ ...prev, benefits: list }));
  };

  async function handleSaveCourse() {
    if (!course.title || !course.slug) {
      toast.error("Vui lòng nhập Tiêu đề và Slug");
      return;
    }

    setSavingCourse(true);
    const payload = {
      title: course.title,
      slug: course.slug,
      description: course.description,
      thumbnail_url: course.thumbnail_url || null,
      author_id: course.author_id || null,
      is_published: course.is_published,
      price: course.price,
      benefits: course.benefits || [],
      updated_at: new Date().toISOString()
    };

    if (isNew) {
      const { data, error } = await supabase.from("courses").insert([payload]).select().single();
      if (error) {
        toast.error("Lỗi: " + error.message);
      } else {
        toast.success("Tạo khoá học thành công!");
        router.push(`/admin/courses/${data.id}`);
      }
    } else {
      const { error } = await supabase.from("courses").update(payload).eq("id", id);
      if (error) {
        toast.error("Lỗi: " + error.message);
      } else {
        toast.success("Cập nhật khoá học thành công!");
      }
    }
    setSavingCourse(false);
  }

  // --- Lesson Operations ---

  async function handleAddLesson() {
    if (!newLessonTitle || !newLessonSlug) {
      toast.error("Vui lòng điền tiêu đề bài học");
      return;
    }

    // Determine next order_index
    const nextIndex = lessons.reduce((max, l) => Math.max(max, l.order_index), -1) + 1;

    const payload = {
      course_id: id,
      title: newLessonTitle,
      slug: newLessonSlug,
      order_index: nextIndex,
      is_free_preview: newLessonFree,
      content: []
    };

    const { data, error } = await supabase.from("lessons").insert([payload]).select().single();
    if (error) {
      toast.error("Lỗi thêm bài giảng: " + error.message);
    } else {
      toast.success("Thêm bài giảng thành công!");
      setLessons([...lessons, data]);
      setNewLessonTitle("");
      setNewLessonSlug("");
      setNewLessonFree(false);
      setShowLessonAdd(false);
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
    if (error) {
      toast.error("Lỗi: " + error.message);
    } else {
      toast.success("Đã xoá bài học");
      setLessons(lessons.filter(l => l.id !== lessonId));
    }
    setDeleteLessonConfirm(null);
  }

  async function handleMoveLesson(index: number, direction: "up" | "down") {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === lessons.length - 1) return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const updatedLessons = [...lessons];
    
    // Swap order_index
    const temp = updatedLessons[index].order_index;
    updatedLessons[index].order_index = updatedLessons[swapIndex].order_index;
    updatedLessons[swapIndex].order_index = temp;

    // Swap position in array
    const tempObj = updatedLessons[index];
    updatedLessons[index] = updatedLessons[swapIndex];
    updatedLessons[swapIndex] = tempObj;

    setLessons(updatedLessons);

    // Save to DB
    const promises = [
      supabase.from("lessons").update({ order_index: updatedLessons[index].order_index }).eq("id", updatedLessons[index].id),
      supabase.from("lessons").update({ order_index: updatedLessons[swapIndex].order_index }).eq("id", updatedLessons[swapIndex].id)
    ];

    await Promise.all(promises);
  }

  async function handleTogglePreview(lesson: any) {
    const updatedStatus = !lesson.is_free_preview;
    const { error } = await supabase
      .from("lessons")
      .update({ is_free_preview: updatedStatus })
      .eq("id", lesson.id);

    if (error) {
      toast.error("Lỗi: " + error.message);
    } else {
      toast.success("Cập nhật chế độ xem thử thành công");
      setLessons(lessons.map(l => l.id === lesson.id ? { ...l, is_free_preview: updatedStatus } : l));
    }
  }



  if (loading) {
    return <div className="p-8 text-center text-slate-400">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/courses">
            <Button variant="outline" className="w-10 h-10 p-0 rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              {isNew ? "Tạo khoá học mới" : "Chỉnh sửa khoá học"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && course.slug && (
            <Link href={`/courses/${course.slug}`} target="_blank">
              <Button variant="outline" className="rounded-xl gap-2 font-bold border-slate-200">
                <ExternalLink className="w-4 h-4 text-slate-500" />
                Xem trang public
              </Button>
            </Link>
          )}
          <Button onClick={handleSaveCourse} disabled={savingCourse} className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
            <Save className="w-4 h-4" />
            {savingCourse ? "Đang lưu..." : "Lưu khoá học"}
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Metadata */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-4 border-slate-100">Thông tin khoá học</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Tiêu đề khoá học</label>
                <input
                  type="text"
                  value={course.title}
                  onChange={handleTitleChange}
                  placeholder="VD: Nhập môn Supabase & React"
                  className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-primary transition-all font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Đường dẫn (Slug)</label>
                <input
                  type="text"
                  value={course.slug}
                  onChange={(e) => setCourse({ ...course, slug: e.target.value })}
                  placeholder="VD: nhap-mon-supabase-react"
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-primary transition-all font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Tác giả</label>
                <select
                  value={course.author_id}
                  onChange={(e) => setCourse({ ...course, author_id: e.target.value })}
                  className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-primary transition-all font-semibold"
                >
                  <option value="">-- Chọn tác giả --</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Học phí (VND)</label>
                <input
                  type="number"
                  value={course.price}
                  onChange={(e) => setCourse({ ...course, price: Number(e.target.value) })}
                  placeholder="0 (Miễn phí)"
                  className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-primary transition-all font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Mô tả ngắn</label>
                <textarea
                  value={course.description}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                  placeholder="Mô tả nội dung cốt lõi của khoá học..."
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Ảnh Thumbnail</label>
                <div className="space-y-3">
                  <div className="aspect-[16/9] w-full rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center relative">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-slate-300">
                        <ImageIcon className="w-10 h-10 mx-auto mb-1" />
                        <span className="text-xs">Chưa có ảnh đại diện</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <MediaPicker 
                      onSelect={(url: string) => setCourse({ ...course, thumbnail_url: url })}
                      trigger={
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="rounded-xl w-full text-xs font-bold h-10 gap-1 animate-hover"
                        >
                          <ImageIcon className="w-4 h-4" />
                          Chọn ảnh
                        </Button>
                      }
                    />
                    {course.thumbnail_url && (
                      <Button 
                        type="button" 
                        onClick={() => setCourse({ ...course, thumbnail_url: "" })} 
                        variant="ghost" 
                        className="rounded-xl text-red-500 hover:bg-red-50 text-xs font-bold h-10"
                      >
                        Gỡ
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="block text-xs font-bold text-slate-700">Trạng thái phát hành</span>
                  <span className="text-[10px] text-slate-400">Cho phép người học tìm thấy khoá này</span>
                </div>
                <input
                  type="checkbox"
                  checked={course.is_published}
                  onChange={(e) => setCourse({ ...course, is_published: e.target.checked })}
                  className="w-5 h-5 rounded accent-primary border-slate-300 cursor-pointer"
                />
              </div>
            </div>

            {/* Lợi ích khoá học card */}
            <div className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b pb-4 border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Lợi ích khoá học</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Những giá trị học viên nhận được</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBenefit}
                  className="rounded-xl gap-1 text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm
                </Button>
              </div>

              <div className="space-y-3">
                {(!course.benefits || course.benefits.length === 0) ? (
                  <div className="text-center py-6 text-slate-400 italic text-xs">
                    Chưa có lợi ích nào được thêm.
                  </div>
                ) : (
                  course.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="w-24 shrink-0">
                        <IconPicker
                          value={benefit.icon}
                          onChange={(val) => updateBenefit(idx, { icon: val })}
                        />
                      </div>
                      <input
                        type="text"
                        value={benefit.text}
                        onChange={(e) => updateBenefit(idx, { text: e.target.value })}
                        placeholder="Mô tả lợi ích..."
                        className="flex-1 h-10 bg-white border border-slate-200 rounded-xl px-3 text-xs outline-none focus:border-primary transition-all font-semibold"
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveBenefit(idx, "up")}
                          disabled={idx === 0}
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBenefit(idx, "down")}
                          disabled={idx === (course.benefits?.length || 0) - 1}
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeBenefit(idx)}
                          className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Lessons list & content */}
        <div className="lg:col-span-2 space-y-6">
          {isNew ? (
            <div className="bg-slate-50 rounded-[32px] border border-dashed border-slate-300 p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
              <BookOpen className="w-12 h-12 mb-3 text-slate-300" />
              <p className="font-bold">Bạn đang tạo một khoá học mới.</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[320px]">
                Hãy nhấn nút <b>&quot;Lưu khoá học&quot;</b> ở góc trên để khởi tạo khoá học, sau đó tính năng quản lý và xây dựng bài giảng sẽ xuất hiện.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b pb-4 border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Danh sách bài giảng</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Xây dựng giáo trình bằng cách thêm bài học và nội dung đa phương tiện.</p>
                </div>
                
                <Button 
                  onClick={() => setShowLessonAdd(!showLessonAdd)} 
                  className="rounded-xl gap-1.5 text-xs font-bold shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Thêm bài học
                </Button>
              </div>

              {/* Add Lesson inline form */}
              {showLessonAdd && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
                  <h3 className="text-sm font-bold text-slate-800">Tạo bài học mới</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Tên bài học</label>
                      <input 
                        type="text" 
                        value={newLessonTitle}
                        onChange={handleNewLessonTitleChange}
                        placeholder="VD: Bài 1: Tổng quan"
                        className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm focus:border-primary outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Slug bài học</label>
                      <input 
                        type="text" 
                        value={newLessonSlug}
                        onChange={(e) => setNewLessonSlug(e.target.value)}
                        placeholder="bai-1-tong-quan"
                        className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm focus:border-primary outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="isFree"
                      checked={newLessonFree} 
                      onChange={(e) => setNewLessonFree(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
                    />
                    <label htmlFor="isFree" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
                      Mở khoá học thử (Người dùng không mua vẫn xem được)
                    </label>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowLessonAdd(false)}
                      className="rounded-lg text-xs"
                    >
                      Hủy
                    </Button>
                    <Button 
                      onClick={handleAddLesson}
                      className="rounded-lg text-xs"
                    >
                      Tạo bài
                    </Button>
                  </div>
                </div>
              )}

              {/* Lessons Table / List */}
              <div className="space-y-3">
                {lessons.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 italic text-sm">
                    Khoá học chưa có bài giảng nào. Hãy nhấn nút &quot;Thêm bài học&quot; để bắt đầu.
                  </div>
                ) : (
                  lessons.map((lesson, idx) => {
                    const blockCount = Array.isArray(lesson.content) ? lesson.content.length : 0;
                    return (
                      <div 
                        key={lesson.id} 
                        className="group border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-all hover:shadow-sm"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-slate-100 text-slate-500 font-mono text-[10px] w-6 h-6 flex items-center justify-center rounded-lg font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-slate-800">{lesson.title}</h4>
                            
                            <button
                              onClick={() => handleTogglePreview(lesson)}
                              className={cn(
                                "text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border shrink-0",
                                lesson.is_free_preview 
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" 
                                  : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
                              )}
                              title="Nhấp để đổi chế độ"
                            >
                              {lesson.is_free_preview ? "Xem thử miễn phí" : "Nội dung Khoá"}
                            </button>
                          </div>
                          <div className="flex items-center gap-2 pl-8">
                            <span className="text-[10px] text-slate-400 font-mono">/{lesson.slug}</span>
                            <span className="text-[10px] text-slate-300">•</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              {blockCount} khối nội dung
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-auto pl-8 md:pl-0">
                          {/* Order Buttons */}
                          <div className="flex items-center bg-slate-50 border border-slate-100 rounded-lg p-0.5 shrink-0">
                            <button 
                              onClick={() => handleMoveLesson(idx, "up")}
                              disabled={idx === 0}
                              className="p-1.5 hover:bg-white rounded text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleMoveLesson(idx, "down")}
                              disabled={idx === lessons.length - 1}
                              className="p-1.5 hover:bg-white rounded text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {course.slug && (
                            <Link href={`/courses/${course.slug}/lessons/${lesson.slug}`} target="_blank">
                              <Button 
                                variant="outline" 
                                className="rounded-lg text-xs font-bold h-8.5 px-3 border-slate-200 hover:border-slate-300 gap-1 shrink-0"
                              >
                                <Play className="w-3 h-3 text-slate-500" />
                                Xem bài
                              </Button>
                            </Link>
                          )}

                          <Link href={`/admin/courses/${id}/lessons/${lesson.id}`}>
                            <Button 
                              variant="outline" 
                              className="rounded-lg text-xs font-bold h-8.5 px-3 border-slate-200 hover:border-slate-300 gap-1 shrink-0"
                            >
                              <Edit2 className="w-3 h-3 text-primary" />
                              Xây nội dung
                            </Button>
                          </Link>
                          
                          <button 
                            onClick={() => setDeleteLessonConfirm(lesson.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* --- CONFIRM DIALOGS & SELECTORS --- */}
      <ConfirmModal
        isOpen={deleteLessonConfirm !== null}
        title="Xoá bài giảng"
        description="Bạn có chắc chắn muốn xoá bài giảng này? Nội dung bài giảng sẽ bị xoá vĩnh viễn khỏi hệ thống."
        confirmText="Xoá bài giảng"
        onConfirm={() => deleteLessonConfirm && handleDeleteLesson(deleteLessonConfirm)}
        onClose={() => setDeleteLessonConfirm(null)}
      />
    </div>
  );
}
