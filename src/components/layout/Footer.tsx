"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { IconRenderer } from "./IconRenderer";
import { Mail, ArrowRight } from "lucide-react";
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";

export default function Footer() {
  const { executeAction } = useActionExecutor();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from("site_settings").select("*").single();
      if (data) setSettings(data);
    }
    fetchSettings();
  }, []);

  if (!settings) return null;

  const columns = settings.footer_content || [];
  const config = settings.footer_config || {};
  const bg_color = config.bg_color || '#ffffff';
  const bg_gradient = config.bg_gradient || '';
  const text_mode = config.text_mode || 'light';
  const isDark = text_mode === 'dark';

  // Branding Sizing
  const logo_height_light = config.logo_height_light || 40;
  const logo_height_dark = config.logo_height_dark || 40;
  const current_logo_height = isDark ? logo_height_dark : logo_height_light;

  // Layout & Spacing
  const padding_top = config.padding_top ?? 80;
  const padding_bottom = config.padding_bottom ?? 40;

  // Border top
  const border_top_show = config.border_top_show ?? true;
  const border_top_width = config.border_top_width ?? 1;
  const border_top_color = config.border_top_color || (isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb');

  // Newsletter
  const newsletter_btn_color = config.newsletter_btn_color || '#3b82f6';
  const newsletter_btn_hover = config.newsletter_btn_hover || '#2563eb';
  const newsletter_input_radius = config.newsletter_input_radius ?? 16;
  const newsletter_placeholder = config.newsletter_placeholder || 'Email address...';

  // Bottom Links
  const bottom_links = config.bottom_links || [];

  return (
    <footer 
      className="transition-all"
      style={{ 
        backgroundColor: bg_gradient ? undefined : bg_color,
        backgroundImage: bg_gradient || undefined,
        paddingTop: `${padding_top}px`,
        paddingBottom: `${padding_bottom}px`,
        borderTopWidth: border_top_show ? `${border_top_width}px` : '0px',
        borderTopColor: border_top_color,
        borderTopStyle: border_top_show ? 'solid' : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={cn(
          "grid gap-12 mb-20",
          ( {
            1: "grid-cols-1",
            2: "grid-cols-1 md:grid-cols-2",
            3: "grid-cols-1 md:grid-cols-3",
            4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
            5: "grid-cols-1 md:grid-cols-3 lg:grid-cols-5"
          } as Record<number, string> )[columns.length] || "grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
        )}>
          {columns.map((column: any, i: number) => (
            <div key={i} className="space-y-12">
              {(column.blocks || []).map((block: any, j: number) => (
                <div key={j} className="space-y-6">
                  {block.title && (
                    <h4 className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isDark ? "text-gray-500" : "text-gray-400")}>
                      {block.title}
                    </h4>
                  )}
                  
                  {block.type === 'links' && (
                    <ul className="space-y-4">
                      {block.items?.map((link: any, k: number) => (
                        <li key={k}>
                          <button 
                            onClick={() => executeAction(link.href)}
                            className="group flex items-start space-x-3 transition-all text-left w-full"
                          >
                            {link.icon && (
                              <IconRenderer 
                                name={link.icon} 
                                color="primary" 
                                size="sm" 
                                className="mt-0.5 flex-shrink-0"
                              />
                            )}
                            <div className="flex-1">
                              <span className={cn("text-sm font-bold transition-colors block", isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-primary")}>
                                {link.label}
                              </span>
                              {link.description && (
                                <span className={cn("text-[11px] block mt-0.5 opacity-60", isDark ? "text-gray-400" : "text-gray-500")}>
                                  {link.description}
                                </span>
                              )}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {block.type === 'info' && (
                    <div className="space-y-6">
                      {(() => {
                        const blockLogo = isDark ? (block.logo_dark || block.logo_light) : block.logo_light;
                        const siteLogo = isDark ? (settings.logo_dark_url || settings.logo_url) : settings.logo_url;
                        const finalLogo = blockLogo || siteLogo;

                        if (!finalLogo) return null;

                        return (
                          <Link href="/" className="block">
                            <img 
                              src={finalLogo} 
                              alt={settings.site_name} 
                              className="w-auto object-contain"
                              style={{ height: `${current_logo_height}px` }}
                            />
                          </Link>
                        );
                      })()}
                      {block.description && (
                        <p className={cn("text-sm leading-relaxed", isDark ? "text-gray-400" : "text-gray-500")}>
                          {block.description}
                        </p>
                      )}
                    </div>
                  )}

                  {block.type === 'newsletter' && (
                    <div className="space-y-6">
                      {block.description && (
                        <p className={cn("text-sm leading-relaxed", isDark ? "text-gray-400" : "text-gray-500")}>
                          {block.description}
                        </p>
                      )}
                      <style dangerouslySetInnerHTML={{__html: `
                        .custom-newsletter-btn-${j} {
                          background-color: ${newsletter_btn_color} !important;
                          transition: background-color 0.2s ease-in-out;
                        }
                        .custom-newsletter-btn-${j}:hover {
                          background-color: ${newsletter_btn_hover} !important;
                        }
                      `}} />
                      <div className="relative group">
                        <div 
                          className={cn("flex items-center border transition-all p-1", isDark ? "bg-white/5 border-white/10 focus-within:border-primary/50" : "bg-gray-50 border-gray-100 focus-within:border-primary/30")}
                          style={{ borderRadius: `${newsletter_input_radius}px` }}
                        >
                          <div className="pl-3 pr-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                          </div>
                          <input 
                            type="email" 
                            placeholder={block.placeholder || newsletter_placeholder}
                            className="flex-1 bg-transparent border-none outline-none text-sm py-2 placeholder:text-gray-500"
                          />
                          <button 
                            className={cn("text-white p-2.5 transition-all shadow-lg shadow-primary/20", `custom-newsletter-btn-${j}`)}
                            style={{ borderRadius: `${Math.max(0, newsletter_input_radius - 4)}px` }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {block.type === 'image' && block.image && (
                    <div className="space-y-4">
                      <button 
                        onClick={() => executeAction(block.href)} 
                        className="block group overflow-hidden rounded-2xl border border-transparent hover:border-primary/20 transition-all w-full"
                      >
                        <img 
                          src={block.image} 
                          alt={block.image_label || "Footer Image"} 
                          className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                        />
                      </button>
                      {block.image_label && (
                        <p className={cn("text-[11px] font-medium text-center italic", isDark ? "text-gray-500" : "text-gray-400")}>
                          {block.image_label}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={cn("pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6", isDark ? "border-white/5" : "border-gray-100")}>
          <p className={cn("text-xs font-medium", isDark ? "text-gray-500" : "text-gray-400")}>
            {config.copyright || `© ${new Date().getFullYear()} ${settings.site_name}. All rights reserved.`}
          </p>
          <div className="flex items-center space-x-8">
            {bottom_links.length > 0 ? (
              bottom_links.map((link: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => executeAction(link.href)}
                  className={cn("text-xs font-medium transition-colors hover:scale-105 active:scale-95 text-left", isDark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-primary")}
                >
                  {link.label}
                </button>
              ))
            ) : (
              <>
                <Link href="/privacy" className={cn("text-xs font-medium transition-colors", isDark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-primary")}>Privacy Policy</Link>
                <Link href="/terms" className={cn("text-xs font-medium transition-colors", isDark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-primary")}>Terms of Service</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
