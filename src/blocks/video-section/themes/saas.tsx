"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { VideoSectionData } from "../definition";
import { SectionTitle } from "../../SectionTitle";

function getEmbed(url: string) {
  const yt = url.match(/(?:youtu\.be\/|watch\?v=|embed\/)([^#&?]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
  return url;
}

export function VideoSectionSaaS({ data, isDark }: { data: VideoSectionData; isDark?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const isSplit = data.layout === "split";
  const embedUrl = getEmbed(data.videoUrl);

  const VideoBox = (
    <div className={cn("relative overflow-hidden bg-black shadow-[var(--shadow-lg)]", isSplit ? "flex-1" : "w-full max-w-4xl mx-auto")} style={{ aspectRatio: "16/9", borderRadius: "var(--radius-lg)" }}>
      {playing ? (
        <iframe src={embedUrl} className="w-full h-full" frameBorder="0" allow="autoplay;fullscreen" allowFullScreen />
      ) : (
        <>
          {data.thumbnailUrl && <img src={data.thumbnailUrl} alt={data.title} className="absolute inset-0 w-full h-full object-cover opacity-80" />}
          <button onClick={() => setPlaying(true)} className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-all group">
            <div className="w-24 h-24 rounded-full bg-[var(--primary)]/20 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-white/20">
              <div className="w-20 h-20 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-[0_0_50px_rgba(var(--primary-rgb),0.5)]">
                <div className="w-0 h-0 ml-2" style={{borderLeft:"24px solid white",borderTop:"14px solid transparent",borderBottom:"14px solid transparent"}} />
              </div>
            </div>
          </button>
        </>
      )}
    </div>
  );

  const TextBox = (data.title || data.titleHighlight || data.description) ? (
    <div className={isSplit ? "flex-1" : "w-full"}>
      <SectionTitle 
        title={data.title}
        titleHighlight={data.titleHighlight}
        subtitle={data.description}
        isDark={isDark}
        align={isSplit ? "left" : "center"}
        className="mb-0"
      />
    </div>
  ) : null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className={cn("flex gap-8 items-center", isSplit ? "flex-col md:flex-row" : "flex-col")}>
        {VideoBox}
        {TextBox}
      </div>
    </div>
  );
}
