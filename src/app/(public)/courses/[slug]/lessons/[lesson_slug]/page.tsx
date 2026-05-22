"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, 
  Menu, BookOpen, Video, Type, Play, Award, HelpCircle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Block = 
  | { id: string; type: "text"; text: string }
  | { id: string; type: "video"; videoType: "youtube" | "vimeo" | "media"; url: string };

export default function LessonViewPage() {
  const { slug, lesson_slug } = useParams() as { slug: string; lesson_slug: string };
  const router = useRouter();

  const [course, setCourse] = useState<any | null>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchData();
  }, [slug, lesson_slug]);

  async function fetchData() {
    setLoading(true);
    
    // 1. Fetch course details
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .single();

    if (courseError || !courseData) {
      toast.error("Không tìm thấy khoá học");
      router.push("/courses");
      setLoading(false);
      return;
    }
    setCourse(courseData);

    // 2. Fetch all lessons
    const { data: lessonsData } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseData.id)
      .order("order_index", { ascending: true });

    if (lessonsData) {
      setLessons(lessonsData);
      
      // Find current lesson
      const active = lessonsData.find(l => l.slug === lesson_slug);
      if (active) {
        setCurrentLesson(active);
        // Load completion status from localStorage
        const isDone = localStorage.getItem(`lesson_completed_${active.id}`) === "true";
        setCompleted(isDone);
      } else {
        toast.error("Không tìm thấy bài giảng");
        router.push(`/courses/${slug}`);
      }
    }
    setLoading(false);
  }

  // --- YouTube & Vimeo Embed Helpers ---
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

  // --- Custom Lightweight Markdown Parser ---
  function renderMarkdown(md: string) {
    if (!md) return "";
    
    let html = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, "<pre class='bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs my-4 overflow-x-auto border border-slate-800 leading-normal'><code>$1</code></pre>");

    // Inline code
    html = html.replace(/`([^`]+)`/g, "<code class='bg-slate-100 text-rose-500 px-1.5 py-0.5 rounded font-mono text-xs font-semibold border border-slate-200/50'>$1</code>");

    // Headers
    html = html.replace(/^### (.*$)/gim, "<h4 class='text-sm font-black text-slate-900 mt-6 mb-2'>$1</h4>");
    html = html.replace(/^## (.*$)/gim, "<h3 class='text-base font-black text-slate-900 mt-8 mb-3 border-b border-slate-100 pb-2'>$1</h3>");
    html = html.replace(/^# (.*$)/gim, "<h2 class='text-lg font-black text-slate-900 mt-10 mb-4'>$1</h2>");

    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong class='font-bold text-slate-900'>$1</strong>");

    // Italic
    html = html.replace(/\*([^*]+)\*/g, "<em class='italic'>$1</em>");

    // Unordered lists
    html = html.replace(/^\s*[-*]\s+(.*$)/gim, "<li class='list-disc list-inside ml-4 my-1.5 text-slate-600 font-medium text-sm'>$1</li>");

    // Split and form paragraphs
    const lines = html.split("\n\n");
    html = lines
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return "";
        if (
          trimmed.startsWith("<h") ||
          trimmed.startsWith("<pre") ||
          trimmed.startsWith("<li")
        ) {
          return trimmed;
        }
        return `<p class="leading-relaxed text-slate-600 mb-4 text-sm font-medium">${trimmed.replace(/\n/g, "<br/>")}</p>`;
      })
      .join("");

    return html;
  }

  // --- Navigation & Progress ---

  const currentIndex = lessons.findIndex(l => l.id === currentLesson?.id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  function toggleCompleted() {
    if (!currentLesson) return;
    const newStatus = !completed;
    setCompleted(newStatus);
    if (newStatus) {
      localStorage.setItem(`lesson_completed_${currentLesson.id}`, "true");
      toast.success("Đã đánh dấu hoàn thành bài học!");
    } else {
      localStorage.removeItem(`lesson_completed_${currentLesson.id}`);
      toast.info("Đã gỡ trạng thái hoàn thành");
    }
  }

  function handleNext() {
    if (!currentLesson) return;
    // Auto-mark as completed when they click next
    if (!completed) {
      localStorage.setItem(`lesson_completed_${currentLesson.id}`, "true");
      setCompleted(true);
    }
    
    if (nextLesson) {
      router.push(`/courses/${slug}/lessons/${nextLesson.slug}`);
    } else {
      toast.success("Chúc mừng! Bạn đã hoàn thành tất cả các bài giảng trong khoá học này.");
      router.push(`/courses/${slug}`);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-400 min-h-screen flex items-center justify-center">Đang tải nội dung...</div>;
  }

  if (!course || !currentLesson) {
    return null;
  }

  const blocks: Block[] = Array.isArray(currentLesson.content) ? currentLesson.content : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header Navigation */}
      <header className="bg-slate-900 text-white h-16 px-4 md:px-6 flex items-center justify-between border-b border-slate-800 shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors shrink-0"
            title="Đóng/Mở giáo trình"
          >
            <Menu className="w-5 h-5 text-slate-300" />
          </button>
          
          <Link href={`/courses/${slug}`}>
            <span className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0">
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </span>
          </Link>

          <span className="text-slate-700 hidden sm:inline">|</span>
          
          <div className="min-w-0 hidden md:block">
            <span className="text-xs font-bold text-slate-400 truncate block">{course.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress toggle button */}
          <button
            onClick={toggleCompleted}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
              completed 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20" 
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            )}
          >
            <CheckCircle2 className={cn("w-4 h-4", completed ? "text-emerald-400 fill-emerald-500/20" : "text-slate-400")} />
            {completed ? "Đã hoàn thành" : "Đánh dấu xong"}
          </button>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar Syllabus */}
        <aside className={cn(
          "bg-white border-r border-slate-200 w-80 shrink-0 flex flex-col absolute inset-y-0 left-0 z-20 md:static transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:-ml-80"
        )}>
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-primary" /> Giáo trình bài học
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
              {lessons.length} bài học tự học tiện lợi
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {lessons.map((lesson, idx) => {
              const isActive = lesson.id === currentLesson.id;
              const isDone = localStorage.getItem(`lesson_completed_${lesson.id}`) === "true";
              
              return (
                <Link 
                  key={lesson.id}
                  href={`/courses/${slug}/lessons/${lesson.slug}`}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl transition-all border text-left cursor-pointer",
                    isActive 
                      ? "bg-primary/5 text-primary border-primary/20 font-bold" 
                      : "bg-white border-transparent text-slate-600 hover:bg-slate-50/80 hover:text-slate-800 font-medium"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={cn(
                      "text-[10px] font-mono w-5 h-5 flex items-center justify-center rounded-md border shrink-0 font-bold",
                      isActive 
                        ? "bg-primary text-white border-primary" 
                        : "bg-slate-50 text-slate-400 border-slate-150"
                    )}>
                      {idx + 1}
                    </span>
                    <span className="text-xs truncate">{lesson.title}</span>
                  </div>

                  <div className="shrink-0 pl-2">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 fill-emerald-50 text-emerald-500" />
                    ) : (
                      <Play className={cn("w-3 h-3 text-slate-300", isActive && "text-primary")} />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 overflow-y-auto bg-slate-50/30 flex flex-col">
          
          {/* Lesson content body */}
          <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Bài giảng {currentIndex + 1} / {lessons.length}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                {currentLesson.title}
              </h1>
            </div>

            {/* Render blocks */}
            <div className="space-y-8">
              {blocks.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-[32px] p-12 text-center text-slate-400">
                  <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold">Chưa có nội dung bài giảng.</p>
                  <p className="text-xs text-slate-400 mt-1">Quay lại sau hoặc chọn bài giảng khác từ giáo trình.</p>
                </div>
              ) : (
                blocks.map((block) => {
                  if (block.type === "text") {
                    const isHtml = block.text && (block.text.trim().startsWith("<") || /<[a-z][\s\S]*>/i.test(block.text));
                    const htmlContent = isHtml ? block.text : renderMarkdown(block.text);
                    return (
                      <div 
                        key={block.id} 
                        className="bg-white border border-slate-200/80 rounded-[32px] p-6 md:p-8 shadow-sm prose prose-slate max-w-none leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                      />
                    );
                  } else if (block.type === "video") {
                    let embedUrl = "";
                    if (block.videoType === "youtube") {
                      embedUrl = getYouTubeEmbedUrl(block.url);
                    } else if (block.videoType === "vimeo") {
                      embedUrl = getVimeoEmbedUrl(block.url);
                    }

                    return (
                      <div key={block.id} className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-lg p-0.5 relative group">
                        <div className="aspect-[16/9] w-full relative">
                          {block.videoType === "media" ? (
                            <video 
                              src={block.url} 
                              controls 
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <iframe 
                              src={embedUrl}
                              className="w-full h-full absolute inset-0 border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title="Lesson video content"
                            />
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })
              )}
            </div>
          </div>

          {/* Lesson Footer Navigation */}
          <footer className="bg-white border-t border-slate-200 px-6 py-6 md:py-8 shrink-0 mt-auto shadow-inner bg-slate-50/50">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              {prevLesson ? (
                <Link href={`/courses/${slug}/lessons/${prevLesson.slug}`}>
                  <Button 
                    variant="outline" 
                    className="rounded-xl text-xs font-bold border-slate-200 hover:border-slate-300 hover:bg-slate-50 h-10 gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Bài trước
                  </Button>
                </Link>
              ) : (
                <div />
              )}

              <Button 
                onClick={handleNext}
                className="rounded-xl text-xs font-bold h-10 gap-1.5 shadow-lg shadow-primary/10"
              >
                {nextLesson ? (
                  <>
                    Bài tiếp theo
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4 text-emerald-400" />
                    Hoàn thành khoá học
                  </>
                )}
              </Button>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}
