"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";

export default function SetupPage() {
  const [status, setStatus] = useState<string>("");

  const createAdmin = async () => {
    setStatus("Đang tạo...");
    const { data, error } = await supabase.auth.signUp({
      email: "manhanh0210@gmail.com",
      password: "021097Ma!",
    });

    if (error) {
      setStatus("Lỗi Auth: " + error.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email,
        role: "admin",
        full_name: "Admin Manh Anh"
      });

      if (profileError) {
        setStatus("Lỗi Profile: " + profileError.message);
      } else {
        setStatus("Đã tạo thành công admin và profile! Bạn có thể đăng nhập ngay.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-[32px] border border-slate-700 shadow-2xl text-center">
        <h1 className="text-2xl font-black mb-4">Hệ thống Setup Admin</h1>
        <p className="text-slate-400 mb-8 text-sm">Nhấn nút bên dưới để khởi tạo tài khoản admin đầu tiên.</p>
        <Button onClick={createAdmin} className="w-full h-12 rounded-xl font-bold">
          Khởi tạo Admin (manhanh0210)
        </Button>
        {status && <p className="mt-4 text-primary font-medium">{status}</p>}
      </div>
    </div>
  );
}
