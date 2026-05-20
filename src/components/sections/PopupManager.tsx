"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import { PopupRenderer } from "@/components/sections/PopupRenderer";
import { cn } from "@/lib/utils";

// ─── Storage helpers ───────────────────────────────────────────
function getStorageKey(popupId: string) { return `smax_popup_${popupId}`; }

function shouldShow(popup: any): boolean {
  const freq = popup.conditions?.frequency || "once_per_session";
  const key = getStorageKey(popup.id);

  if (freq === "always") return true;

  const stored = (() => {
    try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
  })();

  if (!stored) return true;

  if (freq === "once_ever") return false;
  if (freq === "once_per_session") {
    return stored.session !== (typeof window !== "undefined" ? sessionStorage.getItem("__smax_session") : null);
  }
  if (freq === "once_per_day") {
    const lastDate = new Date(stored.date).toDateString();
    return lastDate !== new Date().toDateString();
  }
  return true;
}

function markShown(popup: any) {
  const key = getStorageKey(popup.id);
  const session = sessionStorage.getItem("__smax_session") || Math.random().toString(36).substr(2);
  sessionStorage.setItem("__smax_session", session);
  localStorage.setItem(key, JSON.stringify({ date: new Date().toISOString(), session, converted: false }));
}

function markConverted(popup: any) {
  const key = getStorageKey(popup.id);
  const existing = (() => { try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch { return {}; } })();
  localStorage.setItem(key, JSON.stringify({ ...existing, converted: true }));
}

function isConverted(popup: any): boolean {
  const key = getStorageKey(popup.id);
  try { return JSON.parse(localStorage.getItem(key) || "{}").converted === true; } catch { return false; }
}

// ─── Trigger helpers ───────────────────────────────────────────
function matchesPage(conditions: any, pathname: string): boolean {
  const target = conditions?.page_target || "all";
  if (target === "all") return true;
  if (target === "home") return pathname === "/";
  if (target === "specific") {
    const urls: string[] = conditions?.page_urls || [];
    return urls.some(u => pathname.includes(u));
  }
  return true;
}

function matchesDevice(conditions: any): boolean {
  const devices: string[] = conditions?.devices || ["desktop", "mobile"];
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  return devices.includes(isMobile ? "mobile" : "desktop");
}

// ─── Position classes ──────────────────────────────────────────
function getPositionClasses(position: string, type: string): string {
  if (type === "bar" || position === "top-bar") {
    return "fixed top-0 left-0 right-0 z-[9999] flex justify-center";
  }
  if (position === "bottom-bar") {
    return "fixed bottom-0 left-0 right-0 z-[9999] flex justify-center";
  }
  const map: Record<string, string> = {
    center:        "fixed inset-0 z-[9999] flex items-center justify-center",
    "top-left":    "fixed top-6 left-6 z-[9999]",
    "top-right":   "fixed top-6 right-6 z-[9999]",
    "bottom-left": "fixed bottom-6 left-6 z-[9999]",
    "bottom-right":"fixed bottom-6 right-6 z-[9999]",
  };
  return map[position] || map["center"];
}

