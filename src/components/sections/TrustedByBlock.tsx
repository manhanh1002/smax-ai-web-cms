"use client";
import Marquee from "@/components/magicui/marquee";

export interface TrustedByBlockData {
  label?: string;
  highlight?: string;
  logos: string[];
  darkMode?: boolean;
}

export function TrustedByBlock({ data }: { data: TrustedByBlockData }) {
  const isDark = data.darkMode === true;
  if (!data.logos?.length) return null;

  return (
    <section className={cn(
      "py-14 border-y transition-colors duration-300",
      isDark ? "bg-[#0B1229] border-white/5" : "bg-white border-slate-100"
    )}>
      <div className="max-w-6xl mx-auto px-6">
        <p className={cn(
          "text-center text-sm font-bold mb-8",
          isDark ? "text-white" : "text-[#0F1836]"
        )}>
          {data.label || "Được tin dùng bởi"}{" "}
          <span className="text-[#fa6e5b]">{data.highlight || "+20,000 doanh nghiệp"}</span> toàn cầu:
        </p>
        <Marquee pauseOnHover className="[--duration:40s]">
          {data.logos.map((logo, i) => (
            <div
              key={i}
              className={cn(
                "mx-8 h-9 flex items-center justify-center grayscale hover:grayscale-0 transition-all",
                isDark ? "invert opacity-40 hover:opacity-80" : "opacity-50 hover:opacity-100"
              )}
            >
              <img src={logo} alt="" className="h-full w-auto object-contain" />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";
