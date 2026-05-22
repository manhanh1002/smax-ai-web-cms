"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const VIRTUAL_W = 1280;
const VIRTUAL_H = 720;

interface SlideCanvasProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * SlideCanvas renders children inside a fixed 1920×1080 virtual canvas,
 * then uses CSS transform: scale() to shrink it to fit the actual container.
 * This ensures block content always fits within a 16:9 frame without scrollbars.
 */
export function SlideCanvas({ children, className, style }: SlideCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect;
      if (width > 0) {
        setScale(width / VIRTUAL_W);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{
        aspectRatio: "16 / 9",
        overflow: "hidden",
        ...style,
      }}
    >
      <style>{`
        .virtual-canvas-inner > section,
        .virtual-canvas-inner > div {
          width: 100% !important;
          height: 100% !important;
          min-width: 100% !important;
          min-height: 100% !important;
          max-width: none !important;
          max-height: none !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
        }
      `}</style>
      <div
        className="virtual-canvas-inner"
        style={{
          width: VIRTUAL_W,
          height: VIRTUAL_H,
          maxWidth: "none",
          maxHeight: "none",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
