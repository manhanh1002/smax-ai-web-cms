"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Menu, X, ChevronDown, Smile } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { IconRenderer } from "./IconRenderer";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";

export default function Header() {
  const { executeAction } = useActionExecutor();
  const [settings, setSettings] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMega, setActiveMega] = useState<number | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<number | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from("site_settings").select("*").single();
      if (data) setSettings(data);
    }
    fetchSettings();

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!settings) return null;

  const menuItems = settings.navbar_menu || [];
  const headerConfig = settings.header_config || { 
    layout: "layout2", 
    theme: "light", 
    backgroundColor: "",
    mobile: { icon: "Menu", theme: "light", backgroundColor: "" }
  };
  const { layout, theme, backgroundColor, mobile } = headerConfig;
  const isDark = theme === "dark";
  const mobileConfig = mobile || { icon: "Menu", theme: "light", backgroundColor: "" };
  const isMobileDark = mobileConfig.theme === "dark";

  const megaConfig = headerConfig.megaMenu || {
    gap: 8,
    padding: 12,
    theme: "light",
    backgroundColor: "",
    backdropBlur: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "",
    shadow: "xl",
    titleColor: "",
    descriptionColor: "",
    hoverBg: "",
    animationType: "fade",
    animationDuration: 0.2,
    staggerChildren: true,
    width1Col: 320,
    width2Col: 540,
    width3Col: 800,
    width4Col: 1000
  };

  const isMegaDark = megaConfig.theme === "dark";

  const isDefaultOrEmptyAction = (action: any) => {
    if (!action) return true;
    if (typeof action === 'string') {
      return action === '/' || action === '#' || action === '';
    }
    if (action.type === 'url') {
      return !action.url || action.url === '/' || action.url === '#';
    }
    if (action.type === 'page') {
      return !action.pageSlug;
    }
    if (action.type === 'block') {
      return !action.blockId;
    }
    return false;
  };

  const getAnimationProps = (type: string) => {
    switch (type) {
      case 'slide-up': return { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 } };
      case 'slide-down': return { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };
      case 'zoom': return { initial: { opacity: 0, scale: 0.9, y: 0 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.9, y: 0 } };
      case 'scale-down': return { initial: { opacity: 0, scale: 1.1, y: 0 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 1.1, y: 0 } };
      default: return { initial: { opacity: 0, y: 0 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 0 } };
    }
  };

  const navLinks = menuItems.filter((item: any) => !['button', 'secondary_button'].includes(item.type));
  const ctaButtons = menuItems.filter((item: any) => ['button', 'secondary_button'].includes(item.type));

  const Logo = () => {
    const displayLogo = isDark ? (settings.logo_dark_url || settings.logo_url) : settings.logo_url;
    const currentLogoHeight = scrolled ? (headerConfig.logoScrolledHeight ?? 32) : (headerConfig.logoHeight ?? 36);
    return (
      <Link href="/" className={cn("text-2xl font-bold tracking-tight flex items-center group", isDark ? "text-white" : "text-gray-900")}>
        {displayLogo ? (
          <img 
            src={displayLogo} 
            alt={settings.site_name} 
            className="w-auto object-contain transition-all duration-300" 
            style={{ height: `${currentLogoHeight}px` }}
          />
        ) : (
          <>
            <div className="w-9 h-9 bg-primary rounded-xl mr-2.5 transition-transform group-hover:rotate-6 shadow-lg shadow-primary/20" />
            {settings.site_name || "Smax AI"}
          </>
        )}
      </Link>
    );
  };

  const subMenuItems = settings.sub_header_menu || [];

  const NavMenu = ({ className }: { className?: string }) => (
    <nav className={cn("hidden md:flex items-center space-x-1", className)}>
      {navLinks.map((item: any, i: number) => {
        const hasSub = (item.items && item.items.length > 0) || (item.type === 'mega' && item.columnsData && item.columnsData.length > 0);
        const originalIndex = menuItems.indexOf(item);

        return (
          <div 
            key={i} 
            className="relative"
            onMouseEnter={() => hasSub ? setActiveMega(originalIndex) : setActiveMega(null)}
          >
            <button
              onClick={(e) => {
                if (hasSub && isDefaultOrEmptyAction(item.href)) {
                  e.preventDefault();
                  return;
                }
                executeAction(item.href);
              }}
              className={cn(
                "px-4 py-2.5 text-[14px] font-semibold transition-all flex items-center rounded-lg mx-0.5 group",
                isDark 
                  ? "text-gray-300 hover:text-white hover:bg-white/10" 
                  : "text-gray-600 hover:text-primary hover:bg-gray-50",
                activeMega === originalIndex && (isDark ? "text-white bg-white/10" : "text-primary bg-gray-50")
              )}
            >
              {item.icon && (
                <IconRenderer name={item.icon} color={item.color || 'primary'} size="sm" className="mr-2 group-hover:scale-100" />
              )}
              {item.label}
              {hasSub && <ChevronDown className={cn("ml-1.5 w-3.5 h-3.5 transition-transform duration-300", activeMega === originalIndex && "rotate-180")} />}
            </button>

            {/* Dropdown / Mega Menu */}
            <AnimatePresence mode="wait">
              {activeMega === originalIndex && hasSub && (
                <motion.div
                  {...getAnimationProps(megaConfig.animationType)}
                  transition={{ duration: megaConfig.animationDuration, ease: "easeOut" }}
                  className={cn(
                    "absolute top-full border z-[60]",
                    // Hover bridge scales with gap
                    "before:content-[''] before:absolute before:left-0 before:right-0",
                    isMegaDark ? "bg-gray-950/95 border-gray-800" : "bg-white/95 border-gray-200",
                    item.type === 'mega' ? "left-1/2 -translate-x-1/2" : "left-0 w-60"
                  )}
                  style={{
                    marginTop: `${megaConfig.gap}px`,
                    padding: `${megaConfig.padding}px`,
                    borderRadius: `${megaConfig.borderRadius}px`,
                    borderWidth: `${megaConfig.borderWidth}px`,
                    borderColor: megaConfig.borderColor || undefined,
                    backgroundColor: megaConfig.backgroundColor || undefined,
                    backdropFilter: `blur(${megaConfig.backdropBlur}px)`,
                    WebkitBackdropFilter: `blur(${megaConfig.backdropBlur}px)`,
                    boxShadow: megaConfig.shadow === 'none' ? 'none' : undefined,
                    width: item.type === 'mega' ? (
                      item.columns === 2 ? `${megaConfig.width2Col}px` :
                      item.columns === 3 ? `${megaConfig.width3Col}px` :
                      item.columns === 4 ? `${megaConfig.width4Col}px` : `${megaConfig.width1Col}px`
                    ) : undefined
                  }}
                >
                  {/* Styled bridge */}
                  <div 
                    className="absolute left-0 right-0" 
                    style={{ 
                      height: `${megaConfig.gap + 10}px`, 
                      top: `-${megaConfig.gap + 5}px` 
                    }} 
                  />

                  <motion.div 
                    className={cn(
                      "grid gap-4", 
                      item.type === 'mega' 
                        ? ( {
                            1: "grid-cols-1",
                            2: "grid-cols-2",
                            3: "grid-cols-3",
                            4: "grid-cols-4"
                          } as Record<number, string> )[item.columns || 1]
                        : "grid-cols-1"
                    )}
                    variants={{
                      animate: {
                        transition: { staggerChildren: megaConfig.staggerChildren ? 0.05 : 0 }
                      }
                    }}
                    initial="initial"
                    animate="animate"
                  >
                    {(item.columnsData || []).map((col: any, j: number) => {
                      const ColumnWrapper = ({ children }: { children: React.ReactNode }) => (
                        <motion.div variants={{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }}>
                          {children}
                        </motion.div>
                      );

                      if (col.type === 'block_card') {
                        return (
                          <ColumnWrapper key={j}>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                executeAction(col.href);
                                setActiveMega(null);
                              }} 
                              className={cn(
                                "group text-left flex flex-col p-4 rounded-2xl transition-all border border-transparent h-full w-full",
                                isMegaDark ? "bg-white/5 hover:border-white/10" : "bg-gray-50/50 hover:bg-white hover:shadow-xl hover:border-gray-100"
                              )}
                              style={{ 
                                backgroundColor: isMegaDark ? undefined : (megaConfig.hoverBg ? 'transparent' : undefined) 
                              }}
                            >
                              <img src={col.image} className="w-full h-32 object-cover rounded-xl mb-4 group-hover:scale-[1.02] transition-transform" />
                              <h5 
                                className="font-bold text-sm mb-1" 
                                style={{ color: megaConfig.titleColor || (isMegaDark ? "#fff" : "#111827") }}
                              >
                                {col.label || col.title}
                              </h5>
                              <p 
                                className="text-xs mb-4 line-clamp-2"
                                style={{ color: megaConfig.descriptionColor || "#9ca3af" }}
                              >
                                {col.description}
                              </p>
                              <span className="text-xs font-bold text-primary flex items-center mt-auto">
                                {col.ctaLabel || 'Learn More'} <LucideIcons.ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                              </span>
                            </button>
                          </ColumnWrapper>
                        );
                      }

                      if (col.type === 'image_link') {
                        return (
                          <ColumnWrapper key={j}>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                executeAction(col.href);
                                setActiveMega(null);
                              }} 
                              className="group relative overflow-hidden rounded-2xl aspect-[4/3] h-full w-full"
                            >
                              <img src={col.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-left">
                                 <span className="text-white font-bold text-sm tracking-wide">{col.label || col.title}</span>
                              </div>
                            </button>
                          </ColumnWrapper>
                        );
                      }

                      // Default Links column
                      return (
                        <ColumnWrapper key={j}>
                          <div className="space-y-4">
                             {col.label && (
                               <h5 
                                 className="px-3.5 text-[10px] font-black uppercase tracking-widest"
                                 style={{ color: megaConfig.titleColor || (isMegaDark ? "#6b7280" : "#9ca3af") }}
                               >
                                 {col.label}
                               </h5>
                             )}
                             <div className="space-y-1">
                               {(col.items || []).map((sub: any, k: number) => (
                                 <button 
                                    key={k} 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      executeAction(sub.href);
                                      setActiveMega(null);
                                    }} 
                                    className={cn(
                                      "group flex items-start p-3.5 rounded-xl transition-all border border-transparent w-full text-left",
                                      isMegaDark ? "hover:bg-white/5 hover:border-white/10" : "hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-100"
                                    )}
                                    style={{ 
                                      '--hover-bg': megaConfig.hoverBg || (isMegaDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,1)')
                                    } as any}
                                  >
                                    <IconRenderer 
                                      name={sub.icon} 
                                      color={sub.color || 'primary'} 
                                      className="mr-4" 
                                    />
                                    <div className="flex-1">
                                      <span 
                                        className="block text-sm font-bold transition-colors"
                                        style={{ color: megaConfig.titleColor || (isMegaDark ? "#fff" : "#111827") }}
                                      >
                                        {sub.label}
                                      </span>
                                      {sub.description && (
                                        <span 
                                          className="text-[11px] leading-tight mt-0.5 block font-medium opacity-70 group-hover:opacity-100 transition-opacity"
                                          style={{ color: megaConfig.descriptionColor || "#9ca3af" }}
                                        >
                                          {sub.description}
                                        </span>
                                      )}
                                    </div>
                                  </button>
                               ))}
                             </div>
                          </div>
                        </ColumnWrapper>
                      );
                    })}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );


  const getButtonStyle = (itemType: string) => {
    const btnType = itemType === 'button' ? 'primary' : 'secondary';
    const btnConfig = headerConfig.buttons?.[btnType] || {
      bgType: 'solid',
      bg: itemType === 'button' ? 'var(--primary)' : 'transparent',
      text: itemType === 'button' ? '#fff' : (isDark ? '#fff' : '#000'),
      radius: 12,
      borderWidth: itemType === 'button' ? 0 : 1,
      borderColor: isDark ? '#374151' : '#e5e7eb'
    };

    const style: any = {
      borderRadius: `${btnConfig.radius}px`,
      color: btnConfig.text,
      borderWidth: `${btnConfig.borderWidth}px`,
      borderStyle: 'solid',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px 24px',
      fontSize: '14px',
      fontWeight: 'bold',
      position: 'relative',
      overflow: 'hidden'
    };

    const shadowMap: any = {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    };

    if (btnConfig.shadow && btnConfig.shadow !== 'none') {
      style.boxShadow = shadowMap[btnConfig.shadow] || btnConfig.shadow;
    }

    if (btnConfig.borderGradient && btnConfig.borderWidth > 0) {
      // Special handling for gradient border with radius
      style.background = `linear-gradient(${btnConfig.bgType === 'solid' ? btnConfig.bg : btnConfig.bgGradient}, ${btnConfig.bgType === 'solid' ? btnConfig.bg : btnConfig.bgGradient}), ${btnConfig.borderGradient}`;
      style.backgroundClip = 'padding-box, border-box';
      style.backgroundOrigin = 'padding-box, border-box';
      style.borderColor = 'transparent';
    } else {
      if (btnConfig.bgType === 'solid') {
        style.backgroundColor = btnConfig.bg;
      } else {
        style.backgroundImage = btnConfig.bgGradient;
      }
      style.borderColor = btnConfig.borderColor || 'transparent';
    }

    return style;
  };

  const Actions = ({ className }: { className?: string }) => (
    <div className={cn("hidden md:flex items-center space-x-3", className)}>
      {ctaButtons.map((item: any, i: number) => {
        const btnType = item.type === 'button' ? 'primary' : 'secondary';
        const btnConfig = headerConfig.buttons?.[btnType] || {};
        const iconPos = btnConfig.iconPosition || 'left';
        const gap = btnConfig.iconGap || 8;

        return (
          <button 
            key={i} 
            onClick={() => executeAction(item.href)}
            style={getButtonStyle(item.type)}
            className="hover:scale-[1.02] active:scale-[0.98] group"
          >
            {iconPos === 'left' && item.icon && (
              (() => {
                // @ts-ignore
                const IconComp = LucideIcons[item.icon];
                return IconComp ? <IconComp className="w-4 h-4" style={{ marginRight: `${gap}px` }} /> : null;
              })()
            )}

            {item.label}

            {iconPos === 'right' && item.icon && (
              (() => {
                // @ts-ignore
                const IconComp = LucideIcons[item.icon];
                return IconComp ? <IconComp className="w-4 h-4" style={{ marginLeft: `${gap}px` }} /> : null;
              })()
            )}
          </button>
        );
      })}
    </div>
  );

  const MobileToggle = () => {
    // @ts-ignore
    const IconComp = LucideIcons[mobileConfig.icon] || LucideIcons.Menu;
    return (
      <button className="md:hidden p-2.5 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className={isDark ? "text-white" : "text-gray-600"} /> : <IconComp className={isDark ? "text-white" : "text-gray-600"} />}
      </button>
    );
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled 
          ? (backgroundColor ? "" : (isDark ? "bg-gray-950/90 border-gray-800 shadow-lg" : "bg-white/90 border-gray-200 shadow-sm")) + " backdrop-blur-md"
          : (backgroundColor ? "" : "bg-transparent border-transparent")
      )}
      style={{ 
        top: "var(--header-offset, 0px)",
        backgroundColor: backgroundColor ? backgroundColor : undefined,
        borderColor: backgroundColor ? (scrolled ? 'rgba(0,0,0,0.1)' : 'transparent') : undefined,
        paddingTop: scrolled ? (headerConfig.paddingScrolledY ?? 12) : (headerConfig.paddingY ?? 20),
        paddingBottom: scrolled ? (headerConfig.paddingScrolledY ?? 12) : (headerConfig.paddingY ?? 20),
      }}
      onMouseLeave={() => setActiveMega(null)}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Layout 1: Menu - Logo - Button */}
        {layout === 'layout1' && (
          <div className="grid grid-cols-3 items-center">
            <div className="flex justify-start">
              <NavMenu />
            </div>
            <div className="flex justify-center">
              <Logo />
            </div>
            <div className="flex justify-end">
              <Actions />
              <MobileToggle />
            </div>
          </div>
        )}

        {/* Layout 2: Logo - Menu (Center) - Button */}
        {layout === 'layout2' && (
          <div className="flex items-center justify-between relative">
            <Logo />
            <div className="absolute left-1/2 -translate-x-1/2">
              <NavMenu />
            </div>
            <div className="flex items-center space-x-4">
              <Actions />
              <MobileToggle />
            </div>
          </div>
        )}

        {/* Layout 3: Logo - Menu (Next to Logo) - Button */}
        {layout === 'layout3' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <Logo />
              <NavMenu />
            </div>
            <div className="flex items-center space-x-4">
              <Actions />
              <MobileToggle />
            </div>
          </div>
        )}
      </div>

      {/* Sub Header Menu (Desktop Only) */}
      {subMenuItems.length > 0 && (
        <div className={cn(
          "hidden md:block border-t transition-all duration-300",
          isDark ? "bg-white/5 border-white/10" : "bg-gray-50/50 border-gray-100"
        )}>
          <div className="max-w-7xl mx-auto px-4 flex items-center space-x-8 h-10">
            {subMenuItems.map((item: any, i: number) => (
              <button 
                key={i} 
                onClick={() => executeAction(item.href)}
                className={cn(
                  "text-[12px] font-bold uppercase tracking-wider transition-colors",
                  isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-primary"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={cn(
              "md:hidden border-b overflow-hidden",
              isMobileDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
            )}
            style={{ 
              backgroundColor: mobileConfig.backgroundColor || undefined 
            }}
          >
            <div className="p-5 space-y-4">
              {menuItems.map((item: any, i: number) => {
                const hasSubItems = item.items && item.items.length > 0;
                const isMega = item.type === 'mega' && item.columnsData && item.columnsData.length > 0;
                const hasChildren = hasSubItems || isMega;
                const isExpanded = expandedMobile === i;
                
                return (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between w-full">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        if (hasChildren && isDefaultOrEmptyAction(item.href)) {
                          setExpandedMobile(isExpanded ? null : i);
                        } else if (item.href) {
                          executeAction(item.href);
                          setIsOpen(false);
                        } else if (hasChildren) {
                          setExpandedMobile(isExpanded ? null : i);
                        }
                      }}
                      className={cn(
                        "flex items-center text-lg font-bold px-1 text-left flex-1",
                        isMobileDark ? "text-white" : "text-gray-900"
                      )}
                    >
                      {item.icon && item.type !== 'button' && <IconRenderer name={item.icon} color={item.color} size="sm" className="mr-3" />}
                      {item.label}
                    </button>
                    {hasChildren && (
                      <button 
                        onClick={() => setExpandedMobile(isExpanded ? null : i)}
                        className="p-2"
                      >
                        <ChevronDown className={cn(
                          "w-5 h-5 transition-transform duration-300",
                          isExpanded && "rotate-180",
                          isMobileDark ? "text-white" : "text-gray-900"
                        )} />
                      </button>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && hasChildren && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 space-y-2">
                          {/* Standard Dropdown Items */}
                          {hasSubItems && item.items.map((sub: any, j: number) => (
                            <button 
                              key={j} 
                              onClick={(e) => {
                                e.preventDefault();
                                executeAction(sub.href);
                                setIsOpen(false);
                              }}
                              className={cn(
                                "flex items-center p-2 text-sm rounded-lg transition-colors ml-4 w-[calc(100%-1rem)] text-left",
                                isMobileDark ? "text-gray-400 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-primary hover:bg-gray-50"
                              )}
                            >
                              <IconRenderer name={sub.icon} color={sub.color} size="sm" className="mr-3 scale-75" />
                              {sub.label}
                            </button>
                          ))}

                          {/* Mega Menu Items */}
                          {isMega && item.columnsData.map((col: any, j: number) => (
                            <div key={j} className="ml-4 space-y-1">
                              {col.label && (
                                <div className={cn(
                                  "px-2 text-[10px] font-black uppercase tracking-widest mt-3 mb-1",
                                  isMobileDark ? "text-gray-500" : "text-gray-400"
                                )}>
                                  {col.label}
                                </div>
                              )}
                              {(col.items || []).map((sub: any, k: number) => (
                                <button 
                                  key={k} 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    executeAction(sub.href);
                                    setIsOpen(false);
                                  }}
                                  className={cn(
                                    "flex items-center p-2 text-sm rounded-lg transition-colors w-full text-left",
                                    isMobileDark ? "text-gray-400 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-primary hover:bg-gray-50"
                                  )}
                                >
                                  <IconRenderer name={sub.icon} color={sub.color} size="sm" className="mr-3 scale-75" />
                                  {sub.label}
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )})}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}



