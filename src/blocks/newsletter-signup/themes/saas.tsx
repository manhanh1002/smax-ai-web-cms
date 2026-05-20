"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { NewsletterSignupData } from "../definition";

export function NewsletterSignupSaaS({ data, isDark }: { data: NewsletterSignupData; isDark?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const bgStyle = data.bgStyle ?? "light";
  const isGrad = bgStyle === "gradient";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try { await fetch(data.submitUrl, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ email }) }); } catch {}
    setDone(true); setEmail(""); setTimeout(() => setDone(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className={cn("text-3xl md:text-4xl mb-3 font-bold", isDark||isGrad ? "text-white" : "text-[var(--secondary)]")}>{data.title}</h2>
      {data.subtitle && <p className={cn("text-lg mb-8", isDark||isGrad ? "text-white/80" : "text-[var(--secondary)]/60")}>{data.subtitle}</p>}
      {!done ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder={data.placeholder ?? "Nhập email của bạn..."}
              className={cn("flex-1 px-5 py-4 border transition-all focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none text-base", isDark||isGrad
                ? "bg-white/10 border-white/20 text-white placeholder-white/40"
                : "bg-white border-slate-100 text-[var(--secondary)] placeholder-slate-400")} style={{ borderRadius: "var(--radius-md)" }} />
            <button type="submit" className={cn("px-10 py-4 font-bold whitespace-nowrap transition-all hover:brightness-110 shadow-lg shadow-[var(--primary)]/20")} style={{ backgroundColor: isGrad||isDark ? "white" : "var(--primary)", color: isGrad||isDark ? "var(--primary)" : "white", borderRadius: "var(--radius-md)" }}>
              {data.submitText ?? "Đăng ký"}
            </button>
          </div>
          {data.subscriberCount && <p className={cn("text-sm font-bold", isDark||isGrad ? "text-white/50" : "text-slate-400")}>✓ {data.subscriberCount}</p>}
        </form>
      ) : (
        <div className="py-4 px-6 font-bold bg-emerald-50 text-emerald-600 border border-emerald-100" style={{ borderRadius: "var(--radius-md)" }}>✓ Cảm ơn! Kiểm tra email của bạn.</div>
      )}
    </div>
  );
}
