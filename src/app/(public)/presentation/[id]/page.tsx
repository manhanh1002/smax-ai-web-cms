"use client";

import React, { useEffect, useState, useCallback, useRef, use } from "react";
import { supabase } from "@/lib/supabase";
import { renderBlockRenderer } from "@/lib/cms/block-system/registry";
import type { PageBlock } from "@/lib/cms/block-system/types";
import { SlideCanvas } from "@/components/cms/SlideCanvas";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  Home,
} from "lucide-react";

// Slide transition variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export default function PresentationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [title, setTitle] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Touch handling
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    fetchPresentation();
  }, [id]);

  async function fetchPresentation() {
    // Try fetching by ID first (UUID format)
    let data: any = null;
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id
      );

    if (isUUID) {
      const res = await supabase
        .from("pages")
        .select("*")
        .eq("id", id)
        .eq("type", "slide")
        .single();
      data = res.data;
    }

    // Fallback to slug
    if (!data) {
      const res = await supabase
        .from("pages")
        .select("*")
        .eq("slug", id)
        .eq("type", "slide")
        .single();
      data = res.data;
    }

    if (data) {
      setBlocks(data.content_config?.blocks || []);
      setTitle(data.title || "Presentation");
    }
    setLoading(false);
  }

  // Navigate slides
  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= blocks.length) return;
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex, blocks.length]
  );

  const nextSlide = useCallback(() => {
    if (currentIndex < blocks.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, blocks.length]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          prevSlide();
          break;
        case "Home":
          e.preventDefault();
          goToSlide(0);
          break;
        case "End":
          e.preventDefault();
          goToSlide(blocks.length - 1);
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          if (isFullscreen) {
            document.exitFullscreen?.();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, goToSlide, blocks.length, isFullscreen]);

  // Touch/swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;

    // Only handle horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX < 0) nextSlide();
      else prevSlide();
    }
    touchStartRef.current = null;
  };

  // Fullscreen
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [resetHideTimer]);

  // PDF export via browser print
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-700 border-t-white rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">
            Đang tải thuyết trình...
          </p>
        </div>
      </div>
    );
  }

  if (blocks.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-black mb-2">
            Bài thuyết trình trống
          </h1>
          <p className="text-slate-400">
            Chưa có slide nào được thêm vào bài thuyết trình này.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          /* Hide non-printable elements */
          .presentation-controls,
          .slide-progress-bar,
          .presentation-nav-area {
            display: none !important;
          }

          /* Reset body */
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          /* Show the print-only container */
          .print-slides-container {
            display: block !important;
          }
          .presentation-live-view {
            display: none !important;
          }

          /* Each slide fills exactly one page */
          .print-slide-page {
            page-break-after: always;
            break-after: page;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            position: relative;
          }
          .print-slide-page:last-child {
            page-break-after: auto;
          }

          @page {
            size: landscape;
            margin: 0;
          }
        }

        @media screen {
          .print-slides-container {
            display: none !important;
          }
        }
      `}</style>

      {/* ── PRINT-ONLY: All slides stacked ────────────────────── */}
      <div className="print-slides-container">
        {blocks.map((block, i) => (
          <div key={`print-${i}`} className="print-slide-page">
            <SlideCanvas className="w-full" style={{ width: "100vw", height: "100vh" }}>
              {renderBlockRenderer(block, i)}
            </SlideCanvas>
          </div>
        ))}
      </div>

      {/* ── SCREEN-ONLY: Interactive Presentation ─────────────── */}
      <div
        ref={containerRef}
        className="presentation-live-view min-h-screen bg-slate-900 flex flex-col relative select-none"
        onMouseMove={resetHideTimer}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Progress bar at top */}
        <div className="slide-progress-bar absolute top-0 left-0 right-0 h-1 bg-slate-800 z-30">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
            animate={{
              width: `${((currentIndex + 1) / blocks.length) * 100}%`,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>

        {/* Main slide area */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Click navigation areas */}
          <button
            onClick={prevSlide}
            className="presentation-nav-area absolute left-0 top-0 bottom-0 w-1/5 z-10 cursor-w-resize opacity-0"
            aria-label="Previous slide"
          />
          <button
            onClick={nextSlide}
            className="presentation-nav-area absolute right-0 top-0 bottom-0 w-1/5 z-10 cursor-e-resize opacity-0"
            aria-label="Next slide"
          />

          {/* Slide content */}
          <div className="w-full h-full max-w-[100vw] max-h-[100vh] relative">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="w-full h-full"
              >
                <div className="w-full h-full flex items-center justify-center p-2">
                  <SlideCanvas className="w-full max-w-[177.78vh] bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-700/50">
                    {renderBlockRenderer(blocks[currentIndex], currentIndex)}
                  </SlideCanvas>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Floating control bar */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="presentation-controls absolute bottom-6 left-1/2 -translate-x-1/2 z-30"
            >
              <div className="flex items-center gap-1 bg-slate-800/90 backdrop-blur-xl rounded-2xl px-2 py-1.5 shadow-2xl shadow-black/50 border border-slate-700/50">
                {/* Go to start */}
                <button
                  onClick={() => goToSlide(0)}
                  disabled={currentIndex === 0}
                  className="p-2 rounded-xl hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 transition-all"
                  title="Trang đầu"
                >
                  <Home className="w-4 h-4" />
                </button>

                {/* Previous */}
                <button
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className="p-2 rounded-xl hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 transition-all"
                  title="Slide trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Slide indicator */}
                <div className="px-3 py-1 min-w-[80px] text-center">
                  <span className="text-xs font-black text-white tabular-nums">
                    {currentIndex + 1}
                  </span>
                  <span className="text-xs text-slate-500 font-bold mx-1">
                    /
                  </span>
                  <span className="text-xs font-bold text-slate-400 tabular-nums">
                    {blocks.length}
                  </span>
                </div>

                {/* Next */}
                <button
                  onClick={nextSlide}
                  disabled={currentIndex === blocks.length - 1}
                  className="p-2 rounded-xl hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 transition-all"
                  title="Slide sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Separator */}
                <div className="w-px h-6 bg-slate-700 mx-1" />

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                  title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>

                {/* Download PDF */}
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-xl hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                  title="Tải PDF (In)"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {/* Slide dots */}
              {blocks.length <= 20 && (
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  {blocks.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === currentIndex
                          ? "w-6 h-2 bg-white"
                          : "w-2 h-2 bg-slate-600 hover:bg-slate-500"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title overlay (top-left, fades out) */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="presentation-controls absolute top-4 left-4 z-30"
            >
              <p className="text-xs font-bold text-slate-500 bg-slate-800/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                {title}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
