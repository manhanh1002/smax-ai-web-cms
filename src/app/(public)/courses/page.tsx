"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, BookOpen, User, Sparkles, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import StandardLayout from "@/components/layout/StandardLayout";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { cn } from "@/lib/utils";

export default function PublicCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseProgress, setCourseProgress] = useState<Record<string, { completed: number; total: number }>>({});
  const { settings } = useSiteSettings();

  const config = settings?.course_config || {};
  const listLayout = config.list_layout || "grid";
  const bannerBgStyle = config.banner_bg_style || "dark";
  const bannerImageUrl = config.banner_image_url || "";
  const bannerBadge = config.banner_badge || "Học viện Đào tạo Smax AI";
  const bannerTitle = config.banner_title || "Nâng Tầm Kiến Thức \nCùng Smax Academy";
  const bannerDescription = config.banner_description || "Các khoá học thực chiến từ cơ bản...";
  const bannerSearchPlaceholder = config.banner_search_placeholder || "Tìm kiếm khoá học nâng cao...";
  const showPrices = config.show_prices !== false;
  const showProgress = config.show_progress !== false;

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    const { data } = await supabase
      .from("courses")
      .select("*, authors(name, avatar_url), lessons(id)")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    
    if (data) {
      setCourses(data);
      // Track progress for each course
      loadProgress(data);
    }
    setLoading(false);
  }

  function loadProgress(courseList: any[]) {
    const progressMap: Record<string, { completed: number; total: number }> = {};
    
    courseList.forEach((course) => {
      const lessonIds = course.lessons?.map((l: any) => l.id) || [];
      if (lessonIds.length === 0) return;

      // Check localStorage for each lesson in this course
      let completedCount = 0;
      lessonIds.forEach((id: string) => {
        const isCompleted = localStorage.getItem(`lesson_completed_${id}`) === "true";
        if (isCompleted) {
          completedCount++;
        }
      });

      if (completedCount > 0) {
        progressMap[course.id] = {
          completed: completedCount,
          total: lessonIds.length
        };
      }
    });

    setCourseProgress(progressMap);
  }

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const formatTitle = (title: string) => {
    return title.split("\n").map((line, idx) => {
      const parts = line.split(/(Smax Academy|Smax AI)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part === "Smax Academy" || part === "Smax AI") {
          return <span key={pIdx} className="text-primary italic font-black">{part}</span>;
        }
        return part;
      });
      return (
        <React.Fragment key={idx}>
          {renderedLine}
          {idx < title.split("\n").length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  const bannerStyles = getBannerStyles();

  return (
    <StandardLayout>
      <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Page Header Banner */}
      <div 
        className={cn("py-24 px-6 overflow-hidden relative", bannerStyles.className)}
        style={"style" in bannerStyles ? bannerStyles.style : undefined}
      >
        {bannerStyles.overlays}
        
        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          {bannerBadge && (
            <span className={cn(
              "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest",
              bannerBgStyle === "light"
                ? "bg-primary/5 border-primary/20 text-primary"
                : "bg-primary/20 border-primary/30 text-primary-foreground border-primary/30"
            )}>
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              {bannerBadge}
            </span>
          )}
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none whitespace-pre-line">
            {formatTitle(bannerTitle)}
          </h1>
          <p className={cn(
            "max-w-2xl mx-auto text-base md:text-lg font-medium",
            bannerBgStyle === "light" ? "text-slate-600" : "text-slate-400"
          )}>
            {bannerDescription}
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Search className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
                bannerBgStyle === "light" ? "text-slate-400" : "text-slate-505 text-slate-400"
              )} />
              <input
                type="text"
                placeholder={bannerSearchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full h-14 border rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-1 transition-all shadow-xl",
                  bannerBgStyle === "light"
                    ? "bg-white border-slate-200 text-slate-800 placeholder:text-slate-450 focus:border-primary focus:ring-primary/20"
                    : "bg-slate-800/80 border-slate-700/80 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary/30"
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Courses Catalog Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-[32px] border border-slate-200 p-6 space-y-4 animate-pulse">
                <div className="aspect-[16/9] w-full bg-slate-100 rounded-2xl" />
                <div className="h-4 bg-slate-100 rounded-full w-2/3" />
                <div className="h-3 bg-slate-100 rounded-full w-full" />
                <div className="h-3 bg-slate-100 rounded-full w-5/6" />
                <div className="h-8 bg-slate-100 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-[32px] p-8 max-w-2xl mx-auto">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Không tìm thấy khoá học</h3>
            <p className="text-sm text-slate-400 mt-1">Hãy thử tìm kiếm với các từ khoá khác hoặc quay lại sau.</p>
          </div>
        ) : listLayout === "grid" ? (
          /* GRID LAYOUT */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const progress = courseProgress[course.id];
              const lessonCount = course.lessons?.length || 0;
              const percent = progress ? Math.round((progress.completed / progress.total) * 100) : 0;

              return (
                <div 
                  key={course.id} 
                  className="bg-white border border-slate-200/80 rounded-[32px] overflow-hidden hover:border-slate-300 transition-all hover:shadow-xl hover:-translate-y-1 duration-300 flex flex-col group"
                >
                  {/* Thumbnail */}
                  <Link href={`/courses/${course.slug}`}>
                    <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden relative cursor-pointer">
                      {course.thumbnail_url ? (
                        <img 
                          src={course.thumbnail_url} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                          <BookOpen className="w-12 h-12" />
                        </div>
                      )}
                      
                      {/* Price Badge */}
                      {showPrices && (
                        <span className="absolute top-4 right-4 bg-slate-900/90 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-md">
                          {course.price === 0 ? "Miễn phí" : `${course.price.toLocaleString("vi-VN")} đ`}
                        </span>
                      )}

                      {/* Lesson Count Badge */}
                      <span className="absolute bottom-4 left-4 bg-white/95 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm backdrop-blur-md">
                        {lessonCount} bài học
                      </span>
                    </div>
                  </Link>

                  {/* Body */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <Link href={`/courses/${course.slug}`}>
                        <h3 className="text-lg font-black text-slate-950 leading-snug group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                          {course.title}
                        </h3>
                      </Link>
                      <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                        {course.description || "Chưa có mô tả chi tiết cho khoá học này."}
                      </p>
                    </div>

                    {/* Progress tracking */}
                    {showProgress && progress && (
                      <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                          <span className="flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            Đã học {progress.completed}/{progress.total} bài học
                          </span>
                          <span>{percent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Author & Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          {course.authors?.avatar_url ? (
                            <img src={course.authors.avatar_url} alt={course.authors.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-600 truncate max-w-[120px]">
                          {course.authors?.name || "Smax Academy"}
                        </span>
                      </div>

                      <Link href={`/courses/${course.slug}`}>
                        <Button 
                          variant="outline" 
                          className="rounded-xl text-xs font-bold border-slate-200 hover:border-slate-300 hover:bg-slate-50 h-9"
                        >
                          {progress ? "Học tiếp" : "Bắt đầu học"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* LIST LAYOUT (Horizontal Cards) */
          <div className="space-y-8">
            {filteredCourses.map((course) => {
              const progress = courseProgress[course.id];
              const lessonCount = course.lessons?.length || 0;
              const percent = progress ? Math.round((progress.completed / progress.total) * 100) : 0;

              return (
                <div 
                  key={course.id} 
                  className="bg-white border border-slate-200/80 rounded-[32px] overflow-hidden hover:border-slate-300 transition-all hover:shadow-xl hover:-translate-y-1 duration-300 flex flex-col md:flex-row group"
                >
                  {/* Thumbnail */}
                  <Link href={`/courses/${course.slug}`} className="md:w-80 shrink-0">
                    <div className="aspect-[16/9] md:h-full w-full bg-slate-100 overflow-hidden relative cursor-pointer min-h-[180px]">
                      {course.thumbnail_url ? (
                        <img 
                          src={course.thumbnail_url} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                          <BookOpen className="w-12 h-12" />
                        </div>
                      )}
                      
                      {/* Price Badge */}
                      {showPrices && (
                        <span className="absolute top-4 right-4 bg-slate-900/90 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-md">
                          {course.price === 0 ? "Miễn phí" : `${course.price.toLocaleString("vi-VN")} đ`}
                        </span>
                      )}

                      {/* Lesson Count Badge */}
                      <span className="absolute bottom-4 left-4 bg-white/95 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm backdrop-blur-md">
                        {lessonCount} bài học
                      </span>
                    </div>
                  </Link>

                  {/* Body */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <Link href={`/courses/${course.slug}`}>
                        <h3 className="text-xl font-black text-slate-950 leading-snug group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                          {course.title}
                        </h3>
                      </Link>
                      <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                        {course.description || "Chưa có mô tả chi tiết cho khoá học này."}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                      {/* Progress tracking */}
                      {showProgress && progress ? (
                        <div className="flex-1 max-w-xs space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                            <span className="flex items-center gap-1">
                              <Award className="w-3.5 h-3.5 text-amber-500" />
                              Đã học {progress.completed}/{progress.total} bài học
                            </span>
                            <span>{percent}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1" />
                      )}

                      {/* Author & Footer */}
                      <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            {course.authors?.avatar_url ? (
                              <img src={course.authors.avatar_url} alt={course.authors.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                                <User className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-bold text-slate-600 truncate max-w-[120px]">
                            {course.authors?.name || "Smax Academy"}
                          </span>
                        </div>

                        <Link href={`/courses/${course.slug}`}>
                          <Button 
                            variant="outline" 
                            className="rounded-xl text-xs font-bold border-slate-200 hover:border-slate-300 hover:bg-slate-50 h-9"
                          >
                            {progress ? "Học tiếp" : "Bắt đầu học"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </StandardLayout>
  );
}
