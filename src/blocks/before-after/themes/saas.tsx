"use client";
import React, { useState, useRef } from "react";
import type { BeforeAfterData } from "../definition";

export function BeforeAfterSaaS({ data, isDark }: { data: BeforeAfterData; isDark?: boolean }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const calc = (clientX: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {data.title && <h2 className={`text-3xl md:text-4xl mb-8 text-center ${isDark?"text-white":"text-[var(--secondary)]"}`}>{data.title}</h2>}
      <div ref={ref} onMouseMove={e => calc(e.clientX)} onTouchMove={e => calc(e.touches[0].clientX)}
        className="relative w-full overflow-hidden cursor-ew-resize select-none" style={{aspectRatio:"16/9", borderRadius: "var(--radius-md)"}}>
        <img src={data.afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 overflow-hidden" style={{width:`${pos}%`}}>
          <img src={data.beforeImage} alt="Before" className="h-full object-cover" style={{width:`${(100/pos)*100}%`,minWidth:"100%"}} />
        </div>
        <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg" style={{left:`${pos}%`,transform:"translateX(-50%)"}}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 shadow-lg flex items-center justify-center text-[var(--secondary)] font-bold text-sm select-none">⟨⟩</div>
        </div>
        {data.beforeLabel && <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded-[var(--radius)] text-sm font-bold backdrop-blur">{data.beforeLabel}</div>}
        {data.afterLabel  && <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-[var(--radius)] text-sm font-bold backdrop-blur">{data.afterLabel}</div>}
      </div>
      <p className={`text-center mt-3 text-sm ${isDark?"text-white/40":"text-[var(--secondary)]/40"}`}>Kéo để so sánh</p>
    </div>
  );
}
