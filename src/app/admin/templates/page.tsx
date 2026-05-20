"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { 
  LayoutTemplate, Search, Trash2, Clock, 
  Layers, Copy, ChevronRight, FileText, Plus, Edit2, X, Check
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function AdminTemplateList() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingType, setEditingType] = useState<"custom" | "product">("custom");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    const { data, error } = await supabase
      .from("page_templates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Không thể tải danh sách template");
    } else {
      setTemplates(data || []);
    }
    setLoading(false);
  }

  async function deleteTemplate(id: string) {
    const { error } = await supabase.from("page_templates").delete().eq("id", id);
    if (error) {
      toast.error("Không thể xoá: " + error.message);
    } else {
      toast.success("Đã xoá template");
      fetchTemplates();
    }
  }

  function openModal(mode: "add" | "edit", template?: any) {
    setModalMode(mode);
    if (mode === "edit" && template) {
      setEditingId(template.id);
      setEditingName(template.name);
      setEditingType(template.type);
    } else {
      setEditingId(null);
      setEditingName("");
      setEditingType("custom");
    }
    setIsModalOpen(true);
  }

  async function handleSubmit() {
    if (!editingName.trim()) {
      toast.error("Vui lòng nhập tên template");
      return;
    }

    setSaving(true);
    if (modalMode === "add") {
      const { error } = await supabase.from("page_templates").insert({
        name: editingName,
        type: editingType,
        content_config: { blocks: [] }
      });
      if (error) toast.error("Lỗi: " + error.message);
      else {
        toast.success("Đã tạo template mới");
        setIsModalOpen(false);
        fetchTemplates();
      }
    } else {
      const { error } = await supabase.from("page_templates").update({
        name: editingName,
        type: editingType
      }).eq("id", editingId);
      if (error) toast.error("Lỗi: " + error.message);
      else {
        toast.success("Đã cập nhật template");
        setIsModalOpen(false);
        fetchTemplates();
      }
    }
    setSaving(false);
  }

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Page Templates</h1>
          <p className="text-slate-500 mt-1">Quản lý các mẫu giao diện để tái sử dụng cho các trang khác.</p>
        </div>
        <Button 
          onClick={() => openModal("add")}
          className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Tạo template mới
        </Button>
      </div>

      {/* Filter and stats */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Tìm kiếm template..." 
            className="pl-11 h-12 rounded-2xl border-slate-200 bg-white focus:ring-primary/10 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          <Badge variant="gray" className="rounded-xl px-3 py-1.5 h-auto font-bold">
            Tổng: {templates.length}
          </Badge>
        </div>
      </div>

      {/* Template List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-white rounded-3xl border border-slate-100 animate-pulse" />
          ))}
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div 
              key={template.id}
              className="group bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/5 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <LayoutTemplate className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => openModal("edit", template)}
                    className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100"
                  >
                    <Edit2 className="w-4 h-4 text-slate-400" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setDeleteConfirm(template.id)}
                    className="h-9 w-9 p-0 rounded-xl hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                  </Button>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-primary transition-colors">
                  {template.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1 uppercase tracking-tighter">
                    {template.type === 'product' ? <FileText className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
                    {template.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(template.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-50 flex gap-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex-1">
                  Blueprint Ready
                </div>
                <Copy className="w-4 h-4 text-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] p-20 border border-slate-100 text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-slate-200">
            <Copy className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Chưa có template nào</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            Mở một trang bất kỳ trong Page Editor và chọn "Lưu làm Template" để tạo mẫu đầu tiên.
          </p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-[24px] flex items-center justify-center">
                    {modalMode === 'add' ? <Plus className="w-8 h-8" /> : <Edit2 className="w-8 h-8" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 leading-none">
                      {modalMode === 'add' ? 'Tạo template mới' : 'Chỉnh sửa template'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Thiết lập thông tin cơ bản cho mẫu giao diện.</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-2xl hover:bg-slate-100 text-slate-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Tên Template</label>
                  <Input 
                    autoFocus
                    placeholder="Ví dụ: Landing Page Sản phẩm" 
                    className="h-14 rounded-2xl border-slate-200 focus:border-primary transition-all text-lg font-bold"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Loại trang</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setEditingType("custom")}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${editingType === 'custom' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900">Custom</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Tự do xây dựng</p>
                      </div>
                      {editingType === 'custom' && <Check className="w-4 h-4 text-primary" />}
                    </button>
                    <button
                      onClick={() => setEditingType("product")}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${editingType === 'product' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900">Product</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Mẫu sản phẩm</p>
                      </div>
                      {editingType === 'product' && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-8 flex gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
              >
                Huỷ bỏ
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={saving}
                className="flex-[2] rounded-xl font-bold shadow-lg shadow-primary/20"
              >
                {saving ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Xoá template"
        description="Bạn có chắc chắn muốn xoá template này? Hành động này không thể hoàn tác."
        confirmText="Xoá"
        onConfirm={() => deleteConfirm && deleteTemplate(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
