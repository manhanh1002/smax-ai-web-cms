"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Toggle } from "@/components/ui/Toggle";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { 
  Save, Layout, Grid, List, Sparkles, Image as ImageIcon, 
  Search, ArrowLeft, BookOpen, Clock, AlertCircle, Eye, RefreshCw, X, Award, User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DEFAULT_COURSE_CONFIG = {
  list_layout: "grid" as "grid" | "list",
  banner_bg_style: "dark" as "dark" | "primary" | "gradient-royal" | "gradient-ocean" | "light" | "custom-image",
  banner_image_url: "",
  banner_badge: "Học viện Đào tạo Smax AI",
  banner_title: "Nâng Tầm Kiến Thức \nCùng Smax Academy",
  banner_description: "Các khoá học thực chiến từ cơ bản giúp bạn làm chủ AI Builder, tối ưu quy trình kinh doanh và tự động hoá doanh nghiệp.",
  banner_search_placeholder: "Tìm kiếm khoá học nâng cao...",
  show_prices: true,
  show_progress: true,
  primary_color_override: "",
  detail_back_text: "Quay lại danh sách khoá học",
  detail_learning_type_text: "Tự học / Học nhanh online",
  detail_cta_disclaimer: "Không cần đăng nhập • Học miễn phí online"
};

const BANNER_BG_STYLES = [
  { id: "dark", label: "Tối (Slate 900)", description: "Nền tối hiện đại, chữ trắng có họa tiết" },
  { id: "primary", label: "Màu thương hiệu", description: "Sử dụng màu chủ đạo bg-primary làm nền chính" },
  { id: "gradient-royal", label: "Gradient Hoàng Gia", description: "Hiệu ứng chuyển sắc tím hồng lộng lẫy" },
  { id: "gradient-ocean", label: "Gradient Đại Dương", description: "Hiệu ứng chuyển sắc xanh lục lam sâu lắng" },
  { id: "light", label: "Sáng (Slate 50)", description: "Nền xám sáng tinh tế, chữ slate tối" },
  { id: "custom-image", label: "Ảnh nền tùy chỉnh", description: "Được phủ một lớp overlay đen mờ đảm bảo độ tương phản" },
];

