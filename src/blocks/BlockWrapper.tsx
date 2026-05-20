"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BlockSettings } from "./types";
import { useSiteSettings } from "@/context/SiteSettingsContext";

interface BlockWrapperProps {
  children: React.ReactNode;
  settings?: BlockSettings;
  className?: string; // Additional classes for the section
}

export function BlockWrapper({ children, settings, className }: BlockWrapperProps) {
  const { settings: globalSettings } = useSiteSettings();
  const globalBlocks = globalSettings?.theme_config?.blocks;

  const {
    paddingTop = globalBlocks?.padding_top || "large",
    paddingBottom = globalBlocks?.padding_bottom || "large",
    containerWidth = "boxed",
    background = "default",
    backgroundType = "color",
    customBackgroundColor,
    customGradient,
    gradientStart,
    gradientEnd,
    gradientAngle = 135,
    backgroundImage,
    textAlign = "center",
    anchorId,
    entranceAnimation = "none",
    shadowSize = "none",
    borderRadius = "none",
    hideOnMobile = false,
    hideOnDesktop = false,
    customCss
  } = settings || {};

  // Generate a stable ID for styling if anchorId is missing
  const reactId = React.useId();
  const generatedId = `b-${reactId.replace(/:/g, "")}`;
  const blockId = anchorId || generatedId;

  // Visibility classes
  const visibilityClasses = cn(
    hideOnMobile && "hidden md:block",
    hideOnDesktop && "md:hidden"
  );

  // Padding classes mapping
  const ptMap = {
    none: "pt-0",
    small: "pt-8",
    medium: "pt-16",
    large: "pt-24",
    xlarge: "pt-32"
  };

  const pbMap = {
    none: "pb-0",
    small: "pb-8",
    medium: "pb-16",
    large: "pb-24",
    xlarge: "pb-32"
  };

  // Background classes mapping
  const bgMap = {
    default: "bg-white",
    muted: "bg-slate-50",
    dark: "bg-[var(--secondary)]",
    primary: "bg-[var(--primary)]",
    gradient: "bg-gradient-to-b from-slate-50 to-white",
    custom: ""
  };

  const isDark = settings?.colorMode === "dark" || (!settings?.colorMode && (background === "dark" || background === "primary"));

  const alignMap = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  const shadowMap = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl"
  };

  const radiusMap = {
    none: "",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    full: "rounded-[40px]"
  };

  const sectionClasses = cn(
    "relative overflow-hidden transition-colors duration-300",
    ptMap[paddingTop as keyof typeof ptMap] || ptMap.large,
    pbMap[paddingBottom as keyof typeof pbMap] || pbMap.large,
    background !== "custom" && (bgMap[background as keyof typeof bgMap] || bgMap.default),
    isDark ? "text-white" : "text-[var(--secondary)]",
    alignMap[textAlign as keyof typeof alignMap] || alignMap.center,
    visibilityClasses,
    className
  );

  const containerClasses = cn(
    "mx-auto px-6 relative z-10",
    containerWidth === "boxed" ? "max-w-7xl" : 
    containerWidth === "narrow" ? "max-w-4xl" : "w-full",
    shadowMap[shadowSize as keyof typeof shadowMap],
    radiusMap[borderRadius as keyof typeof radiusMap]
  );

  // Custom inline styles for background
  const sectionStyle: React.CSSProperties = {};
  if (background === "custom") {
    if (backgroundType === "color" && customBackgroundColor) {
      sectionStyle.backgroundColor = customBackgroundColor;
    }
    if (backgroundType === "gradient") {
      if (customGradient) {
        sectionStyle.background = customGradient;
      } else if (gradientStart && gradientEnd) {
        sectionStyle.background = `linear-gradient(${gradientAngle}deg, ${gradientStart} 0%, ${gradientEnd} 100%)`;
      }
    }
  }

  // Animation variants
  const getVariants = () => {
    switch (entranceAnimation) {
      case "fadeUp":
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } }
        };
      case "fadeIn":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.8 } }
        };
      case "slideIn":
        return {
          hidden: { opacity: 0, x: -40 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as any } }
        };
      case "zoomIn":
        return {
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" as any } }
        };
      default:
        return {
          hidden: { opacity: 1 },
          visible: { opacity: 1 }
        };
    }
  };

  return (
    <section id={blockId} className={sectionClasses} style={sectionStyle}>
      {/* Custom CSS Injection */}
      {customCss && (
        <style dangerouslySetInnerHTML={{ 
          __html: customCss.replace(/selector|__BLOCK__/g, `#${blockId}`) 
        }} />
      )}
      {/* Background Image Layer */}
      {background === "custom" && backgroundType === "image" && backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={backgroundImage} 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {entranceAnimation !== "none" ? (
        <motion.div
          key={entranceAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
          variants={getVariants()}
          className={containerClasses}
        >
          {children}
        </motion.div>
      ) : (
        <div className={containerClasses}>
          {children}
        </div>
      )}
    </section>
  );
}
