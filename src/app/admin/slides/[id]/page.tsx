"use client";

import React, { useEffect, useState, useRef, use } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import {
  Save, ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown,
  Presentation, ExternalLink, Settings, X, Copy,
  Maximize2, Layers
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { PageBlock } from "@/lib/cms/block-system/types";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Toggle } from "@/components/ui/Toggle";
import { Badge } from "@/components/ui/Badge";
import {
  renderBlockEditor,
  renderBlockRenderer,
  getBlockDefaultData,
  getBlockDefinition,
  MASTER_BLOCK_REGISTRY,
} from "@/lib/cms/block-system/registry";
import { BlockSettingsEditor } from "@/components/cms/block-editors/shared";
import { SlideCanvas } from "@/components/cms/SlideCanvas";
import { motion, AnimatePresence } from "framer-motion";

// Blocks that work well in 16:9 slide format
const SLIDE_ALLOWED_BLOCK_TYPES = [
  "hero",
  "heroCentered",
  "heroSecondary",
  "richText",
  "cta",
  "stats",
  "countUpStats",
  "process",
  "timeline",
  "quoteHighlight",
  "featureIconGrid",
  "bentoGrid",
  "testimonials",
  "compareTable",
  "imageGallery",
  "trustedBy",
  "faq",
  "pricing",
  "teamGrid",
  "cardCarousel",
  "suitableFor",
  "verticalTabs",
  "horizontalTabs",
  "beforeAfter",
  "featureChecklist",
  "caseStudy",
  "integrationsHub",
  "reviewBadges",
  "blogPreview",
  "slideGrid"
];

const SLIDE_BLOCKS = MASTER_BLOCK_REGISTRY.filter((b) =>
  SLIDE_ALLOWED_BLOCK_TYPES.includes(b.type)
);

