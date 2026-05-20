import React from "react";
import { cn } from "@/lib/utils";

export interface SocialLink {
  platform: "linkedin" | "twitter" | "facebook" | "website" | "github";
  url: string;
}

export interface AuthorBioData {
  name: string;
  title?: string;
  company?: string;
  bio: string;
  avatar?: string;
  socials?: SocialLink[];
  darkMode?: boolean;
  layout?: "horizontal" | "vertical";
}

const platformLabels: Record<string, string> = {
  linkedin: "LinkedIn", twitter: "Twitter / X", facebook: "Facebook",
  website: "Website", github: "GitHub",
};

const platformIcons: Record<string, string> = {
  linkedin: "in", twitter: "𝕏", facebook: "f", website: "🌐", github: "⌥",
};

export function AuthorBioBlock({ data }: { data: AuthorBioData }) {
  const isDark = data.darkMode ?? false;
  const isVertical = data.layout === "vertical";

  return (
    <section className={cn("py-14 px-4", isDark ? "bg-slate-900" : "bg-white")}>
      <div className="max-w-3xl mx-auto">
        <div className={cn(
          "rounded-2xl border p-6 md:p-8",
          isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
        )}>
          <div className={cn("flex gap-6", isVertical ? "flex-col items-center text-center" : "flex-col sm:flex-row items-start")}>
            {data.avatar ? (
              <img src={data.avatar} alt={data.name} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
            ) : (
              <div className={cn("w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl font-black", isDark ? "bg-violet-700 text-white" : "bg-violet-100 text-violet-700")}>
                {data.name.charAt(0)}
              </div>
            )}

            <div className="flex-1">
              <div className={cn("text-xs font-bold uppercase tracking-widest mb-1", isDark ? "text-violet-400" : "text-violet-600")}>
                Về tác giả
              </div>
              <h3 className={cn("text-xl font-black mb-0.5", isDark ? "text-white" : "text-slate-900")}>{data.name}</h3>
              {(data.title || data.company) && (
                <p className={cn("text-sm mb-3", isDark ? "text-slate-400" : "text-slate-500")}>
                  {[data.title, data.company].filter(Boolean).join(" tại ")}
                </p>
              )}
              <p className={cn("text-base leading-relaxed mb-4", isDark ? "text-slate-300" : "text-slate-700")}>{data.bio}</p>

              {data.socials && data.socials.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {data.socials.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                        isDark ? "bg-slate-700 text-slate-200 hover:bg-slate-600" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                      )}>
                      <span className="text-xs">{platformIcons[s.platform]}</span>
                      {platformLabels[s.platform]}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
