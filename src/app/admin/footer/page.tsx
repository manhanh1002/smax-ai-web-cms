"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Save, Plus, Trash2, ChevronUp, ChevronDown, Layers, Image as ImageIcon, Link as LinkIcon, Share2, Mail, Settings } from "lucide-react";
import { IconPicker } from "@/components/cms/IconPicker";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { IconRenderer } from "@/components/layout/IconRenderer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ActionPicker } from "@/components/cms/block-editors/shared";
import { toast } from "sonner";

const BRAND_COLORS = [
  { name: 'Primary', value: 'primary' },
  { name: 'Blue', value: 'blue-500' },
  { name: 'Green', value: 'green-500' },
  { name: 'Purple', value: 'purple-500' },
  { name: 'Orange', value: 'orange-500' },
  { name: 'Red', value: 'red-500' },
];

export default function FooterBuilder() {
  const [settings, setSettings] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [footerColumns, setFooterColumns] = useState<any[]>([]);
  const [footerConfig, setFooterConfig] = useState<any>({
    bg_color: '#ffffff',
    text_mode: 'light',
    copyright: '',
    bottom_links: []
  });
  const [saving, setSaving] = useState(false);
  const [expandedBlock, setExpandedBlock] = useState<{ colIdx: number, blockIdx: number } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: siteData } = await supabase.from("site_settings").select("*").single();
    if (siteData) {
      setSettings(siteData);
      
      // Migration: convert old flat columns to new nested blocks structure if needed
      const rawContent = siteData.footer_content || [];
      const migratedContent = rawContent.map((col: any) => {
        if (col.blocks) return col;
        // Old structure: col is a block. Wrap it.
        return { blocks: [col] };
      });
      setFooterColumns(migratedContent);

      setFooterConfig(siteData.footer_config || {
        bg_color: '#ffffff',
        text_mode: 'light',
        copyright: `© ${new Date().getFullYear()} ${siteData.site_name}. All rights reserved.`,
        bottom_links: []
      });
    }

    const { data: pagesData } = await supabase.from("pages").select("id, title, slug");
    setPages(pagesData || []);

    const { data: productsData } = await supabase.from("products").select("id, title, slug");
    setProducts(productsData || []);
  }

  async function saveSettings() {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ 
        footer_content: footerColumns,
        footer_config: footerConfig
      })
      .eq("id", settings.id);
    
    if (!error) toast.success("Footer saved!");
    else toast.error("Error saving footer!");
    setSaving(false);
  }

  function addColumn() {
    if (footerColumns.length >= 5) return;
    setFooterColumns([...footerColumns, { blocks: [{ type: 'links', title: 'New Section', items: [] }] }]);
  }

  function addBlock(colIdx: number) {
    const newCols = [...footerColumns];
    newCols[colIdx].blocks.push({ type: 'links', title: 'New Section', items: [] });
    setFooterColumns(newCols);
    setExpandedBlock({ colIdx, blockIdx: newCols[colIdx].blocks.length - 1 });
  }

  function updateBlock(colIdx: number, blockIdx: number, updates: any) {
    const newCols = [...footerColumns];
    newCols[colIdx].blocks[blockIdx] = { ...newCols[colIdx].blocks[blockIdx], ...updates };
    setFooterColumns(newCols);
  }

  function removeBlock(colIdx: number, blockIdx: number) {
    const newCols = [...footerColumns];
    newCols[colIdx].blocks.splice(blockIdx, 1);
    if (newCols[colIdx].blocks.length === 0) {
      newCols.splice(colIdx, 1);
    }
    setFooterColumns(newCols);
    setExpandedBlock(null);
  }

  function moveColumn(index: number, direction: 'left' | 'right') {
    if ((direction === 'left' && index === 0) || (direction === 'right' && index === footerColumns.length - 1)) return;
    const newCols = [...footerColumns];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    [newCols[index], newCols[targetIndex]] = [newCols[targetIndex], newCols[index]];
    setFooterColumns(newCols);
  }

  if (!settings) return <div className="p-8 text-center text-gray-400">Loading Footer Builder...</div>;

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 text-gray-900 pb-32">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-4 z-50">
        <div>
          <h1 className="text-2xl font-bold">Footer Builder</h1>
          <p className="text-sm text-gray-500">Design a modular footer with up to 5 columns and multiple rows.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/admin/footer/config">
            <Button variant="outline" size="sm" className="h-10">
              <Settings className="w-4 h-4 mr-2" />
              Config Footer
            </Button>
          </Link>
          <Button onClick={saveSettings} disabled={saving} className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Footer"}
          </Button>
        </div>
      </div>

      {/* Global Config & Bottom Navigation */}
      <Card className="border-gray-200 shadow-sm bg-white rounded-3xl overflow-hidden">
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Footer Settings</h3>
        </div>
        <CardContent className="p-8 space-y-8">
           {/* Copyright */}
           <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Copyright Statement</label>
              <Input 
                className="h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary/20 transition-all"
                value={footerConfig.copyright} 
                onChange={(e) => setFooterConfig({...footerConfig, copyright: e.target.value})}
                placeholder="© 2024 Smax AI. All rights reserved."
              />
           </div>

           {/* Bottom Links */}
           <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Bottom Navigation Links</label>
                 <Button 
                   variant="outline" 
                   size="sm" 
                   className="text-xs h-8"
                   onClick={() => {
                     const newLinks = [...(footerConfig.bottom_links || []), { label: "New Link", href: "/" }];
                     setFooterConfig({ ...footerConfig, bottom_links: newLinks });
                   }}
                 >
                   <Plus className="w-3 h-3 mr-1" /> Add Link
                 </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {(footerConfig.bottom_links || []).map((link: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-200 flex flex-col gap-3 relative group">
                       <div className="grid grid-cols-3 gap-3 items-end">
                          <div className="col-span-2 space-y-1">
                             <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest px-1">Label</label>
                             <Input 
                                className="h-9 text-xs bg-white font-medium" 
                                placeholder="Privacy Policy"
                                value={link.label || ""} 
                                onChange={(e) => {
                                   const newLinks = [...(footerConfig.bottom_links || [])];
                                   newLinks[index].label = e.target.value;
                                   setFooterConfig({ ...footerConfig, bottom_links: newLinks });
                                }}
                             />
                          </div>
                          <div className="flex items-center space-x-1 justify-end h-9">
                             <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                                onClick={() => {
                                   const newLinks = (footerConfig.bottom_links || []).filter((_: any, idx: number) => idx !== index);
                                   setFooterConfig({ ...footerConfig, bottom_links: newLinks });
                                }}
                             >
                                <Trash2 className="w-3.5 h-3.5" />
                             </Button>
                          </div>
                       </div>
                       <div>
                          <ActionPicker 
                             label="Hành động khi click" 
                             value={link.href || ""} 
                             onChange={(val) => {
                                const newLinks = [...(footerConfig.bottom_links || [])];
                                newLinks[index].href = val;
                                setFooterConfig({ ...footerConfig, bottom_links: newLinks });
                             }} 
                          />
                       </div>
                    </div>
                 ))}
                 {(footerConfig.bottom_links || []).length === 0 && (
                    <div className="col-span-2 p-8 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                       Chưa có liên kết nào. Footer sẽ tự động hiển thị "Privacy Policy" và "Terms of Service" làm mặc định.
                    </div>
                 )}
              </div>
           </div>
        </CardContent>
      </Card>

      {/* Columns Grid - Horizontal Accordion */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-4 py-2 rounded-full">
             Footer Structure ({footerColumns.length}/5 Columns)
           </h3>
        </div>

        <div className="flex gap-4 h-[600px] items-start overflow-x-auto pb-4 px-2">
          {footerColumns.map((col, colIdx) => {
            const isColActive = expandedBlock?.colIdx === colIdx;
            const hasBlocks = col.blocks.length > 0;

            return (
              <div 
                key={colIdx} 
                className={cn(
                  "relative transition-all duration-500 ease-in-out flex flex-col gap-4",
                  isColActive ? "flex-[4] min-w-[500px]" : "flex-none w-16 md:w-20 hover:w-24 cursor-pointer"
                )}
                onClick={() => {
                   if (!isColActive && hasBlocks) {
                      setExpandedBlock({ colIdx, blockIdx: 0 });
                   } else if (!isColActive && !hasBlocks) {
                      addBlock(colIdx);
                   }
                }}
              >
                {/* Column Header/Label */}
                <div className={cn(
                  "flex items-center justify-between px-2 transition-all",
                  !isColActive && "flex-col space-y-4 py-4"
                )}>
                  {isColActive ? (
                    <>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); moveColumn(colIdx, 'left'); }} disabled={colIdx === 0}>
                          <ChevronUp className="w-3 h-3 rotate-[-90deg]" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); moveColumn(colIdx, 'right'); }} disabled={colIdx === footerColumns.length - 1}>
                          <ChevronUp className="w-3 h-3 rotate-[90deg]" />
                        </Button>
                      </div>
                      <span className="text-[10px] font-black text-primary uppercase">Column {colIdx + 1}</span>
                    </>
                  ) : (
                    <div className="flex flex-col items-center space-y-6">
                       <span className="text-[10px] font-black text-gray-300 uppercase [writing-mode:vertical-lr] rotate-180">
                         Column {colIdx + 1}
                       </span>
                       <div className="flex flex-col space-y-2">
                          {col.blocks.map((b: any, bi: number) => (
                             <div key={bi} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                                {b.type === 'links' && <LinkIcon className="w-3 h-3" />}
                                {b.type === 'info' && <Share2 className="w-3 h-3" />}
                                {b.type === 'newsletter' && <Mail className="w-3 h-3" />}
                                {b.type === 'image' && <ImageIcon className="w-3 h-3" />}
                             </div>
                          ))}
                       </div>
                    </div>
                  )}
                </div>

                {/* Blocks Container */}
                <div className={cn(
                  "flex-1 space-y-3 overflow-y-auto pr-1 transition-all custom-scrollbar",
                  !isColActive && "opacity-0 pointer-events-none"
                )}>
                  {col.blocks.map((block: any, blockIdx: number) => {
                    const isExpanded = isColActive && expandedBlock?.blockIdx === blockIdx;
                    
                    return (
                      <Card 
                        key={blockIdx} 
                        className={cn(
                          "border-gray-200 shadow-sm transition-all overflow-hidden rounded-2xl",
                          isExpanded ? "ring-2 ring-primary/20 shadow-xl" : "hover:shadow-md cursor-pointer"
                        )}
                        onClick={(e) => { e.stopPropagation(); setExpandedBlock({ colIdx, blockIdx }); }}
                      >
                        {/* Block Header */}
                        <div className={cn(
                          "px-4 py-3 flex items-center justify-between border-b transition-colors",
                          isExpanded ? "bg-primary/5 border-primary/10" : "bg-white border-transparent"
                        )}>
                          <div className="flex items-center space-x-3 min-w-0">
                             <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", isExpanded ? "bg-primary text-white" : "bg-gray-100 text-gray-400")}>
                                {block.type === 'links' && <LinkIcon className="w-3.5 h-3.5" />}
                                {block.type === 'info' && <Share2 className="w-3.5 h-3.5" />}
                                {block.type === 'newsletter' && <Mail className="w-3.5 h-3.5" />}
                                {block.type === 'image' && <ImageIcon className="w-3.5 h-3.5" />}
                             </div>
                             <div className="min-w-0">
                                <p className={cn("text-[11px] font-black uppercase tracking-widest truncate", isExpanded ? "text-primary" : "text-gray-900")}>
                                  {block.title || (block.type === 'links' ? 'Links' : block.type === 'info' ? 'About' : block.type === 'newsletter' ? 'Newsletter' : 'Banner')}
                                </p>
                                {!isExpanded && <p className="text-[9px] text-gray-400 uppercase tracking-tighter truncate">{block.type}</p>}
                             </div>
                          </div>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                             {isExpanded && (
                               <Button 
                                 variant="ghost" 
                                 size="sm" 
                                 className="h-7 w-7 p-0 text-red-400 hover:text-red-600" 
                                 onClick={(e) => { e.stopPropagation(); removeBlock(colIdx, blockIdx); }}
                               >
                                 <Trash2 className="w-3.5 h-3.5" />
                               </Button>
                             )}
                             <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); setExpandedBlock(isExpanded ? null : { colIdx, blockIdx }); }}>
                               <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded ? "rotate-180 text-primary" : "text-gray-300")} />
                             </Button>
                          </div>
                        </div>

                        {/* Block Editor */}
                        {isExpanded && (
                          <CardContent className="p-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
                             <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                   <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Type</label>
                                      <select 
                                        className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-white outline-none"
                                        value={block.type}
                                        onChange={(e) => updateBlock(colIdx, blockIdx, { type: e.target.value })}
                                      >
                                        <option value="links">Links List</option>
                                        <option value="info">Company Info</option>
                                        <option value="newsletter">Newsletter</option>
                                        <option value="image">Banner/Image</option>
                                      </select>
                                   </div>
                                   <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Section Title</label>
                                      <Input 
                                        className="h-9 text-xs" 
                                        placeholder="About Us" 
                                        value={block.title} 
                                        onChange={(e) => updateBlock(colIdx, blockIdx, { title: e.target.value })} 
                                      />
                                   </div>
                                </div>

                                {block.type === 'links' && (
                                  <div className="space-y-4">
                                    <div className="space-y-3">
                                      {(block.items || []).map((sub: any, subIdx: number) => (
                                        <div key={subIdx} className="group/item p-4 bg-gray-50/50 rounded-2xl border border-gray-200 hover:border-primary/40 transition-all space-y-4 relative">
                                           <div className="flex items-center gap-4 border-b border-gray-100 pb-3">
                                              <IconPicker 
                                                value={sub.icon} 
                                                onChange={(val) => {
                                                  const newItems = [...(block.items || [])];
                                                  newItems[subIdx].icon = val;
                                                  updateBlock(colIdx, blockIdx, { items: newItems });
                                                }}
                                              />
                                              <div className="flex-1">
                                                <Input 
                                                  className="bg-white text-xs font-bold h-9 border-none shadow-none focus-visible:ring-0 p-0" 
                                                  placeholder="Label" 
                                                  value={sub.label} 
                                                  onChange={(e) => {
                                                    const newItems = [...(block.items || [])];
                                                    newItems[subIdx].label = e.target.value;
                                                    updateBlock(colIdx, blockIdx, { items: newItems });
                                                  }}
                                                />
                                              </div>
                                           </div>
                                           <div className="grid grid-cols-1 gap-3">
                                              <div className="space-y-1">
                                                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest px-1">Type</label>
                                                <select 
                                                  className="w-full bg-white text-[10px] font-medium h-8 px-3 border border-gray-200 rounded-lg outline-none"
                                                  value={sub.type || 'link'}
                                                  onChange={(e) => {
                                                    const newItems = [...(block.items || [])];
                                                    newItems[subIdx].type = e.target.value;
                                                    updateBlock(colIdx, blockIdx, { items: newItems });
                                                  }}
                                                >
                                                  <option value="link">Page</option>
                                                  <option value="product">Product</option>
                                                  <option value="external">External</option>
                                                </select>
                                              </div>
                                              <div className="md:col-span-2">
                                                 <ActionPicker 
                                                   label="Hành động khi click" 
                                                   value={sub.href || ""} 
                                                   onChange={(val) => {
                                                     const newItems = [...(block.items || [])];
                                                     newItems[subIdx].href = val;
                                                     updateBlock(colIdx, blockIdx, { items: newItems });
                                                   }} 
                                                 />
                                               </div>
                                              <div className="space-y-1">
                                                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest px-1">Description</label>
                                                <textarea 
                                                  className="w-full p-2 text-[10px] bg-white border border-gray-200 rounded-lg resize-none h-12 outline-none italic text-gray-500"
                                                  placeholder="Description..." 
                                                  value={sub.description || ''} 
                                                  onChange={(e) => {
                                                    const newItems = [...(block.items || [])];
                                                    newItems[subIdx].description = e.target.value;
                                                    updateBlock(colIdx, blockIdx, { items: newItems });
                                                  }}
                                                />
                                              </div>
                                           </div>
                                           <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover/item:opacity-100 text-red-400"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const newItems = [...(block.items || [])].filter((_, i) => i !== subIdx);
                                                updateBlock(colIdx, blockIdx, { items: newItems });
                                              }}
                                            >
                                             <Trash2 className="w-3 h-3" />
                                           </Button>
                                        </div>
                                      ))}
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="w-full h-10 border border-dashed border-gray-200 text-[10px] text-gray-400 hover:text-primary hover:border-primary transition-all rounded-xl"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const newItems = [...(block.items || []), { label: 'New Link', href: '/', icon: 'Link', type: 'link' }];
                                          updateBlock(colIdx, blockIdx, { items: newItems });
                                        }}
                                      >
                                        <Plus className="w-3 h-3 mr-1" /> Add Link
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {block.type === 'info' && (
                                  <div className="space-y-4">
                                     <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                           <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Logo Light</label>
                                           <MediaPicker 
                                              onSelect={(url) => updateBlock(colIdx, blockIdx, { logo_light: url })}
                                              trigger={
                                                <div className="aspect-video bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-primary overflow-hidden">
                                                  {block.logo_light ? <img src={block.logo_light} className="w-full h-full object-contain p-2" /> : <ImageIcon className="w-4 h-4 text-gray-300" />}
                                                </div>
                                              }
                                           />
                                        </div>
                                        <div className="space-y-1">
                                           <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Logo Dark</label>
                                           <MediaPicker 
                                              onSelect={(url) => updateBlock(colIdx, blockIdx, { logo_dark: url })}
                                              trigger={
                                                <div className="aspect-video bg-gray-900 rounded-xl border border-dashed border-gray-700 flex items-center justify-center cursor-pointer hover:border-primary overflow-hidden">
                                                  {block.logo_dark ? <img src={block.logo_dark} className="w-full h-full object-contain p-2" /> : <ImageIcon className="w-4 h-4 text-gray-600" />}
                                                </div>
                                              }
                                           />
                                        </div>
                                     </div>
                                     <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                                        <textarea 
                                           className="w-full p-3 text-[11px] bg-gray-50 border-transparent rounded-xl h-24 outline-none focus:bg-white focus:ring-2 focus:ring-primary/5 transition-all"
                                           placeholder="Bio..."
                                           value={block.description || ''}
                                           onChange={(e) => updateBlock(colIdx, blockIdx, { description: e.target.value })}
                                        />
                                     </div>
                                  </div>
                                )}

                                {block.type === 'newsletter' && (
                                  <div className="space-y-4">
                                     <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                                        <textarea 
                                           className="w-full p-3 text-[11px] bg-gray-50 border-transparent rounded-xl h-20 outline-none focus:bg-white focus:ring-2 focus:ring-primary/5 transition-all"
                                           placeholder="Stay updated..."
                                           value={block.description || ''}
                                           onChange={(e) => updateBlock(colIdx, blockIdx, { description: e.target.value })}
                                        />
                                     </div>
                                     <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                           <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Placeholder</label>
                                           <Input className="text-[11px] h-9" value={block.placeholder} onChange={(e) => updateBlock(colIdx, blockIdx, { placeholder: e.target.value })} />
                                        </div>
                                        <div className="space-y-1">
                                           <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Btn Text</label>
                                           <Input className="text-[11px] h-9" value={block.button_text} onChange={(e) => updateBlock(colIdx, blockIdx, { button_text: e.target.value })} />
                                        </div>
                                     </div>
                                  </div>
                                )}

                                {block.type === 'image' && (
                                  <div className="space-y-4">
                                     <MediaPicker 
                                        onSelect={(url) => updateBlock(colIdx, blockIdx, { image: url })}
                                        trigger={
                                          <div className="w-full aspect-video bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-primary overflow-hidden">
                                            {block.image ? <img src={block.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-gray-300" />}
                                          </div>
                                        }
                                     />
                                     <Input className="text-xs h-9" placeholder="Label" value={block.image_label} onChange={(e) => updateBlock(colIdx, blockIdx, { image_label: e.target.value })} />
                                     <ActionPicker 
                                       label="Hành động khi click ảnh" 
                                       value={block.href || ""} 
                                       onChange={(val) => updateBlock(colIdx, blockIdx, { href: val })} 
                                     />
                                  </div>
                                )}
                             </div>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full h-12 border border-dashed border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-primary hover:border-primary/20 hover:bg-primary/5 rounded-2xl transition-all"
                    onClick={(e) => { e.stopPropagation(); addBlock(colIdx); }}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Block Row
                  </Button>
                </div>
              </div>
            );
          })}
          
          {footerColumns.length < 5 && (
            <Button variant="outline" className="h-full min-h-[500px] w-20 border-dashed border-2 rounded-3xl bg-white hover:bg-gray-50 transition-all flex flex-col items-center justify-center space-y-3 text-gray-300 hover:text-primary hover:border-primary/20 shrink-0" onClick={addColumn}>
              <Plus className="w-8 h-8" />
              <span className="text-[10px] font-black uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">New Column</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
