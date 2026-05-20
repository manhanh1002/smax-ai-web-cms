"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LucideIcon } from "@/components/layout/IconRenderer";
import {
  Plus, Trash2, ChevronUp, ChevronDown, Save,
  Settings, LayoutDashboard, FileText, Package,
  Users, Newspaper, Image as ImageIcon, HelpCircle,
  GripVertical, Edit2, X, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, Reorder } from "framer-motion";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Button } from "@/components/ui/Button";

interface NavChild {
  href: string;
  label: string;
}

interface NavItem {
  href?: string;
  label: string;
  icon?: string;
  children?: NavChild[];
}

const ICON_OPTIONS = [
  "LayoutDashboard", "FileText", "Package", "Users", "Newspaper",
  "ImageIcon", "Settings", "LogOut", "LayoutPanelTop", "ChevronDown",
  "Shield", "Zap", "Star", "Heart", "Search", "Mail", "Bell", "Calendar"
];

export default function SidebarSettingsPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<{ index: number; subIndex?: number } | null>(null);
  const [editForm, setEditForm] = useState<NavItem & { subIndex?: number }>({ label: "", href: "", icon: "HelpCircle" });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchSidebar();
  }, []);

  async function fetchSidebar() {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("admin_sidebar")
        .single();

      if (error) throw error;
      if (data?.admin_sidebar) {
        setItems(data.admin_sidebar as NavItem[]);
      }
    } catch (err) {
      console.error("Error fetching sidebar:", err);
      toast.error("Không thể tải cấu hình sidebar");
    } finally {
      setLoading(false);
    }
  }

  const saveSidebar = async (newItems: NavItem[]) => {
    setSaving(true);
    try {
      // Get the first settings row ID
      const { data: settingsData } = await supabase.from("site_settings").select("id").limit(1).single();

      const { error } = await supabase
        .from("site_settings")
        .update({ admin_sidebar: newItems })
        .eq("id", settingsData?.id);

      if (error) throw error;
      toast.success("Đã lưu cấu hình sidebar");
      setItems(newItems);
    } catch (err) {
      console.error("Error saving sidebar:", err);
      toast.error("Lỗi khi lưu cấu hình");
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    const newItem: NavItem = { label: "Mục mới", href: "/admin", icon: "HelpCircle" };
    setItems([...items, newItem]);
  };

  const addCategory = () => {
    const newItem: NavItem = { label: "Danh mục mới", icon: "FileText", children: [] };
    setItems([...items, newItem]);
  };

  const deleteItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const deleteChild = (parentIndex: number, childIndex: number) => {
    const newItems = [...items];
    if (newItems[parentIndex].children) {
      newItems[parentIndex].children!.splice(childIndex, 1);
      setItems(newItems);
    }
  };

  const addChild = (parentIndex: number) => {
    const newItems = [...items];
    if (!newItems[parentIndex].children) newItems[parentIndex].children = [];
    newItems[parentIndex].children!.push({ label: "Trang mới", href: "/admin" });
    setItems(newItems);
  };

  const startEditing = (index: number, subIndex?: number) => {
    setEditingItem({ index, subIndex });
    if (subIndex !== undefined) {
      const child = items[index].children![subIndex];
      setEditForm({ label: child.label, href: child.href });
    } else {
      setEditForm({ ...items[index] });
    }
  };

  const saveEdit = () => {
    if (!editingItem) return;
    const newItems = [...items];
    if (editingItem.subIndex !== undefined) {
      newItems[editingItem.index].children![editingItem.subIndex] = {
        label: editForm.label,
        href: editForm.href || "/admin"
      };
    } else {
      newItems[editingItem.index] = {
        ...newItems[editingItem.index],
        label: editForm.label,
        href: editForm.href,
        icon: editForm.icon
      };
    }
    setItems(newItems);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Cấu hình Sidebar</h1>
          <p className="text-slate-500 mt-1">Sắp xếp, tạo danh mục và quản lý menu điều hướng admin.</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => saveSidebar(items)}
            disabled={saving}
            className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
          >
            {saving ? <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div> : <Save className="w-4 h-4" />}
            Lưu thay đổi
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
          {items.map((item, index) => (
            <Reorder.Item key={`${item.label}-${index}`} value={item}>
              <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <GripVertical className="w-5 h-5 text-slate-300 cursor-grab active:cursor-grabbing" />
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <LucideIcon name={item.icon || "HelpCircle"} className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{item.label}</h3>
                      <p className="text-xs text-slate-400 font-medium">{item.children ? `${item.children.length} mục con` : item.href}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startEditing(index)}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    {item.children && (
                      <button
                        onClick={() => addChild(index)}
                        className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-xl transition-all"
                        title="Thêm mục con"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteConfirm(index)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {item.children && item.children.length > 0 && (
                  <div className="mt-4 ml-12 pl-6 border-l-2 border-slate-50 space-y-2">
                    {item.children.map((child, subIndex) => (
                      <div key={`${child.href}-${subIndex}`} className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                        <div className="flex items-center space-x-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          <div>
                            <p className="text-sm font-bold text-slate-700">{child.label}</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{child.href}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => startEditing(index, subIndex)}
                            className="p-1.5 text-slate-300 hover:text-primary rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteChild(index, subIndex)}
                            className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            onClick={addItem}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-bold">Thêm Link lẻ</span>
          </button>
          <button
            onClick={addCategory}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-bold">Thêm Danh mục</span>
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl border border-slate-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900">
                {editingItem.subIndex !== undefined ? "Sửa mục con" : "Sửa mục chính"}
              </h2>
              <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-slate-50 rounded-full">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Nhãn hiển thị</label>
                <input
                  type="text"
                  value={editForm.label}
                  onChange={e => setEditForm({ ...editForm, label: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="VD: Dashboard"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Đường dẫn (URL)</label>
                <input
                  type="text"
                  value={editForm.href}
                  onChange={e => setEditForm({ ...editForm, href: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="VD: /admin/pages"
                />
              </div>

              {editingItem.subIndex === undefined && (
                <div>
                  <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Icon</label>
                  <div className="grid grid-cols-6 gap-2 p-4 bg-slate-50 rounded-2xl max-h-48 overflow-y-auto custom-scrollbar">
                    {ICON_OPTIONS.map(icon => (
                      <button
                        key={icon}
                        onClick={() => setEditForm({ ...editForm, icon })}
                        className={cn(
                          "p-2 rounded-xl transition-all flex items-center justify-center",
                          editForm.icon === icon ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:bg-white hover:text-slate-600"
                        )}
                      >
                        <LucideIcon name={icon} className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={saveEdit}
                className="w-full rounded-xl gap-2 font-bold shadow-lg shadow-primary/20 mt-4"
              >
                Cập nhật
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Xóa mục sidebar"
        description="Bạn có chắc chắn muốn xóa mục này không? Các mục con (nếu có) cũng sẽ bị xóa."
        confirmText="Xóa mục"
        onConfirm={() => {
          if (deleteConfirm !== null) {
            deleteItem(deleteConfirm);
            setDeleteConfirm(null);
          }
        }}
        onClose={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
