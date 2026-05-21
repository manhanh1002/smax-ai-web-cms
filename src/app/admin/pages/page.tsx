"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Plus, Edit2, ExternalLink, Trash2, Home, AlertCircle, X,
  LayoutTemplate, Search, Check, Tag, ChevronDown, Settings
} from "lucide-react";
import Link from "next/link";
import { PageSettingsModal } from "@/components/cms/PageSettingsModal";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function AdminPagesList() {
  const router = useRouter();
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Template state
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Category state
  const [categories, setCategories] = useState<any[]>([]);
  const [filterCategoryId, setFilterCategoryId] = useState<string>("all");
  const [newCategoryId, setNewCategoryId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategoryId]);

  // Quick settings state
  const [editingPage, setEditingPage] = useState<any | null>(null);
  const [availableSidebars, setAvailableSidebars] = useState<any[]>([]);

  useEffect(() => {
    fetchPages();
    fetchTemplates();
    fetchCategories();
    fetchSidebars();
  }, []);

  async function fetchSidebars() {
    const { data } = await supabase.from("sidebars").select("id, name");
    if (data) setAvailableSidebars(data);
  }

  async function fetchTemplates() {
    const { data } = await supabase.from("page_templates").select("id, name, type");
    if (data) setTemplates(data);
  }

  async function fetchCategories() {
    const { data } = await supabase
      .from("page_categories")
      .select("id, name, slug")
      .order("name");
    if (data) setCategories(data);
  }

  async function fetchPages() {
    const { data, error } = await supabase
      .from("pages")
      .select("*, page_categories(id, name)")
      .or('type.eq.custom,type.is.null,type.eq.product')
      .order("updated_at", { ascending: false });

    if (data) setPages(data);
    setLoading(false);
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setNewTitle(title);
    // Auto generate slug
    const slug = title.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    setNewSlug(slug);
  };

  async function handleCreatePage() {
    if (!newTitle.trim() || !newSlug.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và slug");
      return;
    }

    setIsCreating(true);

    let content_config = { blocks: [] };
    let type = 'custom';

    if (selectedTemplateId) {
      const { data: template } = await supabase
        .from("page_templates")
        .select("content_config, type")
        .eq("id", selectedTemplateId)
        .single();
      if (template) {
        content_config = template.content_config;
        type = template.type;
      }
    }

    const { data, error } = await supabase
      .from("pages")
      .insert([{
        title: newTitle,
        slug: newSlug,
        type,
        content_config,
        template_id: selectedTemplateId,
        category_id: newCategoryId || null,
        status: 'draft'
      }])
      .select()
      .single();

    if (error) {
      toast.error("Lỗi khi tạo trang: " + error.message);
    } else {
      toast.success("Đã tạo trang mới!");
      setIsModalOpen(false);
      setNewTitle("");
      setNewSlug("");
      setSelectedTemplateId(null);
      setNewCategoryId(null);
      fetchPages();
      router.push(`/admin/pages/${data.id}`);
    }
    setIsCreating(false);
  }

  async function deletePage(id: string) {
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (!error) {
      toast.success("Đã xoá trang");
      fetchPages();
    }
  }

  const filteredPages = pages.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategoryId === "all"
      ? true
      : filterCategoryId === "uncategorized"
        ? !p.category_id
        : p.category_id === filterCategoryId;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPages.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPages = filteredPages.slice(startIndex, endIndex);

  const renderPageNumbers = () => {
    const pagesToShow: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pagesToShow.push(i);
    } else {
      pagesToShow.push(1);
      if (currentPage > 3) pagesToShow.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pagesToShow.push(i);
      }

      if (currentPage < totalPages - 2) pagesToShow.push("...");
      pagesToShow.push(totalPages);
    }

    return pagesToShow.map((pageVal, index) => {
      if (pageVal === "...") {
        return (
          <span key={`dots-${index}`} className="px-2 text-slate-400 font-bold">
            ...
          </span>
        );
      }
      return (
        <Button
          key={`page-${pageVal}`}
          variant={currentPage === pageVal ? "primary" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(pageVal as number)}
          className={cn(
            "rounded-xl h-10 w-10 p-0 font-bold",
            currentPage === pageVal
              ? "shadow-md shadow-primary/20"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          )}
        >
          {pageVal}
        </Button>
      );
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý trang</h1>
          <p className="text-slate-500 mt-1">Xây dựng và quản lý các trang nội dung linh hoạt.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/pages/category">
            <Button
              variant="outline"
              className="rounded-2xl px-5 h-12 font-bold gap-2 border-slate-200 text-slate-600 hover:border-slate-300"
            >
              <Tag className="w-4 h-4" />
              Chuyên mục trang
            </Button>
          </Link>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Tạo trang mới
          </Button>
        </div>
      </div>

      {/* Filter and stats */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Tìm kiếm theo tiêu đề hoặc đường dẫn..."
            className="pl-11 h-12 rounded-2xl border-slate-200 bg-white focus:ring-primary/10 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Category Filter Dropdown */}
        <div className="relative">
          <select
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
            className="h-12 pl-4 pr-10 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 ring-primary/10 appearance-none cursor-pointer min-w-[180px]"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="uncategorized">Chưa phân loại</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm shrink-0">
          <Badge variant="gray" className="rounded-xl px-3 py-1.5 h-auto font-bold">
            Tổng: {pages.length}
          </Badge>
          <Badge variant="success" className="rounded-xl px-3 py-1.5 h-auto font-bold">
            Live: {pages.filter(p => p.status === 'published').length}
          </Badge>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Tiêu đề</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Đường dẫn</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Danh mục</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Đặc biệt</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Trạng thái</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
                      <span className="text-sm font-bold text-slate-400">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="max-w-xs mx-auto">
                      <LayoutTemplate className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 font-medium">Không tìm thấy trang nào phù hợp.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPages.map((page) => (
                  <tr key={page.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <Link href={`/admin/pages/${page.id}`} className="flex flex-col">
                        <span className="text-base font-black text-slate-900 group-hover:text-primary transition-colors">{page.title}</span>
                      </Link>
                    </td>
                    <td className="px-8 py-5">
                      <code className="text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 tracking-tight italic">
                        /{page.slug}
                      </code>
                    </td>
                    <td className="px-8 py-5">
                      {page.page_categories ? (
                        <Badge variant="gray" className="rounded-xl px-2.5 py-1 gap-1.5 font-bold text-xs">
                          <Tag className="w-3 h-3" />
                          {page.page_categories.name}
                        </Badge>
                      ) : (
                        <span className="text-slate-200 text-xs">--</span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex gap-2">
                        {page.is_home && (
                          <Badge variant="brand" className="rounded-xl px-2.5 py-1 gap-1.5 shadow-sm border-amber-100">
                            <Home className="w-3 h-3" /> Home
                          </Badge>
                        )}
                        {page.is_404 && (
                          <Badge variant="warning" className="rounded-xl px-2.5 py-1 gap-1.5 shadow-sm">
                            <AlertCircle className="w-3 h-3" /> 404
                          </Badge>
                        )}
                        {!page.is_home && !page.is_404 && <span className="text-slate-200">--</span>}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <Badge
                        variant={page.status === 'published' ? 'success' : 'gray'}
                        className="rounded-xl px-3 py-1 font-bold"
                      >
                        {page.status === 'published' ? 'Đang hoạt động' : 'Bản nháp'}
                      </Badge>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/pages/${page.id}`}>
                          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-2xl hover:bg-white hover:shadow-md transition-all">
                            <Edit2 className="w-4 h-4 text-slate-600" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 rounded-2xl hover:bg-white hover:shadow-md transition-all"
                          onClick={() => setEditingPage(page)}
                        >
                          <Settings className="w-4 h-4 text-slate-500" />
                        </Button>
                        <a href={`/${page.slug}`} target="_blank" rel="noreferrer">
                          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-2xl hover:bg-white hover:shadow-md transition-all">
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                          </Button>
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                          onClick={() => setDeleteConfirm(page.id)}
                        ><Trash2 className="w-4 h-4 text-slate-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-5 bg-white border-t border-slate-100">
            <span className="text-sm font-bold text-slate-500">
              Hiển thị {startIndex + 1} - {Math.min(endIndex, filteredPages.length)} trong tổng số {filteredPages.length} trang
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="rounded-xl h-10 px-3 border-slate-200 text-slate-600 disabled:opacity-50"
              >
                Trước
              </Button>
              {renderPageNumbers()}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="rounded-xl h-10 px-3 border-slate-200 text-slate-600 disabled:opacity-50"
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-[24px] flex items-center justify-center">
                    <Plus className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 leading-none">Tạo trang mới</h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Bắt đầu xây dựng nội dung mới ngay lập tức.</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-2xl hover:bg-slate-100 text-slate-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Tiêu đề trang</Label>
                    <Input
                      autoFocus
                      placeholder="Ví dụ: Giới thiệu công ty"
                      className="h-14 rounded-2xl border-slate-200 focus:border-primary transition-all text-lg font-bold"
                      value={newTitle}
                      onChange={handleTitleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Đường dẫn (Slug)</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-mono">/</span>
                      <Input
                        placeholder="gioi-thieu"
                        className="pl-8 h-14 rounded-2xl border-slate-200 focus:border-primary transition-all font-mono"
                        value={newSlug}
                        onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Danh mục trang</Label>
                    <select
                      value={newCategoryId || ""}
                      onChange={(e) => setNewCategoryId(e.target.value || null)}
                      className="w-full h-11 rounded-2xl border border-slate-200 px-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 ring-primary/10"
                    >
                      <option value="">-- Không có danh mục --</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Chọn Template (Tùy chọn)</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                    <button
                      onClick={() => setSelectedTemplateId(null)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                        selectedTemplateId === null ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900">Trang trắng (Blank)</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Bắt đầu từ đầu</p>
                      </div>
                      {selectedTemplateId === null && <Check className="w-4 h-4 text-primary" />}
                    </button>

                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplateId(template.id)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                          selectedTemplateId === template.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-100 hover:border-slate-200"
                        )}
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900">{template.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{template.type} template</p>
                        </div>
                        {selectedTemplateId === template.id && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 flex gap-4">
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-2xl h-16 font-bold text-slate-500 text-lg hover:bg-slate-100"
              >
                Huỷ bỏ
              </Button>
              <Button
                onClick={handleCreatePage}
                disabled={isCreating}
                className="flex-[2] rounded-xl font-bold shadow-lg shadow-primary/20"
              >
                {isCreating ? "Đang khởi tạo..." : "Xác nhận tạo trang"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Xóa trang"
        description="Bạn có chắc chắn muốn xóa trang này? Hành động này không thể hoàn tác."
        confirmText="Xóa trang"
        onConfirm={() => deleteConfirm && deletePage(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
      />

      <PageSettingsModal
        page={editingPage}
        isOpen={editingPage !== null}
        onClose={() => setEditingPage(null)}
        onSave={() => fetchPages()}
        categories={categories}
        availableSidebars={availableSidebars}
      />
    </div>
  );
}
