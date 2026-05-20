import React from "react";
import { cn } from "@/lib/utils";

export interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
}

export interface TeamGridData {
  sectionLabel?: string;
  title: string;
  subtitle?: string;
  members: TeamMember[];
  columns?: 3 | 4;
  avatarShape?: "circle" | "rounded";
  showBio?: boolean;
  darkMode?: boolean;
}

export function TeamGridBlock({ data }: { data: TeamGridData }) {
  const isDark = data.darkMode ?? false;
  const cols = data.columns ?? 3;
  const gridCols = cols === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";

  return (
    <section className={cn("py-20 px-4", isDark ? "bg-slate-900" : "bg-white")}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          {data.sectionLabel && <p className={cn("text-xs font-bold uppercase tracking-widest mb-3", isDark ? "text-violet-400" : "text-violet-600")}>{data.sectionLabel}</p>}
          <h2 className={cn("text-3xl md:text-4xl font-black mb-3", isDark ? "text-white" : "text-slate-900")}>{data.title}</h2>
          {data.subtitle && <p className={cn("text-lg max-w-2xl mx-auto", isDark ? "text-slate-400" : "text-slate-600")}>{data.subtitle}</p>}
        </div>

        <div className={cn("grid gap-6", gridCols)}>
          {(data.members ?? []).map((member, i) => (
            <div key={i} className={cn(
              "text-center p-6 rounded-2xl border transition-all hover:border-violet-300",
              isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            )}>
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className={cn(
                    "w-20 h-20 object-cover mx-auto mb-4",
                    data.avatarShape === "rounded" ? "rounded-2xl" : "rounded-full"
                  )}
                />
              ) : (
                <div className={cn(
                  "w-20 h-20 flex items-center justify-center mx-auto mb-4 text-2xl font-black",
                  data.avatarShape === "rounded" ? "rounded-2xl" : "rounded-full",
                  isDark ? "bg-violet-800 text-violet-200" : "bg-violet-100 text-violet-700"
                )}>
                  {member.name.charAt(0)}
                </div>
              )}

              <h3 className={cn("font-bold text-base mb-0.5", isDark ? "text-white" : "text-slate-900")}>{member.name}</h3>
              <p className={cn("text-sm mb-3", isDark ? "text-violet-400" : "text-violet-600")}>{member.role}</p>

              {data.showBio && member.bio && (
                <p className={cn("text-xs leading-relaxed mb-3", isDark ? "text-slate-400" : "text-slate-500")}>{member.bio}</p>
              )}

              {(member.linkedin || member.twitter) && (
                <div className="flex justify-center gap-2">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                      className={cn("text-xs px-3 py-1.5 rounded-lg font-medium", isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
                      in
                    </a>
                  )}
                  {member.twitter && (
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer"
                      className={cn("text-xs px-3 py-1.5 rounded-lg font-medium", isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
                      𝕏
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
