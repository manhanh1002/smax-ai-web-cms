"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { MASTER_BLOCK_REGISTRY, getBlockDefinition } from "@/lib/cms/block-system/registry";
import { Toggle } from "@/components/ui/Toggle";
import {
  Search, Package, CheckCircle2, XCircle, Info, ArrowUpRight,
  LayoutDashboard, FileText, Zap, Share2, Globe, Copy, Trash2,
  Pencil, X, Check, Loader2, BookTemplate,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
interface CmsBlock {
  id: string;
  name: string;
  type: string;
  data: any;
  category: "global" | "template";
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────
// Inline rename input
// ─────────────────────────────────────────────────────────
function RenameInput({ value, onSave, onCancel }: { value: string; onSave: (v: string) => void; onCancel: () => void }) {
  const [v, setV] = useState(value);
  return (
    <div className="flex items-center gap-2">
      <input autoFocus value={v} onChange={e => setV(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") onSave(v); if (e.key === "Escape") onCancel(); }}
        className="h-9 px-3 rounded-xl border border-primary text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 flex-1 font-bold" />
      <button onClick={() => onSave(v)} className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90">
        <Check className="w-3.5 h-3.5" />
      </button>
      <button onClick={onCancel} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// CMS Block Card (Global / Template)
// ─────────────────────────────────────────────────────────
function CmsBlockCard({ block, onDelete, onRename }: {
  block: CmsBlock;
  onDelete: () => void;
  onRename: (name: string) => void;
}) {
  const [renaming, setRenaming] = useState(false);
  const reg = getBlockDefinition(block.type);
  const isGlobal = block.category === "global";

  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className={cn(
      "group bg-white rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-300",
      isGlobal
        ? "border-violet-100 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/5"
        : "border-blue-100 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner",
            isGlobal ? "bg-violet-50" : "bg-blue-50")}>
            {reg?.label.split(" ")[0] ?? "📦"}
          </div>
          <div>
            {renaming ? (
              <RenameInput value={block.name} onSave={name => { onRename(name); setRenaming(false); }} onCancel={() => setRenaming(false)} />
            ) : (
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {block.name}
                <button onClick={() => setRenaming(true)} className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-slate-100 text-slate-400 transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </h3>
            )}
            <code className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-widest mt-1 inline-block">
              {block.type}
            </code>
          </div>
        </div>

        <button onClick={handleDelete}
          className="p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className={cn("px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1",
          isGlobal ? "bg-violet-50 text-violet-600 border border-violet-100" : "bg-blue-50 text-blue-600 border border-blue-100")}>
          {isGlobal ? <><Globe className="w-2.5 h-2.5" /> Global Sync</> : <><Copy className="w-2.5 h-2.5" /> Template Copy</>}
        </span>
        <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-lg bg-slate-50 text-slate-400 border border-slate-100">
          {reg?.label ?? block.type}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-50 text-[10px] font-medium text-slate-400">
        <Info className="w-3.5 h-3.5" />
        <span>Cập nhật: {new Date(block.updated_at).toLocaleDateString("vi-VN")}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────
export default function BlocksLibraryPage() {
  const [disabledBlocks, setDisabledBlocks] = useState<string[]>([]);
  const [activeMainTab, setActiveMainTab] = useState<"library" | "global" | "template">("library");
  const [activeLibTab, setActiveLibTab] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [cmsBlocks, setCmsBlocks] = useState<CmsBlock[]>([]);
  const [loadingCms, setLoadingCms] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{id: string, name: string} | null>(null);

  useEffect(() => { fetchSettings(); }, []);
  useEffect(() => {
    if (activeMainTab === "global" || activeMainTab === "template") fetchCmsBlocks(activeMainTab);
  }, [activeMainTab]);

  async function fetchSettings() {
    const { data } = await supabase.from("site_settings").select("disabled_blocks").single();
    if (data) setDisabledBlocks(data.disabled_blocks || []);
    setLoading(false);
  }

  async function fetchCmsBlocks(category: "global" | "template") {
    setLoadingCms(true);
    const { data } = await supabase.from("cms_blocks").select("*").eq("category", category).order("updated_at", { ascending: false });
    setCmsBlocks(data || []);
    setLoadingCms(false);
  }

  async function toggleBlock(type: string) {
    const isDisabled = disabledBlocks.includes(type);
    const next = isDisabled ? disabledBlocks.filter(t => t !== type) : [...disabledBlocks, type];
    setDisabledBlocks(next);
    setSaving(true);
    const { data: s } = await supabase.from("site_settings").select("id").single();
    const { error } = await supabase.from("site_settings").update({ disabled_blocks: next }).eq("id", s?.id);
    if (error) toast.error("Không thể cập nhật trạng thái block");
    else toast.success(`${isDisabled ? "Kích hoạt" : "Vô hiệu hoá"} block thành công`);
    setSaving(false);
  }

  async function deleteCmsBlock(id: string) {
    const { error } = await supabase.from("cms_blocks").delete().eq("id", id);
    if (error) { toast.error("Không thể xoá block"); return; }
    toast.success("Đã xoá block khỏi thư viện");
    setCmsBlocks(prev => prev.filter(b => b.id !== id));
  }

  async function renameCmsBlock(id: string, name: string) {
    const { error } = await supabase.from("cms_blocks").update({ name, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) { toast.error("Không thể đổi tên"); return; }
    toast.success("Đã đổi tên thành công");
    setCmsBlocks(prev => prev.map(b => b.id === id ? { ...b, name } : b));
  }

  const LIBRARY_TABS = [
    { id: "all", label: "Tất cả", icon: Package },
    { id: "layout", label: "Layout", icon: LayoutDashboard },
    { id: "content", label: "Nội dung", icon: FileText },
    { id: "marketing", label: "Marketing", icon: Zap },
    { id: "social", label: "Social/Proof", icon: Share2 },
  ];

  const filteredBlocks = MASTER_BLOCK_REGISTRY.filter(b => {
    const matchSearch = b.label.toLowerCase().includes(search.toLowerCase()) || b.type.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeLibTab === "all" || b.category === activeLibTab;
    return matchSearch && matchTab;
  });

  const MAIN_TABS = [
    { id: "library", label: "Block Library", icon: Package, desc: "Quản lý block hệ thống" },
    { id: "global", label: "Global Blocks", icon: Globe, desc: "Đồng bộ toàn site" },
    { id: "template", label: "Template Blocks", icon: Copy, desc: "Bản sao tái sử dụng" },
  ] as const;

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl border border-gray-200 shadow-sm gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Package className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">System Infrastructure</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Blocks Library</h1>
          <p className="text-sm text-gray-500">Quản lý tất cả Block trong hệ thống — bật/tắt, lưu trữ và tái sử dụng.</p>
        </div>
        {activeMainTab === "library" && (
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Tìm kiếm block..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm" />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><Package className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổng Block hệ thống</p>
            <p className="text-2xl font-bold text-slate-900">{MASTER_BLOCK_REGISTRY.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600"><Globe className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Blocks</p>
            <p className="text-2xl font-bold text-slate-900">{cmsBlocks.filter(b => b.category === "global").length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><Copy className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Template Blocks</p>
            <p className="text-2xl font-bold text-slate-900">{cmsBlocks.filter(b => b.category === "template").length}</p>
          </div>
        </div>
      </div>

      {/* Tabs & Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Main Tab Switcher */}
        <div className="flex p-1 bg-gray-100 rounded-xl max-w-fit">
          {MAIN_TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeMainTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveMainTab(tab.id)}
                className={cn("flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-lg transition-all",
                  active ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900")}>
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Category Dropdown */}
        {activeMainTab === "library" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest shrink-0">Danh mục:</span>
            <select
              value={activeLibTab}
              onChange={e => setActiveLibTab(e.target.value)}
              className="px-4 py-2 pr-10 text-xs font-bold border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-700 cursor-pointer shadow-sm min-w-[160px] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
            >
              {LIBRARY_TABS.map(tab => (
                <option key={tab.id} value={tab.id}>
                  {tab.label} ({tab.id === "all" ? MASTER_BLOCK_REGISTRY.length : MASTER_BLOCK_REGISTRY.filter(b => b.category === tab.id).length})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── Library Tab ── */}
      {activeMainTab === "library" && (
        <>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBlocks.map(block => {
              const isDisabled = disabledBlocks.includes(block.type);
              return (
                <div key={block.type} className={cn(
                  "group bg-white rounded-2xl border p-6 transition-all duration-300 flex flex-col gap-4",
                  isDisabled ? "border-slate-100 opacity-60 grayscale bg-slate-50/50" : "border-slate-200 hover:border-primary hover:shadow-xl hover:shadow-blue-500/5"
                )}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner transition-colors",
                        isDisabled ? "bg-slate-200" : "bg-slate-50 group-hover:bg-blue-50")}>
                        {block.label.split(" ")[0]}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{block.label.split(" ").slice(1).join(" ")}</h3>
                        <code className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-widest mt-1 inline-block">{block.type}</code>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Toggle checked={!isDisabled} onChange={() => toggleBlock(block.type)} disabled={saving} />
                      <span className={cn("text-[10px] font-bold uppercase tracking-tighter", isDisabled ? "text-slate-400" : "text-green-500")}>
                        {isDisabled ? "Inactive" : "Active"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500 leading-relaxed min-h-[40px]">{block.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {block.supportedThemes && block.supportedThemes.length > 0 ? (
                        block.supportedThemes.map(theme => (
                          <span key={theme} className="px-2 py-1 bg-blue-50 text-blue-600 text-[9px] font-bold uppercase tracking-widest rounded-md border border-blue-100 flex items-center gap-1">
                            <LayoutDashboard className="w-2.5 h-2.5" /> Theme: {theme}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-1 bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-widest rounded-md border border-slate-100 flex items-center gap-1">
                          <LayoutDashboard className="w-2.5 h-2.5" /> All Themes
                        </span>
                      )}
                      <span className="px-2 py-1 bg-slate-50 text-slate-500 text-[9px] font-bold uppercase tracking-widest rounded-md border border-slate-100">
                        Category: {block.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                        <Info className="w-3.5 h-3.5" />
                        <span>Click switch to toggle visibility in Page Builder</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBlocks.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold">Không tìm thấy block nào khớp với tìm kiếm</p>
            </div>
          )}
        </>
      )}

      {/* ── Global / Template Tabs ── */}
      {(activeMainTab === "global" || activeMainTab === "template") && (
        <>
          <div className={cn("flex items-start gap-4 p-5 rounded-2xl border",
            activeMainTab === "global" ? "bg-violet-50 border-violet-100" : "bg-blue-50 border-blue-100")}>
            {activeMainTab === "global" ? <Globe className="w-5 h-5 text-violet-600 mt-0.5 shrink-0" /> : <Copy className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />}
            <div>
              <p className={cn("text-xs font-bold uppercase tracking-widest", activeMainTab === "global" ? "text-violet-700" : "text-blue-700")}>
                {activeMainTab === "global" ? "Global Blocks — Đồng bộ toàn site" : "Template Blocks — Tạo bản sao khi dùng"}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {activeMainTab === "global"
                  ? "Thay đổi một Global Block sẽ cập nhật đồng thời tất cả các trang đang sử dụng nó."
                  : "Khi thêm Template Block vào trang, hệ thống tạo một bản sao độc lập — thay đổi không ảnh hưởng lẫn nhau."}
              </p>
            </div>
          </div>

          {loadingCms ? (
            <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-medium">Đang tải...</span>
            </div>
          ) : cmsBlocks.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeMainTab === "global" ? <Globe className="w-10 h-10 text-slate-300" /> : <Copy className="w-10 h-10 text-slate-300" />}
              </div>
              <p className="text-slate-400 font-bold">Chưa có {activeMainTab === "global" ? "Global" : "Template"} Block nào</p>
              <p className="text-slate-300 text-xs font-medium mt-2">
                Vào Page Editor → Nhấn "Lưu thành..." cạnh bất kỳ block nào để thêm vào thư viện
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cmsBlocks.map(block => (
                <CmsBlockCard
                  key={block.id}
                  block={block}
                  onDelete={() => setDeleteConfirm({ id: block.id, name: block.name })}
                  onRename={name => renameCmsBlock(block.id, name)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Xoá block"
        description={`Bạn có chắc chắn muốn xoá "${deleteConfirm?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xoá block"
        onConfirm={() => {
          if (deleteConfirm) {
            deleteCmsBlock(deleteConfirm.id);
            setDeleteConfirm(null);
          }
        }}
        onClose={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
