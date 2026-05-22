"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, BookOpen, Clock, Award, PlayCircle, 
  CheckCircle2, User, ChevronRight, Share2, AlertCircle
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import StandardLayout from "@/components/layout/StandardLayout";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { cn } from "@/lib/utils";

export default function PublicCourseDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  const [course, setCourse] = useState<any | null>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  
  const { settings } = useSiteSettings();
  const config = settings?.course_config || {};
  const bannerBgStyle = config.banner_bg_style || "dark";
  const bannerImageUrl = config.banner_image_url || "";
  const showPrices = config.show_prices !== false;
  const showProgress = config.show_progress !== false;
  const detailBackText = config.detail_back_text || "Quay lại danh sách khoá học";
  const detailLearningTypeText = config.detail_learning_type_text || "Tự học / Học nhanh online";
  const detailCtaDisclaimer = config.detail_cta_disclaimer || "Không cần đăng nhập • Học miễn phí online";

  useEffect(() => {
    fetchCourseDetails();
  }, [slug]);

  async function fetchCourseDetails() {
    setLoading(true);
    
    // 1. Fetch course details
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("*, authors(*)")
      .eq("slug", slug)
      .single();

    if (courseError || !courseData) {
      toast.error("Không tìm thấy khoá học");
      router.push("/courses");
      setLoading(false);
      return;
    }

    setCourse(courseData);

    // 2. Fetch course lessons
    const { data: lessonsData } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseData.id)
      .order("order_index", { ascending: true });

    if (lessonsData) {
      setLessons(lessonsData);
      
      // 3. Load progress from localStorage
      const progress: Record<string, boolean> = {};
      lessonsData.forEach((lesson: any) => {
        const isDone = localStorage.getItem(`lesson_completed_${lesson.id}`) === "true";
        if (isDone) {
          progress[lesson.id] = true;
        }
      });
      setCompletedLessons(progress);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <StandardLayout>
        <div className="p-8 text-center text-slate-400 min-h-screen flex items-center justify-center">Đang tải thông tin khoá học...</div>
      </StandardLayout>
    );
  }

  if (!course) {
    return null;
  }

  const completedCount = Object.keys(completedLessons).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  // Determine the next lesson the user should click
  let nextLesson = lessons[0]; // Default to first lesson
  if (lessons.length > 0) {
    const uncompleted = lessons.find(l => !completedLessons[l.id]);
    if (uncompleted) {
      nextLesson = uncompleted;
    }
  }

  const getBannerStyles = () => {
    switch (bannerBgStyle) {
      case "primary":
        return {
          className: "bg-primary text-white border-b border-primary-600",
          overlays: (
            <>
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
            </>
          )
        };
      case "gradient-royal":
        return {
          className: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-b border-purple-700",
          overlays: (
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0c_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          )
        };
      case "gradient-ocean":
        return {
          className: "bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-900 text-white border-b border-blue-950",
          overlays: (
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          )
        };
      case "light":
        return {
          className: "bg-slate-50 text-slate-900 border-b border-slate-200",
          overlays: (
            <>
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(#00000003_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            </>
          )
        };
      case "custom-image":
        return {
          className: "relative text-white border-b border-slate-800 bg-cover bg-center",
          overlays: (
            <div className="absolute inset-0 bg-slate-950/75 z-0 pointer-events-none" />
          ),
          style: bannerImageUrl ? { backgroundImage: `url(${bannerImageUrl})` } : {}
        };
      case "dark":
      default:
        return {
          className: "bg-slate-900 text-white border-b border-slate-800",
          overlays: (
            <>
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-500/10 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            </>
          )
        };
    }
  };

  const bannerStyles = getBannerStyles();

  return (
    <StandardLayout>
      <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Course Detail Hero Banner */}
      <div 
        className={cn("py-16 md:py-24 px-6 relative overflow-hidden", bannerStyles.className)}
        style={"style" in bannerStyles ? bannerStyles.style : undefined}
      >
        {bannerStyles.overlays}
        
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <Link href="/courses">
            <span className={cn(
              "inline-flex items-center gap-1.5 text-xs transition-colors cursor-pointer mb-2 font-semibold",
              bannerBgStyle === "light" ? "text-slate-500 hover:text-slate-800" : "text-slate-400 hover:text-white"
            )}>
              <ArrowLeft className="w-4 h-4" /> {detailBackText}
            </span>
          </Link>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight max-w-4xl">
            {course.title}
          </h1>

          <p className={cn(
            "text-sm md:text-base max-w-3xl leading-relaxed",
            bannerBgStyle === "light" ? "text-slate-600" : "text-slate-400"
          )}>
            {course.description || "Chưa có mô tả chi tiết."}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold pt-2">
            <span className={cn(
              "flex items-center gap-1.5",
              bannerBgStyle === "light" ? "text-slate-600" : "text-slate-400"
            )}>
              <BookOpen className="w-4 h-4 text-primary" />
              {lessons.length} bài giảng
            </span>
            <span className={cn(
              "flex items-center gap-1.5",
              bannerBgStyle === "light" ? "text-slate-600" : "text-slate-400"
            )}>
              <Clock className="w-4 h-4 text-indigo-400" />
              {detailLearningTypeText}
            </span>
            {showPrices && (
              <span className={cn(
                "px-3 py-1 rounded-full border",
                bannerBgStyle === "light"
                  ? "bg-slate-100 border-slate-200 text-slate-600"
                  : "bg-slate-800 border-slate-700 text-slate-200"
              )}>
                Học phí: {course.price === 0 ? "Miễn phí" : `${course.price.toLocaleString("vi-VN")} VND`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Syllabus */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Benefits Section */}
            {course.benefits && course.benefits.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Lợi ích khoá học</h2>
                  <p className="text-xs text-slate-400 mt-1">Những giá trị và kỹ năng thực tế bạn sẽ nhận được sau khoá học này.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.benefits.map((benefit: any, idx: number) => {
                    const IconComponent = (benefit.icon && (LucideIcons as any)[benefit.icon]) || CheckCircle2;
                    return (
                      <div key={idx} className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                            {benefit.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Outline list */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Nội dung bài giảng</h2>
                <p className="text-xs text-slate-400 mt-1">Giáo trình chi tiết của khoá học. Nhấp vào bài học bất kỳ để bắt đầu tiếp thu kiến thức.</p>
              </div>

              {lessons.length === 0 ? (
                <div className="text-center py-12 text-slate-400 italic text-sm">
                  Khoá học chưa có bài giảng nào được công khai.
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson, idx) => {
                    const isDone = completedLessons[lesson.id];
                    return (
                      <Link 
                        key={lesson.id}
                        href={`/courses/${slug}/lessons/${lesson.slug}`}
                        className="group flex items-center justify-between p-4 border border-slate-200 hover:border-slate-300 rounded-2xl hover:bg-slate-50/50 transition-all hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-8 h-8 rounded-xl bg-slate-100 font-mono text-xs font-bold text-slate-500 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <span className="block text-sm font-bold text-slate-800 group-hover:text-primary transition-colors truncate">
                              {lesson.title}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              {lesson.is_free_preview && (
                                <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border border-emerald-100 shrink-0">
                                  Học thử miễn phí
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 font-medium">/{lesson.slug}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isDone ? (
                            <span className="text-emerald-500 flex items-center gap-1 text-xs font-bold">
                              <CheckCircle2 className="w-4 h-4 fill-emerald-50 text-emerald-500" />
                              <span className="hidden sm:inline">Hoàn thành</span>
                            </span>
                          ) : (
                            <PlayCircle className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Author Section */}
            {course.authors && (
              <div className="bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Thông tin giảng viên
                </h3>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    {course.authors.avatar_url ? (
                      <img src={course.authors.avatar_url} alt={course.authors.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 text-center sm:text-left min-w-0">
                    <h4 className="text-base font-bold text-slate-800">{course.authors.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-2xl whitespace-pre-line">
                      {course.authors.bio || "Tác giả / Giảng viên tại Smax AI Academy."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: CTA Panel */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
            <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm overflow-hidden space-y-6">
              {/* Thumbnail */}
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <BookOpen className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Progress Summary if started */}
              {showProgress && completedCount > 0 && (
                <div className="space-y-2 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-emerald-600" />
                      Tiến độ học tập
                    </span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="block text-[10px] text-emerald-700 font-semibold text-center mt-1">
                    Đã hoàn thành {completedCount}/{lessons.length} bài học
                  </span>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-3">
                {lessons.length > 0 ? (
                  <Link href={`/courses/${slug}/lessons/${nextLesson.slug}`} className="block w-full">
                    <Button className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-primary/20 gap-1.5">
                      <PlayCircle className="w-5 h-5" />
                      {completedCount > 0 ? "Học tiếp bài hiện tại" : "Bắt đầu học ngay"}
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full h-12 rounded-2xl font-bold opacity-50">
                    Sắp có bài giảng
                  </Button>
                )}

                <div className="text-center text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {detailCtaDisclaimer}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>
    </StandardLayout>
  );
}
