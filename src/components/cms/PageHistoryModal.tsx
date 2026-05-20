"use client";

import React, { useEffect, useState } from "react";
import { 
  X, Clock, User, Edit2, Trash2, Eye, Check, RotateCcw, Save
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PageHistoryModalProps {
  pageId: string;
  isOpen: boolean;
  onClose: () => void;
  onPreviewVersion: (version: any) => void;
  onRestoreVersion: (version: any) => void;
  activeVersionId: string | null;
}

export function PageHistoryModal({
  pageId,
  isOpen,
  onClose,
  onPreviewVersion,
  onRestoreVersion,
  activeVersionId
}: PageHistoryModalProps) {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDescriptionId, setEditingDescriptionId] = useState<string | null>(null);
  const [editingDescriptionValue, setEditingDescriptionValue] = useState("");

  useEffect(() => {
    if (isOpen && pageId) {
      fetchVersions();
    }
  }, [isOpen, pageId]);

  async function fetchVersions() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("page_versions")
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq("page_id", pageId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (err: any) {
      console.error("Error fetching versions:", err);
      toast.error("Không thể tải lịch sử phiên bản");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateDescription(id: string) {
    if (!editingDescriptionValue.trim()) {
      toast.error("Vui lòng nhập mô tả phiên bản");
      return;
    }

    try {
      const { error } = await supabase
        .from("page_versions")
        .update({ description: editingDescriptionValue })
        .eq("id", id);

      if (error) throw error;

      toast.success("Đã cập nhật mô tả!");
      setVersions(versions.map(v => v.id === id ? { ...v, description: editingDescriptionValue } : v));
      setEditingDescriptionId(null);
    } catch (err: any) {
      toast.error("Lỗi khi cập nhật mô tả: " + err.message);
    }
  }

  async function handleDeleteVersion(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Bạn có chắc chắn muốn xóa bản ghi lịch sử này? Hành động này không thể hoàn tác.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("page_versions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Đã xóa bản ghi lịch sử!");
      setVersions(versions.filter(v => v.id !== id));
    } catch (err: any) {
      toast.error("Lỗi khi xóa phiên bản: " + err.message);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Lịch sử phiên bản (Version Control)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Danh sách các phiên bản đã lưu của trang này. Chỉ áp dụng cho Page Builder.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-8 max-h-[60vh] overflow-y-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
              <p className="text-sm font-medium">Đang tải lịch sử...</p>
            </div>
          ) : versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Clock className="w-16 h-16 text-slate-200 mb-4" />
              <p className="font-bold text-slate-700">Chưa có lịch sử phiên bản</p>
              <p className="text-sm text-slate-400 mt-1 max-w-xs text-center">Bấm "Lưu thay đổi" trong màn hình soạn thảo để bắt đầu lưu trữ các phiên bản.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version) => {
                const isActive = activeVersionId === version.id;
                const creatorName = version.profiles?.full_name || version.profiles?.email || "Ẩn danh";
                const isEditing = editingDescriptionId === version.id;

                return (
                  <div 
                    key={version.id} 
                    className={cn(
                      "flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all gap-4",
                      isActive 
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/5" 
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                    )}
                  >
                    <div className="flex-1 space-y-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900 bg-white shadow-sm border border-slate-100 px-3 py-1 rounded-xl">
                          {formatDate(version.created_at)}
                        </span>
                        
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {creatorName}
                        </span>

                        {isActive && (
                          <span className="text-[10px] bg-primary text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Đang xem trước
                          </span>
                        )}
                      </div>

                      {/* Version note/description */}
                      <div className="flex items-center gap-2 group/desc max-w-2xl">
                        {isEditing ? (
                          <div className="flex items-center gap-2 w-full">
                            <Input
                              value={editingDescriptionValue}
                              onChange={(e) => setEditingDescriptionValue(e.target.value)}
                              className="h-9 text-sm rounded-xl py-0 px-3"
                              autoFocus
                            />
                            <Button 
                              size="sm" 
                              onClick={() => handleUpdateDescription(version.id)}
                              className="rounded-xl h-9 px-3 gap-1.5"
                            >
                              <Save className="w-3.5 h-3.5" />
                              Lưu
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setEditingDescriptionId(null)}
                              className="rounded-xl h-9 px-3 text-slate-500"
                            >
                              Hủy
                            </Button>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                              {version.description || "Lưu thủ công"}
                            </p>
                            <button
                              onClick={() => {
                                setEditingDescriptionId(version.id);
                                setEditingDescriptionValue(version.description || "Lưu thủ công");
                              }}
                              className="opacity-0 group-hover/desc:opacity-100 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all"
                              title="Sửa ghi chú"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <Button
                        variant={isActive ? "primary" : "outline"}
                        size="sm"
                        onClick={() => onPreviewVersion(version)}
                        className="rounded-xl gap-1.5 h-10 font-bold"
                      >
                        <Eye className="w-4 h-4" />
                        {isActive ? "Đang xem" : "Xem trước"}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRestoreVersion(version)}
                        className="rounded-xl gap-1.5 h-10 font-bold border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Khôi phục
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteVersion(version.id, e)}
                        className="rounded-xl h-10 w-10 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Xóa phiên bản này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="rounded-xl font-bold px-6"
          >
            Đóng
          </Button>
        </div>

      </div>
    </div>
  );
}
