"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Save, Plus, Trash2, ChevronUp, ChevronDown, Layers, Link as LinkIcon, Share2 } from "lucide-react";
import { IconPicker } from "@/components/cms/IconPicker";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { IconRenderer } from "@/components/layout/IconRenderer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import { ActionPicker } from "@/components/cms/block-editors/shared";
import { toast } from "sonner";

const BRAND_COLORS = [
  { name: "Brand", value: "primary" },
  { name: "Blue", value: "blue-500" },
  { name: "Green", value: "green-500" },
  { name: "Purple", value: "purple-500" },
  { name: "Orange", value: "orange-500" },
  { name: "Red", value: "red-500" },
];

export default function HeaderBuilder() {
  const [settings, setSettings] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'main' | 'mobile_bottom' | 'sub_header'>('main');
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [expandedMegaCol, setExpandedMegaCol] = useState<{ itemIdx: number; colIdx: number } | null>(null);
  const [showIconPicker, setShowIconPicker] = useState<number | null>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  
  // Data for dropdowns
  const [pages, setPages] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchSettings();
    fetchNavigationData();
  }, []);

  useEffect(() => {
    if (settings) {
      if (activeTab === 'main') setMenuItems(settings.navbar_menu || []);
      else if (activeTab === 'mobile_bottom') setMenuItems(settings.mobile_bottom_menu || []);
      else if (activeTab === 'sub_header') setMenuItems(settings.sub_header_menu || []);
    }
  }, [activeTab, settings]);

  async function fetchNavigationData() {
    const { data: pData } = await supabase.from("pages").select("id, title, slug, type").or('type.eq.custom,type.is.null');
    const { data: prData } = await supabase.from("pages").select("id, title, slug, type").eq("type", "product");
    if (pData) setPages(pData);
    if (prData) setProducts(prData);
  }

  async function fetchSettings() {
    const { data } = await supabase.from("site_settings").select("*").single();
    if (data) {
      setSettings(data);
    }
  }

  async function saveSettings() {
    setSaving(true);
    const updateData: any = {};
    if (activeTab === 'main') updateData.navbar_menu = menuItems;
    else if (activeTab === 'mobile_bottom') updateData.mobile_bottom_menu = menuItems;
    else if (activeTab === 'sub_header') updateData.sub_header_menu = menuItems;

    const { error } = await supabase
      .from("site_settings")
      .update(updateData)
      .eq("id", settings.id);
    
    if (!error) {
      toast.success("Navigation saved!");
      setSettings({ ...settings, ...updateData });
    }
    setSaving(false);
  }

  function addItem() {
    if (activeTab === 'mobile_bottom' && menuItems.length >= 5) {
      toast.error("Mobile Bottom Navigation is limited to 5 items.");
      return;
    }
    setMenuItems([...menuItems, { label: "New Item", href: "/", type: "link", icon: "", color: "primary", items: [], columns: 1 }]);
  }

  function addSubItem(index: number, subType: 'link' | 'block_card' | 'image_link' = 'link') {
    if (activeTab === 'mobile_bottom') return;
    const newItems = [...menuItems];
    if (!newItems[index].items) newItems[index].items = [];
    
    const newItem: any = { 
      label: "Sub Link", 
      href: "/", 
      type: subType,
      description: "", 
      icon: "", 
      color: "primary" 
    };

    if (subType === 'block_card') {
      newItem.image = "https://via.placeholder.com/400x300";
      newItem.ctaLabel = "Learn More";
    } else if (subType === 'image_link') {
      newItem.image = "https://via.placeholder.com/400x300";
    }

    newItems[index].items.push(newItem);
    setMenuItems(newItems);
  }

  function updateItem(index: number, updates: any) {
    const newItems = [...menuItems];
    newItems[index] = { ...newItems[index], ...updates };
    setMenuItems(newItems);
  }

  function updateSubItem(index: number, subIndex: number, updates: any) {
    const newItems = [...menuItems];
    newItems[index].items[subIndex] = { ...newItems[index].items[subIndex], ...updates };
    setMenuItems(newItems);
  }

  function removeItem(index: number) {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  }

  function removeSubItem(index: number, subIndex: number) {
    const newItems = [...menuItems];
    newItems[index].items = newItems[index].items.filter((_: any, i: number) => i !== subIndex);
    setMenuItems(newItems);
  }

  function moveItem(index: number, direction: 'up' | 'down') {
    const newItems = [...menuItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setMenuItems(newItems);
  }

  if (!settings) return <div className="p-8 text-center">Loading Header Builder...</div>;

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 text-gray-900">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Navigation Builder</h1>
          <p className="text-sm text-gray-500">Configure global navigation, mobile bottom bars, and sub-menus.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/admin/header/config">
            <Button variant="outline" className="rounded-xl gap-2 font-bold">
              <Layers className="w-4 h-4" />
              Config
            </Button>
          </Link>
          <Button onClick={saveSettings} disabled={saving} className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Navigation"}
          </Button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="space-y-4">
        <div className="flex p-1 bg-gray-100 rounded-xl max-w-fit">
          {['main', 'mobile_bottom', 'sub_header'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "px-6 py-2 text-sm font-semibold rounded-lg transition-all",
                activeTab === tab ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
              )}
            >
              {tab === 'main' ? 'Main Header' : tab === 'mobile_bottom' ? 'Mobile Bottom Nav' : 'Desktop Sub-menu'}
            </button>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
          <p className="text-sm text-blue-700 font-medium">
            {activeTab === 'main' && "Editing the primary navigation bar shown at the top of all pages."}
            {activeTab === 'mobile_bottom' && "Editing the app-style navigation bar shown at the bottom on mobile devices (Max 5 items)."}
            {activeTab === 'sub_header' && "Editing the secondary navigation bar shown below the main header on desktop."}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {menuItems.map((item, index) => (
          <Card key={`${activeTab}-${index}`} className="overflow-visible border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col space-y-0.5">
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => moveItem(index, 'up')} disabled={index === 0}>
                    <ChevronUp className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => moveItem(index, 'down')} disabled={index === menuItems.length - 1}>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="flex-1 grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Label</label>
                    <Input className="h-9 text-sm px-3" value={item.label} onChange={(e) => updateItem(index, { label: e.target.value })} />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</label>
                    <select 
                      className="w-full h-9 px-3 text-sm border-gray-200 rounded-md bg-white disabled:bg-gray-50 outline-none focus:ring-2 focus:ring-primary/20 transition-all border"
                      value={item.type || 'link'}
                      onChange={(e) => updateItem(index, { type: e.target.value })}
                    >
                      <option value="link">Standard Link</option>
                      <option value="product">Sản phẩm & Giải pháp</option>
                      <option value="external">External URL</option>
                      {activeTab !== 'mobile_bottom' && <option value="mega">Mega Menu</option>}
                      <option value="button">CTA (Primary)</option>
                      <option value="secondary_button">Secondary</option>
                    </select>
                  </div>

                  <div className="col-span-6">
                    <ActionPicker 
                      label="Action" 
                      value={item.href || ""} 
                      onChange={(val) => updateItem(index, { href: val })} 
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Icon</label>
                    <IconPicker 
                      value={item.icon} 
                      onChange={(val) => updateItem(index, { icon: val })} 
                    />
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0" onClick={() => removeItem(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {item.type === 'mega' && (
                <div className="mt-4 flex items-center space-x-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Total Columns</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4].map(col => (
                        <button 
                          key={col}
                          onClick={() => {
                            const currentCols = item.columnsData || [];
                            const newCols = Array.from({ length: col }, (_, i) => currentCols[i] || { type: 'links', label: `Column ${i+1}`, items: [] });
                            updateItem(index, { columns: col, columnsData: newCols });
                          }}
                          className={`w-8 h-8 rounded-lg border text-xs font-bold transition-all ${item.columns === col ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:border-primary'}`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

              {/* Sub-items (Mega Menu Columns) */}
              {(item.type === 'mega' && activeTab !== 'mobile_bottom') && (
                <div className="mt-2 ml-10 pl-6 border-l-2 border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                      <Layers className="w-3 h-3 mr-2" /> Mega Menu Columns ({item.columns || 1})
                    </h4>
                  </div>
                  <div className="flex gap-4 h-[600px] items-start overflow-x-auto pb-4 px-2 custom-scrollbar">
                    {(item.columnsData || Array.from({ length: item.columns || 1 }, () => ({ type: 'links', items: [] }))).map((col: any, colIdx: number) => {
                      const isColActive = expandedMegaCol?.itemIdx === index && expandedMegaCol?.colIdx === colIdx;
                      const hasContent = col.type === 'links' ? (col.items?.length > 0) : (col.title || col.image);

                      return (
                        <div 
                          key={colIdx} 
                          className={cn(
                            "relative transition-all duration-500 ease-in-out flex flex-col gap-4",
                            isColActive ? "flex-[4] min-w-[500px]" : "flex-none w-16 md:w-20 hover:w-24 cursor-pointer"
                          )}
                          onClick={() => {
                            if (!isColActive) {
                              setExpandedMegaCol({ itemIdx: index, colIdx });
                            }
                          }}
                        >
                          {/* Column Header / Label */}
                          <div className={cn(
                            "flex items-center justify-between px-2 transition-all",
                            !isColActive && "flex-col space-y-4 py-4"
                          )}>
                            {isColActive ? (
                              <>
                                <div className="flex items-center space-x-3">
                                  <span className="text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-tighter">Column {colIdx + 1}</span>
                                  <select 
                                    className="text-[10px] font-bold border-none bg-transparent text-gray-500 uppercase tracking-widest outline-none cursor-pointer hover:text-primary transition-colors"
                                    value={col.type}
                                    onChange={(e) => {
                                      const newCols = [...(item.columnsData || [])];
                                      newCols[colIdx] = { ...col, type: e.target.value };
                                      updateItem(index, { columnsData: newCols });
                                    }}
                                  >
                                    <option value="links">Links List</option>
                                    <option value="block_card">Block Card</option>
                                    <option value="image_link">Image Banner</option>
                                  </select>
                                </div>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); setExpandedMegaCol(null); }}>
                                  <ChevronDown className="w-4 h-4 text-gray-300" />
                                </Button>
                              </>
                            ) : (
                              <div className="flex flex-col items-center space-y-6">
                                <span className="text-[10px] font-black text-gray-300 uppercase [writing-mode:vertical-lr] rotate-180">
                                  Column {colIdx + 1}
                                </span>
                                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 shadow-sm">
                                  {col.type === 'links' && <LinkIcon className="w-4 h-4" />}
                                  {col.type === 'block_card' && <Share2 className="w-4 h-4" />}
                                  {col.type === 'image_link' && <ImageIcon className="w-4 h-4" />}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Column Editor Content */}
                          <div className={cn(
                            "flex-1 space-y-4 overflow-y-auto pr-1 transition-all custom-scrollbar",
                            !isColActive && "opacity-0 pointer-events-none"
                          )}>
                            <div className="space-y-4 p-5 bg-white border border-gray-200 rounded-3xl shadow-sm relative">
                              {col.type === 'links' && (
                                <div className="space-y-6">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Column Heading</label>
                                    <Input 
                                      placeholder="About Us" 
                                      className="text-xs font-bold h-10 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/5 transition-all" 
                                      value={col.label || ''} 
                                      onChange={(e) => {
                                        const newCols = [...(item.columnsData || [])];
                                        newCols[colIdx] = { ...col, label: e.target.value };
                                        updateItem(index, { columnsData: newCols });
                                      }}
                                    />
                                  </div>
                                  
                                  <div className="space-y-4">
                                    {(col.items || []).map((sub: any, subIdx: number) => (
                                      <div key={subIdx} className="group/item p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-primary/30 transition-all space-y-4 relative shadow-sm">
                                         <div className="flex items-center gap-4 border-b border-gray-100 pb-3">
                                            <IconPicker 
                                              value={typeof sub.icon === 'string' ? sub.icon : ''} 
                                              onChange={(val) => {
                                                const newCols = [...(item.columnsData || [])];
                                                newCols[colIdx].items[subIdx].icon = val;
                                                updateItem(index, { columnsData: newCols });
                                              }}
                                            />
                                              <div className="flex flex-col space-y-1">
                                                <Input 
                                                  className="bg-white text-xs font-bold h-9 border-none focus-visible:ring-1 focus-visible:ring-primary/10 shadow-none" 
                                                  placeholder="Link Label" 
                                                  value={typeof sub.label === 'string' ? sub.label : ''} 
                                                  onChange={(e) => {
                                                    const newCols = [...(item.columnsData || [])];
                                                    newCols[colIdx].items[subIdx].label = e.target.value;
                                                    updateItem(index, { columnsData: newCols });
                                                  }}
                                                />
                                                <Input 
                                                  className="bg-white text-[10px] h-7 border-none focus-visible:ring-1 focus-visible:ring-primary/10 shadow-none opacity-60 focus:opacity-100 transition-opacity" 
                                                  placeholder="Add description..." 
                                                  value={sub.description || ''} 
                                                  onChange={(e) => {
                                                    const newCols = [...(item.columnsData || [])];
                                                    newCols[colIdx].items[subIdx].description = e.target.value;
                                                    updateItem(index, { columnsData: newCols });
                                                  }}
                                                />
                                              </div>
                                            </div>

                                         <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                              <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest px-1">Type</label>
                                              <select 
                                                className="w-full bg-white text-[10px] font-medium h-8 px-3 border border-gray-200 rounded-lg outline-none"
                                                value={sub.type || 'link'}
                                                onChange={(e) => {
                                                  const newCols = [...(item.columnsData || [])];
                                                  newCols[colIdx].items[subIdx].type = e.target.value;
                                                  updateItem(index, { columnsData: newCols });
                                                }}
                                              >
                                                <option value="link">Page</option>
                                                <option value="product">Product</option>
                                                <option value="external">External</option>
                                              </select>
                                            </div>
                                            
                                            <div className="space-y-1">
                                              <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest px-1">URL</label>
                                              {sub.type === 'product' ? (
                                                <select 
                                                  className="w-full h-8 px-3 text-[10px] border border-gray-200 rounded-lg bg-white outline-none"
                                                  value={sub.href}
                                                  onChange={(e) => {
                                                    const newCols = [...(item.columnsData || [])];
                                                    newCols[colIdx].items[subIdx].href = e.target.value;
                                                    updateItem(index, { columnsData: newCols });
                                                  }}
                                                >
                                                  <option value="/">Select Product...</option>
                                                  {products.map(p => <option key={p.id} value={`/${p.slug}`}>{p.title}</option>)}
                                                </select>
                                              ) : sub.type === 'link' ? (
                                                <select 
                                                  className="w-full h-8 px-3 text-[10px] border border-gray-200 rounded-lg bg-white outline-none"
                                                  value={sub.href}
                                                  onChange={(e) => {
                                                    const newCols = [...(item.columnsData || [])];
                                                    newCols[colIdx].items[subIdx].href = e.target.value;
                                                    updateItem(index, { columnsData: newCols });
                                                  }}
                                                >
                                                  <option value="/">Select Page...</option>
                                                  {pages.map(p => <option key={p.id} value={`/${p.slug}`}>{p.title}</option>)}
                                                </select>
                                              ) : (
                                                <Input 
                                                  className="bg-white text-[10px] h-8 rounded-lg" 
                                                  placeholder="https://..." 
                                                  value={sub.href} 
                                                  onChange={(e) => {
                                                    const newCols = [...(item.columnsData || [])];
                                                    newCols[colIdx].items[subIdx].href = e.target.value;
                                                    updateItem(index, { columnsData: newCols });
                                                  }}
                                                />
                                              )}
                                            </div>
                                         </div>
                                         <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover/item:opacity-100 text-red-400 hover:text-red-600 transition-all"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const newCols = [...(item.columnsData || [])];
                                              newCols[colIdx].items = newCols[colIdx].items.filter((_: any, i: number) => i !== subIdx);
                                              updateItem(index, { columnsData: newCols });
                                            }}
                                          >
                                           <Trash2 className="w-3.5 h-3.5" />
                                         </Button>
                                      </div>
                                    ))}
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="w-full h-12 border border-dashed border-gray-200 text-[10px] font-bold text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all rounded-2xl"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newCols = [...(item.columnsData || [])];
                                        if (!newCols[colIdx]) newCols[colIdx] = { type: 'links', label: `Column ${colIdx + 1}`, items: [] };
                                        newCols[colIdx].items = [...(newCols[colIdx].items || []), { label: 'New Link', href: '/', icon: '', type: 'link' }];
                                        updateItem(index, { columnsData: newCols });
                                      }}
                                    >
                                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Link Item
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {col.type === 'block_card' && (
                                <div className="space-y-4">
                                   <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Card Image</label>
                                      <MediaPicker 
                                        onSelect={(url) => {
                                          const newCols = [...(item.columnsData || [])];
                                          newCols[colIdx].image = url;
                                          updateItem(index, { columnsData: newCols });
                                        }}
                                        trigger={
                                          <div className="aspect-video bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-primary overflow-hidden transition-all group">
                                            {col.image ? (
                                              <img src={col.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                            ) : (
                                              <div className="text-center">
                                                <ImageIcon className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                                                <p className="text-[10px] text-gray-400 font-medium">Click to upload</p>
                                              </div>
                                            )}
                                          </div>
                                        }
                                      />
                                   </div>
                                   <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Card Title</label>
                                      <Input 
                                        placeholder="Card Title" 
                                        className="text-xs font-bold h-10 rounded-xl" 
                                        value={col.title || ''} 
                                        onChange={(e) => {
                                          const newCols = [...(item.columnsData || [])];
                                          newCols[colIdx].title = e.target.value;
                                          updateItem(index, { columnsData: newCols });
                                        }}
                                      />
                                   </div>
                                   <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Description</label>
                                      <textarea 
                                        className="w-full p-3 text-[11px] bg-gray-50 border-transparent rounded-xl h-24 outline-none focus:bg-white focus:ring-2 focus:ring-primary/5 transition-all resize-none"
                                        placeholder="Short description..."
                                        value={col.description || ''}
                                        onChange={(e) => {
                                          const newCols = [...(item.columnsData || [])];
                                          newCols[colIdx].description = e.target.value;
                                          updateItem(index, { columnsData: newCols });
                                        }}
                                      />
                                   </div>
                                </div>
                              )}

                              {col.type === 'image_link' && (
                                <div className="space-y-4">
                                   <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Banner Image</label>
                                      <MediaPicker 
                                        onSelect={(url) => {
                                          const newCols = [...(item.columnsData || [])];
                                          newCols[colIdx].image = url;
                                          updateItem(index, { columnsData: newCols });
                                        }}
                                        trigger={
                                          <div className="w-full aspect-[4/5] bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-primary overflow-hidden transition-all group">
                                            {col.image ? (
                                              <img src={col.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                            ) : (
                                              <div className="text-center">
                                                <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                <p className="text-[10px] text-gray-400 font-medium">Portrait Banner (4:5)</p>
                                              </div>
                                            )}
                                          </div>
                                        }
                                      />
                                   </div>
                                   <div className="space-y-1">
                                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Destination URL</label>
                                      <Input 
                                        placeholder="https://..." 
                                        className="text-xs h-10 rounded-xl" 
                                        value={col.href || ''} 
                                        onChange={(e) => {
                                          const newCols = [...(item.columnsData || [])];
                                          newCols[colIdx].href = e.target.value;
                                          updateItem(index, { columnsData: newCols });
                                        }}
                                      />
                                   </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
          </Card>
        ))}
        
        {activeTab === 'mobile_bottom' && menuItems.length >= 5 ? (
          <p className="text-center text-sm text-gray-400 italic">Maximum 5 items reached for Mobile Bottom Nav.</p>
        ) : (
          <Button variant="outline" className="w-full border-dashed border-2 py-8 rounded-2xl bg-white hover:bg-gray-50 transition-colors" onClick={addItem}>
            <Plus className="w-5 h-5 mr-2" />
            Add {activeTab === 'main' ? 'Main' : activeTab === 'mobile_bottom' ? 'Mobile' : 'Sub'} Menu Item
          </Button>
        )}
      </div>
    </div>
  );
}


