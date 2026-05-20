"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Save, Layout, Sun, Moon, Palette, ArrowLeft, Menu, AlignRight, AlignJustify, Grid, MoreHorizontal, Smartphone, Image as ImageIcon, MousePointer2, Tally2 } from "lucide-react";
import Link from "next/link";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { toast } from "sonner";

const LAYOUTS = [
  { 
    id: "layout1", 
    name: "Menu Left, Logo Center, Button Right", 
    description: "Main menu on the left, Logo in the middle, and CTA button on the right.",
    preview: (
      <div className="w-full h-12 border rounded border-gray-200 flex items-center px-4 bg-gray-50">
        <div className="w-1/3 flex justify-start space-x-1">
          <div className="h-2 w-8 bg-gray-300 rounded" />
          <div className="h-2 w-8 bg-gray-300 rounded" />
        </div>
        <div className="w-1/3 flex justify-center">
          <div className="h-4 w-12 bg-primary/20 rounded" />
        </div>
        <div className="w-1/3 flex justify-end">
          <div className="h-6 w-12 bg-primary rounded" />
        </div>
      </div>
    )
  },
  { 
    id: "layout2", 
    name: "Logo Left, Menu Center, Button Right", 
    description: "Logo on the left, Main menu centered between logo and button.",
    preview: (
      <div className="w-full h-12 border rounded border-gray-200 flex items-center px-4 bg-gray-50">
        <div className="w-1/3 flex justify-start">
          <div className="h-4 w-12 bg-primary/20 rounded" />
        </div>
        <div className="w-1/3 flex justify-center space-x-1">
          <div className="h-2 w-8 bg-gray-300 rounded" />
          <div className="h-2 w-8 bg-gray-300 rounded" />
        </div>
        <div className="w-1/3 flex justify-end">
          <div className="h-6 w-12 bg-primary rounded" />
        </div>
      </div>
    )
  },
  { 
    id: "layout3", 
    name: "Logo Left, Menu Middle, Button Right", 
    description: "Logo on the left, Menu immediately after logo, and Button on the right.",
    preview: (
      <div className="w-full h-12 border rounded border-gray-200 flex items-center px-4 bg-gray-50">
        <div className="flex-1 flex items-center space-x-4">
          <div className="h-4 w-12 bg-primary/20 rounded" />
          <div className="flex space-x-1">
            <div className="h-2 w-8 bg-gray-300 rounded" />
            <div className="h-2 w-8 bg-gray-300 rounded" />
          </div>
        </div>
        <div className="flex justify-end">
          <div className="h-6 w-12 bg-primary rounded" />
        </div>
      </div>
    )
  }
];

const MOBILE_ICONS = [
  { id: 'Menu', component: Menu },
  { id: 'AlignRight', component: AlignRight },
  { id: 'AlignJustify', component: AlignJustify },
  { id: 'Grid', component: Grid },
  { id: 'MoreHorizontal', component: MoreHorizontal },
];

import { cn } from "@/lib/utils";

