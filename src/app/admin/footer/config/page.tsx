"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Save, ArrowLeft, Sun, Moon, Palette, Sliders, Layout, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function FooterConfig() {
  const [settings, setSettings] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'spacing' | 'components'>('general');
  const [saving, setSaving] = useState(false);

  const [config, setConfig] = useState({
    bg_color: '#ffffff',
    bg_gradient: '',
    text_mode: 'light',
    logo_height_light: 40,
    logo_height_dark: 40,
    padding_top: 80,
    padding_bottom: 40,
    border_top_show: true,
    border_top_width: 1,
    border_top_color: '#e5e7eb',
    newsletter_btn_color: '#3b82f6',
    newsletter_btn_hover: '#2563eb',
    newsletter_input_radius: 16,
    newsletter_placeholder: 'Email address...',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase.from("site_settings").select("*").single();
    if (data) {
      setSettings(data);
      if (data.footer_config) {
        setConfig({
          bg_color: data.footer_config.bg_color || '#ffffff',
          bg_gradient: data.footer_config.bg_gradient || '',
          text_mode: data.footer_config.text_mode || 'light',
          logo_height_light: data.footer_config.logo_height_light ?? 40,
          logo_height_dark: data.footer_config.logo_height_dark ?? 40,
          padding_top: data.footer_config.padding_top ?? 80,
          padding_bottom: data.footer_config.padding_bottom ?? 40,
          border_top_show: data.footer_config.border_top_show ?? true,
          border_top_width: data.footer_config.border_top_width ?? 1,
          border_top_color: data.footer_config.border_top_color || '#e5e7eb',
          newsletter_btn_color: data.footer_config.newsletter_btn_color || '#3b82f6',
          newsletter_btn_hover: data.footer_config.newsletter_btn_hover || '#2563eb',
          newsletter_input_radius: data.footer_config.newsletter_input_radius ?? 16,
          newsletter_placeholder: data.footer_config.newsletter_placeholder || 'Email address...',
        });
      }
    }
  }

  async function saveConfig() {
    setSaving(true);
    try {
      // Merge style settings with existing footer_config fields (like copyright, bottom_links)
      const updatedFooterConfig = {
        ...(settings.footer_config || {}),
        ...config,
      };

      const { error } = await supabase
        .from("site_settings")
        .update({ 
          footer_config: updatedFooterConfig
        })
        .eq("id", settings.id);
      
      if (error) throw error;
      toast.success("Cấu hình footer đã được lưu!");
      setSettings({ ...settings, footer_config: updatedFooterConfig });
    } catch (err) {
      console.error(err);
      toast.error("Không thể lưu cấu hình");
    } finally {
      setSaving(false);
    }
  }

  if (!settings) return <div className="p-8 text-center text-gray-400">Loading Configuration...</div>;

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 text-gray-900 pb-32">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/footer">
            <Button variant="ghost" size="sm" className="h-9 px-3">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Footer Configuration</h1>
            <p className="text-sm text-gray-500 font-medium">Tùy biến giao diện, kiểu dáng và màu sắc của footer.</p>
          </div>
        </div>
        <Button onClick={saveConfig} disabled={saving} className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-gray-100 rounded-xl max-w-fit border border-gray-200">
        <button 
          onClick={() => setActiveTab('general')}
          className={cn(
            "px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
            activeTab === 'general' ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
          )}
        >
          Colors & Theme
        </button>
        <button 
          onClick={() => setActiveTab('spacing')}
          className={cn(
            "px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
            activeTab === 'spacing' ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
          )}
        >
          Layout & Spacing
        </button>
        <button 
          onClick={() => setActiveTab('components')}
          className={cn(
            "px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
            activeTab === 'components' ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
          )}
        >
          Component Styling
        </button>
      </div>

      {/* Tab Contents */}
      <div className="mt-6">
        {activeTab === 'general' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Visual Mode Selector */}
            <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-white">
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Footer Visual Mode</h3>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <button
                    onClick={() => setConfig({ ...config, text_mode: 'light' })}
                    className={cn(
                      "p-5 rounded-2xl border-2 flex flex-col items-center justify-center space-y-2 transition-all",
                      config.text_mode === 'light' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                    )}
                  >
                    <Sun className="w-6 h-6" />
                    <span className="text-sm font-bold">Light Mode (Sáng)</span>
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, text_mode: 'dark' })}
                    className={cn(
                      "p-5 rounded-2xl border-2 flex flex-col items-center justify-center space-y-2 transition-all",
                      config.text_mode === 'dark' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                    )}
                  >
                    <Moon className="w-6 h-6" />
                    <span className="text-sm font-bold">Dark Mode (Tối)</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Custom Footer Colors */}
            <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-white">
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5" /> Background Customization
                </h3>
              </div>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Solid Background Color</label>
                  <div className="flex space-x-2">
                    <input 
                      type="color" 
                      value={config.bg_color} 
                      onChange={(e) => setConfig({ ...config, bg_color: e.target.value })}
                      className="w-10 h-10 rounded-xl cursor-pointer border-gray-200"
                    />
                    <Input 
                      type="text" 
                      value={config.bg_color} 
                      onChange={(e) => setConfig({ ...config, bg_color: e.target.value })}
                      placeholder="#ffffff"
                      className="flex-1 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Gradient Background Override (CSS)</label>
                  <Input 
                    type="text" 
                    value={config.bg_gradient} 
                    onChange={(e) => setConfig({ ...config, bg_gradient: e.target.value })}
                    placeholder="linear-gradient(to right, #111827, #1f2937)"
                    className="font-mono h-10"
                  />
                  <p className="text-[10px] text-gray-400 leading-tight">Nếu được đặt, chế độ gradient CSS này sẽ ghi đè lên màu solid phía bên trái.</p>
                </div>
              </CardContent>
            </Card>

            {/* Logo Heights */}
            <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-white">
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Logo Branding Sizing</h3>
              </div>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Logo Height - Light Mode (px)</label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={config.logo_height_light} 
                      onChange={(e) => setConfig({ ...config, logo_height_light: parseInt(e.target.value) || 40 })}
                      className="h-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">px</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Logo Height - Dark Mode (px)</label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={config.logo_height_dark} 
                      onChange={(e) => setConfig({ ...config, logo_height_dark: parseInt(e.target.value) || 40 })}
                      className="h-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">px</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'spacing' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Vertical Spacing */}
            <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-white">
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5" /> Vertical Spacing (Padding)
                </h3>
              </div>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Top Padding (pt-{config.padding_top} in public)</label>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded font-mono">{config.padding_top}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="200" 
                    step="10"
                    value={config.padding_top} 
                    onChange={(e) => setConfig({ ...config, padding_top: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bottom Padding (pb-{config.padding_bottom} in public)</label>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded font-mono">{config.padding_bottom}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="200" 
                    step="10"
                    value={config.padding_bottom} 
                    onChange={(e) => setConfig({ ...config, padding_bottom: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Top Border */}
            <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-white">
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <Layout className="w-3.5 h-3.5" /> Top Divider Border
                </h3>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    id="border_top_show" 
                    checked={config.border_top_show} 
                    onChange={(e) => setConfig({ ...config, border_top_show: e.target.checked })}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary/20 cursor-pointer"
                  />
                  <label htmlFor="border_top_show" className="text-sm font-bold text-gray-700 cursor-pointer">Hiển thị đường viền trên cùng của Footer</label>
                </div>

                {config.border_top_show && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 animate-in fade-in duration-200">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Border Color</label>
                      <div className="flex space-x-2">
                        <input 
                          type="color" 
                          value={config.border_top_color} 
                          onChange={(e) => setConfig({ ...config, border_top_color: e.target.value })}
                          className="w-10 h-10 rounded-xl cursor-pointer border-gray-200"
                        />
                        <Input 
                          type="text" 
                          value={config.border_top_color} 
                          onChange={(e) => setConfig({ ...config, border_top_color: e.target.value })}
                          placeholder="#e5e7eb"
                          className="flex-1 font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Border Width (px)</label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          value={config.border_top_width} 
                          onChange={(e) => setConfig({ ...config, border_top_width: parseInt(e.target.value) || 1 })}
                          className="h-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">px</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Newsletter Styling */}
            <Card className="border-gray-200 shadow-sm rounded-3xl overflow-hidden bg-white">
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Newsletter Subscribe Styling
                </h3>
              </div>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Button Background Color</label>
                  <div className="flex space-x-2">
                    <input 
                      type="color" 
                      value={config.newsletter_btn_color} 
                      onChange={(e) => setConfig({ ...config, newsletter_btn_color: e.target.value })}
                      className="w-10 h-10 rounded-xl cursor-pointer border-gray-200"
                    />
                    <Input 
                      type="text" 
                      value={config.newsletter_btn_color} 
                      onChange={(e) => setConfig({ ...config, newsletter_btn_color: e.target.value })}
                      className="flex-1 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Button Hover Color</label>
                  <div className="flex space-x-2">
                    <input 
                      type="color" 
                      value={config.newsletter_btn_hover} 
                      onChange={(e) => setConfig({ ...config, newsletter_btn_hover: e.target.value })}
                      className="w-10 h-10 rounded-xl cursor-pointer border-gray-200"
                    />
                    <Input 
                      type="text" 
                      value={config.newsletter_btn_hover} 
                      onChange={(e) => setConfig({ ...config, newsletter_btn_hover: e.target.value })}
                      className="flex-1 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Subscribe Input Border Radius (px)</label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={config.newsletter_input_radius} 
                      onChange={(e) => setConfig({ ...config, newsletter_input_radius: parseInt(e.target.value) || 16 })}
                      className="h-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">px</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Default Placeholder Text</label>
                  <Input 
                    type="text" 
                    value={config.newsletter_placeholder} 
                    onChange={(e) => setConfig({ ...config, newsletter_placeholder: e.target.value })}
                    className="h-10"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
