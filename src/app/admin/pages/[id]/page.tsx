"use client";

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { 
  Save, ArrowLeft, Eye, EyeOff, LayoutTemplate, FileText, Settings, X, 
  Home, AlertCircle, Layout, Columns, PanelLeft, PanelRight, Eye as EyeIcon,
  Copy, Monitor, Tablet, Smartphone, History, RotateCcw, Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductEditor } from "@/components/cms/ProductEditor";
import { BlockEditor } from "@/components/cms/BlockEditor";
import { cn } from "@/lib/utils";
import type { PageBlock } from "@/lib/cms/block-system/types";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Toggle } from "@/components/ui/Toggle";
import { Badge } from "@/components/ui/Badge";
import { PageHistoryModal } from "@/components/cms/PageHistoryModal";
import { MediaPicker } from "@/components/cms/MediaPicker";

export default function PageEditor() {
  const { id } = useParams() as { id: string };

  const [page, setPage] = useState<any>(null);
  const [productConfig, setProductConfig] = useState<any>({});
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [pageType, setPageType] = useState<"custom" | "product">("custom");
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  
  // Settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isHome, setIsHome] = useState(false);
  const [is404, setIs404] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [layoutType, setLayoutType] = useState<"full" | "left-sidebar" | "right-sidebar" | "double-sidebar">("full");
  const [hideHeader, setHideHeader] = useState(false);
  const [hideFooter, setHideFooter] = useState(false);
  const [sidebarLeftId, setSidebarLeftId] = useState<string | null>(null);
  const [sidebarRightId, setSidebarRightId] = useState<string | null>(null);
  const [availableSidebars, setAvailableSidebars] = useState<any[]>([]);
  const [pageCategories, setPageCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  // Page background state
  const [pageBackground, setPageBackground] = useState<any>({
    type: "color",
    color: "#ffffff",
    gradientColor1: "#ffffff",
    gradientColor2: "#000000",
    gradientAngle: 180,
    imageUrl: ""
  });

  // Template state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const [isResizing, setIsResizing] = useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  // History state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [previewedVersion, setPreviewedVersion] = useState<any | null>(null);
  const [backupState, setBackupState] = useState<any | null>(null);

  // Preview config for the live preview panel
  const previewConfig = pageType === "custom"
    ? { blocks, pageBackground }
    : { ...productConfig, pageBackground };

  const lastSavedRef = useRef<string>("");

  useEffect(() => { 
    fetchPage(); 
    fetchSidebars();
    fetchPageCategories();
  }, [id]);



  async function fetchSidebars() {
    const { data } = await supabase.from("sidebars").select("id, name");
    if (data) setAvailableSidebars(data);
  }

  async function fetchPageCategories() {
    const { data } = await supabase
      .from("page_categories")
      .select("id, name")
      .order("name");
    if (data) setPageCategories(data);
  }

  async function fetchPage() {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("*, page_templates(is_fixed)")
        .eq("id", id)
        .single();
        
      if (error) throw error;

      if (data) {
        const config = data.content_config || {};
        const initialBlocks = config.blocks || data.blocks || [];
        const initialProductConfig = config || {};
        const type = data.type || "custom";
        const initialBg = config.pageBackground || {
          type: "color",
          color: "#ffffff",
          gradientColor1: "#ffffff",
          gradientColor2: "#000000",
          gradientAngle: 180,
          imageUrl: ""
        };

        setPage(data);
        setProductConfig(initialProductConfig);
        setBlocks(initialBlocks);
        setPageType(type);
        setPageBackground(initialBg);
        
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setIsHome(data.is_home || false);
        setIs404(data.is_404 || false);
        setStatus(data.status || "draft");
        setLayoutType(data.layout_type || "full");
        setHideHeader(data.hide_header || false);
        setHideFooter(data.hide_footer || false);
        setSidebarLeftId(data.sidebar_left_id);
        setSidebarRightId(data.sidebar_right_id);
        setCategoryId(data.category_id || null);

        // Initialize lastSavedRef with the actual data we just loaded
        const currentData = JSON.stringify({
          title: data.title || "", 
          slug: data.slug || "", 
          isHome: data.is_home || false, 
          is404: data.is_404 || false, 
          status: data.status || "draft", 
          layoutType: data.layout_type || "full", 
          hideHeader: data.hide_header || false, 
          hideFooter: data.hide_footer || false, 
          sidebarLeftId: data.sidebar_left_id, 
          sidebarRightId: data.sidebar_right_id,
          blocks: initialBlocks, 
          productConfig: initialProductConfig, 
          pageType: type,
          pageBackground: initialBg
        });
        lastSavedRef.current = currentData;
      }
    } catch (err: any) {
      console.error("Error fetching page:", err);
      toast.error("Không thể tải dữ liệu trang");
    }
  }

  async function savePage(silent = false) {
    if (!silent) setSaving(true);
    
    // If isHome or is404 is being set to true, we need to unset others
    if (isHome && !page.is_home) {
      await supabase.from("pages").update({ is_home: false }).eq("is_home", true);
    }
    if (is404 && !page.is_404) {
      await supabase.from("pages").update({ is_404: false }).eq("is_404", true);
    }

    const configToSave = pageType === "custom"
      ? { ...productConfig, blocks, pageBackground }
      : { ...productConfig, pageBackground };

    const { error } = await supabase.from("pages").update({
      title,
      slug,
      is_home: isHome,
      is_404: is404,
      status: status,
      layout_type: layoutType,
      hide_header: hideHeader,
      hide_footer: hideFooter,
      sidebar_left_id: sidebarLeftId,
      sidebar_right_id: sidebarRightId,
      category_id: categoryId,
      content_config: configToSave,
      type: pageType,
      updated_at: new Date().toISOString(),
    }).eq("id", id);

    if (error) {
      if (!silent) toast.error("Có lỗi xảy ra: " + error.message);
    } else {
      if (!silent) {
        toast.success("Đã lưu trang thành công!");
        
        // Save to page_versions on manual saves
        try {
          const { data: { user } } = await supabase.auth.getUser();
          await supabase.from("page_versions").insert({
            page_id: id,
            title,
            slug,
            status,
            content_config: configToSave,
            blocks,
            layout_type: layoutType,
            hide_header: hideHeader,
            hide_footer: hideFooter,
            sidebar_left_id: sidebarLeftId,
            sidebar_right_id: sidebarRightId,
            category_id: categoryId,
            type: pageType,
            created_by: user?.id || null,
            description: "Lưu thủ công"
          });
        } catch (err) {
          console.error("Error saving page version:", err);
        }
      }
      
      // Update lastSavedRef
      lastSavedRef.current = JSON.stringify({
        title, slug, isHome, is404, status, layoutType, 
        hideHeader, hideFooter, sidebarLeftId, sidebarRightId,
        blocks, productConfig, pageType, pageBackground
      });

      setPage({ 
        ...page, 
        title, slug, is_home: isHome, is_404: is404, status, 
        layout_type: layoutType, hide_header: hideHeader, hide_footer: hideFooter,
        sidebar_left_id: sidebarLeftId, sidebar_right_id: sidebarRightId,
        page_templates: page.page_templates // Keep template info
      });
    }
    if (!silent) setSaving(false);
  }

  // Version Control logic
  const handlePreviewVersion = (version: any) => {
    if (!previewedVersion) {
      setBackupState({
        title,
        slug,
        status,
        layoutType,
        hideHeader,
        hideFooter,
        sidebarLeftId,
        sidebarRightId,
        categoryId,
        blocks,
        productConfig,
        pageType,
        pageBackground
      });
    }

    setPreviewedVersion(version);

    setTitle(version.title || "");
    setSlug(version.slug || "");
    setStatus(version.status || "draft");
    setLayoutType(version.layout_type || "full");
    setHideHeader(version.hide_header || false);
    setHideFooter(version.hide_footer || false);
    setSidebarLeftId(version.sidebar_left_id || null);
    setSidebarRightId(version.sidebar_right_id || null);
    setCategoryId(version.category_id || null);
    setBlocks(version.blocks || []);
    setProductConfig(version.content_config || {});
    setPageType(version.type || "custom");
    setPageBackground(version.content_config?.pageBackground || { type: "color", color: "#ffffff" });

    setIsHistoryOpen(false);
    toast.success("Đang xem trước phiên bản ngày " + new Date(version.created_at).toLocaleString("vi-VN"));
  };

  const handleExitPreview = () => {
    if (!backupState) return;

    setTitle(backupState.title);
    setSlug(backupState.slug);
    setStatus(backupState.status);
    setLayoutType(backupState.layoutType);
    setHideHeader(backupState.hideHeader);
    setHideFooter(backupState.hideFooter);
    setSidebarLeftId(backupState.sidebarLeftId);
    setSidebarRightId(backupState.sidebarRightId);
    setCategoryId(backupState.categoryId);
    setBlocks(backupState.blocks);
    setProductConfig(backupState.productConfig);
    setPageType(backupState.pageType);
    setPageBackground(backupState.pageBackground);

    setPreviewedVersion(null);
    setBackupState(null);
    toast.info("Đã thoát chế độ xem trước");
  };

  const handleRestoreVersion = async (version: any) => {
    const confirmRestore = confirm(
      `Bạn có chắc chắn muốn khôi phục trang về phiên bản ngày ${new Date(version.created_at).toLocaleString("vi-VN")}?`
    );
    if (!confirmRestore) return;

    setSaving(true);
    
    const { error } = await supabase
      .from("pages")
      .update({
        title: version.title,
        slug: version.slug,
        status: version.status,
        layout_type: version.layout_type,
        hide_header: version.hide_header,
        hide_footer: version.hide_footer,
        sidebar_left_id: version.sidebar_left_id,
        sidebar_right_id: version.sidebar_right_id,
        category_id: version.category_id,
        content_config: version.content_config,
        blocks: version.blocks,
        type: version.type,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast.error("Lỗi khi khôi phục trang: " + error.message);
    } else {
      toast.success("Đã khôi phục trang thành công!");
      
      setTitle(version.title);
      setSlug(version.slug);
      setStatus(version.status);
      setLayoutType(version.layout_type);
      setHideHeader(version.hide_header);
      setHideFooter(version.hide_footer);
      setSidebarLeftId(version.sidebar_left_id);
      setSidebarRightId(version.sidebar_right_id);
      setCategoryId(version.category_id);
      setBlocks(version.blocks || []);
      setProductConfig(version.content_config || {});
      setPageType(version.type);
      setPageBackground(version.content_config?.pageBackground || { type: "color", color: "#ffffff" });

      // Save history version recording the restoration
      try {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from("page_versions").insert({
          page_id: id,
          title: version.title,
          slug: version.slug,
          status: version.status,
          content_config: version.content_config,
          blocks: version.blocks,
          layout_type: version.layout_type,
          hide_header: version.hide_header,
          hide_footer: version.hide_footer,
          sidebar_left_id: version.sidebar_left_id,
          sidebar_right_id: version.sidebar_right_id,
          category_id: version.category_id,
          type: version.type,
          created_by: user?.id || null,
          description: `Khôi phục về phiên bản ngày ${new Date(version.created_at).toLocaleString("vi-VN")}`
        });
      } catch (err) {
        console.error("Error logging restore version:", err);
      }

      setPreviewedVersion(null);
      setBackupState(null);
      setIsHistoryOpen(false);
      
      // Reload iframe src
      if (iframeRef.current) {
        iframeRef.current.src = `/preview-frame/${id}`;
      }
    }
    setSaving(false);
  };

  // Auto-save effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (saving || !page || previewedVersion) return;

      const currentData = JSON.stringify({
        title, slug, isHome, is404, status, layoutType, 
        hideHeader, hideFooter, sidebarLeftId, sidebarRightId,
        blocks, productConfig, pageType, pageBackground
      });

      if (currentData !== lastSavedRef.current) {
        console.log("Auto-saving page...");
        savePage(true);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [title, slug, isHome, is404, status, layoutType, hideHeader, hideFooter, sidebarLeftId, sidebarRightId, blocks, productConfig, pageType, pageBackground, saving, page, previewedVersion]);

  // Resizing logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(320, Math.min(800, e.clientX));
      setSidebarWidth(newWidth);
    };
    
    const handleMouseUp = () => setIsResizing(false);
    
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
    }
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    };
  }, [isResizing]);

  // Sync preview with iframe
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: "UPDATE_PREVIEW",
        config: previewConfig
      }, "*");
    }
  }, [previewConfig]);

  async function saveAsTemplate() {
    if (!templateName.trim()) {
      toast.error("Vui lòng nhập tên template");
      return;
    }

    setSavingTemplate(true);
    const configToSave = pageType === "custom"
      ? { ...productConfig, blocks, pageBackground }
      : { ...productConfig, pageBackground };

    const { error } = await supabase.from("page_templates").insert({
      name: templateName,
      content_config: configToSave,
      type: pageType,
      is_fixed: false,
    });

    if (error) {
      toast.error("Không thể lưu template: " + error.message);
    } else {
      toast.success("Đã lưu thành Template mới!");
      setIsTemplateModalOpen(false);
      setTemplateName("");
    }
    setSavingTemplate(false);
  }

  if (!page) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
        <p className="text-sm font-medium">Đang tải editor...</p>
      </div>
    </div>
  );


  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages">
            <Button variant="ghost" size="sm" className="rounded-xl">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div 
            className="group cursor-pointer hover:bg-slate-50 p-1 px-2 rounded-lg -ml-2 transition-colors border border-transparent hover:border-slate-100"
            onClick={() => setIsSettingsOpen(true)}
          >
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 leading-none">{title}</h1>
              <Settings className="w-3 h-3 text-slate-300 group-hover:text-slate-500" />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">/{slug}</span>
              {isHome && <Home className="w-2.5 h-2.5 text-amber-500" />}
              {is404 && <AlertCircle className="w-2.5 h-2.5 text-red-500" />}
              <Badge variant={status === 'published' ? 'success' : 'gray'} className="text-[8px] px-1 py-0 h-3.5 ml-1">
                {status === 'published' ? 'Live' : 'Draft'}
              </Badge>
              {layoutType !== 'full' && (
                <Badge variant="brand" className="text-[8px] px-1 py-0 h-3.5 ml-1">
                  Sidebar
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        {page.type === "product" && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setPageType("custom")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                pageType === "custom" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <LayoutTemplate className="w-3.5 h-3.5" /> Custom Blocks
            </button>
            <button
              onClick={() => setPageType("product")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                pageType === "product" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <FileText className="w-3.5 h-3.5" /> Product Template
            </button>
          </div>
        )}

        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
          {[
            { id: "desktop", icon: Monitor, label: "Desktop" },
            { id: "tablet", icon: Tablet, label: "Tablet" },
            { id: "mobile", icon: Smartphone, label: "Mobile" }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => setViewportMode(mode.id as any)}
              className={cn(
                "p-2 rounded-xl transition-all",
                viewportMode === mode.id ? "bg-white shadow text-primary" : "text-slate-400 hover:text-slate-600"
              )}
              title={mode.label}
            >
              <mode.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {pageType === "custom" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(v => !v)}
              className="rounded-xl gap-2"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "Ẩn Preview" : "Live Preview"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/${slug}`, "_blank")}
            className="rounded-xl"
            disabled={!!previewedVersion}
          >
            View Live
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsHistoryOpen(true)}
            className="rounded-xl gap-2"
            disabled={saving}
          >
            <History className="w-4 h-4" />
            Lịch sử
          </Button>
          <Button 
            onClick={() => savePage()} 
            disabled={saving || !!previewedVersion} 
            className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
          >
            <Save className="w-4 h-4" />
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setTemplateName(title + " Template");
              setIsTemplateModalOpen(true);
            }} 
            className="rounded-xl gap-2 border-primary/20 text-primary hover:bg-primary/5"
            disabled={!!previewedVersion}
          >
            <Copy className="w-4 h-4" />
            Lưu làm Template
          </Button>
        </div>
      </header>

      {/* ── Preview Mode Banner ────────────────────────────────────── */}
      {previewedVersion && (
        <div className="bg-amber-500 text-white px-6 py-3 flex items-center justify-between z-30 shrink-0 shadow-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-bold">
              Bạn đang xem bản preview của phiên bản ngày {new Date(previewedVersion.created_at).toLocaleString("vi-VN")} bởi {previewedVersion.profiles?.full_name || previewedVersion.profiles?.email || "Ẩn danh"}.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl font-bold"
              onClick={() => handleRestoreVersion(previewedVersion)}
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Khôi phục phiên bản này
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-slate-900 hover:bg-slate-50 border-none rounded-xl font-bold"
              onClick={handleExitPreview}
            >
              <X className="w-4 h-4 mr-1.5" />
              Thoát xem trước
            </Button>
          </div>
        </div>
      )}

      {/* ── Body ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {pageType === "custom" && (
          <>
            <div 
              className={cn(
                "overflow-y-auto bg-white border-r border-slate-200 transition-none relative group",
                previewedVersion && "pointer-events-none opacity-75"
              )}
              style={{ width: showPreview ? sidebarWidth : "100%", flexShrink: 0 }}
            >
              {/* Resize Handle */}
              {showPreview && (
                <div 
                  className={cn(
                    "absolute top-0 right-0 w-1.5 h-full cursor-col-resize z-30 transition-colors",
                    isResizing ? "bg-primary" : "hover:bg-slate-200"
                  )}
                  onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
                />
              )}

              <div className="p-6">
                <div className="mb-6 text-slate-900">
                  <h2 className="text-lg font-black">Custom Blocks</h2>
                  <p className="text-xs text-slate-400 mt-1">Thêm, xoá và sắp xếp các block để xây trang theo ý muốn.</p>
                </div>
                <BlockEditor 
                  blocks={blocks} 
                  onChange={setBlocks} 
                  isLocked={!!previewedVersion}
                />
              </div>
            </div>
 
            {showPreview && (
              <div className="flex-1 overflow-y-auto bg-slate-100/50 flex flex-col items-center p-8 scrollbar-hide">
                <div 
                  className={cn(
                    "bg-white shadow-2xl transition-all duration-500 overflow-hidden relative",
                    viewportMode === "desktop" ? "w-full" : 
                    viewportMode === "tablet" ? "w-[768px]" : "w-[390px]"
                  )}
                  style={{ 
                    minHeight: "100%",
                    borderRadius: viewportMode === "desktop" ? "0" : "32px",
                    border: viewportMode === "desktop" ? "none" : "8px solid #1e293b"
                  }}
                >
                  <iframe 
                    ref={iframeRef}
                    src={`/preview-frame/${id}`}
                    className="w-full h-full border-none"
                    onLoad={() => {
                      // Send initial config when iframe loads
                      if (iframeRef.current?.contentWindow) {
                        iframeRef.current.contentWindow.postMessage({
                          type: "UPDATE_PREVIEW",
                          config: previewConfig
                        }, "*");
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {pageType === "product" && (
          <div 
            className={cn(
              "flex-1 overflow-y-auto p-10 max-w-5xl mx-auto w-full",
              previewedVersion && "pointer-events-none opacity-75"
            )}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900">Product Template Editor</h2>
              <p className="text-slate-500 text-sm mt-1">Điền nội dung để tự động tạo trang giới thiệu sản phẩm.</p>
            </div>
            <ProductEditor config={productConfig} onChange={setProductConfig} />
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900">Cấu hình trang</h2>
                <p className="text-xs text-slate-400 mt-0.5">Thiết lập thông tin và giao diện của trang.</p>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[80vh]">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tiêu đề trang</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl h-12" />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Đường dẫn (Alias)</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono">/</span>
                    <Input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""))} className="pl-8 rounded-xl h-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Danh mục trang</Label>
                  <select
                    value={categoryId || ""}
                    onChange={(e) => setCategoryId(e.target.value || null)}
                    className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 ring-primary/20"
                  >
                    <option value="">-- Không có danh mục --</option>
                    {pageCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-xl", status === 'published' ? "bg-green-100 text-green-600" : "bg-white text-slate-300")}>
                        <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                          <div className={cn("w-2 h-2 rounded-full", status === 'published' ? "bg-green-600" : "bg-slate-300")} />
                        </div>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}</p>
                    </div>
                    <Toggle checked={status === 'published'} onChange={(checked) => setStatus(checked ? 'published' : 'draft')} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 text-slate-900">
                      <Home className={cn("w-5 h-5", isHome ? "text-amber-500" : "text-slate-300")} />
                      <p className="text-sm font-bold">Đặt làm Trang chủ</p>
                    </div>
                    <Toggle checked={isHome} onChange={setIsHome} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 text-slate-900">
                      <AlertCircle className={cn("w-5 h-5", is404 ? "text-red-500" : "text-slate-300")} />
                      <p className="text-sm font-bold">Đặt làm Trang 404</p>
                    </div>
                    <Toggle checked={is404} onChange={setIs404} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Bố cục trang (Layout)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'full', icon: Layout, label: 'No Sidebar' },
                      { id: 'left-sidebar', icon: PanelLeft, label: 'Left Sidebar' },
                      { id: 'right-sidebar', icon: PanelRight, label: 'Right Sidebar' },
                      { id: 'double-sidebar', icon: Columns, label: 'Double Side' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setLayoutType(item.id as any)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                          layoutType === item.id ? "border-primary bg-primary/5 text-primary" : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                        )}
                      >
                        <item.icon className="w-6 h-6" />
                        <span className="text-[10px] font-bold">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Gán Sidebar</Label>
                  <div className="grid grid-cols-1 gap-4">
                    {(layoutType === 'left-sidebar' || layoutType === 'double-sidebar') && (
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-400">Sidebar Bên Trái</Label>
                        <select 
                          value={sidebarLeftId || ""} 
                          onChange={(e) => setSidebarLeftId(e.target.value || null)}
                          className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 ring-primary/20"
                        >
                          <option value="">-- Mặc định --</option>
                          {availableSidebars.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                    )}
                    {(layoutType === 'right-sidebar' || layoutType === 'double-sidebar') && (
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-400">Sidebar Bên Phải</Label>
                        <select 
                          value={sidebarRightId || ""} 
                          onChange={(e) => setSidebarRightId(e.target.value || null)}
                          className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 ring-primary/20"
                        >
                          <option value="">-- Mặc định --</option>
                          {availableSidebars.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                    )}
                    {layoutType === 'full' && (
                      <p className="text-[10px] text-slate-400 italic">Chọn kiểu layout có Sidebar để kích hoạt tính năng này.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Hiển thị (Landing Page)</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-sm font-bold text-slate-900">Ẩn Header</p>
                      <Toggle checked={hideHeader} onChange={setHideHeader} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-sm font-bold text-slate-900">Ẩn Footer</p>
                      <Toggle checked={hideFooter} onChange={setHideFooter} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nền trang (Page Background)</Label>
                  <div className="flex bg-slate-100 p-1 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setPageBackground((prev: any) => ({ ...prev, type: "color" }))}
                      className={cn(
                        "flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all",
                        pageBackground.type === "color" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Màu sắc
                    </button>
                    <button
                      type="button"
                      onClick={() => setPageBackground((prev: any) => ({ ...prev, type: "gradient" }))}
                      className={cn(
                        "flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all",
                        pageBackground.type === "gradient" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Gradient
                    </button>
                    <button
                      type="button"
                      onClick={() => setPageBackground((prev: any) => ({ ...prev, type: "image" }))}
                      className={cn(
                        "flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all",
                        pageBackground.type === "image" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Hình ảnh
                    </button>
                  </div>

                  {pageBackground.type === "color" && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-400">Chọn màu nền</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={pageBackground.color || "#ffffff"}
                          onChange={(e) => setPageBackground((prev: any) => ({ ...prev, color: e.target.value }))}
                          className="w-12 h-11 rounded-xl border border-slate-200 cursor-pointer p-1 bg-white shrink-0"
                        />
                        <Input
                          value={pageBackground.color || "#ffffff"}
                          onChange={(e) => setPageBackground((prev: any) => ({ ...prev, color: e.target.value }))}
                          placeholder="#ffffff"
                          className="rounded-xl h-11"
                        />
                      </div>
                    </div>
                  )}

                  {pageBackground.type === "gradient" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-slate-400">Màu bắt đầu</Label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={pageBackground.gradientColor1 || "#ffffff"}
                              onChange={(e) => setPageBackground((prev: any) => ({ ...prev, gradientColor1: e.target.value }))}
                              className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-1 bg-white shrink-0"
                            />
                            <Input
                              value={pageBackground.gradientColor1 || "#ffffff"}
                              onChange={(e) => setPageBackground((prev: any) => ({ ...prev, gradientColor1: e.target.value }))}
                              placeholder="#ffffff"
                              className="rounded-xl h-10 text-xs"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-slate-400">Màu kết thúc</Label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={pageBackground.gradientColor2 || "#000000"}
                              onChange={(e) => setPageBackground((prev: any) => ({ ...prev, gradientColor2: e.target.value }))}
                              className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-1 bg-white shrink-0"
                            />
                            <Input
                              value={pageBackground.gradientColor2 || "#000000"}
                              onChange={(e) => setPageBackground((prev: any) => ({ ...prev, gradientColor2: e.target.value }))}
                              placeholder="#000000"
                              className="rounded-xl h-10 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                          <span>Góc xoay (Angle)</span>
                          <span>{pageBackground.gradientAngle ?? 180}°</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={pageBackground.gradientAngle ?? 180}
                          onChange={(e) => setPageBackground((prev: any) => ({ ...prev, gradientAngle: parseInt(e.target.value) }))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    </div>
                  )}

                  {pageBackground.type === "image" && (
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold text-slate-400">Hình nền trang</Label>
                      <div className="flex gap-2">
                        <Input
                          value={pageBackground.imageUrl || ""}
                          onChange={(e) => setPageBackground((prev: any) => ({ ...prev, imageUrl: e.target.value }))}
                          placeholder="https://example.com/image.png"
                          className="rounded-xl h-11"
                        />
                        <MediaPicker
                          onSelect={(url) => setPageBackground((prev: any) => ({ ...prev, imageUrl: url }))}
                        />
                      </div>
                      {pageBackground.imageUrl && (
                        <div className="relative aspect-video rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 mt-2">
                          <img
                            src={pageBackground.imageUrl}
                            alt="Background Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setPageBackground((prev: any) => ({ ...prev, imageUrl: "" }))}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Button onClick={() => setIsSettingsOpen(false)} className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">Hoàn tất</Button>
            </div>
          </div>
        </div>
      )}

      {/* Save as Template Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Copy className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Lưu làm Template</h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Tạo một bản sao cấu hình trang này để có thể dùng lại nhanh chóng cho các trang sau.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Tên Template</label>
                  <Input 
                    autoFocus
                    placeholder="Ví dụ: Landing Page Sản phẩm Template" 
                    className="h-14 rounded-2xl border-slate-200 focus:border-primary transition-all text-lg font-bold"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 flex gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setIsTemplateModalOpen(false)}
                className="flex-1 rounded-xl font-bold text-slate-500"
              >
                Huỷ bỏ
              </Button>
              <Button 
                onClick={saveAsTemplate}
                disabled={savingTemplate}
                className="flex-[2] rounded-xl font-bold shadow-lg shadow-primary/20"
              >
                {savingTemplate ? "Đang lưu..." : "Xác nhận lưu"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      <PageHistoryModal
        pageId={id}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onPreviewVersion={handlePreviewVersion}
        onRestoreVersion={handleRestoreVersion}
        activeVersionId={previewedVersion?.id || null}
      />
    </div>
  );
}
