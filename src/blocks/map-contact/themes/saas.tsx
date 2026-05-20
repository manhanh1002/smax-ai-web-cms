import React from "react";
import { cn } from "@/lib/utils";
import type { MapContactData } from "../definition";

export function MapContactSaaS({ data, isDark }: { data: MapContactData; isDark?: boolean }) {
  const isSplit = data.layout !== "full-width";
  return (
    <div className="max-w-6xl mx-auto">
      {data.title && <h2 className={cn("text-3xl md:text-4xl mb-10 text-center", isDark?"text-white":"text-[var(--secondary)]")}>{data.title}</h2>}
      <div className={cn("flex gap-8", isSplit?(data.layout==="map-right"?"flex-col md:flex-row-reverse":"flex-col md:flex-row"):"flex-col")}>
        <div className={cn("overflow-hidden shadow-[var(--shadow-lg)]", isSplit?"md:flex-1":"w-full")} style={{ borderRadius: "var(--radius-md)" }}>
          {data.mapEmbedUrl
            ? <iframe src={data.mapEmbedUrl} width="100%" height="500" style={{border:0}} allowFullScreen loading="lazy" className="w-full h-full min-h-[400px]" />
            : <div className={cn("flex items-center justify-center min-h-[400px] text-sm", isDark?"bg-white/5 text-white/40":"bg-slate-100 text-slate-500")}>Nhập Google Maps Embed URL trong editor</div>
          }
        </div>
        <div className={cn("space-y-6", isSplit?"md:flex-1":"")}>
          {(data.offices??[]).map((office, i) => (
            <div key={i} className={cn("p-6 border shadow-[var(--shadow-md)]", isDark?"bg-white/5 border-white/10":"bg-white border-slate-200")} style={{ borderRadius: "var(--radius-md)" }}>
              <h3 className={cn("font-bold text-base mb-4", isDark?"text-white":"text-[var(--secondary)]")}>{office.name}</h3>
              <div className="space-y-2.5 text-sm">
                {office.address && <div className="flex items-start gap-2"><span className="text-lg mt-0.5">📍</span><span className={isDark?"text-white/60":"text-[var(--secondary)]/60"}>{office.address}</span></div>}
                {office.phone && <div className="flex items-start gap-2"><span className="text-lg mt-0.5">☎️</span><a href={`tel:${office.phone}`} className={cn("font-bold text-[var(--primary)] hover:underline")}>{office.phone}</a></div>}
                {office.email && <div className="flex items-start gap-2"><span className="text-lg mt-0.5">✉️</span><a href={`mailto:${office.email}`} className={cn("font-bold text-[var(--primary)] hover:underline")}>{office.email}</a></div>}
                {office.hours && <div className="flex items-start gap-2"><span className="text-lg mt-0.5">🕐</span><span className={isDark?"text-white/60":"text-[var(--secondary)]/60"}>{office.hours}</span></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
