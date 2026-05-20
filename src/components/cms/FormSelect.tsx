"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ChevronDown, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormSelectProps {
  value?: string;
  onChange: (id: string) => void;
  className?: string;
}

export function FormSelect({ value, onChange, className }: FormSelectProps) {
  const [forms, setForms] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForms() {
      const { data } = await supabase
        .from("forms")
        .select("id, name")
        .order("name");
      if (data) setForms(data);
      setLoading(false);
    }
    fetchForms();
  }, []);

  if (loading) {
    return (
      <div className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 flex items-center px-4 gap-2 animate-pulse">
        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
        <span className="text-xs text-slate-400 font-medium">Đang tải danh sách form...</span>
      </div>
    );
  }

  return (
    <div className={cn("relative group", className)}>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all appearance-none cursor-pointer"
      >
        <option value="" disabled>-- Chọn Form --</option>
        {forms.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
        <ChevronDown className="w-4 h-4" />
      </div>
      
      {forms.length === 0 && (
        <p className="mt-2 text-[10px] text-amber-600 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Chưa có form nào. Hãy tạo form trong trang Admin Forms.
        </p>
      )}
    </div>
  );
}
