"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, FileText, Package, Users, 
  ArrowUpRight, TrendingUp, MousePointer2, Clock 
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pages: 0,
    products: 0,
    members: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [pages, profiles] = await Promise.all([
        supabase.from("pages").select("id", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }),
      ]);
      
      setStats({
        pages: pages.count || 0,
        products: 0, // Placeholder for products table if exists
        members: profiles.count || 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Trang tùy chỉnh", value: stats.pages, icon: FileText, color: "bg-blue-500" },
    { label: "Sản phẩm", value: stats.products, icon: Package, color: "bg-purple-500" },
    { label: "Thành viên", value: stats.members, icon: Users, color: "bg-amber-500" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1 font-medium">Chào mừng trở lại! Hệ thống của bạn đang hoạt động ổn định.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-slate-600">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${card.color} opacity-[0.03] rounded-bl-[100px] transition-all group-hover:scale-110`} />
            
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 ${card.color} bg-opacity-10 rounded-2xl`}>
                <card.icon className={`w-6 h-6 text-slate-900`} />
              </div>
              <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12%</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
              <h2 className="text-4xl font-black text-slate-900 tabular-nums">{card.value}</h2>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 italic">Cập nhật lúc 18:40</span>
              <button className="text-slate-300 group-hover:text-primary transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Hoạt động gần đây</h3>
          <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">Xem tất cả</button>
        </div>
        
        <div className="space-y-6">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center gap-6 p-4 rounded-3xl hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                <MousePointer2 className="w-5 h-5 text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">Admin đã chỉnh sửa trang "Sản phẩm AI"</p>
                <p className="text-xs text-slate-400 mt-0.5">Vừa xong • Bởi manhanh0210@gmail.com</p>
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Edit</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
