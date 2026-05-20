"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { settings } = useSiteSettings();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const redirectToUrl = `${window.location.origin}/vi/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectToUrl,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage("Đã gửi liên kết đặt lại mật khẩu vào email của bạn. Vui lòng kiểm tra hộp thư!");
      toast.success("Gửi link reset mật khẩu thành công!");
    }
    setLoading(false);
  };

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
              <Lock className="w-8 h-8 text-primary" />
            </div>
          )}
          {!settings?.logo_dark_url && !settings?.logo_url && (
            <h1 className="text-3xl font-black text-white tracking-tight">{settings?.site_name || "Smax AI"} Admin</h1>
          )}
          <p className="text-slate-400 mt-2">
            {mode === "login" ? "Đăng nhập để quản trị hệ thống" : "Khôi phục mật khẩu tài khoản"}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@smax.ai"
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-11 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setError(null);
                        setSuccessMessage(null);
                      }}
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
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
                      Đăng nhập ngay
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="forgot-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleForgotPassword}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email khôi phục</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@smax.ai"
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

                {successMessage && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-400 text-xs font-semibold text-center leading-relaxed"
                  >
                    {successMessage}
                  </motion.p>
                )}

                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={loading || !!successMessage}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold transition-all shadow-lg shadow-primary/25 gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Gửi liên kết khôi phục"
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="w-full h-12 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại đăng nhập
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-slate-500 text-xs mt-8">
          © 2026 Smax AI. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
