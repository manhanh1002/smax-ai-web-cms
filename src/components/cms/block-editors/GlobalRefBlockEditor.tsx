"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Globe, Unlink, Edit2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { renderBlockEditor } from "@/lib/cms/block-system/registry";
import { BlockSettingsEditor } from "./shared";

interface GlobalRefData {
  block_id: string;
  _resolved?: {
    name: string;
    type: string;
    data: any;
  };
}

interface GlobalRefBlockEditorProps {
  data: GlobalRefData;
  onChange: (data: GlobalRefData) => void;
}

export function GlobalRefBlockEditor({ data, onChange }: GlobalRefBlockEditorProps) {
  const [cmsBlock, setCmsBlock] = useState<any | null>(data._resolved || null);
  const [loading, setLoading] = useState(!data._resolved);
  const [saving, setSaving] = useState(false);
  const [editingGlobal, setEditingGlobal] = useState(false);
  const [localData, setLocalData] = useState<any>(data._resolved?.data || null);
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");

  useEffect(() => {
    // Always fetch latest data from DB to ensure we're editing the "Source of Truth"
    if (data.block_id) {
      fetchBlock();
    }
  }, [data.block_id]);

  async function fetchBlock() {
    setLoading(true);
    const { data: block } = await supabase
      .from("cms_blocks")
      .select("*")
      .eq("id", data.block_id)
      .single();
    if (block) {
      setCmsBlock(block);
      setLocalData(block.data);
    }
    setLoading(false);
  }

  async function handleSaveGlobal() {
    if (!localData || !data.block_id) return;
    setSaving(true);
    const { error } = await supabase
      .from("cms_blocks")
      .update({ data: localData, updated_at: new Date().toISOString() })
      .eq("id", data.block_id);

    if (error) {
      toast.error("Không thể lưu Global Block");
    } else {
      toast.success("Đã lưu — tất cả trang dùng block này đã được cập nhật");
      setCmsBlock((prev: any) => ({ ...prev, data: localData }));
      
      // Cập nhật lại _resolved data cho parent component (BlockEditor)
      onChange({
        ...data,
        _resolved: {
          ...data._resolved,
          type: cmsBlock.type,
          data: localData,
          name: cmsBlock.name
        }
      });
      
      setEditingGlobal(false);
    }
    setSaving(false);
  }

  function handleUnlink() {
    if (!cmsBlock) return;
    onChange({
      ...data,
      _unlink: true,
      _unlinkType: cmsBlock.type,
      _unlinkData: cmsBlock.data,
    } as any);
    toast.info("Đã tách liên kết — block này giờ là bản sao độc lập");
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-6 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm font-medium">Đang tải Global Block...</span>
      </div>
    );
  }

  if (!cmsBlock) {
    return (
      <div className="flex items-center gap-3 p-6 bg-red-50 rounded-2xl text-red-500 border border-red-100">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <div>
          <p className="text-sm font-bold">Không tìm thấy Global Block</p>
          <p className="text-xs opacity-70 mt-0.5">ID: {data.block_id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Global Block Info Banner */}
      <div className="flex items-center gap-4 p-4 bg-violet-50 border border-violet-200 rounded-2xl">
        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 shrink-0">
          <Globe className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-violet-900 uppercase tracking-widest">Global Block</p>
          <p className="text-sm font-bold text-violet-700 truncate mt-0.5">{cmsBlock.name}</p>
          <p className="text-[10px] text-violet-500 font-medium mt-0.5">
            Thay đổi nội dung sẽ ảnh hưởng tất cả trang đang dùng block này
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setEditingGlobal(v => !v);
              if (!editingGlobal) {
                setLocalData(cmsBlock.data);
                setActiveTab("content");
              }
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all",
              editingGlobal
                ? "bg-violet-600 text-white"
                : "bg-violet-100 text-violet-700 hover:bg-violet-200"
            )}
          >
            <Edit2 className="w-3.5 h-3.5" />
            {editingGlobal ? "Đang chỉnh sửa" : "Chỉnh sửa Global"}
          </button>
          <button
            onClick={handleUnlink}
            title="Tách liên kết — chuyển thành block thường"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 text-xs font-black transition-all"
          >
            <Unlink className="w-3.5 h-3.5" />
            Unlink
          </button>
        </div>
      </div>

      {/* Editor Panel */}
      {editingGlobal && localData !== null && (
        <div className="border border-violet-200 rounded-2xl overflow-hidden bg-white">
          <div className="px-5 py-3 bg-violet-50 border-b border-violet-100 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("content")}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-black transition-all",
                  activeTab === "content" ? "bg-white text-violet-600 shadow-sm" : "text-violet-400 hover:text-violet-600"
                )}
              >
                Nội dung
              </button>
              <button
                onClick={() => setActiveTab("design")}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-black transition-all",
                  activeTab === "design" ? "bg-white text-violet-600 shadow-sm" : "text-violet-400 hover:text-violet-600"
                )}
              >
                Thiết kế & Settings
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingGlobal(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-white transition-all"
              >
                Huỷ
              </button>
              <button
                onClick={handleSaveGlobal}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-black hover:bg-violet-700 disabled:opacity-50 transition-all"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Lưu & Đồng bộ
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {activeTab === "content" ? (
              renderBlockEditor({ type: cmsBlock.type, data: localData }, setLocalData)
            ) : (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Cấu hình giao diện chung cho Global Block
                </p>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                   <BlockSettingsEditor 
                     settings={localData.settings || {}} 
                     onChange={s => setLocalData({ ...localData, settings: s })} 
                   />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Read-only preview note when not editing */}
      {!editingGlobal && (
        <p className="text-[10px] text-slate-400 font-medium text-center">
          Nhấn "Chỉnh sửa Global" để thay đổi nội dung hoặc thiết kế (Anchor ID, Padding...)
        </p>
      )}
    </div>
  );
}