export default function CourseSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [config, setConfig] = useState(DEFAULT_COURSE_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewTab, setPreviewTab] = useState<"catalog" | "detail">("catalog");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("site_settings").select("*").single();
      if (error) throw error;
      if (data) {
        setSettings(data);
        if (data.course_config) {
          setConfig({
            ...DEFAULT_COURSE_CONFIG,
            ...data.course_config
          });
        }
      }
    } catch (err) {
      console.error("Error fetching site settings:", err);
      toast.error("Không thể tải cấu hình hệ thống");
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    if (!settings?.id) return;
    try {
      setSaving(true);
      const { error } = await supabase
        .from("site_settings")
        .update({
          course_config: config
        })
        .eq("id", settings.id);

      if (error) throw error;
      toast.success("Cấu hình khoá học đã được cập nhật thành công!");
    } catch (err) {
      console.error("Error saving course settings:", err);
      toast.error("Gặp lỗi trong quá trình lưu cấu hình!");
    } finally {
      setSaving(false);
    }
  }

  const updateConfig = (key: keyof typeof DEFAULT_COURSE_CONFIG, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetToDefault = () => {
    if (confirm("Bạn có chắc chắn muốn khôi phục cấu hình khoá học về mặc định? Các thay đổi chưa lưu sẽ bị mất.")) {
      setConfig(DEFAULT_COURSE_CONFIG);
      toast.info("Đã khôi phục về mặc định (Nhớ bấm Lưu cấu hình)");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <span>Đang tải cấu hình khoá học...</span>
        </div>
      </div>
    );
  }

  // Live preview helper classes
  const getBannerStyleClass = (style: string) => {
    switch (style) {
      case "primary":
        return "bg-primary text-white border-primary-600";
      case "gradient-royal":
        return "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-purple-700";
      case "gradient-ocean":
        return "bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-900 text-white border-blue-950";
      case "light":
        return "bg-slate-50 text-slate-900 border-slate-200";
      case "custom-image":
        return "relative text-white border-slate-800 bg-cover bg-center";
      case "dark":
      default:
        return "bg-slate-900 text-white border-slate-800";
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layout className="w-8 h-8 text-primary" />
            Cấu hình Khoá học
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Tùy chỉnh giao diện, bố cục, banner và các cài đặt hiển thị của trang khoá học công khai.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={resetToDefault}
            className="rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
          >
            Khôi phục mặc định
          </Button>
          <Button 
            onClick={saveSettings} 
            disabled={saving} 
            className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20 bg-primary text-white px-5 h-11"
          >
            <Save className="w-4.5 h-4.5" />
            {saving ? "Đang lưu..." : "Lưu cấu hình"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Settings (5/12 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Layout & Core config */}
          <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Grid className="w-5 h-5 text-primary" />
              Thiết lập Bố cục & Hiển thị
            </h3>

            {/* List Layout Choice */}
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase text-slate-400 tracking-wider">Bố cục danh sách khoá học</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateConfig("list_layout", "grid")}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 border-2 rounded-2xl transition-all gap-2",
                    config.list_layout === "grid"
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200"
                  )}
                >
                  <Grid className="w-5 h-5" />
                  <span className="text-xs font-bold">Dạng Lưới (Grid)</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateConfig("list_layout", "list")}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 border-2 rounded-2xl transition-all gap-2",
                    config.list_layout === "list"
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200"
                  )}
                >
                  <List className="w-5 h-5" />
                  <span className="text-xs font-bold">Dạng Danh sách (List)</span>
                </button>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4 pt-2 border-t border-slate-50">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-bold text-slate-800">Hiển thị học phí</Label>
                  <p className="text-xs text-slate-400">Hiển thị giá tiền trên thẻ khoá học hoặc ẩn đi.</p>
                </div>
                <Toggle 
                  checked={config.show_prices} 
                  onChange={(checked) => updateConfig("show_prices", checked)} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-bold text-slate-800">Theo dõi tiến trình</Label>
                  <p className="text-xs text-slate-400">Hiển thị thanh tiến độ học tập dựa vào Cookie/LocalStorage.</p>
                </div>
                <Toggle 
                  checked={config.show_progress} 
                  onChange={(checked) => updateConfig("show_progress", checked)} 
                />
              </div>
            </div>
          </div>

          {/* Card 2: Banner Background Styles */}
          <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Hình nền Banner Hero
            </h3>

            <div className="space-y-3">
              <Label className="text-xs font-black uppercase text-slate-400 tracking-wider">Kiểu nền Banner</Label>
              <div className="grid grid-cols-1 gap-2">
                {BANNER_BG_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => updateConfig("banner_bg_style", style.id)}
                    className={cn(
                      "flex items-start text-left p-3.5 border rounded-2xl transition-all gap-3",
                      config.banner_bg_style === style.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0",
                      config.banner_bg_style === style.id ? "border-primary text-primary bg-primary" : "border-slate-300"
                    )}>
                      {config.banner_bg_style === style.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 block">{style.label}</span>
                      <span className="text-[11px] text-slate-400 font-medium block">{style.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Background Image Picker */}
            {config.banner_bg_style === "custom-image" && (
              <div className="space-y-3 p-4 bg-slate-50 border border-slate-150 rounded-2xl animate-in fade-in slide-in-from-top-1 duration-200">
                <Label className="text-xs font-bold text-slate-600 block">Tải lên / Chọn ảnh nền</Label>
                {config.banner_image_url ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-[21/9]">
                    <img 
                      src={config.banner_image_url} 
                      alt="Banner background" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => updateConfig("banner_image_url", "")}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-slate-300 transition-colors">
                    <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-[11px] text-slate-400 mb-3 font-medium">Chưa chọn ảnh nền. Vui lòng nhấn nút dưới đây để chọn ảnh.</p>
                    <MediaPicker 
                      onSelect={(url) => updateConfig("banner_image_url", url)}
                      trigger={
                        <Button type="button" variant="outline" size="sm" className="rounded-lg font-bold">
                          Chọn từ Media
                        </Button>
                      }
                    />
                  </div>
                )}
                
                {config.banner_image_url && (
                  <div className="flex justify-end pt-1">
                    <MediaPicker 
                      onSelect={(url) => updateConfig("banner_image_url", url)}
                      trigger={
                        <button type="button" className="text-xs font-bold text-primary hover:underline">
                          Thay đổi ảnh khác
                        </button>
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 3: Banner Content Setup */}
          <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Nội dung Banner (Header)
            </h3>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600">Badge trên cùng</Label>
              <Input 
                value={config.banner_badge}
                onChange={(e) => updateConfig("banner_badge", e.target.value)}
                placeholder="Ví dụ: Học viện Đào tạo Smax AI"
                className="rounded-xl font-medium"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-600">Tiêu đề chính (Banner Title)</Label>
                <span className="text-[10px] text-slate-400 font-medium">Hỗ trợ \n xuống dòng</span>
              </div>
              <textarea
                value={config.banner_title}
                onChange={(e) => updateConfig("banner_title", e.target.value)}
                rows={3}
                placeholder="Ví dụ: Nâng Tầm Kiến Thức &#10;Cùng Smax Academy"
                className="flex w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary placeholder:text-gray-450 transition-all font-medium resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600">Mô tả phụ</Label>
              <textarea
                value={config.banner_description}
                onChange={(e) => updateConfig("banner_description", e.target.value)}
                rows={3}
                placeholder="Nhập mô tả giới thiệu về các khoá học của bạn..."
                className="flex w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary placeholder:text-gray-450 transition-all font-medium resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600">Placeholder ô tìm kiếm</Label>
              <Input 
                value={config.banner_search_placeholder}
                onChange={(e) => updateConfig("banner_search_placeholder", e.target.value)}
                placeholder="Ví dụ: Tìm kiếm khóa học nâng cao..."
                className="rounded-xl font-medium"
              />
            </div>
          </div>

          {/* Card 4: Detail Page Configuration */}
          <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Cấu hình Trang Chi tiết Khoá học
            </h3>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600">Text nút quay lại</Label>
              <Input 
                value={config.detail_back_text}
                onChange={(e) => updateConfig("detail_back_text", e.target.value)}
                placeholder="Ví dụ: Quay lại danh sách khoá học"
                className="rounded-xl font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600">Nhãn hình thức học tập</Label>
              <Input 
                value={config.detail_learning_type_text}
                onChange={(e) => updateConfig("detail_learning_type_text", e.target.value)}
                placeholder="Ví dụ: Tự học / Học nhanh online"
                className="rounded-xl font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600">Ghi chú dưới nút học (CTA Disclaimer)</Label>
              <Input 
                value={config.detail_cta_disclaimer}
                onChange={(e) => updateConfig("detail_cta_disclaimer", e.target.value)}
                placeholder="Ví dụ: Không cần đăng nhập • Học miễn phí online"
                className="rounded-xl font-medium"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Premium Live Preview (7/12 cols) */}
        <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-8">
          <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm flex flex-col h-[780px]">
            
            {/* Live Preview Header Toolbar */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Eye className="w-4.5 h-4.5 text-slate-400" />
                Khung xem trước trực quan (Real-time Live Preview)
              </span>

              {/* Mode Toggles */}
              <div className="bg-slate-200/60 p-1 rounded-xl flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewTab("catalog")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    previewTab === "catalog" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  Trang Danh mục
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("detail")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    previewTab === "detail" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  Trang Chi tiết
                </button>
              </div>
            </div>

            {/* Live Preview Render Viewport */}
            <div className="flex-1 overflow-y-auto bg-slate-100 p-6 custom-scrollbar select-none pointer-events-none">
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden min-h-full flex flex-col">
                
                {/* 1. RENDER HERO BANNER */}
                <div 
                  className={cn(
                    "py-12 px-6 overflow-hidden relative text-center border-b",
                    getBannerStyleClass(config.banner_bg_style)
                  )}
                  style={config.banner_bg_style === "custom-image" && config.banner_image_url ? { 
                    backgroundImage: `url(${config.banner_image_url})` 
                  } : undefined}
                >
                  {/* Custom Image Overlay */}
                  {config.banner_bg_style === "custom-image" && (
                    <div className="absolute inset-0 bg-slate-950/75 z-0" />
                  )}

                  {/* Standard Overlays for Dark / Light / Primary */}
                  {config.banner_bg_style === "dark" && (
                    <>
                      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-500/10 to-transparent pointer-events-none" />
                      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
                    </>
                  )}

                  {config.banner_bg_style === "primary" && (
                    <>
                      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
                    </>
                  )}

                  {config.banner_bg_style === "gradient-royal" && (
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff0c_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
                  )}

                  {config.banner_bg_style === "light" && (
                    <>
                      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none" />
                      <div className="absolute inset-0 bg-[radial-gradient(#00000003_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
                    </>
                  )}

                  <div className="relative z-10 space-y-4 max-w-xl mx-auto">
                    {/* Catalog Mode Back text or Banner Badge */}
                    {previewTab === "catalog" ? (
                      config.banner_badge && (
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          config.banner_bg_style === "light"
                            ? "bg-primary/5 border-primary/20 text-primary"
                            : "bg-primary/20 border-primary/30 text-primary-foreground"
                        )}>
                          <Sparkles className="w-3 h-3 text-primary" />
                          {config.banner_badge}
                        </span>
                      )
                    ) : (
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-[11px] font-bold cursor-pointer hover:underline",
                        config.banner_bg_style === "light" ? "text-slate-500" : "text-slate-300"
                      )}>
                        <ArrowLeft className="w-3.5 h-3.5" />
                        {config.detail_back_text || "Quay lại danh sách khoá học"}
                      </span>
                    )}

                    {/* Banner Title */}
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight whitespace-pre-line">
                      {previewTab === "catalog" 
                        ? config.banner_title 
                        : "Xây dựng hệ thống Chatbot thông minh với Smax AI"}
                    </h2>

                    {/* Banner Description */}
                    <p className={cn(
                      "text-xs font-medium max-w-md mx-auto line-clamp-3 leading-relaxed",
                      config.banner_bg_style === "light" ? "text-slate-500" : "text-slate-400"
                    )}>
                      {previewTab === "catalog" 
                        ? config.banner_description 
                        : "Khóa học chuyên sâu hướng dẫn từng bước tích hợp, huấn luyện và thiết lập các kịch bản AI tự động hóa tư vấn bán hàng."}
                    </p>

                    {/* Conditional Banner Footer details */}
                    {previewTab === "catalog" ? (
                      /* Search placeholder preview */
                      <div className="max-w-xs mx-auto pt-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <div className={cn(
                            "w-full h-10 border rounded-xl pl-9 pr-3 text-[11px] flex items-center font-medium",
                            config.banner_bg_style === "light" 
                              ? "bg-white border-slate-200 text-slate-400"
                              : "bg-slate-800/80 border-slate-700/80 text-slate-500"
                          )}>
                            {config.banner_search_placeholder || "Tìm kiếm khóa học..."}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Detail metadata preview */
                      <div className={cn(
                        "flex items-center justify-center gap-4 text-[10px] font-bold pt-1",
                        config.banner_bg_style === "light" ? "text-slate-500" : "text-slate-300"
                      )}>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-primary" />
                          12 bài giảng
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          {config.detail_learning_type_text || "Tự học / Học nhanh online"}
                        </span>
                        {config.show_prices && (
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] border",
                            config.banner_bg_style === "light"
                              ? "bg-slate-100 border-slate-200 text-slate-600"
                              : "bg-slate-800 border-slate-700 text-slate-200"
                          )}>
                            Học phí: Miễn phí
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. RENDER VIEWPORT CONTENT */}
                <div className="flex-1 bg-slate-50 p-6 flex flex-col justify-between">
                  {previewTab === "catalog" ? (
                    // Catalog layout view
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500">Danh mục khoá học ({config.list_layout === "grid" ? "Grid" : "List"})</span>
                        <div className="w-16 h-2 bg-slate-200 rounded-full" />
                      </div>

                      {config.list_layout === "grid" ? (
                        /* GRID PREVIEW (Render 2 mock grid cards) */
                        <div className="grid grid-cols-2 gap-4">
                          {Array(2).fill(0).map((_, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                              {/* Card thumb */}
                              <div className="aspect-[16/9] bg-slate-100 relative">
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <BookOpen className="w-6 h-6" />
                                </div>
                                {config.show_prices && (
                                  <span className="absolute top-2 right-2 bg-slate-900/90 text-white text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-full">
                                    Miễn phí
                                  </span>
                                )}
                              </div>
                              {/* Card body */}
                              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                                <div>
                                  <div className="h-3 bg-slate-850 rounded-full w-4/5 mb-2" />
                                  <div className="h-2 bg-slate-100 rounded-full w-full" />
                                </div>
                                
                                {/* Mock progress */}
                                {config.show_progress && i === 0 && (
                                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 space-y-1">
                                    <div className="flex items-center justify-between text-[8px] font-bold text-slate-400">
                                      <span>Đang học 4/12 bài</span>
                                      <span>33%</span>
                                    </div>
                                    <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-400 w-1/3 rounded-full" />
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                  <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 rounded-full bg-slate-200" />
                                    <span className="text-[9px] font-bold text-slate-500">Giảng viên</span>
                                  </div>
                                  <div className="w-12 h-4 bg-slate-100 border border-slate-200 rounded-lg" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* LIST PREVIEW (Render 2 mock horizontal cards) */
                        <div className="space-y-3">
                          {Array(2).fill(0).map((_, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-row">
                              {/* Horizontal thumb */}
                              <div className="w-24 bg-slate-100 relative shrink-0">
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <BookOpen className="w-6 h-6" />
                                </div>
                                {config.show_prices && (
                                  <span className="absolute top-1.5 right-1.5 bg-slate-900/90 text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full">
                                    Free
                                  </span>
                                )}
                              </div>
                              {/* Horizontal body */}
                              <div className="p-3 flex-1 flex flex-col justify-between">
                                <div className="space-y-1">
                                  <div className="h-3 bg-slate-850 rounded-full w-2/3" />
                                  <div className="h-2 bg-slate-100 rounded-full w-full" />
                                </div>
                                
                                <div className="flex items-center justify-between pt-1 mt-1 border-t border-slate-50">
                                  {/* Mock Progress */}
                                  {config.show_progress && i === 0 ? (
                                    <div className="flex-1 max-w-[100px] space-y-0.5">
                                      <div className="flex justify-between text-[7px] font-bold text-slate-400">
                                        <span>Đã học 33%</span>
                                      </div>
                                      <div className="w-full h-0.5 bg-slate-200 rounded-full">
                                        <div className="h-full bg-emerald-400 w-1/3 rounded-full" />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex-1" />
                                  )}
                                  
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-4 h-4 rounded-full bg-slate-200" />
                                    <div className="w-10 h-4 bg-slate-100 border border-slate-200 rounded-lg" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Detail layout view
                    <div className="grid grid-cols-3 gap-4">
                      {/* Left: Lessons outline */}
                      <div className="col-span-2 space-y-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
                        <div className="border-b border-slate-100 pb-2">
                          <span className="text-[10px] font-black text-slate-800 block">Nội dung bài giảng</span>
                          <span className="text-[8px] text-slate-400 block">Giáo trình chi tiết của khóa học</span>
                        </div>
                        {/* Mock lessons */}
                        <div className="space-y-1.5">
                          {Array(3).fill(0).map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-2 border border-slate-100 rounded-lg">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-4 h-4 rounded bg-slate-150 text-[9px] font-bold text-slate-500 flex items-center justify-center">
                                  {i + 1}
                                </span>
                                <div className="h-2 bg-slate-200 rounded-full w-24" />
                              </div>
                              <div className="w-3 h-3 rounded-full bg-slate-200" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: CTA details */}
                      <div className="col-span-1 space-y-3">
                        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm space-y-3">
                          <div className="aspect-[16/9] w-full bg-slate-100 rounded-lg" />
                          
                          {/* Progress summary Mock */}
                          {config.show_progress && (
                            <div className="space-y-1 p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                              <div className="flex items-center justify-between text-[7px] font-bold text-emerald-800">
                                <span>Tiến độ học tập</span>
                                <span>25%</span>
                              </div>
                              <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 w-1/4 rounded-full" />
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            <div className="w-full h-8 bg-primary rounded-xl flex items-center justify-center text-white text-[9px] font-bold">
                              Bắt đầu học ngay
                            </div>
                            <span className="text-[8px] text-slate-400 text-center font-medium block leading-snug">
                              {config.detail_cta_disclaimer || "Không cần đăng nhập • Học miễn phí online"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mock Footer info */}
                  <div className="text-center text-[9px] text-slate-300 font-bold border-t border-slate-100 pt-3 mt-4">
                    SMAX AI ACADEMY DESIGN SYSTEM
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
