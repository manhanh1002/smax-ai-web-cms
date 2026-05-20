
"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Search, Check, Image as ImageIcon, X, Loader2, Upload, Plus, FolderPlus, ChevronDown, FolderUp, FileUp, MousePointer2, Info } from "lucide-react";

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
  public_url: string;
  mime_type: string;
  file_type: string;
  size_bytes: number;
  folder_id: string | null;
  created_at: string;
}

interface MediaPickerProps {
  onSelect: (url: string) => void;
  trigger?: React.ReactNode;
}

export function MediaPicker({ onSelect, trigger }: MediaPickerProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [showSelectionHint, setShowSelectionHint] = useState(false);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (open) {
      fetchAssets();
    }
  }, [open, search, currentFolderId]);

  // ── Breadcrumbs ──
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
    if (open) updateBreadcrumbs();
  }, [currentFolderId, open]);

  function getFileType(mime: string) {
    if (mime.startsWith("image/")) return "image";
    if (mime.startsWith("video/")) return "video";
    if (mime === "application/pdf" || mime.includes("document") || mime.includes("text")) return "document";
    return "other";
  }

  const uploadSingleFile = async (file: File, targetFolderId: string | null) => {
    const fileType = getFileType(file.type);
    const timestamp = Date.now();

    let fileToUpload: Blob | File = file;
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
        nameToUpload = (fileToUpload as File).name;
      } catch (err) {
        console.error("Compression failed:", err);
      }
    }

    const filePath = `uploads/${timestamp}_${nameToUpload.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const { data: storageData, error } = await supabase.storage
      .from("media")
      .upload(filePath, fileToUpload, { upsert: false, contentType: mimeType });

    if (error || !storageData) {
      console.error("Upload error:", error);
      return;
    }

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;

    const { data: dbData, error: dbError } = await supabase.from("media_assets").insert({
      name: filePath.split("/").pop(),
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
  };

  const handleFiles = async (files: FileList | null, isFolder: boolean = false) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const folderCache: Record<string, string> = {}; // path -> id

    for (const file of Array.from(files)) {
      let targetFolderId = currentFolderId;

      if (isFolder && (file as any).webkitRelativePath) {
        const pathParts = (file as any).webkitRelativePath.split('/');
        pathParts.pop();

        let parentId = currentFolderId;
        let currentPath = "";

        for (const part of pathParts) {
          currentPath += (currentPath ? "/" : "") + part;
          if (folderCache[currentPath]) {
            parentId = folderCache[currentPath];
          } else {
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

  const toggleSelect = (asset: MediaAsset, e: React.MouseEvent) => {
    const id = asset.id;
    if (multiSelectMode || e.shiftKey || e.metaKey || e.ctrlKey) {
      setSelectedIds(prev => {
        const isSelected = prev.includes(id);
        const newSelected = isSelected ? prev.filter(i => i !== id) : [...prev, id];
        
        if (!isSelected && newSelected.length === 1 && !multiSelectMode) {
          setShowSelectionHint(true);
        } else {
          setShowSelectionHint(false);
        }
        return newSelected;
      });
    } else {
      // Single select behavior
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

  const handleConfirm = () => {
    const selectedAssets = assets.filter(a => selectedIds.includes(a.id));
    if (selectedAssets.length === 0) return;
    
    // If only one, return string (for backward compatibility)
    // If multiple, we might need a different prop, but for now we just return the first one or a comma-separated string?
    // Actually, let's just return the first one if the caller doesn't support multiple.
    // Ideally the caller should handle string[].
    const urls = selectedAssets.map(a => a.public_url);
    onSelect(urls.length === 1 ? urls[0] : urls.join(","));
    setOpen(false);
  };

  useEffect(() => {
    if (showSelectionHint) {
      const timer = setTimeout(() => setShowSelectionHint(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSelectionHint]);

  async function fetchAssets() {
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
    let q = supabase
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false });

    if (currentFolderId) {
      q = q.eq("folder_id", currentFolderId);
    } else {
      q = q.is("folder_id", null);
    }

    if (search) {
      q = q.ilike("original_name", `%${search}%`);
    }

    const { data } = await q;
    setAssets(data || []);
    setLoading(false);
  }

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    const { error } = await supabase.from("media_folders").insert({
      name: newFolderName.trim(),
      parent_id: currentFolderId
    });
    if (!error) {
      setNewFolderName("");
      setShowCreateFolder(false);
      fetchAssets();
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {trigger || (
          <Button variant="outline" size="sm" className="rounded-xl">
            <ImageIcon className="w-4 h-4 mr-2" /> Chọn từ Media
          </Button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-black text-slate-900">Thư viện Media</h3>
                  <div className="flex gap-2 relative" ref={dropdownRef}>
                    {/* Multi-select toggle */}
                    <button
                      onClick={() => {
                        setMultiSelectMode(!multiSelectMode);
                        if (!multiSelectMode) setShowSelectionHint(false);
                      }}
                      className={`inline-flex items-center gap-2 px-3 h-8 border rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                        multiSelectMode 
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg" 
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <MousePointer2 className="w-3 h-3" />
                      {multiSelectMode ? "Hủy chọn nhiều" : "Chọn nhiều"}
                    </button>

                    <div className="flex border border-blue-600 rounded-full overflow-hidden">
                      <Button 
                        onClick={() => fileInputRef.current?.click()} 
                        disabled={uploading}
                        size="sm" 
                        className="rounded-none h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white gap-2 border-r border-blue-500"
                      >
                        {uploading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                        Tải lên
                      </Button>
                      <button
                        onClick={() => setShowUploadDropdown(!showUploadDropdown)}
                        disabled={uploading}
                        className="px-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>

                    {showUploadDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[110] overflow-hidden">
                        <button
                          onClick={() => {
                            setShowUploadDropdown(false);
                            fileInputRef.current?.click();
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 flex items-center gap-3"
                        >
                          <FileUp className="w-4 h-4 text-blue-500" />
                          Tải lên tệp
                        </button>
                        <button
                          onClick={() => {
                            setShowUploadDropdown(false);
                            folderInputRef.current?.click();
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 flex items-center gap-3"
                        >
                          <FolderUp className="w-4 h-4 text-blue-500" />
                          Tải lên thư mục
                        </button>
                      </div>
                    )}

                    <Button
                      onClick={() => setShowCreateFolder(true)}
                      variant="outline"
                      size="sm"
                      className="rounded-full h-8 px-3 border-slate-200 text-slate-600 gap-2"
                    >
                      <Plus className="w-3 h-3" />
                      Thư mục
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,video/webm,image/webp,application/pdf"
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
                    accept="image/*,video/*,video/webm,image/webp,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files, true)}
                  />
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Breadcrumbs */}
              <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest overflow-x-auto">
                <button 
                  onClick={() => setCurrentFolderId(null)}
                  className={`hover:text-blue-600 ${!currentFolderId ? "text-blue-600" : ""}`}
                >
                  Gốc
                </button>
                {breadcrumbPath.map((folder, idx) => (
                  <React.Fragment key={folder.id}>
                    <span className="text-slate-200">/</span>
                    <button 
                      onClick={() => setCurrentFolderId(folder.id)}
                      className={`hover:text-blue-600 whitespace-nowrap ${idx === breadcrumbPath.length - 1 ? "text-blue-600" : ""}`}
                    >
                      {folder.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>

              {/* Search */}
              <div className="px-6 py-4 border-b border-slate-50 shrink-0">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm tệp..."
                    className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto p-6 min-h-[400px] relative">
                {/* Create Folder Popup */}
                {showCreateFolder && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm p-4">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 w-full max-w-sm"
                    >
                      <h4 className="font-black text-slate-900 mb-4">Tạo thư mục mới</h4>
                      <input
                        autoFocus
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && createFolder()}
                        placeholder="Tên thư mục..."
                        className="w-full border-slate-200 rounded-2xl px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                      <div className="flex gap-2">
                        <Button onClick={createFolder} className="flex-1 rounded-2xl bg-blue-600">Tạo</Button>
                        <Button onClick={() => { setShowCreateFolder(false); setNewFolderName(""); }} variant="ghost" className="flex-1 rounded-2xl">Huỷ</Button>
                      </div>
                    </motion.div>
                  </div>
                )}

                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-sm font-medium">Đang tải tài nguyên...</p>
                  </div>
                ) : (folders.length === 0 && assets.length === 0) ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300 py-12">
                    <div className="p-6 bg-slate-50 rounded-full mb-4">
                      <ImageIcon className="w-12 h-12 opacity-20" />
                    </div>
                    <p className="font-bold">Không tìm thấy tệp nào</p>
                    <p className="text-xs mt-1">Hãy thử tìm kiếm với từ khóa khác</p>
                  </div>
                ) : (
                  <div className="pb-20">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {/* Folders */}
                      {folders.map((folder) => (
                        <motion.div
                          key={folder.id}
                          onClick={() => setCurrentFolderId(folder.id)}
                          className="group relative aspect-square bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer overflow-hidden hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all flex flex-col items-center justify-center gap-3"
                        >
                          <div className="p-4 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
                            <FolderPlus className="w-8 h-8 text-blue-500" />
                          </div>
                          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter px-3 text-center truncate w-full">
                            {folder.name}
                          </p>
                        </motion.div>
                      ))}

                      {/* Assets */}
                      {assets.map((asset) => (
                        <motion.div
                          key={asset.id}
                          layoutId={asset.id}
                          onClick={(e) => toggleSelect(asset, e)}
                          onDoubleClick={() => {
                            onSelect(asset.public_url);
                            setOpen(false);
                          }}
                          className={`group relative aspect-square bg-slate-50 rounded-2xl border cursor-pointer overflow-hidden transition-all ${
                            selectedIds.includes(asset.id) ? "border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20" : "border-slate-100 hover:border-blue-500"
                          }`}
                        >
                          {asset.file_type === "image" ? (
                            <img
                              src={asset.public_url}
                              alt={asset.original_name}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-2">
                              <ImageIcon className="w-8 h-8 text-slate-300" />
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                {asset.mime_type.split("/")[1]}
                              </span>
                            </div>
                          )}
                          
                          {/* Selection UI */}
                          <div className={`absolute inset-0 bg-blue-600/10 transition-opacity flex items-center justify-center ${selectedIds.includes(asset.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                            <div className={`p-2 bg-white rounded-full shadow-lg transform transition-all ${selectedIds.includes(asset.id) ? "scale-110" : "translate-y-4 group-hover:translate-y-0"}`}>
                              <Check className={`w-5 h-5 ${selectedIds.includes(asset.id) ? "text-blue-600" : "text-slate-300"}`} />
                            </div>
                          </div>
                          
                          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                            <p className="text-[10px] text-white truncate font-bold leading-none">
                              {asset.original_name}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Hint Tooltip */}
                    {showSelectionHint && selectedIds.length === 1 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-2xl flex items-center gap-3 border border-slate-800"
                      >
                        <div className="w-5 h-5 bg-blue-500/20 rounded flex items-center justify-center">
                          <Info className="w-3 h-3 text-blue-400" />
                        </div>
                        <span>Giữ <b>Cmd/Ctrl</b> để chọn nhiều mục</span>
                        <button onClick={() => setShowSelectionHint(false)} className="ml-1">
                          <X className="w-3 h-3 text-slate-500" />
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex flex-col">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {assets.length + folders.length} mục khả dụng
                  </p>
                  {selectedIds.length > 0 && (
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest animate-pulse">
                      Đã chọn {selectedIds.length} mục
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpen(false)}
                    className="rounded-xl text-slate-500 text-[10px] font-bold uppercase tracking-widest"
                  >
                    Đóng
                  </Button>
                  {selectedIds.length > 0 && (
                    <Button
                      size="sm"
                      onClick={handleConfirm}
                      className="rounded-xl bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-6"
                    >
                      Xác nhận chọn
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
