"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function CustomCodeEditor({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  const updateField = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const labelClass = "block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 mt-6";
  const textareaClass = "w-full min-h-[150px] p-4 bg-slate-900 text-indigo-300 font-mono text-sm border border-slate-800 focus:border-indigo-500 outline-none transition-all rounded-xl";

  return (
    <div className="space-y-2">
      <div>
        <label className={labelClass}>HTML (Tailwind CSS được hỗ trợ)</label>
        <textarea
          value={data.html || ""}
          onChange={(e) => updateField("html", e.target.value)}
          className={cn(textareaClass, "min-h-[250px]")}
          placeholder="<div>...</div>"
        />
      </div>

      <div>
        <label className={labelClass}>CSS tùy chỉnh</label>
        <textarea
          value={data.css || ""}
          onChange={(e) => updateField("css", e.target.value)}
          className={textareaClass}
          placeholder=".my-class { ... }"
        />
      </div>

      <div>
        <label className={labelClass}>JavaScript tùy chỉnh</label>
        <textarea
          value={data.js || ""}
          onChange={(e) => updateField("js", e.target.value)}
          className={textareaClass}
          placeholder="console.log('Hello');"
        />
      </div>
      
      <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong className="block mb-1">💡 Lưu ý:</strong>
          Mã JS sẽ được thực thi ngay khi block được render. Hãy cẩn thận khi thao tác trực tiếp với DOM hoặc các biến toàn cục để tránh xung đột với hệ thống.
        </p>
      </div>
    </div>
  );
}