// ─── Single popup controller ───────────────────────────────────
function PopupController({ popup }: { popup: any }) {
  const [visible, setVisible] = useState(false);
  const triggered = useRef(false);

  const trigger = useCallback(() => {
    if (triggered.current) return;
    if (!shouldShow(popup)) return;
    if (isConverted(popup) && !popup.conditions?.show_after_convert) return;
    if (!matchesDevice(popup.conditions)) return;

    triggered.current = true;
    markShown(popup);
    setVisible(true);

    // Track view
    supabase.from("popup_events").insert({ popup_id: popup.id, event_type: "view", page_url: window.location.href }).then(() => {
      supabase.from("popups").update({ views_count: (popup.views_count || 0) + 1 }).eq("id", popup.id);
    });
  }, [popup]);

  useEffect(() => {
    if (!matchesPage(popup.conditions, window.location.pathname)) return;

    const trig = popup.conditions?.trigger || "time_delay";

    if (trig === "on_load") {
      trigger();
      return;
    }

    if (trig === "time_delay") {
      const delay = (popup.conditions?.delay_seconds || 3) * 1000;
      const t = setTimeout(trigger, delay);
      return () => clearTimeout(t);
    }

    if (trig === "scroll_depth") {
      const pct = popup.conditions?.scroll_percent || 50;
      const onScroll = () => {
        const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (scrolled >= pct) { trigger(); window.removeEventListener("scroll", onScroll); }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    if (trig === "exit_intent") {
      const onMouse = (e: MouseEvent) => { if (e.clientY <= 5) trigger(); };
      document.addEventListener("mouseleave", onMouse);
      return () => document.removeEventListener("mouseleave", onMouse);
    }
  }, [trigger, popup.conditions]);

  const handleClose = () => {
    setVisible(false);
    supabase.from("popup_events").insert({ popup_id: popup.id, event_type: "close", page_url: window.location.href });
  };

  const handleConvert = () => {
    markConverted(popup);
    setVisible(false);
    supabase.from("popup_events").insert({ popup_id: popup.id, event_type: "convert", page_url: window.location.href }).then(() => {
      supabase.from("popups").update({ conversions_count: (popup.conversions_count || 0) + 1 }).eq("id", popup.id);
    });
  };

  const posClass = getPositionClasses(popup.position, popup.type);
  const hasBackdrop = popup.settings?.backdrop !== false && (popup.position === "center" || popup.type === "modal");

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          {hasBackdrop && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
              onClick={handleClose}
            />
          )}

          {/* Popup */}
          <div className={posClass} key="popup">
            <PopupRenderer
              popup={popup}
              onClose={handleClose}
              onConvert={handleConvert}
            />
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Manager (fetches all active popups) ──────────────────
export function PopupManager() {
  const [popups, setPopups] = useState<any[]>([]);
  const [manualPopupId, setManualPopupId] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("popups").select("*").eq("is_active", true).then(({ data }) => {
      setPopups(data || []);
    });
  }, []);

  useEffect(() => {
    const handleOpen = (e: any) => {
      const id = e.detail?.id;
      if (id) setManualPopupId(id);
    };
    window.addEventListener("smax-open-popup", handleOpen);
    return () => window.removeEventListener("smax-open-popup", handleOpen);
  }, []);

  // Find the manual popup if it's not already in the active list
  const [manualPopup, setManualPopup] = useState<any>(null);
  useEffect(() => {
    if (manualPopupId) {
      const existing = popups.find(p => p.id === manualPopupId);
      if (existing) {
        // Trigger it? We need a way to tell the controller to show it.
        // Actually, it's better to just render a dedicated controller for the manual one.
        supabase.from("popups").select("*").eq("id", manualPopupId).single().then(({ data }) => {
          if (data) setManualPopup(data);
        });
      } else {
        supabase.from("popups").select("*").eq("id", manualPopupId).single().then(({ data }) => {
          if (data) setManualPopup(data);
        });
      }
    }
  }, [manualPopupId, popups]);

  return (
    <>
      {popups.map(popup => <PopupController key={popup.id} popup={popup} />)}
      {manualPopup && (
        <ManualPopupController 
          popup={manualPopup} 
          onClose={() => {
            setManualPopup(null);
            setManualPopupId(null);
          }} 
        />
      )}
    </>
  );
}

// ─── Dedicated controller for manually triggered popups ────────
function ManualPopupController({ popup, onClose }: { popup: any; onClose: () => void }) {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    onClose();
    supabase.from("popup_events").insert({ popup_id: popup.id, event_type: "close", page_url: window.location.href });
  };

  const handleConvert = () => {
    markConverted(popup);
    setVisible(false);
    onClose();
    supabase.from("popup_events").insert({ popup_id: popup.id, event_type: "convert", page_url: window.location.href }).then(() => {
      supabase.from("popups").update({ conversions_count: (popup.conversions_count || 0) + 1 }).eq("id", popup.id);
    });
  };

  const posClass = getPositionClasses(popup.position, popup.type);
  const hasBackdrop = popup.settings?.backdrop !== false && (popup.position === "center" || popup.type === "modal");

  return (
    <AnimatePresence>
      {visible && (
        <>
          {hasBackdrop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
              onClick={handleClose}
            />
          )}
          <div className={posClass}>
            <PopupRenderer
              popup={popup}
              onClose={handleClose}
              onConvert={handleConvert}
            />
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
