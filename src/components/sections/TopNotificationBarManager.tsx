"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { TopNotificationBar } from "./TopNotificationBar";

export function TopNotificationBarManager() {
  const [activeBar, setActiveBar] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetchActiveBar();
  }, [pathname]); // Re-evaluate when pathname changes

  const fetchActiveBar = async () => {
    // 1. Fetch the first active notification bar
    const { data, error } = await supabase
      .from("notification_bars")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      setActiveBar(null);
      return;
    }

    // 2. Evaluate Conditions
    const conditions = data.conditions || { page_target: "all", page_urls: [], devices: ["desktop", "mobile"] };
    
    // Check device (simple check)
    const isMobile = window.innerWidth < 768;
    const currentDevice = isMobile ? "mobile" : "desktop";
    if (!conditions.devices?.includes(currentDevice)) {
      setActiveBar(null);
      return;
    }

    // Check page target
    const target = conditions.page_target || "all";
    let shouldShow = false;

    if (target === "all") {
      shouldShow = true;
    } else if (target === "home") {
      shouldShow = pathname === "/" || pathname === "/home";
    } else if (target === "specific" && conditions.page_urls?.length) {
      const urls: string[] = conditions.page_urls;
      // Match exact or wildcard (e.g. /blog/*)
      shouldShow = urls.some(url => {
        if (url.endsWith("/*")) {
          const prefix = url.slice(0, -2);
          return pathname === prefix || pathname?.startsWith(`${prefix}/`);
        }
        return pathname === url;
      });
    }

    if (!shouldShow) {
      setActiveBar(null);
      return;
    }

    // 3. Set Active and Track View
    setActiveBar(data);
    
    // Check if dismissed in this session
    if (sessionStorage.getItem(`noti_dismissed_${data.id}`)) return;

    // Track view (using simple debounce or checking if already tracked to avoid spam)
    if (!sessionStorage.getItem(`noti_viewed_${data.id}_${pathname}`)) {
      sessionStorage.setItem(`noti_viewed_${data.id}_${pathname}`, "true");
      supabase.rpc("increment_notification_bar_views", { bar_id: data.id }).then((res) => {
        if (res.error) {
          // Fallback if RPC doesn't exist (using normal update)
          supabase
            .from("notification_bars")
            .update({ views_count: (data.views_count || 0) + 1 })
            .eq("id", data.id)
            .then();
        }
      });
    }
  };

  const handleActionClick = async () => {
    if (!activeBar) return;
    
    // Track click
    await supabase.rpc("increment_notification_bar_conversions", { bar_id: activeBar.id }).then((res) => {
      if (res.error) {
        // Fallback
        supabase
          .from("notification_bars")
          .update({ conversions_count: (activeBar.conversions_count || 0) + 1 })
          .eq("id", activeBar.id)
          .then();
      }
    });
  };

  if (!activeBar) return null;

  return (
    <TopNotificationBar
      id={activeBar.id}
      content={activeBar.content}
      settings={activeBar.settings}
      onActionClick={handleActionClick}
    />
  );
}
