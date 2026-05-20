"use client";

import React, { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // Fetch profile
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error || !profile) {
          // If no profile exists, create one as default admin if email matches primary admin
          if (user.email === "manhanh0210@gmail.com") {
            const { data: newProfile } = await supabase
              .from("profiles")
              .insert({
                id: user.id,
                email: user.email,
                role: "admin",
                full_name: "Admin Manh Anh",
                permissions: {
                  pages: true,
                  blog: true,
                  marketing: true,
                  media: true,
                  members: true,
                  settings: true
                }
              })
              .select()
              .single();
            if (newProfile) {
              setAuthorized(true);
              setLoading(false);
              return;
            }
          }
          setAuthorized(false);
          setLoading(false);
          return;
        }

        // Admin has full access
        if (profile.role === "admin") {
          setAuthorized(true);
          setLoading(false);
          return;
        }

        // Check module permissions for staff
        const permissions = profile.permissions || {};
        let isAllowed = true;

        if (pathname.startsWith("/admin/pages") || 
            pathname.startsWith("/admin/templates") || 
            pathname.startsWith("/admin/header") || 
            pathname.startsWith("/admin/footer") || 
            pathname.startsWith("/admin/sidebars") || 
            pathname.startsWith("/admin/blocks") || 
            pathname.startsWith("/admin/theme") || 
            pathname.startsWith("/admin/ai-builder")) {
          isAllowed = !!permissions.pages;
        } else if (pathname.startsWith("/admin/blog") || pathname.startsWith("/admin/blog-setting")) {
          isAllowed = !!permissions.blog;
        } else if (pathname.startsWith("/admin/members")) {
          isAllowed = !!permissions.members;
        } else if (pathname.startsWith("/admin/forms") || 
                   pathname.startsWith("/admin/submissions") || 
                   pathname.startsWith("/admin/popups") || 
                   pathname.startsWith("/admin/notification-bars")) {
          isAllowed = !!permissions.marketing;
        } else if (pathname.startsWith("/admin/media")) {
          isAllowed = !!permissions.media;
        } else if (pathname.startsWith("/admin/settings")) {
          isAllowed = !!permissions.settings;
        }

        setAuthorized(isAllowed);
      } catch (err) {
        console.error("Auth layout check error:", err);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-xs text-slate-400 font-medium">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="p-4 bg-red-50 text-red-500 rounded-full mb-4">
            <ShieldAlert className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Truy cập bị từ chối</h2>
          <p className="text-slate-400 max-w-md text-sm mb-6">
            Tài khoản nhân viên của bạn không được cấp quyền truy cập vào module này. Vui lòng liên hệ Admin để phân quyền chi tiết.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