export default function HeaderConfig() {
  const [settings, setSettings] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'mega_menu' | 'buttons'>('general');
  const [config, setConfig] = useState({
    layout: "layout1",
    theme: "light",
    backgroundColor: "",
    mobile: {
      icon: "Menu",
      theme: "light",
      backgroundColor: ""
    },
    paddingY: 20,
    paddingScrolledY: 12,
    logoHeight: 36,
    logoScrolledHeight: 32,
    megaMenu: {
      gap: 8,
      padding: 12,
      theme: "light",
      backgroundColor: "",
      backdropBlur: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "",
      shadow: "xl",
      titleColor: "",
      descriptionColor: "",
      hoverBg: "",
      animationType: "fade",
      animationDuration: 0.2,
      staggerChildren: true,
      width1Col: 320,
      width2Col: 540,
      width3Col: 800,
      width4Col: 1000
    },
    buttons: {
      primary: { bgType: "solid", bg: "#3b82f6", bgGradient: "linear-gradient(to right, #3b82f6, #2563eb)", text: "#ffffff", radius: 12, borderWidth: 0, borderColor: "", borderGradient: "", shadow: "md", iconPosition: "left", iconGap: 8 },
      secondary: { bgType: "solid", bg: "transparent", bgGradient: "", text: "#111827", radius: 12, borderWidth: 1, borderColor: "#e5e7eb", borderGradient: "", shadow: "none", iconPosition: "right", iconGap: 8 }
    }
  });
  const [logoUrl, setLogoUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase.from("site_settings").select("*").single();
    if (data) {
      setSettings(data);
      if (data.header_config) {
        const savedButtons = data.header_config.buttons || {};
        // Transition logic: if old structure with light/dark exists, take light as default
        const primary = { 
          bgType: "solid", bg: "#3b82f6", bgGradient: "linear-gradient(to right, #3b82f6, #2563eb)", text: "#ffffff", radius: 12, borderWidth: 0, borderColor: "", borderGradient: "", shadow: "md", iconPosition: "left", iconGap: 8,
          ...(savedButtons.primary?.light || savedButtons.primary || {})
        };
        const secondary = {
          bgType: "solid", bg: "transparent", bgGradient: "", text: "#111827", radius: 12, borderWidth: 1, borderColor: "#e5e7eb", borderGradient: "", shadow: "none", iconPosition: "right", iconGap: 8,
          ...(savedButtons.secondary?.light || savedButtons.secondary || {})
        };

        setConfig({
          layout: data.header_config.layout || "layout1",
          theme: data.header_config.theme || "light",
          backgroundColor: data.header_config.backgroundColor || "",
          mobile: data.header_config.mobile || {
            icon: "Menu",
            theme: "light",
            backgroundColor: ""
          },
          paddingY: data.header_config.paddingY ?? 20,
          paddingScrolledY: data.header_config.paddingScrolledY ?? 12,
          logoHeight: data.header_config.logoHeight ?? 36,
          logoScrolledHeight: data.header_config.logoScrolledHeight ?? 32,
          megaMenu: {
            gap: 8,
            padding: 12,
            theme: "light",
            backgroundColor: "",
            backdropBlur: 20,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "",
            shadow: "xl",
            titleColor: "",
            descriptionColor: "",
            hoverBg: "",
            animationType: "fade",
            animationDuration: 0.2,
            staggerChildren: true,
            width1Col: 320,
            width2Col: 540,
            width3Col: 800,
            width4Col: 1000,
            ...(data.header_config.megaMenu || {})
          },
          buttons: { primary, secondary }
        });
        setLogoUrl(data.logo_url || "");
      }
    }
  }

  async function saveConfig() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ 
          header_config: config,
          logo_url: logoUrl
        })
        .eq("id", settings.id);
      
      if (error) throw error;
      toast.success("Configuration saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  }

  if (!settings) return <div className="p-8 text-center">Loading Configuration...</div>;

  const ButtonStyleEditor = ({ type }: { type: 'primary' | 'secondary' }) => {
    const btnConfig = (config.buttons as any)[type];
    const updateBtn = (updates: any) => {
      setConfig({
        ...config,
        buttons: {
          ...config.buttons,
          [type]: { ...btnConfig, ...updates }
        }
      });
    };

    return (
      <div className="space-y-6">

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">BG Type</label>
            <select 
              value={btnConfig.bgType} 
              onChange={(e) => updateBtn({ bgType: e.target.value })}
              className="w-full h-9 px-3 border border-gray-200 rounded-lg text-xs"
            >
              <option value="solid">Solid</option>
              <option value="gradient">Gradient</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Text Color</label>
            <input 
              type="color" 
              value={btnConfig.text} 
              onChange={(e) => updateBtn({ text: e.target.value })}
              className="w-full h-9 rounded-lg cursor-pointer border-0 shadow-sm"
            />
          </div>
        </div>

        {btnConfig.bgType === 'solid' ? (
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Background Color</label>
            <div className="flex space-x-2">
              <input 
                type="color" 
                value={btnConfig.bg} 
                onChange={(e) => updateBtn({ bg: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 shadow-sm"
              />
              <input 
                type="text" 
                value={btnConfig.bg} 
                onChange={(e) => updateBtn({ bg: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white font-mono"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">BG Gradient (CSS)</label>
            <input 
              type="text" 
              value={btnConfig.bgGradient} 
              onChange={(e) => updateBtn({ bgGradient: e.target.value })}
              placeholder="linear-gradient(...)"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white font-mono"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Border Width (px)</label>
            <input 
              type="number" 
              value={btnConfig.borderWidth} 
              onChange={(e) => updateBtn({ borderWidth: parseInt(e.target.value) })}
              className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Border Radius (px)</label>
            <input 
              type="number" 
              value={btnConfig.radius} 
              onChange={(e) => updateBtn({ radius: parseInt(e.target.value) })}
              className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Border Color (Solid)</label>
          <input 
            type="color" 
            value={btnConfig.borderColor || "#e5e7eb"} 
            onChange={(e) => updateBtn({ borderColor: e.target.value })}
            className="w-full h-8 rounded-lg cursor-pointer border-0 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Border Gradient (CSS)</label>
          <input 
            type="text" 
            value={btnConfig.borderGradient} 
            onChange={(e) => updateBtn({ borderGradient: e.target.value })}
            placeholder="linear-gradient(...)"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white font-mono"
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Icon Configuration</h4>
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 uppercase">Position</label>
               <select 
                 value={btnConfig.iconPosition || "left"} 
                 onChange={(e) => updateBtn({ iconPosition: e.target.value })}
                 className="w-full h-9 px-3 border border-gray-200 rounded-lg text-xs"
               >
                 <option value="left">Left of Text</option>
                 <option value="right">Right of Text</option>
               </select>
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 uppercase">Gap (px)</label>
               <input 
                 type="number" 
                 value={btnConfig.iconGap || 8} 
                 onChange={(e) => updateBtn({ iconGap: parseInt(e.target.value) })}
                 className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm"
               />
             </div>
           </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Shadow</label>
          <select 
            value={btnConfig.shadow} 
            onChange={(e) => updateBtn({ shadow: e.target.value })}
            className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm"
          >
            <option value="none">None</option>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">Extra Large</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/header">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Header Configuration</h1>
            <p className="text-sm text-gray-500 font-medium">Tùy biến giao diện, kiểu dáng và màu sắc của header.</p>
          </div>
        </div>
        <Button onClick={saveConfig} disabled={saving} className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-gray-100 rounded-xl max-w-fit">
        <button 
          onClick={() => setActiveTab('general')}
          className={cn(
            "px-8 py-2.5 text-sm font-semibold rounded-lg transition-all",
            activeTab === 'general' ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
          )}
        >
          General Settings
        </button>
        <button 
          onClick={() => setActiveTab('mega_menu')}
          className={cn(
            "px-8 py-2.5 text-sm font-semibold rounded-lg transition-all",
            activeTab === 'mega_menu' ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
          )}
        >
          Mega Menu Design
        </button>
        <button 
          onClick={() => setActiveTab('buttons')}
          className={cn(
            "px-8 py-2.5 text-sm font-semibold rounded-lg transition-all",
            activeTab === 'buttons' ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
          )}
        >
          Buttons Design
        </button>
      </div>

      <div className="mt-8">
        {activeTab === 'general' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Desktop Config */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">Desktop Header</h2>
                <div className="flex items-center gap-4">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Logo Branding</span>
                   <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                          {logoUrl ? <img src={logoUrl} className="w-full h-full object-contain p-1" /> : <ImageIcon className="w-4 h-4 text-gray-300" />}
                        </div>
                        <MediaPicker onSelect={(url) => setLogoUrl(url)} trigger={<Button variant="outline" size="sm" className="h-8 text-xs">Change Logo</Button>} />
                     </div>
                     <div className="flex gap-4">
                        <div className="flex flex-col space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Height (px)</label>
                          <input 
                            type="number" 
                            value={config.logoHeight} 
                            onChange={(e) => setConfig({ ...config, logoHeight: parseInt(e.target.value) })}
                            className="w-20 h-8 px-2 border border-gray-200 rounded text-xs"
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Scrolled (px)</label>
                          <input 
                            type="number" 
                            value={config.logoScrolledHeight} 
                            onChange={(e) => setConfig({ ...config, logoScrolledHeight: parseInt(e.target.value) })}
                            className="w-20 h-8 px-2 border border-gray-200 rounded text-xs"
                          />
                        </div>
                     </div>
                   </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Layout Selection */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center">
                    <Layout className="w-4 h-4 mr-2 text-primary" /> Layout Strategy
                  </h2>
                  <div className="space-y-4">
                    {LAYOUTS.map((l) => (
                      <div 
                        key={l.id}
                        onClick={() => setConfig({ ...config, layout: l.id })}
                        className={`cursor-pointer p-4 rounded-2xl border-2 transition-all hover:shadow-md ${config.layout === l.id ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white'}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-gray-900">{l.name}</span>
                          {config.layout === l.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        {l.preview}
                        <p className="mt-3 text-xs text-gray-500 italic">{l.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Theme & Color */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center">
                      {config.theme === 'light' ? <Sun className="w-4 h-4 mr-2 text-orange-400" /> : <Moon className="w-4 h-4 mr-2 text-indigo-400" />} 
                      Header Visual Mode
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setConfig({ ...config, theme: 'light' })}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${config.theme === 'light' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white'}`}
                      >
                        <Sun className={`w-8 h-8 ${config.theme === 'light' ? 'text-primary' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium">Light Mode</span>
                      </button>
                      <button
                        onClick={() => setConfig({ ...config, theme: 'dark' })}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${config.theme === 'dark' ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white'}`}
                      >
                        <Moon className={`w-8 h-8 ${config.theme === 'dark' ? 'text-primary' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium">Dark Mode</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center">
                      <Palette className="w-4 h-4 mr-2 text-pink-500" /> Custom Header Background
                    </h2>
                    <Card className="border-gray-100 bg-gray-50/50">
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Background Color</label>
                          <div className="flex space-x-2">
                            <input 
                              type="color" 
                              value={config.backgroundColor || "#ffffff"} 
                              onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                              className="w-10 h-10 rounded cursor-pointer border-0"
                            />
                            <input 
                              type="text" 
                              value={config.backgroundColor} 
                              onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                              placeholder="e.g. #ffffff"
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm bg-white font-mono"
                            />
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setConfig({ ...config, backgroundColor: "" })}
                          className="w-full text-xs"
                        >
                          Reset to Theme Default
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-100">
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center">
                  <MoreHorizontal className="w-4 h-4 mr-2 text-blue-500" /> Vertical Spacing (Padding)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Default Padding Y (px)</label>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded font-mono">{config.paddingY}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={config.paddingY} 
                      onChange={(e) => setConfig({ ...config, paddingY: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Scrolled Padding Y (px)</label>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded font-mono">{config.paddingScrolledY}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={config.paddingScrolledY} 
                      onChange={(e) => setConfig({ ...config, paddingScrolledY: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Config */}
            <div className="space-y-6 pt-12 border-t">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Smartphone className="w-6 h-6 mr-2 text-primary" /> Mobile Header
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Burger Icon</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {MOBILE_ICONS.map((icon) => {
                      const IconComp = icon.component;
                      return (
                        <button
                          key={icon.id}
                          onClick={() => setConfig({ ...config, mobile: { ...config.mobile, icon: icon.id } })}
                          className={`p-6 rounded-2xl border-2 flex items-center justify-center transition-all ${config.mobile.icon === icon.id ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'}`}
                        >
                          <IconComp className="w-8 h-8" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Mobile Menu Theme</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setConfig({ ...config, mobile: { ...config.mobile, theme: 'light' } })}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${config.mobile.theme === 'light' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 bg-white'}`}
                      >
                        <Sun className={`w-6 h-6 ${config.mobile.theme === 'light' ? 'text-primary' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium">Light Mode</span>
                      </button>
                      <button
                        onClick={() => setConfig({ ...config, mobile: { ...config.mobile, theme: 'dark' } })}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${config.mobile.theme === 'dark' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 bg-white'}`}
                      >
                        <Moon className={`w-6 h-6 ${config.mobile.theme === 'dark' ? 'text-primary' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium">Dark Mode</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Mobile Background</h2>
                    <Card className="border-gray-100 bg-gray-50/50">
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Background Color</label>
                          <div className="flex space-x-2">
                            <input 
                              type="color" 
                              value={config.mobile.backgroundColor || "#ffffff"} 
                              onChange={(e) => setConfig({ ...config, mobile: { ...config.mobile, backgroundColor: e.target.value } })}
                              className="w-10 h-10 rounded cursor-pointer border-0"
                            />
                            <input 
                              type="text" 
                              value={config.mobile.backgroundColor} 
                              onChange={(e) => setConfig({ ...config, mobile: { ...config.mobile, backgroundColor: e.target.value } })}
                              placeholder="e.g. #ffffff"
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm bg-white font-mono"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mega_menu' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              {/* Left Column: Layout & Visual */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center">
                    <MoreHorizontal className="w-4 h-4 mr-2 text-primary" /> Spacing & Sizing
                  </h2>
                  <Card className="border-gray-100 bg-gray-50/50">
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gap from Header (px)</label>
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded font-mono">{config.megaMenu.gap}px</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="80" 
                          value={config.megaMenu.gap} 
                          onChange={(e) => setConfig({ ...config, megaMenu: { ...config.megaMenu, gap: parseInt(e.target.value) } })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Internal Padding (px)</label>
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded font-mono">{config.megaMenu.padding}px</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="60" 
                          value={config.megaMenu.padding} 
                          onChange={(e) => setConfig({ ...config, megaMenu: { ...config.megaMenu, padding: parseInt(e.target.value) } })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center">
                    <Palette className="w-4 h-4 mr-2 text-pink-500" /> Color & Transparency
                  </h2>
                  <Card className="border-gray-100 bg-gray-50/50">
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-4">
                        <label className="text-xs font-semibold text-gray-700">Dropdown Visual Mode</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setConfig({ ...config, megaMenu: { ...config.megaMenu, theme: 'light' } })}
                            className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center space-y-1 transition-all ${config.megaMenu.theme === 'light' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 bg-white'}`}
                          >
                            <Sun className={`w-5 h-5 ${config.megaMenu.theme === 'light' ? 'text-primary' : 'text-gray-400'}`} />
                            <span className="text-xs font-medium">Light</span>
                          </button>
                          <button
                            onClick={() => setConfig({ ...config, megaMenu: { ...config.megaMenu, theme: 'dark' } })}
                            className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center space-y-1 transition-all ${config.megaMenu.theme === 'dark' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 bg-white'}`}
                          >
                            <Moon className={`w-5 h-5 ${config.megaMenu.theme === 'dark' ? 'text-primary' : 'text-gray-400'}`} />
                            <span className="text-xs font-medium">Dark</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Background Override</label>
                        <div className="flex space-x-2">
                          <input 
                            type="color" 
                            value={config.megaMenu.backgroundColor || "#ffffff"} 
                            onChange={(e) => setConfig({ ...config, megaMenu: { ...config.megaMenu, backgroundColor: e.target.value } })}
                            className="w-10 h-10 rounded-lg cursor-pointer border-0 shadow-sm"
                          />
                          <input 
                            type="text" 
                            value={config.megaMenu.backgroundColor} 
                            onChange={(e) => setConfig({ ...config, megaMenu: { ...config.megaMenu, backgroundColor: e.target.value } })}
                            placeholder="Theme Default"
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Backdrop Blur (px)</label>
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded font-mono">{config.megaMenu.backdropBlur}px</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="40" 
                          value={config.megaMenu.backdropBlur} 
                          onChange={(e) => setConfig({ ...config, megaMenu: { ...config.megaMenu, backdropBlur: parseInt(e.target.value) } })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center">
                    <Grid className="w-4 h-4 mr-2 text-indigo-500" /> Fixed Column Widths
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(num => (
                      <div key={num} className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{num} Column Width</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            value={(config.megaMenu as any)[`width${num}Col`]} 
                            onChange={(e) => setConfig({ ...config, megaMenu: { ...config.megaMenu, [`width${num}Col`]: parseInt(e.target.value) } })}
                            className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm font-bold bg-gray-50 focus:bg-white transition-colors"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold uppercase">px</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Borders, Shadows & Animations */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center">
                    <Layout className="w-4 h-4 mr-2 text-orange-500" /> Border & Shadows
                  </h2>
                  <Card className="border-gray-100 bg-gray-50/50">
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Border Radius (px)</label>
                          <input 
                            type="number" 
                            value={config.megaMenu.borderRadius} 
                            onChange={(e) => setConfig({ ...config, megaMenu: { ...config.megaMenu, borderRadius: parseInt(e.target.value) } })}
                            className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm font-bold bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Border Width (px)</label>
                          <input 
                            type="number" 
                            value={config.megaMenu.borderWidth} 
                            onChange={(e) => setConfig({ ...config, megaMenu: { ...config.megaMenu, borderWidth: parseInt(e.target.value) } })}
                            className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm font-bold bg-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Shadow Depth</label>
                        <select 
                          value={config.megaMenu.shadow} 
                          onChange={(e) => setConfig({ ...config, megaMenu: { ...config.megaMenu, shadow: e.target.value } })}
                          className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm bg-white"
                        >
                          <option value="none">None</option>
                          <option value="sm">Small</option>
                          <option value="md">Medium</option>
                          <option value="lg">Large</option>
                          <option value="xl">Extra Large</option>
                          <option value="2xl">Deep Shadow (2XL)</option>
                        </select>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Border Color</label>
                        <div className="flex space-x-2">
                          <input 
                            type="color" 
                            value={config.megaMenu.borderColor || "#e5e7eb"} 
                            onChange={(e) => setConfig({ ...config, megaMenu: { ...config.megaMenu, borderColor: e.target.value } })}
                            className="w-10 h-10 rounded-lg cursor-pointer border-0 shadow-sm"
                          />
                          <input 
                            type="text" 
                            value={config.megaMenu.borderColor} 
                            onChange={(e) => setConfig({ ...config, megaMenu: { ...config.megaMenu, borderColor: e.target.value } })}
                            placeholder="Auto Color"
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white font-mono"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center">
                    <Grid className="w-4 h-4 mr-2 text-blue-500" /> Animation & Effects
                  </h2>
                  <Card className="border-gray-100 bg-gray-50/50">
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Animation Type</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['fade', 'slide-up', 'slide-down', 'zoom', 'scale-down'].map(type => (
                            <button
                              key={type}
                              onClick={() => setConfig({ ...config, megaMenu: { ...config.megaMenu, animationType: type } })}
                              className={`px-3 py-2 rounded-lg border text-xs font-semibold capitalize transition-all ${config.megaMenu.animationType === type ? 'border-primary bg-primary text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                            >
                              {type.replace('-', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Animation Duration (s)</label>
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded font-mono">{config.megaMenu.animationDuration}s</span>
                        </div>
                        <input 
                          type="range" 
                          min="0.1" 
                          max="1.0" 
                          step="0.05"
                          value={config.megaMenu.animationDuration} 
                          onChange={(e) => setConfig({ ...config, megaMenu: { ...config.megaMenu, animationDuration: parseFloat(e.target.value) } })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="space-y-0.5">
                          <label className="text-xs font-bold text-gray-700">Stagger Items</label>
                          <p className="text-[10px] text-gray-400">Items enter sequentially</p>
                        </div>
                        <button
                          onClick={() => setConfig({ ...config, megaMenu: { ...config.megaMenu, staggerChildren: !config.megaMenu.staggerChildren } })}
                          className={`w-10 h-5 rounded-full transition-colors relative ${config.megaMenu.staggerChildren ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.megaMenu.staggerChildren ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center">
                    <AlignJustify className="w-4 h-4 mr-2 text-green-500" /> Typography & Items
                  </h2>
                  <Card className="border-gray-100 bg-gray-50/50">
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Title Color</label>
                          <input 
                            type="color" 
                            value={config.megaMenu.titleColor || "#000000"} 
                            onChange={(e) => setConfig({ ...config, megaMenu: { ...config.megaMenu, titleColor: e.target.value } })}
                            className="w-full h-8 rounded-lg cursor-pointer border-0 shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Desc Color</label>
                          <input 
                            type="color" 
                            value={config.megaMenu.descriptionColor || "#6b7280"} 
                            onChange={(e) => setConfig({ ...config, megaMenu: { ...config.megaMenu, descriptionColor: e.target.value } })}
                            className="w-full h-8 rounded-lg cursor-pointer border-0 shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 pt-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Item Hover Background</label>
                        <div className="flex space-x-2">
                          <input 
                            type="color" 
                            value={config.megaMenu.hoverBg || "#f3f4f6"} 
                            onChange={(e) => setConfig({ ...config, megaMenu: { ...config.megaMenu, hoverBg: e.target.value } })}
                            className="w-10 h-10 rounded-lg cursor-pointer border-0 shadow-sm"
                          />
                          <input 
                            type="text" 
                            value={config.megaMenu.hoverBg} 
                            onChange={(e) => setConfig({ ...config, megaMenu: { ...config.megaMenu, hoverBg: e.target.value } })}
                            placeholder="Default Hover"
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white font-mono"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'buttons' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Primary Button */}
               <div className="space-y-6">
                 <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <MousePointer2 className="w-5 h-5 mr-2 text-primary" /> Primary Button (CTA)
                 </h2>
                 <Card className="border-gray-100 bg-gray-50/50">
                   <CardContent className="p-6">
                     <ButtonStyleEditor type="primary" />
                   </CardContent>
                 </Card>
               </div>

               {/* Secondary Button */}
               <div className="space-y-6">
                 <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Tally2 className="w-5 h-5 mr-2 text-gray-500" /> Secondary Button
                 </h2>
                 <Card className="border-gray-100 bg-gray-50/50">
                   <CardContent className="p-6">
                     <ButtonStyleEditor type="secondary" />
                   </CardContent>
                 </Card>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
