"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, BadgeCheck, Zap, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormRenderer } from "@/components/sections/FormRenderer";

interface PopupRendererProps {
  popup: any;
  preview?: boolean;
  onClose?: () => void;
  onConvert?: () => void;
}

// ─── Pricing Deal Badge ────────────────────────────────────────
function PricingDealBadge({ col, primaryColor }: { col: any; primaryColor?: string }) {
  const color = primaryColor || "#3b82f6";
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
      {col.badge && (
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs font-black uppercase tracking-widest shadow-lg"
          style={{ backgroundColor: color }}>
          <Zap className="w-3.5 h-3.5" />
          {col.badge}
        </div>
      )}
      {col.original_price && (
        <p className="text-slate-400 text-sm font-bold line-through">{col.original_price}</p>
      )}
      {col.sale_price && (
        <div className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5" style={{ color }} />
          <p className="text-4xl font-black" style={{ color }}>{col.sale_price}</p>
        </div>
      )}
      {col.description && (
        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{col.description}</p>
      )}
      {col.highlights?.length > 0 && (
        <ul className="space-y-1.5 text-left w-full max-w-xs">
          {col.highlights.map((h: string, i: number) => (
            <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <BadgeCheck className="w-4 h-4 shrink-0" style={{ color }} />
              {h}
            </li>
          ))}
        </ul>
      )}
      {col.cta_label && (
        <button className="w-full py-3 rounded-2xl text-white text-sm font-black uppercase tracking-widest shadow-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: color }}>
          {col.cta_label}
        </button>
      )}
    </div>
  );
}

// ─── Column renderer ───────────────────────────────────────────
function ColContent({ col, popup, onConvert }: { col: any; popup: any; onConvert?: () => void }) {
  const primaryColor = popup.settings?.theme?.primary_color;

  if (col.type === "form") {
    return (
      <div className="space-y-4 p-6">
        {col.heading && <h3 className="text-xl font-black text-slate-900 tracking-tight">{col.heading}</h3>}
        {col.subheading && <p className="text-sm text-slate-500 leading-relaxed">{col.subheading}</p>}
        {col.form_id ? (
          <FormRenderer
            formId={col.form_id}
            onSuccess={onConvert}
          />
        ) : (
          <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-sm font-bold">
            Chưa chọn Form
          </div>
        )}
      </div>
    );
  }

  if (col.type === "image") {
    return (
      <div className="h-full min-h-[200px] overflow-hidden">
        {col.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={col.image_url}
            alt={col.image_alt || ""}
            className="w-full h-full"
            style={{ objectFit: col.object_fit || "cover" }}
          />
        ) : (
          <div className="w-full h-full min-h-[200px] bg-slate-100 flex items-center justify-center text-slate-400 text-sm font-bold">
            Chưa có ảnh
          </div>
        )}
      </div>
    );
  }

  if (col.type === "pricing_deal") {
    return <PricingDealBadge col={col} primaryColor={primaryColor} />;
  }

  if (col.type === "text") {
    return (
      <div className="p-6 space-y-3">
        {col.heading && <h3 className="text-xl font-black text-slate-900">{col.heading}</h3>}
        {col.body && <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{col.body}</p>}
      </div>
    );
  }

  return null;
}

// ─── Animation variants ────────────────────────────────────────
function getVariants(animation: string) {
  switch (animation) {
    case "slide-up":    return { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } };
    case "slide-right": return { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } };
    case "zoom":        return { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } };
    default:            return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  }
}

// ─── Width map ─────────────────────────────────────────────────
const WIDTH_MAP: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

// ─── Main Renderer ─────────────────────────────────────────────
export function PopupRenderer({ popup, preview = false, onClose, onConvert }: PopupRendererProps) {
  const s = popup.settings || {};
  const c = popup.content || {};
  const cols: any[] = c.cols || [];
  const is2col = c.layout === "2col" && cols.length >= 2;
  const primaryColor = s.theme?.primary_color || "#3b82f6";
  const bgColor = s.theme?.bg_color || "#ffffff";
  const variants = getVariants(s.animation || "fade");
  const widthClass = WIDTH_MAP[s.width || "md"] || "max-w-lg";
  const radiusClass = s.corner_radius === "none" ? "rounded-none" : s.corner_radius === "md" ? "rounded-2xl" : s.corner_radius === "full" ? "rounded-[32px]" : "rounded-3xl";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={variants}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "w-full shadow-2xl overflow-hidden relative",
        widthClass,
        radiusClass,
        preview && "shadow-xl"
      )}
      style={{ backgroundColor: bgColor }}
    >
      {/* Close button */}
      {s.show_close !== false && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>
      )}

      {/* Content */}
      {is2col ? (
        <div className="grid grid-cols-2">
          <ColContent col={cols[0]} popup={popup} onConvert={onConvert} />
          <ColContent col={cols[1]} popup={popup} onConvert={onConvert} />
        </div>
      ) : (
        <ColContent col={cols[0] || {}} popup={popup} onConvert={onConvert} />
      )}

      {/* Accent line */}
      <div className="h-1 w-full" style={{ backgroundColor: primaryColor }} />
    </motion.div>
  );
}