export default function SlideEditor() {
  const { id } = useParams() as { id: string };

  const [slide, setSlide] = useState<any>(null);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [showPicker, setShowPicker] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<"content" | "design">("content");

  const lastSavedRef = useRef<string>("");

  useEffect(() => {
    fetchSlide();
  }, [id]);

  async function fetchSlide() {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        const initialBlocks = data.content_config?.blocks || [];
        setSlide(data);
        setBlocks(initialBlocks);
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setStatus(data.status || "draft");
        setActiveSlideIndex(initialBlocks.length > 0 ? 0 : -1);

        lastSavedRef.current = JSON.stringify({
          title: data.title,
          slug: data.slug,
          status: data.status,
          blocks: initialBlocks,
        });
      }
    } catch (err: any) {
      console.error("Error fetching slide:", err);
      toast.error("Không thể tải dữ liệu slide");
    }
  }

  async function saveSlide(silent = false) {
    if (!silent) setSaving(true);

    const configToSave = { blocks };

    const { error } = await supabase
      .from("pages")
      .update({
        title,
        slug,
        status,
        content_config: configToSave,
        type: "slide",
        layout_type: "full",
        hide_header: true,
        hide_footer: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      if (!silent) toast.error("Có lỗi xảy ra: " + error.message);
    } else {
      if (!silent) toast.success("Đã lưu bài thuyết trình!");
      lastSavedRef.current = JSON.stringify({
        title,
        slug,
        status,
        blocks,
      });
    }
    if (!silent) setSaving(false);
  }

  // Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      if (saving || !slide) return;
      const currentData = JSON.stringify({ title, slug, status, blocks });
      if (currentData !== lastSavedRef.current) {
        console.log("Auto-saving slide...");
        saveSlide(true);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [title, slug, status, blocks, saving, slide]);

  // Block operations
  const addBlock = (type: string) => {
    const newBlocks = [
      ...blocks,
      { type, data: getBlockDefaultData(type) },
    ];
    setBlocks(newBlocks);
    setActiveSlideIndex(newBlocks.length - 1);
    setShowPicker(false);
  };

  const deleteBlock = (index: number) => {
    const next = blocks.filter((_, i) => i !== index);
    setBlocks(next);
    if (activeSlideIndex >= next.length) {
      setActiveSlideIndex(Math.max(0, next.length - 1));
    }
  };

  const duplicateBlock = (index: number) => {
    const next = [...blocks];
    next.splice(index + 1, 0, JSON.parse(JSON.stringify(blocks[index])));
    setBlocks(next);
    setActiveSlideIndex(index + 1);
  };

  const moveBlock = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    setBlocks(next);
    setActiveSlideIndex(target);
  };

  const updateBlockData = (index: number, data: any) => {
    const next = [...blocks];
    next[index] = { ...next[index], data };
    setBlocks(next);
  };

  const currentBlock = blocks[activeSlideIndex];
  const currentBlockDef = currentBlock
    ? getBlockDefinition(currentBlock.type)
    : null;

  if (!slide) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-medium">Đang tải editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/admin/slides">
            <Button variant="ghost" size="sm" className="rounded-xl">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div
            className="group cursor-pointer hover:bg-slate-50 p-1 px-2 rounded-lg -ml-2 transition-colors border border-transparent hover:border-slate-100"
            onClick={() => setIsSettingsOpen(true)}
          >
            <div className="flex items-center gap-2">
              <Presentation className="w-4 h-4 text-violet-500" />
              <h1 className="text-base font-black text-slate-900 leading-none">
                {title}
              </h1>
              <Settings className="w-3 h-3 text-slate-300 group-hover:text-slate-500" />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                {blocks.length} slides
              </span>
              <Badge
                variant={status === "published" ? "success" : "gray"}
                className="text-[8px] px-1 py-0 h-3.5 ml-1"
              >
                {status === "published" ? "Live" : "Draft"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/presentation/${id}`, "_blank")}
            className="rounded-xl gap-2 font-bold"
          >
            <ExternalLink className="w-4 h-4" />
            Xem trình chiếu
          </Button>
          <Button
            onClick={() => saveSlide()}
            disabled={saving}
            className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
          >
            <Save className="w-4 h-4" />
            {saving ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </header>

      {/* ── Body: 3-column layout ───────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Slide Thumbnails */}
        <div className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Slides ({blocks.length})
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {blocks.map((block, i) => {
              const def = getBlockDefinition(block.type);
              const isActive = i === activeSlideIndex;
              return (
                <div
                  key={`slide-${i}`}
                  onClick={() => {
                    setActiveSlideIndex(i);
                    setActiveEditorTab("content");
                  }}
                  className={cn(
                    "w-full rounded-xl border-2 transition-all text-left group relative cursor-pointer",
                    isActive
                      ? "border-violet-500 bg-violet-50 shadow-md shadow-violet-500/10"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
                  )}
                >
                  {/* Slide number */}
                  <div className="px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          isActive ? "text-violet-600" : "text-slate-400"
                        )}
                      >
                        Slide {i + 1}
                      </span>
                      {/* Mini actions on hover */}
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); moveBlock(i, -1); }}
                          disabled={i === 0}
                          className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-20"
                        >
                          <ChevronUp className="w-3 h-3 text-slate-500" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveBlock(i, 1); }}
                          disabled={i === blocks.length - 1}
                          className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-20"
                        >
                          <ChevronDown className="w-3 h-3 text-slate-500" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); duplicateBlock(i); }}
                          className="p-0.5 rounded hover:bg-slate-200"
                        >
                          <Copy className="w-3 h-3 text-slate-500" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteBlock(i); }}
                          className="p-0.5 rounded hover:bg-red-100"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p
                      className={cn(
                        "text-xs font-bold truncate mt-0.5",
                        isActive ? "text-violet-900" : "text-slate-600"
                      )}
                    >
                      {def?.label || block.type}
                    </p>
                  </div>
                  {/* Mini aspect-video preview placeholder */}
                  <div
                    className={cn(
                      "mx-2 mb-2 aspect-video rounded-lg border overflow-hidden flex items-center justify-center",
                      isActive
                        ? "bg-violet-100/50 border-violet-200"
                        : "bg-slate-50 border-slate-100"
                    )}
                  >
                    <span className="text-lg">
                      {def?.label.split(" ")[0] || "📦"}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Add Slide Button */}
            <button
              onClick={() => setShowPicker(true)}
              className="w-full rounded-xl border-2 border-dashed border-slate-200 hover:border-violet-400 py-4 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-violet-500 transition-all hover:bg-violet-50/50 group"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Thêm slide
              </span>
            </button>
          </div>
        </div>

        {/* CENTER: Canvas Preview */}
        <div className="flex-1 overflow-y-auto flex items-start justify-center p-8 bg-slate-100/80">
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-6">
                <Layers className="w-12 h-12 text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Bắt đầu tạo thuyết trình
              </h3>
              <p className="text-sm text-slate-400 mb-6 max-w-sm">
                Thêm slide đầu tiên bằng cách chọn một block phù hợp từ thư
                viện.
              </p>
              <Button
                onClick={() => setShowPicker(true)}
                className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
              >
                <Plus className="w-4 h-4" />
                Thêm slide đầu tiên
              </Button>
            </div>
          ) : currentBlock ? (
            <div className="w-full max-w-5xl">
              {/* Slide frame */}
              <div className="bg-white rounded-2xl shadow-2xl shadow-slate-300/50 overflow-hidden border border-slate-200/50">
                {/* Slide title bar */}
                <div className="bg-slate-50 px-4 py-2 flex items-center justify-between border-b border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Slide {activeSlideIndex + 1} / {blocks.length} — {currentBlockDef?.label}
                  </span>
                  <button
                    onClick={() => window.open(`/presentation/${id}`, "_blank")}
                    className="p-1 rounded-lg hover:bg-slate-200 transition-colors"
                    title="Xem toàn màn hình"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
                {/* Content with virtual canvas scaling */}
                <SlideCanvas>
                  {renderBlockRenderer(currentBlock, activeSlideIndex)}
                </SlideCanvas>
              </div>
            </div>
          ) : null}
        </div>

        {/* RIGHT: Block Editor */}
        {currentBlock && (
          <div className="w-[400px] bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-slate-900">
                  {currentBlockDef?.label || currentBlock.type}
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Slide {activeSlideIndex + 1}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-1">
              <button
                onClick={() => setActiveEditorTab("content")}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-black transition-all",
                  activeEditorTab === "content"
                    ? "bg-violet-50 text-violet-600"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                Nội dung
              </button>
              <button
                onClick={() => setActiveEditorTab("design")}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-black transition-all",
                  activeEditorTab === "design"
                    ? "bg-violet-50 text-violet-600"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                Thiết kế
              </button>
            </div>

            {/* Editor content */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {activeEditorTab === "content" ? (
                renderBlockEditor(currentBlock, (data) =>
                  updateBlockData(activeSlideIndex, data)
                )
              ) : (
                <BlockSettingsEditor
                  settings={currentBlock.data.settings || {}}
                  onChange={(s) =>
                    updateBlockData(activeSlideIndex, {
                      ...currentBlock.data,
                      settings: s,
                    })
                  }
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Block Picker Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {showPicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPicker(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[32px] shadow-2xl z-[101] overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Thêm Slide mới
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Chọn loại block phù hợp cho slide thuyết trình
                  </p>
                </div>
                <button
                  onClick={() => setShowPicker(false)}
                  className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SLIDE_BLOCKS.map((reg) => (
                    <button
                      key={reg.type}
                      onClick={() => addBlock(reg.type)}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/10 transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-violet-50 flex items-center justify-center text-2xl transition-colors shrink-0">
                        {reg.label.split(" ")[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                          {reg.label.split(" ").slice(1).join(" ")}
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed mt-0.5 line-clamp-2">
                          {reg.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Slide-Optimized Block Library
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Settings Modal ──────────────────────────────────────────── */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Cấu hình thuyết trình
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Thiết lập thông tin bài thuyết trình.
                </p>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tiêu đề
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl h-12"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Đường dẫn (Slug)
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono">
                    /
                  </span>
                  <Input
                    value={slug}
                    onChange={(e) =>
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/ /g, "-")
                          .replace(/[^\w-]+/g, "")
                      )
                    }
                    className="pl-8 rounded-xl h-12"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-xl",
                      status === "published"
                        ? "bg-green-100 text-green-600"
                        : "bg-white text-slate-300"
                    )}
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          status === "published"
                            ? "bg-green-600"
                            : "bg-slate-300"
                        )}
                      />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {status === "published" ? "Đã xuất bản" : "Bản nháp"}
                  </p>
                </div>
                <Toggle
                  checked={status === "published"}
                  onChange={(checked) =>
                    setStatus(checked ? "published" : "draft")
                  }
                />
              </div>
            </div>

            <div className="px-8 pb-8">
              <Button
                onClick={() => setIsSettingsOpen(false)}
                className="w-full rounded-xl h-12 font-bold"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
