"use client";
import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { ImageGalleryData } from "../definition";

export function ImageGallerySaaS({ data, isDark }: { data: ImageGalleryData; isDark?: boolean }) {
  const [selected, setSelected] = useState<number|null>(null);
  const [cat, setCat] = useState<string|null>(null);
  const categories = useMemo(() => [...new Set((data.images??[]).map(i=>i.category).filter(Boolean))] as string[], [data.images]);
  const filtered = useMemo(() => cat ? (data.images??[]).filter(i=>i.category===cat) : (data.images??[]), [data.images, cat]);
  const cols = data.columns ?? 3;
  const imgCount = filtered.length;
  const gridCols: Record<number,string> = {
    2: imgCount === 1 ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 md:grid-cols-2",
    3: imgCount === 1 ? "grid-cols-1 max-w-md mx-auto" : imgCount === 2 ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: imgCount === 1 ? "grid-cols-1 max-w-md mx-auto" : imgCount === 2 ? "grid-cols-2 max-w-4xl mx-auto" : imgCount === 3 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-3 max-w-5xl mx-auto" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  };

  return (
    <div className="max-w-6xl mx-auto">
      {data.title && <h2 className={cn("text-3xl md:text-4xl mb-8 text-center", isDark?"text-white":"text-[var(--secondary)]")}>{data.title}</h2>}
      {data.showFilter && categories.length > 0 && (
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          <button onClick={() => setCat(null)} className={cn("px-4 py-2 text-sm font-bold transition-all", !cat?"bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20":(isDark?"bg-white/10 text-white/80 hover:bg-white/20":"bg-slate-100 text-slate-700 hover:bg-slate-200"))} style={{ borderRadius: "var(--radius-md)" }}>Tất cả</button>
          {categories.map(c => <button key={c} onClick={() => setCat(c)} className={cn("px-4 py-2 text-sm font-bold transition-all", cat===c?"bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20":(isDark?"bg-white/10 text-white/80 hover:bg-white/20":"bg-slate-100 text-slate-700 hover:bg-slate-200"))} style={{ borderRadius: "var(--radius-md)" }}>{c}</button>)}
        </div>
      )}
      <div className={cn("grid gap-4", gridCols[cols])}>
        {filtered.map((img, i) => (
          <button key={i} onClick={() => data.enableLightbox && setSelected(i)} className="relative h-52 overflow-hidden group shadow-[var(--shadow-md)]" style={{ borderRadius: "var(--radius-lg)" }}>
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all" />
            {data.enableLightbox && <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-3xl">🔍</div>}
            {img.caption && <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3"><p className="text-white text-sm">{img.caption}</p></div>}
          </button>
        ))}
      </div>
      {data.enableLightbox && selected !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={filtered[selected].src} alt={filtered[selected].alt} className="w-full h-auto" style={{ borderRadius: "var(--radius-lg)" }} />
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-white text-2xl bg-black/50 w-12 h-12 rounded-full flex items-center justify-center hover:bg-[var(--primary)] transition-colors">×</button>
            <button onClick={() => setSelected(s => s! > 0 ? s!-1 : filtered.length-1)} className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl bg-black/50 w-12 h-12 rounded-full flex items-center justify-center hover:bg-[var(--primary)] transition-colors">‹</button>
            <button onClick={() => setSelected(s => s! < filtered.length-1 ? s!+1 : 0)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl bg-black/50 w-12 h-12 rounded-full flex items-center justify-center hover:bg-[var(--primary)] transition-colors">›</button>
            {filtered[selected].caption && <p className="text-white text-center mt-6 text-lg font-medium">{filtered[selected].caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
