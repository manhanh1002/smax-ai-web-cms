"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Image as ImageIcon,
  LogOut, LayoutPanelTop, Users, Settings,
  Newspaper, ChevronDown, ChevronLeft,
  PencilRuler, Sparkles
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Database, FolderTree, Layers } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

interface NavItem {
  href?: string;
  label: string;
  icon: any;
  children?: { href: string; label: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Pages Builder",
    icon: FileText,
    children: [
      { href: "/admin/pages", label: "Quản lý Trang" },
      { href: "/admin/templates", label: "Quản lý Templates" },
      { href: "/admin/header", label: "Cấu hình Header" },
      { href: "/admin/footer", label: "Cấu hình Footer" },
      { href: "/admin/sidebars", label: "Cấu hình Sidebar" },
      { href: "/admin/blocks", label: "Quản lý Blocks" },
      { href: "/admin/theme", label: "Cấu hình Theme" },
    ]
  },
  { href: "/admin/ai-builder", label: "AI Builder", icon: Sparkles },
  {
    label: "Blog",
    icon: Newspaper,
    children: [
      { href: "/admin/blog", label: "Blog & Tin tức" },
      { href: "/admin/blog-setting", label: "Blog Setting" },
    ]
  },
  { href: "/admin/members", label: "Thành viên", icon: Users },
  {
    label: "Marketing Tools",
    icon: PencilRuler,
    children: [
      { href: "/admin/forms", label: "Quản lý Forms" },
      { href: "/admin/submissions", label: "Phản hồi khách hàng" },
      { href: "/admin/popups", label: "Popup Builder" },
      { href: "/admin/notification-bars", label: "Top Notification Bar" },
    ]
  },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Cài đặt hệ thống", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useSiteSettings();
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) {
          setCurrentUser(data);
        }
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
    setHasInitialized(true);
  }, []);

  useEffect(() => {
    if (hasInitialized) {
      localStorage.setItem("admin_sidebar_collapsed", String(isCollapsed));
    }
  }, [isCollapsed, hasInitialized]);

  useEffect(() => {
    // Initial open groups based on pathname
    const initialGroups = NAV_ITEMS
      .filter(item => item.children?.some(child => pathname === child.href || pathname?.startsWith(child.href + "/")))
      .map(item => item.label);

    setOpenGroups(prev => Array.from(new Set([...prev, ...initialGroups])));
  }, [pathname]);

  const toggleGroup = (label: string) => {
    if (isCollapsed) return; // Don't toggle in sidebar if collapsed
    setOpenGroups(prev =>
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (!currentUser) return true; // Show all while loading
    if (currentUser.role === "admin") return true;

    const perms = currentUser.permissions || {};
    if (item.label === "Dashboard") return true;
    if (item.label === "Pages Builder") return !!perms.pages;
    if (item.label === "AI Builder ✨") return !!perms.pages;
    if (item.label === "Blog") return !!perms.blog;
    if (item.label === "Thành viên") return !!perms.members;
    if (item.label === "Marketing Tools") return !!perms.marketing;
    if (item.label === "Media") return !!perms.media;
    if (item.label === "Cài đặt hệ thống") return !!perms.settings;
    return true;
  });

  return (
    <aside className={cn(
      "bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-50",
      isCollapsed ? "w-20 overflow-visible" : "w-64"
    )}>
      <div className={cn(
        "p-6 border-b border-slate-50 relative flex items-center transition-all duration-300",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <div className="overflow-hidden whitespace-nowrap flex items-center h-10">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={settings.site_name || "Logo"} className="h-8 max-w-[150px] object-contain" />
            ) : (
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{settings?.site_name || "Smax AI"}</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Console</p>
              </div>
            )}
          </div>
        )}

        {isCollapsed && (
          <div className="w-10 h-10 flex items-center justify-center">
            {settings?.favicon_url ? (
              <img src={settings.favicon_url} alt="Favicon" className="w-8 h-8 object-contain" />
            ) : (
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">
                  {(settings?.site_name || "S").charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm z-10"
        >
          <ChevronLeft className={cn(
            "w-3 h-3 text-slate-500 transition-transform duration-300",
            isCollapsed && "rotate-180"
          )} />
        </button>
      </div>

      <nav className={cn(
        "flex-1 p-4 space-y-1 custom-scrollbar",
        isCollapsed ? "overflow-visible" : "overflow-y-auto overflow-x-hidden"
      )}>
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isGroup = !!item.children;
          const isOpen = openGroups.includes(item.label);
          const hasActiveChild = item.children?.some(child =>
            pathname === child.href || pathname?.startsWith(child.href + "/")
          );
          const active = !isGroup && (pathname === item.href || pathname?.startsWith(item.href! + "/"));

          return (
            <div key={item.label} className="relative group hover:z-[999]">
              {isGroup ? (
                <>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className={cn(
                      "w-full flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all group",
                      isCollapsed ? "justify-center" : "justify-between",
                      hasActiveChild && !isOpen && !isCollapsed
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                      isCollapsed && hasActiveChild && "bg-slate-100 text-slate-900"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={cn("w-5 h-5 shrink-0", hasActiveChild ? "text-slate-600" : "text-slate-400 group-hover:text-slate-600")} />
                      {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isOpen ? "rotate-180" : ""
                      )} />
                    )}
                  </button>

                  {/* Sub-menu for non-collapsed mode */}
                  {!isCollapsed && isOpen && (
                    <div className="ml-4 pl-4 border-l border-slate-100 space-y-1 mt-1 animate-in slide-in-from-top-2 duration-200">
                      {item.children?.map((child) => {
                        const childActive = pathname === child.href || pathname?.startsWith(child.href + "/");
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block px-4 py-2 text-sm font-bold rounded-xl transition-all",
                              childActive
                                ? "bg-primary text-white shadow-md shadow-primary/10"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            )}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* Floating Menu for Collapsed Mode */}
                  {isCollapsed && (
                    <div className="absolute left-full top-0 pl-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[999] translate-x-1 group-hover:translate-x-0 pointer-events-none group-hover:pointer-events-auto">
                      <div className="w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2">
                        <div className="px-4 py-2 border-b border-slate-50 mb-1">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{item.label}</span>
                        </div>
                        <div className="space-y-0.5">
                          {item.children?.map((child) => {
                            const childActive = pathname === child.href || pathname?.startsWith(child.href + "/");
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "block px-4 py-2.5 text-sm font-bold rounded-xl transition-all",
                                  childActive
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                )}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href={item.href!}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all group",
                      isCollapsed ? "justify-center" : "space-x-3",
                      active
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 shrink-0", active ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                    {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                  </Link>

                  {/* Tooltip for Collapsed Mode */}
                  {isCollapsed && (
                    <div className="absolute left-[calc(100%+4px)] top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[999] translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

      </nav>

      <div className="p-4 border-t border-slate-50">
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center text-sm font-bold text-red-500 rounded-2xl hover:bg-red-50 transition-all group",
            isCollapsed ? "justify-center p-3" : "space-x-3 px-4 py-3"
          )}
          title={isCollapsed ? "Đăng xuất" : ""}
        >
          <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-500 shrink-0" />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}
