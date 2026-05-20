"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-32 w-full space-y-6">
      <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-4">
        <List className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-black uppercase tracking-widest">Mục lục bài viết</h3>
      </div>
      
      <ul className="space-y-3">
        {headings.map((h) => (
          <li 
            key={h.id}
            style={{ paddingLeft: `${(h.level - 2) * 16}px` }}
          >
            <a 
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                console.log('ToC Click:', h.id, 'Found Element:', !!el);
                
                if (el) {
                  const offset = 120; // Increased offset slightly
                  const bodyRect = document.body.getBoundingClientRect().top;
                  const elementRect = el.getBoundingClientRect().top;
                  const elementPosition = elementRect - bodyRect;
                  const offsetPosition = elementPosition - offset;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                  });
                } else {
                  // Fallback: jump to hash if JS scroll fails
                  window.location.hash = h.id;
                }
                setActiveId(h.id);
              }}
              className={cn(
                "block text-sm transition-all duration-200 border-l-2 py-0.5 px-4",
                activeId === h.id 
                  ? "border-primary text-primary font-bold bg-primary/5 rounded-r-lg" 
                  : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200"
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
