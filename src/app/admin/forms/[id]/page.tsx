"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, Save, Loader2, CheckCircle2, 
  Trash2, Eye, Layout, Settings2, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { FormBuilderEditor, FormStep, FormSettings } from "@/components/cms/FormBuilderEditor";
import { FormRenderer } from "@/components/sections/FormRenderer";

const DEFAULT_SETTINGS: FormSettings = {
  type: "onestep",
  submit_label: "Gửi thông tin",
  success_message: "Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ lại sớm nhất.",
  theme: {
    primary_color: "#3b82f6",
    border_radius: "xl"
  }
};

const DEFAULT_STEPS: FormStep[] = [
  {
    id: "step-1",
    title: "Thông tin liên hệ",
    fields: [
      { id: "f1", fieldId: "name", type: "text", label: "Họ và tên", placeholder: "Nhập họ tên...", required: true, width: "full" },
      { id: "f2", fieldId: "email", type: "email", label: "Email", placeholder: "example@gmail.com", required: true, width: "half" },
      { id: "f3", fieldId: "phone", type: "phone", label: "Số điện thoại", placeholder: "090...", required: true, width: "half" },
    ]
  }
];

export default function FormEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<FormStep[]>([]);
  const [settings, setSettings] = useState<FormSettings>(DEFAULT_SETTINGS);
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const lastSavedRef = React.useRef<string>("");

  useEffect(() => {
    if (!isNew) {
      fetchForm();
    } else {
      setName("Form mới chưa đặt tên");
      setSteps(DEFAULT_STEPS);
    }
  }, [id]);

  async function fetchForm() {
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching form:", error);
      router.push("/admin/forms");
    } else {
      setName(data.name);
      setDescription(data.description || "");
      setSteps(data.steps || []);
      setSettings(data.settings || DEFAULT_SETTINGS);

      // Initialize lastSavedRef
      lastSavedRef.current = JSON.stringify({
        name: data.name, description: data.description || "", steps: data.steps || [], settings: data.settings || DEFAULT_SETTINGS
      });
    }
    setLoading(false);
  }

  async function handleSave(silent = false) {
    if (!silent) setSaving(true);
    const payload = {
      name,
      description,
      steps,
      settings,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (isNew) {
      const { data, error: err } = await supabase.from("forms").insert([payload]).select().single();
      error = err;
      if (data) {
        router.replace(`/admin/forms/${data.id}`);
      }
    } else {
      const { error: err } = await supabase.from("forms").update(payload).eq("id", id);
      error = err;
    }

    if (error) {
      if (!silent) toast.error("Lỗi khi lưu form: " + error.message);
    } else {
      lastSavedRef.current = JSON.stringify({ name, description, steps, settings });
      if (!silent) {
        toast.success("Đã lưu form thành công!");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    }
    if (!silent) setSaving(false);
  }

  // Auto-save effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (saving || loading || isNew) return;

      const currentData = JSON.stringify({ name, description, steps, settings });
      if (currentData !== lastSavedRef.current) {
        console.log("Auto-saving form...");
        handleSave(true);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [name, description, steps, settings, saving, loading, isNew]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Đang tải cấu hình form...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/forms">
              <button className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div className="h-8 w-[1px] bg-slate-100" />
            <div>
              <div className="flex items-center gap-2">
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="text-lg font-black text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                  placeholder="Tên Form..."
                />
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <input
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="text-xs text-slate-400 font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                placeholder="Nhập mô tả cho form này..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl h-10 gap-2 border-slate-200">
              <Eye className="w-4 h-4" /> Xem trước
            </Button>
            <Button 
              onClick={() => handleSave()} 
              disabled={saving}
              className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20 relative overflow-hidden"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Đang lưu..." : saved ? "Đã lưu!" : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Editor Area */}
          <div className="lg:col-span-2">
            <FormBuilderEditor 
              steps={steps}
              settings={settings}
              onChange={(s, st) => {
                setSteps(s);
                setSettings(st);
              }}
            />
          </div>

          {/* Live Preview Area */}
          <div className="space-y-6 sticky top-24 self-start">
            <div className="space-y-6">
              <div className="flex items-center justify-between px-4">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Live Preview
                </h4>
                <span className="px-2 py-1 bg-green-50 text-[10px] font-black text-green-600 rounded-lg border border-green-100 uppercase tracking-wider">Đang xem trước</span>
              </div>

              <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden group min-h-[400px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <FormRenderer 
                  key={JSON.stringify(steps) + JSON.stringify(settings)}
                  previewData={{ steps, settings }} 
                />
              </div>

              <div className="bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Tổng quan cấu trúc</p>
                    <p className="text-sm font-bold mt-1">{steps.reduce((acc, s) => acc + s.fields.length, 0)} trường • {steps.length} bước</p>
                  </div>
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Layout className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
