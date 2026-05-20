"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  Upload, Search, Grid3X3, List, Trash2, Copy, Check,
  FileText, Film, Image as ImageIcon, File as FileIcon, X, FolderPlus,
  Download, Info, Filter, FolderInput, MousePointer2, ChevronDown, FolderUp, FileUp
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

// ── Types ────────────────────────────────────────────────────────────────────
interface MediaFolder {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
}

interface MediaAsset {
  id: string;
  name: string;
  original_name: string;
  file_path: string;
  public_url: string;
  mime_type: string;
  file_type: "image" | "video" | "document" | "other";
  size_bytes: number;
  width?: number;
  height?: number;
  alt_text: string;
  caption: string;
  folder: string;
  folder_id: string | null;
  created_at: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileType(mime: string): MediaAsset["file_type"] {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime === "application/pdf" || mime.includes("document") || mime.includes("text")) return "document";
  return "other";
}

function FileTypeIcon({ type, className = "w-8 h-8" }: { type: string; className?: string }) {
  if (type === "image") return <ImageIcon className={`${className} text-blue-500`} />;
  if (type === "video") return <Film className={`${className} text-purple-500`} />;
  if (type === "document") return <FileText className={`${className} text-orange-500`} />;
  return <FileIcon className={`${className} text-slate-400`} />;
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function MediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [showSelectionHint, setShowSelectionHint] = useState(false);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [allFoldersList, setAllFoldersList] = useState<MediaFolder[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [deleteConfirmFolder, setDeleteConfirmFolder] = useState<MediaFolder | null>(null);
  const [deleteConfirmAsset, setDeleteConfirmAsset] = useState<MediaAsset | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUploadDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAssets = useCallback(async () => {
    setLoading(true);

    // Fetch Folders
    let folderQuery = supabase.from("media_folders").select("*");
    if (currentFolderId) {
      folderQuery = folderQuery.eq("parent_id", currentFolderId);
    } else {
      folderQuery = folderQuery.is("parent_id", null);
    }
    const { data: folderData } = await folderQuery.order("name");
    setFolders(folderData || []);

    // Fetch Assets
    let q = supabase.from("media_assets").select("*").order("created_at", { ascending: false });
    
    if (currentFolderId) {
      q = q.eq("folder_id", currentFolderId);
    } else {
      q = q.is("folder_id", null);
    }

    if (filterType !== "all") q = q.eq("file_type", filterType);
    if (search) q = q.ilike("original_name", `%${search}%`);
    
    const { data } = await q;
    setAssets(data || []);
    setLoading(false);
  }, [filterType, search, currentFolderId]);

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  // ── Folder Actions ────────────────────────────────────────────────────────
  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const { error } = await supabase.from("media_folders").insert({
        name: newFolderName.trim(),
        parent_id: currentFolderId || null
      });
      if (error) {
        console.error("Error creating folder:", error);
        toast.error(`Lỗi tạo thư mục: ${error.message}`);
      } else {
        toast.success("Đã tạo thư mục mới");
        setNewFolderName("");
        setShowCreateFolder(false);
        fetchAssets();
      }
    } catch (err: any) {
      console.error("Exception in createFolder:", err);
      toast.error(`Lỗi không xác định: ${err.message}`);
    }
  };

  const deleteFolder = async (folder: MediaFolder) => {
    const { error } = await supabase.from("media_folders").delete().eq("id", folder.id);
    if (error) {
      console.error("Error deleting folder:", error);
      toast.error(`Lỗi xoá thư mục: ${error.message}`);
    } else {
      toast.success("Đã xoá thư mục");
      fetchAssets();
    }
  };

  const fetchAllFolders = async () => {
    const { data } = await supabase.from("media_folders").select("*").order("name");
    setAllFoldersList(data || []);
  };

  useEffect(() => {
    if (showMoveModal) fetchAllFolders();
  }, [showMoveModal]);

  const handleMoveAssets = async (targetFolderId: string | null) => {
    if (selectedIds.length === 0) return;
    const { error } = await supabase
      .from("media_assets")
      .update({ folder_id: targetFolderId })
      .in("id", selectedIds);
    
    if (error) {
      toast.error(`Lỗi di chuyển: ${error.message}`);
    } else {
      toast.success("Đã di chuyển thành công");
      setSelectedIds([]);
      setShowMoveModal(false);
      fetchAssets();
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    if (multiSelectMode || e.shiftKey || e.metaKey || e.ctrlKey) {
      setSelectedIds(prev => {
        const isSelected = prev.includes(id);
        const newSelected = isSelected ? prev.filter(i => i !== id) : [...prev, id];
        
        // Show hint only on first selection if not in multi-mode
        if (!isSelected && newSelected.length === 1 && !multiSelectMode) {
          setShowSelectionHint(true);
        } else {
          setShowSelectionHint(false);
        }
        return newSelected;
      });
    } else {
      setSelectedIds(prev => {
        const isSelected = prev.includes(id) && prev.length === 1;
        if (!isSelected) {
          setShowSelectionHint(true);
          return [id];
        }
        setShowSelectionHint(false);
        return [];
      });
    }
  };

  // Auto-hide hint after 5s
  useEffect(() => {
    if (showSelectionHint) {
      const timer = setTimeout(() => setShowSelectionHint(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSelectionHint]);

  // ── Breadcrumbs ────────────────────────────────────────────────────────────
  const [breadcrumbPath, setBreadcrumbPath] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    const updateBreadcrumbs = async () => {
      if (!currentFolderId) {
        setBreadcrumbPath([]);
        return;
      }
      
      const path = [];
      let currId = currentFolderId;
      while (currId) {
        const { data } = await supabase.from("media_folders").select("id, name, parent_id").eq("id", currId).single();
        if (data) {
          path.unshift({ id: data.id, name: data.name });
          currId = data.parent_id;
        } else {
          break;
        }
      }
      setBreadcrumbPath(path);
    };
    updateBreadcrumbs();
  }, [currentFolderId]);

  // ── Upload ─────────────────────────────────────────────────────────────────
  // ── Upload Logic ──────────────────────────────────────────────────────────
  const uploadSingleFile = async (file: File, targetFolderId: string | null) => {
    const fileType = getFileType(file.type);
    const timestamp = Date.now();
    
    setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

    let fileToUpload = file;
    let mimeType = file.type;
    let nameToUpload = file.name;

    // Client-side compression to WebP for images
    if (fileType === "image") {
      try {
        const compressedBlob = await new Promise<Blob>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              canvas.width = img.width;
              canvas.height = img.height;
              ctx?.drawImage(img, 0, 0);
              canvas.toBlob(
                (blob) => {
                  if (blob) resolve(blob);
                  else reject(new Error("Canvas toBlob failed"));
                },
                "image/webp",
                0.8
              );
            };
            img.onerror = reject;
          };
          reader.onerror = reject;
        });
        
        fileToUpload = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
          type: "image/webp",
        });
        mimeType = "image/webp";
        nameToUpload = fileToUpload.name;
      } catch (err) {
        console.error("Compression failed, uploading original:", err);
      }
    }

    const filePath = `uploads/${timestamp}_${nameToUpload.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // Upload to Supabase Storage
    const { data: storageData, error } = await supabase.storage
      .from("media")
      .upload(filePath, fileToUpload, { upsert: false, contentType: mimeType });

    if (error || !storageData) {
      console.error("Upload error:", error);
      setUploadProgress((prev) => { const n = { ...prev }; delete n[file.name]; return n; });
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;

    // Save to DB
    const { data: dbData, error: dbError } = await supabase.from("media_assets").insert({
      name: filePath.split('/').pop(),
      original_name: file.name,
      file_path: filePath,
      public_url: publicUrl,
      mime_type: mimeType,
      file_type: fileType,
      size_bytes: fileToUpload.size,
      folder_id: targetFolderId,
      folder: "/", // legacy
    }).select().single();

    if (!dbError && dbData) {
      // Optional: Call Edge Function to optimize media (e.g. generating thumbnails)
      // We already do WebP conversion client-side, so this is non-critical.
      supabase.functions.invoke('optimize-media', {
        body: { filePath: filePath, fileType: mimeType }
      }).then(({ error: efError }) => {
        if (efError) console.debug("Optimization Edge Function skipped (normal if not deployed).");
      }).catch(() => {
        // Silent catch for network errors to avoid console noise
      });
    }

    setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
    setTimeout(() => {
      setUploadProgress((prev) => { const n = { ...prev }; delete n[file.name]; return n; });
    }, 1500);
  };

  const handleFiles = async (files: FileList | null, isFolder: boolean = false) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const folderCache: Record<string, string> = {}; // path -> id

    for (const file of Array.from(files)) {
      let targetFolderId = currentFolderId;

      // Handle directory structure for folder uploads
      if (isFolder && (file as any).webkitRelativePath) {
        const pathParts = (file as any).webkitRelativePath.split('/');
        pathParts.pop(); // Remove the filename itself

        let parentId = currentFolderId;
        let currentPath = "";

        for (const part of pathParts) {
          currentPath += (currentPath ? "/" : "") + part;
          if (folderCache[currentPath]) {
            parentId = folderCache[currentPath];
          } else {
            // Check if folder exists in this level or create it
            let q = supabase.from("media_folders").select("id").eq("name", part);
            if (parentId) q = q.eq("parent_id", parentId);
            else q = q.is("parent_id", null);
            
            const { data: existing } = await q.maybeSingle();

            if (existing) {
              parentId = existing.id;
            } else {
              const { data: created, error: createError } = await supabase
                .from("media_folders")
                .insert({ name: part, parent_id: parentId })
                .select()
                .single();
              
              if (!createError && created) {
                parentId = created.id;
              } else {
                console.error("Error creating folder structure:", createError);
              }
            }
            folderCache[currentPath] = parentId!;
          }
        }
        targetFolderId = parentId;
      }

      try {
        await uploadSingleFile(file, targetFolderId);
      } catch (uploadErr) {
        console.error("Critical upload error:", uploadErr);
      }
    }

    setUploading(false);
    fetchAssets();
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (asset: MediaAsset) => {
    await supabase.storage.from("media").remove([asset.file_path]);
    await supabase.from("media_assets").delete().eq("id", asset.id);
    setSelectedIds(prev => prev.filter(id => id !== asset.id));
    toast.success("Đã xoá tệp thành công");
    fetchAssets();
  };

  // ── Copy URL ───────────────────────────────────────────────────────────────
  const copyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.public_url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ── Save edit ──────────────────────────────────────────────────────────────
  const saveEdit = async () => {
    if (!editingAsset) return;
    await supabase.from("media_assets")
      .update({ alt_text: editingAsset.alt_text, caption: editingAsset.caption })
      .eq("id", editingAsset.id);
    setEditingAsset(null);
    fetchAssets();
  };

  // ── Drag & Drop ────────────────────────────────────────────────────────────
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const selectedAsset = assets.find((a) => selectedIds.length === 1 && a.id === selectedIds[0]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ── Toolbar ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Thư viện Media</h1>
          <p className="text-xs text-gray-500 mt-0.5">{assets.length} tệp</p>
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
          />
        </div>

        {/* Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả</option>
          <option value="image">Hình ảnh</option>
          <option value="video">Video</option>
          <option value="document">Tài liệu</option>
        </select>

        {/* View toggle */}
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-select toggle */}
        <button
          onClick={() => {
            setMultiSelectMode(!multiSelectMode);
            if (!multiSelectMode) setShowSelectionHint(false);
          }}
          className={`inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-all ${
            multiSelectMode 
              ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-100" 
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          <MousePointer2 className="w-4 h-4" />
          {multiSelectMode ? "Hủy chọn nhiều" : "Chọn nhiều"}
        </button>

        {/* Move button */}
        {selectedIds.length > 0 && (
          <button
            onClick={() => setShowMoveModal(true)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"
          >
            <FolderInput className="w-4 h-4" />
            Di chuyển ({selectedIds.length})
          </button>
        )}

        {/* Create folder button */}
        <button
          onClick={() => setShowCreateFolder(true)}
          className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors"
          title="Tạo thư mục"
        >
          <FolderPlus className="w-4 h-4" />
        </button>

        {/* Upload Button with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex border border-blue-600 rounded-lg overflow-hidden">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors border-r border-blue-500"
            >
              <Upload className="w-4 h-4" />
              Tải lên
            </button>
            <button
              onClick={() => setShowUploadDropdown(!showUploadDropdown)}
              className="px-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {showUploadDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <button
                onClick={() => {
                  setShowUploadDropdown(false);
                  fileInputRef.current?.click();
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-3 transition-colors"
              >
                <FileUp className="w-4 h-4 text-blue-500" />
                Tải lên tệp
              </button>
              <button
                onClick={() => {
                  setShowUploadDropdown(false);
                  folderInputRef.current?.click();
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-3 transition-colors"
              >
                <FolderUp className="w-4 h-4 text-blue-500" />
                Tải lên thư mục
              </button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,video/webm,image/webp,application/pdf,.doc,.docx,.xls,.xlsx"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <input
          ref={folderInputRef}
          type="file"
          // @ts-ignore
          webkitdirectory=""
          directory=""
          multiple
          accept="image/*,video/*,video/webm,image/webp,application/pdf,.doc,.docx,.xls,.xlsx"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files, true)}
        />
      </div>

      {/* ── Breadcrumbs ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-2 flex items-center gap-2 text-sm text-gray-500 overflow-x-auto">
        <button 
          onClick={() => setCurrentFolderId(null)}
          className={`hover:text-blue-600 font-medium ${!currentFolderId ? "text-blue-600" : ""}`}
        >
          Gốc
        </button>
        {breadcrumbPath.map((folder, idx) => (
          <React.Fragment key={folder.id}>
            <span className="text-gray-300">/</span>
            <button 
              onClick={() => setCurrentFolderId(folder.id)}
              className={`hover:text-blue-600 font-medium whitespace-nowrap ${idx === breadcrumbPath.length - 1 ? "text-blue-600" : ""}`}
            >
              {folder.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Selection Hint Tooltip */}
        {showSelectionHint && selectedIds.length === 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-4 py-2.5 rounded-2xl text-xs font-medium shadow-2xl animate-in fade-in slide-in-from-bottom-4 flex items-center gap-3 border border-gray-800">
            <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Info className="w-4 h-4 text-blue-400" />
            </div>
            <span>Giữ <b>Cmd/Ctrl</b> để chọn nhiều, hoặc bật <b>Chế độ chọn nhiều</b> ở trên.</span>
            <button onClick={() => setShowSelectionHint(false)} className="ml-1 p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        )}

        {/* Move Assets Modal */}
        {showMoveModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md flex flex-col max-h-[80vh]">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Di chuyển {selectedIds.length} mục</h3>
                <button onClick={() => setShowMoveModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="overflow-y-auto p-2">
                <button
                  onClick={() => handleMoveAssets(null)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl flex items-center gap-3 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FolderPlus className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Thư mục gốc</p>
                    <p className="text-xs text-gray-500">/</p>
                  </div>
                </button>
                
                <div className="h-px bg-gray-100 my-2 mx-4" />

                {allFoldersList.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm italic">
                    Chưa có thư mục nào khác
                  </div>
                ) : allFoldersList.map(f => (
                  <button
                    key={f.id}
                    onClick={() => handleMoveAssets(f.id)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl flex items-center gap-3 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FolderPlus className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{f.name}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex gap-3">
                <button
                  onClick={() => setShowMoveModal(false)}
                  className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
                >
                  Huỷ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Folder Modal */}
        {showCreateFolder && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-sm">
              <h3 className="font-bold text-gray-900 mb-4">Tạo thư mục mới</h3>
              <input
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createFolder()}
                placeholder="Tên thư mục..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={createFolder}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
                >
                  Tạo
                </button>
                <button
                  onClick={() => { setShowCreateFolder(false); setNewFolderName(""); }}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200"
                >
                  Huỷ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Main area ── */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="mb-4 space-y-2">
              {Object.entries(uploadProgress).map(([name, pct]) => (
                <div key={name} className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 truncate max-w-xs">{name}</span>
                    <span className="text-xs text-gray-500">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Drop zone when empty or dragging */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`relative ${dragOver ? "ring-2 ring-blue-500 ring-offset-2 rounded-2xl" : ""}`}
          >
            {loading ? (
              <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Đang tải...</div>
            ) : (folders.length === 0 && assets.length === 0) ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-blue-400 transition-colors"
              >
                <Upload className="w-10 h-10 text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-500">Kéo thả tệp vào đây hoặc nhấn để chọn</p>
                <p className="text-xs text-gray-400 mt-1">Hỗ trợ: JPG, PNG, WebP, GIF, MP4, PDF, DOC</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {/* Folders first */}
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    onDoubleClick={() => setCurrentFolderId(folder.id)}
                    className="group relative bg-white rounded-xl border-2 border-gray-100 cursor-pointer overflow-hidden transition-all hover:border-blue-200 p-3 flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <FolderPlus className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-xs font-bold text-gray-700 truncate w-full text-center">{folder.name}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirmFolder(folder); }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))}

                {/* Assets */}
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={(e) => toggleSelect(asset.id, e)}
                    className={`group relative bg-white rounded-xl border-2 cursor-pointer overflow-hidden transition-all ${
                      selectedIds.includes(asset.id) ? "border-blue-500 shadow-md ring-2 ring-blue-500/20" : "border-gray-100 hover:border-blue-200"
                    }`}
                  >
                    {/* Selection Checkmark */}
                    {selectedIds.includes(asset.id) && (
                      <div className="absolute top-2 left-2 z-10 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 text-white stroke-[3px]" />
                      </div>
                    )}
                    {/* Thumbnail */}
                    <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                      {asset.file_type === "image" ? (
                        <img src={asset.public_url} alt={asset.alt_text || asset.original_name} className="w-full h-full object-cover" />
                      ) : (
                        <FileTypeIcon type={asset.file_type} className="w-10 h-10" />
                      )}
                    </div>
                    {/* File name */}
                    <div className="p-2">
                      <p className="text-xs font-medium text-gray-700 truncate">{asset.original_name}</p>
                      <p className="text-[10px] text-gray-400">{formatBytes(asset.size_bytes)}</p>
                    </div>
                    {/* Quick actions on hover */}
                    <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); copyUrl(asset); }}
                        className="w-7 h-7 bg-white rounded-lg shadow border border-gray-200 flex items-center justify-center hover:bg-blue-50"
                        title="Sao chép URL"
                      >
                        {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmAsset(asset); }}
                        className="w-7 h-7 bg-white rounded-lg shadow border border-gray-200 flex items-center justify-center hover:bg-red-50"
                        title="Xoá"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List view */
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Tên tệp</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Loại</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Kích thước</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày tải</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {/* Folders first in list */}
                    {folders.map((folder) => (
                      <tr
                        key={folder.id}
                        onDoubleClick={() => setCurrentFolderId(folder.id)}
                        className="border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center shrink-0">
                              <FolderPlus className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="font-bold text-gray-800">.. {folder.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">Thư mục</td>
                        <td className="px-4 py-3 text-gray-500">-</td>
                        <td className="px-4 py-3 text-gray-500">{new Date(folder.created_at).toLocaleDateString("vi-VN")}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmFolder(folder); }} className="p-1.5 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* Assets in list */}
                    {assets.map((asset) => (
                      <tr
                        key={asset.id}
                        onClick={(e) => toggleSelect(asset.id, e)}
                        className={`border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${selectedIds.includes(asset.id) ? "bg-blue-50" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                              {asset.file_type === "image"
                                ? <img src={asset.public_url} alt="" className="w-full h-full object-cover" />
                                : <FileTypeIcon type={asset.file_type} className="w-4 h-4" />}
                            </div>
                            <span className="font-medium text-gray-800 truncate max-w-xs">{asset.original_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 capitalize">{asset.file_type}</td>
                        <td className="px-4 py-3 text-gray-500">{formatBytes(asset.size_bytes)}</td>
                        <td className="px-4 py-3 text-gray-500">{new Date(asset.created_at).toLocaleDateString("vi-VN")}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={(e) => { e.stopPropagation(); copyUrl(asset); }} className="p-1.5 hover:bg-gray-100 rounded-lg">
                              {copiedId === asset.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmAsset(asset); }} className="p-1.5 hover:bg-red-50 rounded-lg">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── Detail panel ── */}
        {selectedAsset && (
          <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto shrink-0 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <span className="font-semibold text-gray-800 text-sm">Chi tiết</span>
              <button onClick={() => setSelectedIds([])} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Preview */}
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              {selectedAsset.file_type === "image" ? (
                <img src={selectedAsset.public_url} alt="" className="w-full rounded-lg object-contain max-h-48" />
              ) : selectedAsset.file_type === "video" ? (
                <video src={selectedAsset.public_url} controls className="w-full rounded-lg" />
              ) : (
                <div className="flex flex-col items-center justify-center h-32 bg-white rounded-lg border border-gray-200">
                  <FileTypeIcon type={selectedAsset.file_type} className="w-12 h-12" />
                  <p className="text-xs text-gray-500 mt-2">{selectedAsset.mime_type}</p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 space-y-3 text-xs flex-1">
              <div>
                <p className="font-medium text-gray-500 mb-1">Tên tệp</p>
                <p className="text-gray-800 break-all">{selectedAsset.original_name}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500 mb-1">Kích thước</p>
                <p className="text-gray-800">{formatBytes(selectedAsset.size_bytes)}</p>
              </div>
              {selectedAsset.width && (
                <div>
                  <p className="font-medium text-gray-500 mb-1">Kích thước ảnh</p>
                  <p className="text-gray-800">{selectedAsset.width} × {selectedAsset.height} px</p>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-500 mb-1">Ngày tải lên</p>
                <p className="text-gray-800">{new Date(selectedAsset.created_at).toLocaleString("vi-VN")}</p>
              </div>

              {/* URL copy */}
              <div>
                <p className="font-medium text-gray-500 mb-1">URL công khai</p>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <span className="flex-1 text-gray-600 truncate text-[11px]">{selectedAsset.public_url}</span>
                  <button onClick={() => copyUrl(selectedAsset)}>
                    {copiedId === selectedAsset.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400 hover:text-blue-500" />}
                  </button>
                </div>
              </div>

              {/* Editable metadata */}
              {editingAsset?.id === selectedAsset.id ? (
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-500 mb-1">Alt Text</p>
                    <input
                      value={editingAsset.alt_text}
                      onChange={(e) => setEditingAsset({ ...editingAsset, alt_text: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mô tả hình ảnh..."
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 mb-1">Caption</p>
                    <textarea
                      value={editingAsset.caption}
                      onChange={(e) => setEditingAsset({ ...editingAsset, caption: e.target.value })}
                      rows={2}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Chú thích..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">
                      Lưu
                    </button>
                    <button onClick={() => setEditingAsset(null)} className="flex-1 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200">
                      Huỷ
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setEditingAsset({ ...selectedAsset })}
                  className="w-full py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Chỉnh sửa thông tin
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-100 space-y-2">
              <a
                href={selectedAsset.public_url}
                download
                className="flex items-center justify-center gap-2 w-full py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                <Download className="w-3.5 h-3.5" /> Tải xuống
              </a>
              <button
                onClick={() => setDeleteConfirmAsset(selectedAsset)}
                className="flex items-center justify-center gap-2 w-full py-2 border border-red-200 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" /> Xoá tệp
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteConfirmFolder !== null}
        title="Xoá thư mục"
        description={`Bạn có chắc chắn muốn xoá thư mục "${deleteConfirmFolder?.name}" và toàn bộ nội dung bên trong?`}
        confirmText="Xoá thư mục"
        onConfirm={() => {
          if (deleteConfirmFolder) {
            deleteFolder(deleteConfirmFolder);
            setDeleteConfirmFolder(null);
          }
        }}
        onClose={() => setDeleteConfirmFolder(null)}
      />

      <ConfirmModal
        isOpen={deleteConfirmAsset !== null}
        title="Xoá tệp"
        description={`Bạn có chắc chắn muốn xoá "${deleteConfirmAsset?.original_name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xoá tệp"
        onConfirm={() => {
          if (deleteConfirmAsset) {
            handleDelete(deleteConfirmAsset);
            setDeleteConfirmAsset(null);
            if (selectedIds.length === 1 && selectedIds[0] === deleteConfirmAsset.id) {
              setSelectedIds([]);
            }
          }
        }}
        onClose={() => setDeleteConfirmAsset(null)}
      />
    </div>
  );
}
