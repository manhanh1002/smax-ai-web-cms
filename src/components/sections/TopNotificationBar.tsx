"use client";

import * as LucideIcons from "lucide-react";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";

export interface TopNotificationBarProps {
  id?: string;
  content: {
    type: "single" | "multi";
    items: { text: string; link?: string }[];
    image_url?: string;
    cta_label?: string;
    cta_link?: any;
  };
  settings: {
    layout: "static" | "marquee";
    sticky: boolean;
    show_close: boolean;
    height: number;
    speed: number;
    carousel_interval: number;
    theme: {
      bg_type: "color" | "gradient" | "image";
      bg_color: string;
      bg_gradient: string;
      bg_image: string;
      text_color: string;
      primary_color: string;
      primary_text_color: string;
    };
  };
  isPreview?: boolean;
  onDismiss?: () => void;
  onActionClick?: () => void;
}

export function TopNotificationBar({
  id,
  content,
  settings,
  isPreview = false,
  onDismiss,
  onActionClick
}: TopNotificationBarProps) {
  const [dismissed, setDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const { executeAction } = useActionExecutor();

  // Handle Close
  const handleDismiss = () => {
    if (!isPreview) {
      setDismissed(true);
      if (id) {
        sessionStorage.setItem(`noti_dismissed_${id}`, "true");
      }
    }
    if (onDismiss) onDismiss();
  };

  // Check initial dismiss state
  useEffect(() => {
    if (!isPreview && id) {
      if (sessionStorage.getItem(`noti_dismissed_${id}`)) {
        setDismissed(true);
      }
    }
  }, [id, isPreview]);

  // Set CSS Variable for layout shifting
  useEffect(() => {
    if (isPreview) return; // Do not shift layout in preview mode
    if (dismissed) {
      document.documentElement.style.setProperty("--header-offset", "0px");
      document.documentElement.style.setProperty("--main-offset", "0px");
      return;
    }
    
    const updateLayout = () => {
      if (barRef.current) {
        const height = barRef.current.offsetHeight;
        
        if (settings.sticky) {
          document.documentElement.style.setProperty("--header-offset", `${height}px`);
          document.documentElement.style.setProperty("--main-offset", `${height}px`);
        } else {
          // If not sticky, it scrolls away. Header follows it down until it hits 0.
          const scrollY = window.scrollY;
          const headerOffset = Math.max(0, height - scrollY);
          document.documentElement.style.setProperty("--header-offset", `${headerOffset}px`);
          // Main content doesn't need dynamic margin because the absolute bar is in document flow
          // or we just set main offset statically so the absolute bar doesn't overlap it.
          document.documentElement.style.setProperty("--main-offset", `${height}px`);
        }
      }
    };
    
    updateLayout();
    window.addEventListener("resize", updateLayout);
    if (!settings.sticky) {
      window.addEventListener("scroll", updateLayout, { passive: true });
    }
    
    return () => {
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("scroll", updateLayout);
      document.documentElement.style.setProperty("--header-offset", "0px");
      document.documentElement.style.setProperty("--main-offset", "0px");
    };
  }, [dismissed, isPreview, settings.height, settings.sticky, content]); // Re-run if settings/content change height

  // Handle Multi-text Carousel
  useEffect(() => {
    if (content.type === "multi" && content.items.length > 1 && settings.layout === "static") {
      const intervalId = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % content.items.length);
      }, settings.carousel_interval || 4000);
      return () => clearInterval(intervalId);
    }
  }, [content, settings.layout, settings.carousel_interval]);

  if (dismissed) return null;

  const currentItem = content.items[currentIndex] || { text: "" };

  const getBackgroundStyle = () => {
    if (settings.theme.bg_type === "color") return { backgroundColor: settings.theme.bg_color };
    if (settings.theme.bg_type === "gradient") return { backgroundImage: settings.theme.bg_gradient };
    if (settings.theme.bg_type === "image") {
      return { 
        backgroundImage: `url(${settings.theme.bg_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      };
    }
    return { backgroundColor: "#E25A49" }; // Fallback
  };

  const handleClickItem = (link?: string) => {
    if (link && !isPreview) {
      if (onActionClick) onActionClick();
      window.open(link, "_blank");
    }
  };

  const handleCtaClick = () => {
    if (content.cta_link && !isPreview) {
      if (onActionClick) onActionClick();
      executeAction(content.cta_link);
    }
  };

  const CtaButton = () => {
    if (!content.cta_label) return null;
    return (
      <button 
        onClick={handleCtaClick}
        className="ml-4 shrink-0 px-3 py-1 text-[11px] font-bold rounded-full transition-transform hover:scale-105"
        style={{ 
          backgroundColor: settings.theme.primary_color, 
          color: settings.theme.primary_text_color 
        }}
      >
        {content.cta_label}
      </button>
    );
  };

  return (
    <div
      ref={barRef}
      className={cn(
        "w-full overflow-hidden flex items-center justify-center relative",
        settings.sticky && !isPreview ? "fixed top-0 left-0 right-0 z-[60]" : "relative z-[60]"
      )}
      style={{
        ...getBackgroundStyle(),
        color: settings.theme.text_color,
        minHeight: `${settings.height || 40}px`,
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 flex items-center h-full relative">
        
        {/* Left Icon / Image */}
        {content.image_url && (
          content.image_url.startsWith('http') || content.image_url.startsWith('/') ? (
            <img 
              src={content.image_url} 
              alt="icon" 
              className="w-6 h-6 object-contain shrink-0 mr-3 hidden sm:block" 
            />
          ) : (() => {
            // @ts-ignore
            const IconComp = LucideIcons[content.image_url];
            return IconComp ? <IconComp className="w-5 h-5 shrink-0 mr-3 hidden sm:block" /> : null;
          })()
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-hidden h-full flex items-center justify-center text-xs md:text-sm font-semibold relative">
          {settings.layout === "marquee" ? (
            <Marquee 
              className="w-full py-1" 
              style={{ "--duration": `${settings.speed || 20}s`, "--gap": "3rem" } as any}
              repeat={20}
              pauseOnHover={true}
            >
              {content.items.map((item, i) => (
                <span 
                  key={i} 
                  className={cn("flex items-center font-semibold", item.link ? "cursor-pointer hover:opacity-80 transition-opacity" : "")}
                  onClick={() => handleClickItem(item.link)}
                >
                  {item.text}
                </span>
              ))}
            </Marquee>
          ) : (
            <div className="flex items-center justify-center w-full text-center px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -5, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn("flex items-center gap-1", currentItem.link ? "cursor-pointer hover:opacity-80 transition-opacity" : "")}
                  onClick={() => handleClickItem(currentItem.link)}
                >
                  <span className="line-clamp-1">{currentItem.text}</span>
                  {currentItem.link && <ChevronRight className="w-4 h-4 ml-1 opacity-70" />}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="hidden sm:flex items-center shrink-0 pr-6">
           <CtaButton />
        </div>

        {/* Close Button */}
        {settings.show_close && (
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors opacity-70 hover:opacity-100"
          >
            <span className="text-lg leading-none mt-[-2px]">&times;</span>
          </button>
        )}
      </div>
    </div>
  );
}
