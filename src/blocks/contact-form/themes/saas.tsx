"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { ContactFormData } from "../definition";

export function ContactFormSaaS({ data, isDark }: { data: ContactFormData; isDark?: boolean }) {
  const [formData, setFormData] = useState<Record<string,string>>({});
  const [submitted, setSubmitted] = useState(false);
  const isSplit = data.layout === "side-by-side" && data.contactInfo;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await fetch(data.submitUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(formData)}); } catch {}
    setSubmitted(true); setFormData({}); setTimeout(()=>setSubmitted(false),4000);
  };
  const inputClass = cn("w-full px-4 py-3 border text-sm transition-all focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]", isDark?"bg-white/5 border-white/10 text-white placeholder-white/30":"bg-white border-slate-200 text-[var(--secondary)] placeholder-slate-400");
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className={cn("text-3xl md:text-4xl mb-3 text-center", isDark?"text-white":"text-[var(--secondary)]")}>{data.title}</h2>
      {data.subtitle && <p className={cn("text-lg text-center mb-10 max-w-2xl mx-auto", isDark?"text-white/60":"text-[var(--secondary)]/60")}>{data.subtitle}</p>}
      <div className={cn("flex gap-12", isSplit?"flex-col lg:flex-row":"flex-col")}>
        {data.contactInfo && isSplit && (
          <div className="lg:w-1/3 space-y-6">
            {data.contactInfo.address && <div><p className={cn("font-bold mb-1", isDark?"text-white":"text-[var(--secondary)]")}>📍 Địa chỉ</p><p className={isDark?"text-white/60":"text-[var(--secondary)]/60"}>{data.contactInfo.address}</p></div>}
            {data.contactInfo.phone && <div><p className={cn("font-bold mb-1", isDark?"text-white":"text-[var(--secondary)]")}>☎️ SĐT</p><a href={`tel:${data.contactInfo.phone}`} className={cn("font-bold text-[var(--primary)]")}>{data.contactInfo.phone}</a></div>}
            {data.contactInfo.email && <div><p className={cn("font-bold mb-1", isDark?"text-white":"text-[var(--secondary)]")}>✉️ Email</p><a href={`mailto:${data.contactInfo.email}`} className={cn("font-bold text-[var(--primary)]")}>{data.contactInfo.email}</a></div>}
            {data.contactInfo.hours && <div><p className={cn("font-bold mb-1", isDark?"text-white":"text-[var(--secondary)]")}>🕐 Giờ</p><p className={isDark?"text-white/60":"text-[var(--secondary)]/60"}>{data.contactInfo.hours}</p></div>}
          </div>
        )}
        <div className={isSplit?"lg:flex-1":"max-w-2xl mx-auto w-full"}>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {(data.fields??[]).map(f => (
                <div key={f.name}>
                  <label className={cn("block text-sm font-bold mb-1.5", isDark?"text-white":"text-[var(--secondary)]")}>
                    {f.label}{f.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {f.type==="textarea" ? (
                    <textarea name={f.name} placeholder={f.placeholder} required={f.required} rows={4} value={formData[f.name]??""} onChange={e => setFormData(p=>({...p,[f.name]:e.target.value}))} className={inputClass} style={{ borderRadius: "var(--radius-md)" }} />
                  ) : f.type==="select" ? (
                    <select name={f.name} required={f.required} value={formData[f.name]??""} onChange={e => setFormData(p=>({...p,[f.name]:e.target.value}))} className={inputClass} style={{ borderRadius: "var(--radius-md)" }}>
                      <option value="">Chọn...</option>
                      {(f.options??[]).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} name={f.name} placeholder={f.placeholder} required={f.required} value={formData[f.name]??""} onChange={e => setFormData(p=>({...p,[f.name]:e.target.value}))} className={inputClass} style={{ borderRadius: "var(--radius-md)" }} />
                  )}
                </div>
              ))}
              <button type="submit" className={cn("w-full py-3 font-bold mt-2 text-white transition-all hover:brightness-110 shadow-lg shadow-[var(--primary)]/20")} style={{ backgroundColor: "var(--primary)", borderRadius: "var(--radius-md)" }}>
                {data.submitText ?? "Gửi"}
              </button>
            </form>
          ) : (
            <div className="py-8 px-6 text-center font-bold bg-emerald-100 text-emerald-700" style={{ borderRadius: "var(--radius-md)" }}>✓ Cảm ơn! Chúng tôi sẽ liên hệ sớm.</div>
          )}
        </div>
      </div>
    </div>
  );
}
