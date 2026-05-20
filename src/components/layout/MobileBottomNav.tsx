"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const [settings, setSettings] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from("site_settings").select("*").single();
      if (data) setSettings(data);
    }
    fetchSettings();
  }, []);

  if (!settings) return null;

  const menuItems = settings.mobile_bottom_menu || [];
  if (menuItems.length === 0) return null;

  // Enforce max 5 items
  const items = menuItems.slice(0, 5);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-100 pb-safe shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item: any, i: number) => {
          // @ts-ignore
          const Icon = LucideIcons[item.icon] || LucideIcons.Smile;
          const isActive = pathname === item.href;

          return (
            <Link 
              key={i} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 w-full h-full transition-all duration-300",
                isActive ? "text-primary" : "text-gray-400"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all",
                isActive ? "bg-primary/10" : ""
              )}>
                <Icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
