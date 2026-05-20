"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const { settings } = useSiteSettings();
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasSession(true);
      } else {
        // Check hash fragments as Supabase sometimes puts tokens in URL fragment
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        if (hash && (hash.includes("access_token=") || hash.includes("type=recovery"))) {
          setHasSession(true);
        } else {
          setError("Yêu cầu đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng gửi lại yêu cầu.");
        }
      }
      setChecking(false);
    }

    checkSession();

    // Listen for recovery state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setHasSession(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Mật khẩu phải chứa ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      toast.success("Đặt lại mật khẩu thành công!");
      router.push("/login");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0B1229] flex items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1229] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          {settings?.logo_dark_url ? (
            <div className="flex justify-center mb-6">
              <img src={settings.logo_dark_url} alt={settings.site_name || "Logo"} className="h-12 object-contain" />
            </div>
          ) : settings?.logo_url ? (
            <div className="flex justify-center mb-6">
              <img src={settings.logo_url} alt={settings.site_name || "Logo"} className="h-12 object-contain" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
          )}
          {!settings?.logo_dark_url && !settings?.logo_url && (
            <h1 className="text-3xl font-black text-white tracking-tight">{settings?.site_name || "Smax AI"}</h1>
          )}
          <p className="text-slate-400 mt-2">Đặt lại mật khẩu mới cho tài khoản của bạn</p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl">
          {error && !hasSession ? (
            <div className="space-y-6 text-center">
              <p className="text-red-400 text-sm font-medium leading-relaxed">{error}</p>
              <Button
                onClick={() => router.push("/login")}
                className="w-full h-12 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold transition-all shadow-lg shadow-primary/25"
              >
                Quay lại Đăng nhập
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-11 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-11 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-xs font-medium text-center"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold transition-all shadow-lg shadow-primary/25 gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Cập nhật mật khẩu
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-slate-500 text-xs mt-8">
          © 2026 Smax AI. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
