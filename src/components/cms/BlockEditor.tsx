"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, ChevronDown, ChevronUp, Layout, Globe, Copy, Save, X, Loader2, Package } from "lucide-react";
import { type PageBlock } from "@/lib/cms/block-system/types";
import { renderBlockEditor, getBlockDefaultData, MASTER_BLOCK_REGISTRY, getBlockDefinition } from "@/lib/cms/block-system/registry";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface BlockEditorProps {
  blocks: PageBlock[];
  onChange: (blocks: PageBlock[]) => void;
  isLocked?: boolean;
}

// ── Save-as Modal ────────────────────────────────────────────────────────────
function SaveAsModal({
  open, onClose, onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, category: "global" | "template") => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"global" | "template">("template");
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (open) { setName(""); setCategory("template"); } }, [open]);

  if (!open) return null;

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên cho block"); return; }
    setSaving(true);
    await onSave(name.trim(), category);
    setSaving(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[200]" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[28px] shadow-2xl z-[201] overflow-hidden">
            <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Lưu block vào thư viện</h3>
              <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-7 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tên gợi nhớ</label>
                <input
                  autoFocus value={name} onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSave()}
                  placeholder="Ví dụ: Hero trang chủ, CTA mùa hè..."
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Loại block</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "template", label: "Template Block", desc: "Bản sao độc lập khi dùng", icon: Copy, color: "blue" },
                    { id: "global", label: "Global Block", desc: "Đồng bộ tất cả trang", icon: Globe, color: "violet" },
                  ].map(opt => {
                    const Icon = opt.icon;
                    const active = category === opt.id;
                    return (
                      <button key={opt.id} onClick={() => setCategory(opt.id as any)}
                        className={cn("p-4 rounded-2xl border-2 text-left transition-all",
                          active
                            ? opt.color === "blue" ? "border-blue-500 bg-blue-50" : "border-violet-500 bg-violet-50"
                            : "border-slate-100 hover:border-slate-200 bg-white")}>
                        <Icon className={cn("w-5 h-5 mb-2", active ? (opt.color === "blue" ? "text-blue-600" : "text-violet-600") : "text-slate-400")} />
                        <p className={cn("text-xs font-black", active ? (opt.color === "blue" ? "text-blue-900" : "text-violet-900") : "text-slate-700")}>{opt.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
              <button onClick={handleSave} disabled={saving}
                className="w-full h-11 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-primary transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Đang lưu..." : "Lưu vào thư viện"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Save-as Dropdown Button ───────────────────────────────────────────────────
function SaveAsDropdown({ onSaveAs }: { onSaveAs: () => void }) {
  return (
    <button
      onClick={onSaveAs}
      title="Lưu thành Global hoặc Template block"
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 text-xs font-black transition-all"
    >
      <Save className="w-3.5 h-3.5" />
      Lưu thành...
    </button>
  );
}

// ── Block Row ─────────────────────────────────────────────────────────────────
import { BlockSettingsEditor } from "./block-editors/shared";

function BlockRow({ block, index, total, onUpdate, onDelete, onMove, isLocked, onSaveAs }: {
  block: PageBlock; index: number; total: number;
  onUpdate: (data: any) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
  isLocked?: boolean;
  onSaveAs: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  const reg = getBlockDefinition(block.type);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col">
        <div className="px-5 pt-4 pb-2 border-b border-slate-50 flex items-start justify-between bg-slate-50/30">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="min-w-0">
              <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{reg?.label || block.type}</span>
              <p className="text-[10px] text-slate-400 font-medium line-clamp-1 mt-0.5">{reg?.description}</p>
            </div>
          </div>
          {!isLocked && (
            <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors ml-2 shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="px-5 py-3 flex items-center justify-between bg-white gap-2">
          <div className="flex items-center gap-1">
            {!isLocked && (
              <>
                <button onClick={() => onMove(-1)} disabled={index === 0} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors">
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                </button>
                <button onClick={() => onMove(1)} disabled={index === total - 1} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors">
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isLocked && block.type !== "global_ref" && (
              <SaveAsDropdown onSaveAs={onSaveAs} />
            )}
            {block.type === "global_ref" && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest border border-violet-100">
                <Globe className="w-3 h-3" /> Global
              </span>
            )}
            <button
              onClick={() => {
                setExpanded(v => !v);
                if (!expanded) setActiveTab("content");
              }}
              className={cn(
                "px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                expanded ? "bg-slate-900 text-white shadow-lg" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              )}
            >
              {expanded ? "Thu gọn" : "Chỉnh sửa nội dung"}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="border-t border-slate-100 bg-slate-50/50 flex flex-col">
              {/* Tabs for all blocks (except global_ref which has its own tabs) */}
              {block.type !== "global_ref" && (
                <div className="px-5 py-2 border-b border-slate-200 flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab("content")}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-black transition-all",
                      activeTab === "content" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    Nội dung
                  </button>
                  <button
                    onClick={() => setActiveTab("design")}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-black transition-all",
                      activeTab === "design" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    Thiết kế & Settings
                  </button>
                </div>
              )}

              <div className={cn("bg-white", block.type === "global_ref" ? "p-0" : "p-5")}>
                {block.type === "global_ref" || activeTab === "content" ? (
                  renderBlockEditor(block, onUpdate)
                ) : (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <BlockSettingsEditor 
                      settings={block.data.settings || {}} 
                      onChange={s => onUpdate({ ...block.data, settings: s })} 
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Block Picker Modal ────────────────────────────────────────────────────────
function BlockPickerModal({
  show, onClose, disabledBlocks, onAddSystemBlock, onAddCmsBlock,
}: {
  show: boolean;
  onClose: () => void;
  disabledBlocks: string[];
  onAddSystemBlock: (type: string) => void;
  onAddCmsBlock: (b: any) => void;
}) {
  const [pickerTab, setPickerTab] = useState<"system" | "global" | "template">("system");
  const [cmsBlocks, setCmsBlocks] = useState<any[]>([]);
  const [loadingCms, setLoadingCms] = useState(false);

  useEffect(() => {
    if (show && pickerTab !== "system") fetchCmsBlocks(pickerTab);
  }, [show, pickerTab]);

  async function fetchCmsBlocks(category: "global" | "template") {
    setLoadingCms(true);
    const { data } = await supabase.from("cms_blocks").select("*").eq("category", category).order("created_at", { ascending: false });
    setCmsBlocks(data || []);
    setLoadingCms(false);
  }
  const activeBlocks = MASTER_BLOCK_REGISTRY.filter(b => 
    !disabledBlocks.includes(b.type) && 
    b.type !== "slideGrid"
  );
  const PICKER_TABS = [
    { id: "system", label: "Hệ thống", icon: Package },
    { id: "global", label: "Global Blocks", icon: Globe },
    { id: "template", label: "Templates", icon: Copy },
  ] as const;

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100]" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[32px] shadow-2xl z-[101] overflow-hidden flex flex-col max-h-[85vh]">

            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Thêm Block mới</h3>
                <p className="text-xs text-slate-400 font-medium">Chọn từ hệ thống hoặc thư viện đã lưu</p>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-8 pt-4 pb-0 bg-white">
              {PICKER_TABS.map(tab => {
                const Icon = tab.icon;
                const active = pickerTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setPickerTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-xs font-black transition-all border-b-2",
                      active ? "bg-white text-primary border-primary" : "text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50"
                    )}>
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar border-t border-slate-100">
              {/* System blocks */}
              {pickerTab === "system" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeBlocks.map(reg => (
                    <button key={reg.type} onClick={() => { onAddSystemBlock(reg.type); onClose(); }}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary hover:shadow-lg hover:shadow-blue-500/10 transition-all text-left group">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center text-2xl transition-colors shrink-0">
                        {reg.label.split(" ")[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                          {reg.label.split(" ").slice(1).join(" ")}
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed mt-0.5 line-clamp-2">{reg.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Global / Template blocks from DB */}
              {(pickerTab === "global" || pickerTab === "template") && (
                <div>
                  {loadingCms ? (
                    <div className="flex items-center justify-center py-16 text-slate-400 gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm font-medium">Đang tải...</span>
                    </div>
                  ) : cmsBlocks.length === 0 ? (
                    <div className="py-16 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        {pickerTab === "global" ? <Globe className="w-8 h-8 text-slate-300" /> : <Copy className="w-8 h-8 text-slate-300" />}
                      </div>
                      <p className="text-slate-400 font-bold text-sm">Chưa có {pickerTab === "global" ? "Global" : "Template"} Block nào</p>
                      <p className="text-slate-300 text-xs font-medium mt-1">
                        Nhấn "Lưu thành..." trên một block để lưu vào thư viện
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {cmsBlocks.map(b => {
                        const reg = getBlockDefinition(b.type);
                        return (
                          <button key={b.id} onClick={() => { onAddCmsBlock(b); onClose(); }}
                            className={cn(
                              "flex items-start gap-4 p-4 rounded-2xl bg-white border text-left group transition-all",
                              pickerTab === "global"
                                ? "border-violet-100 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/10"
                                : "border-blue-100 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10"
                            )}>
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors shrink-0",
                              pickerTab === "global" ? "bg-violet-50 group-hover:bg-violet-100" : "bg-blue-50 group-hover:bg-blue-100")}>
                              {reg?.label.split(" ")[0] ?? "📦"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-slate-900 text-sm">{b.name}</p>
                                {pickerTab === "global" && (
                                  <span className="text-[9px] font-black text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded uppercase tracking-widest">SYNC</span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{reg?.label ?? b.type}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Smax AI Custom Block Library
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Main BlockEditor ──────────────────────────────────────────────────────────
export function BlockEditor({ blocks, onChange, isLocked = false }: BlockEditorProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [disabledBlocks, setDisabledBlocks] = useState<string[]>([]);
  const [saveAsFor, setSaveAsFor] = useState<number | null>(null); // block index

  useEffect(() => {
    if (showPicker) fetchDisabledBlocks();
  }, [showPicker]);

  async function fetchDisabledBlocks() {
    const { data } = await supabase.from("site_settings").select("disabled_blocks").single();
    if (data) setDisabledBlocks(data.disabled_blocks || []);
  }

  // Add system block
  const addBlock = (type: string) => {
    onChange([...blocks, { type, data: getBlockDefaultData(type) }]);
  };

  // Add from CMS blocks table
  const addCmsBlock = (b: any) => {
    if (b.category === "global") {
      // Reference — keeps sync
      onChange([...blocks, { type: "global_ref" as any, data: { block_id: b.id, _resolved: { type: b.type, name: b.name, data: b.data } } }]);
    } else {
      // Template — copy data, create independent block
      onChange([...blocks, { type: b.type as any, data: JSON.parse(JSON.stringify(b.data)) }]);
    }
  };

  const updateBlock = (index: number, data: any) => {
    // Handle unlink signal from GlobalRefBlockEditor
    if (data._unlink) {
      const next = [...blocks] as PageBlock[];
      next[index] = { type: data._unlinkType as any, data: data._unlinkData };
      onChange(next);
      return;
    }
    const next = [...blocks];
    next[index] = { ...next[index], data };
    onChange(next);
  };

  const deleteBlock = (index: number) => onChange(blocks.filter((_, i) => i !== index));

  const moveBlock = (index: number, dir: -1 | 1) => {
    const next = [...blocks];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  async function handleSaveAs(name: string, category: "global" | "template") {
    if (saveAsFor === null) return;
    const block = blocks[saveAsFor];
    const { error } = await supabase.from("cms_blocks").insert({
      name, type: block.type, data: block.data, category,
    });
    if (error) {
      toast.error("Không thể lưu block: " + error.message);
    } else {
      toast.success(`Đã lưu "${name}" vào thư viện ${category === "global" ? "Global" : "Template"} Blocks`);
    }
    setSaveAsFor(null);
  }

  return (
    <div className="space-y-4">
      {/* Locked indicator */}
      {isLocked && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700">
          <Layout className="w-5 h-5 shrink-0" />
          <div>
            <p className="text-xs font-black uppercase tracking-wider">Khuôn mẫu cố định</p>
            <p className="text-[10px] font-medium opacity-80">Bố cục trang đã được khoá. Bạn chỉ có thể cập nhật nội dung.</p>
          </div>
        </div>
      )}

      {/* Block list */}
      {blocks.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          <p className="font-bold mb-1">Chưa có block nào</p>
          <p className="text-xs">Nhấn "Thêm Block" để bắt đầu xây trang</p>
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, i) => (
            <BlockRow
              key={`${block.type}-${i}`}
              block={block}
              index={i}
              total={blocks.length}
              onUpdate={data => updateBlock(i, data)}
              onDelete={() => deleteBlock(i)}
              onMove={dir => moveBlock(i, dir)}
              isLocked={isLocked}
              onSaveAs={() => setSaveAsFor(i)}
            />
          ))}
        </div>
      )}

      {/* Add block button */}
      {!isLocked && (
        <div className="pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            className="w-full rounded-2xl border-dashed border-2 h-14 text-slate-500 hover:text-primary hover:border-primary transition-all bg-slate-50/50 hover:bg-blue-50/50 gap-2 group"
            onClick={() => setShowPicker(true)}
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-bold">Thêm Block mới</span>
          </Button>
        </div>
      )}

      {/* Block Picker Modal */}
      <BlockPickerModal
        show={showPicker}
        onClose={() => setShowPicker(false)}
        disabledBlocks={disabledBlocks}
        onAddSystemBlock={addBlock}
        onAddCmsBlock={addCmsBlock}
      />

      {/* Save As Modal */}
      <SaveAsModal
        open={saveAsFor !== null}
        onClose={() => setSaveAsFor(null)}
        onSave={handleSaveAs}
      />
    </div>
  );
}
