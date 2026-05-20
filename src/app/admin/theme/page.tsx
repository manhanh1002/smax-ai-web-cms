"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  Save, Palette, Type, Square, 
  RotateCcw, Check, Sparkles, Layout,
  MousePointer2, Heading1, CaseSensitive
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const FONT_OPTIONS = [
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Outfit", value: "Outfit, sans-serif" },
  { name: "Plus Jakarta Sans", value: "Plus Jakarta Sans, sans-serif" },
  { name: "Sora", value: "Sora, sans-serif" },
  { name: "Montserrat", value: "Montserrat, sans-serif" },
  { name: "Playfair Display", value: "Playfair Display, serif" },
  { name: "Fraunces", value: "Fraunces, serif" },
  { name: "Space Grotesk", value: "Space Grotesk, sans-serif" },
  { name: "Lexend", value: "Lexend, sans-serif" },
  { name: "Bricolage Grotesque", value: "Bricolage Grotesque, sans-serif" },
];

const RADIUS_OPTIONS = [
  { name: "None", value: "0px" },
  { name: "Small", value: "0.375rem" },
  { name: "Medium", value: "0.5rem" },
  { name: "Large", value: "0.75rem" },
  { name: "Full", value: "9999px" },
];

const WEIGHT_OPTIONS = [
  { name: "Regular", value: "400" },
  { name: "Medium", value: "500" },
  { name: "SemiBold", value: "600" },
  { name: "Bold", value: "700" },
  { name: "ExtraBold", value: "800" },
  { name: "Black", value: "900" },
];

const PRESET_PALETTES = [
  {
    name: "Smax Default",
    colors: {
      primary: "#E25A49",
      accent: "#E36B53",
      secondary: "#101828",
      background: "#ffffff",
    }
  },
  {
    name: "Midnight Pro",
    colors: {
      primary: "#6366F1",
      accent: "#818CF8",
      secondary: "#0F172A",
      background: "#ffffff",
    }
  },
  {
    name: "Golden Hour",
    colors: {
      primary: "#D97706",
      accent: "#F59E0B",
      secondary: "#451A03",
      background: "#ffffff",
    }
  },
  {
    name: "Deep Ocean",
    colors: {
      primary: "#0284C7",
      accent: "#0EA5E9",
      secondary: "#082F49",
      background: "#ffffff",
    }
  },
  {
    name: "Rose Garden",
    colors: {
      primary: "#E11D48",
      accent: "#FB7185",
      secondary: "#4C0519",
      background: "#ffffff",
    }
  },
  {
    name: "Forest Peak",
    colors: {
      primary: "#059669",
      accent: "#10B981",
      secondary: "#064E3B",
      background: "#ffffff",
    }
  },
  {
    name: "Slate Minimal",
    colors: {
      primary: "#334155",
      accent: "#475467",
      secondary: "#0F172A",
      background: "#ffffff",
    }
  },
  {
    name: "Cyber Neon",
    colors: {
      primary: "#D946EF",
      accent: "#F472B6",
      secondary: "#2E1065",
      background: "#ffffff",
    }
  }
];

export default function ThemeSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'colors' | 'typography' | 'ui' | 'effects' | 'blocks'>('colors');
  
  // Local state for theme config to enable live preview
  const [themeConfig, setThemeConfig] = useState<any>({
    colors: {
      primary: "#E25A49",
      primary_hover: "#c2543d",
      accent: "#E36B53",
      secondary: "#101828",
      success: "#10B981",
      background: "#ffffff",
      foreground: "#101828",
    },
    typography: {
      heading_font: "Inter, sans-serif",
      body_font: "Inter, sans-serif",
      base_size: "16px",
      h1_weight: "900",
      h2_weight: "800",
      h3_weight: "700",
    },
    ui: {
      radius: "0.5rem",
      button_style: "solid",
      shadow_style: "soft", // soft, sharp, deep, none
    },
    effects: {
      marquee_speed: "20s",
      marquee_gap: "2rem",
      grid_speed: "15s",
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase.from("site_settings").select("*").single();
      if (data) {
        setSettings(data);
        if (data.theme_config) {
          // Merge with defaults to ensure new fields are present
          setThemeConfig((prev: any) => ({
            ...prev,
            ...data.theme_config,
            colors: { ...prev.colors, ...data.theme_config.colors },
            typography: { ...prev.typography, ...data.theme_config.typography },
            ui: { ...prev.ui, ...data.theme_config.ui },
            effects: { ...prev.effects, ...data.theme_config.effects },
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ theme_config: themeConfig })
        .eq("id", settings.id);
      
      if (error) throw error;
      toast.success("Theme settings saved successfully!");
    } catch (err) {
      console.error("Error saving theme:", err);
      toast.error("Failed to save theme settings.");
    } finally {
      setSaving(false);
    }
  }

  const updateColor = (key: string, value: string) => {
    setThemeConfig({
      ...themeConfig,
      colors: { ...themeConfig.colors, [key]: value }
    });
  };

  const applyPreset = (preset: any) => {
    setThemeConfig({
      ...themeConfig,
      colors: { ...themeConfig.colors, ...preset.colors }
    });
  };

  if (loading) return <div className="p-8 text-center">Loading settings...</div>;

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Theme Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Customize your website's global visual identity.</p>
        </div>
        <Button 
          onClick={saveSettings} 
          disabled={saving}
          className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Navigation */}
        <div className="lg:col-span-3 space-y-2">
          <button 
            onClick={() => setActiveSection('colors')}
            className={cn(
              "w-full flex items-center space-x-3 px-5 py-4 rounded-2xl font-bold transition-all",
              activeSection === 'colors' ? "bg-primary text-white shadow-lg shadow-primary/10" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Palette className="w-5 h-5" />
            <span>Colors & Palettes</span>
          </button>
          <button 
            onClick={() => setActiveSection('typography')}
            className={cn(
              "w-full flex items-center space-x-3 px-5 py-4 rounded-2xl font-bold transition-all",
              activeSection === 'typography' ? "bg-primary text-white shadow-lg shadow-primary/10" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Type className="w-5 h-5" />
            <span>Typography</span>
          </button>
          <button 
            onClick={() => setActiveSection('ui')}
            className={cn(
              "w-full flex items-center space-x-3 px-5 py-4 rounded-2xl font-bold transition-all",
              activeSection === 'ui' ? "bg-primary text-white shadow-lg shadow-primary/10" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Square className="w-5 h-5" />
            <span>UI Components</span>
          </button>
          <button 
            onClick={() => setActiveSection('effects')}
            className={cn(
              "w-full flex items-center space-x-3 px-5 py-4 rounded-2xl font-bold transition-all",
              activeSection === 'effects' ? "bg-primary text-white shadow-lg shadow-primary/10" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Layout className="w-5 h-5" />
            <span>Effects & Motion</span>
          </button>
          <button 
            onClick={() => setActiveSection('blocks')}
            className={cn(
              "w-full flex items-center space-x-3 px-5 py-4 rounded-2xl font-bold transition-all",
              activeSection === 'blocks' ? "bg-primary text-white shadow-lg shadow-primary/10" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Sparkles className="w-5 h-5" />
            <span>Blocks & Layout</span>
          </button>

          <div className="mt-8 p-6 bg-primary/5 rounded-3xl border border-primary/10">
            <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-3 flex items-center">
              <Sparkles className="w-3 h-3 mr-2" /> Pro Tip
            </h4>
            <p className="text-[11px] text-gray-500 leading-relaxed italic">
              Changes applied here will affect the entire website instantly after saving. Use the preview to verify your design.
            </p>
          </div>
        </div>

        {/* Middle Content: Editor */}
        <div className="lg:col-span-5 space-y-6">
          {activeSection === 'colors' && (
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-gray-50/30">
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Brand Colors</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl border border-gray-200" style={{ backgroundColor: themeConfig.colors.primary }} />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Primary Color</p>
                          <p className="text-[10px] text-gray-400">Main brand color (buttons, icons)</p>
                        </div>
                      </div>
                      <input 
                        type="color" 
                        value={themeConfig.colors.primary} 
                        onChange={(e) => updateColor('primary', e.target.value)}
                        className="w-10 h-10 border-none bg-transparent cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl border border-gray-200" style={{ backgroundColor: themeConfig.colors.accent }} />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Accent Color</p>
                          <p className="text-[10px] text-gray-400">Supporting accents & highlights</p>
                        </div>
                      </div>
                      <input 
                        type="color" 
                        value={themeConfig.colors.accent} 
                        onChange={(e) => updateColor('accent', e.target.value)}
                        className="w-10 h-10 border-none bg-transparent cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl border border-gray-200" style={{ backgroundColor: themeConfig.colors.secondary }} />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Secondary Color</p>
                          <p className="text-[10px] text-gray-400">Navigation & dark backgrounds</p>
                        </div>
                      </div>
                      <input 
                        type="color" 
                        value={themeConfig.colors.secondary} 
                        onChange={(e) => updateColor('secondary', e.target.value)}
                        className="w-10 h-10 border-none bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Preset Palettes</h3>
                  <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {PRESET_PALETTES.map((preset) => (
                      <button 
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl hover:border-primary transition-all text-left space-y-2 group"
                      >
                        <p className="text-[10px] font-bold text-gray-500 group-hover:text-primary">{preset.name}</p>
                        <div className="flex -space-x-1">
                          {Object.values(preset.colors).map((c, i) => (
                            <div key={i} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'typography' && (
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-gray-50/30">
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Font Families</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 flex items-center">
                        <Heading1 className="w-4 h-4 mr-2 text-primary" /> Heading Font
                      </label>
                      <select 
                        className="w-full h-12 px-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/5 transition-all"
                        value={themeConfig.typography.heading_font}
                        onChange={(e) => setThemeConfig({ ...themeConfig, typography: { ...themeConfig.typography, heading_font: e.target.value } })}
                      >
                        {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 flex items-center">
                        <CaseSensitive className="w-4 h-4 mr-2 text-primary" /> Body Font
                      </label>
                      <select 
                        className="w-full h-12 px-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/5 transition-all"
                        value={themeConfig.typography.body_font}
                        onChange={(e) => setThemeConfig({ ...themeConfig, typography: { ...themeConfig.typography, body_font: e.target.value } })}
                      >
                        {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-6 pt-4 border-t border-gray-100">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Heading Weights</h4>
                      
                      {/* H1 Weight */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">H1 Weight (Main Titles)</label>
                        <div className="grid grid-cols-3 gap-2">
                          {WEIGHT_OPTIONS.map(w => (
                            <button
                              key={w.value}
                              onClick={() => setThemeConfig({ ...themeConfig, typography: { ...themeConfig.typography, h1_weight: w.value } })}
                              className={cn(
                                "py-1.5 text-[9px] font-bold border rounded-xl transition-all",
                                (themeConfig.typography.h1_weight || "900") === w.value ? "bg-primary text-white border-primary" : "bg-white text-gray-400 border-gray-100 hover:border-primary/20"
                              )}
                            >
                              {w.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* H2 Weight */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">H2 Weight (Section Titles)</label>
                        <div className="grid grid-cols-3 gap-2">
                          {WEIGHT_OPTIONS.map(w => (
                            <button
                              key={w.value}
                              onClick={() => setThemeConfig({ ...themeConfig, typography: { ...themeConfig.typography, h2_weight: w.value } })}
                              className={cn(
                                "py-1.5 text-[9px] font-bold border rounded-xl transition-all",
                                (themeConfig.typography.h2_weight || "800") === w.value ? "bg-primary text-white border-primary" : "bg-white text-gray-400 border-gray-100 hover:border-primary/20"
                              )}
                            >
                              {w.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* H3 Weight */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">H3 Weight (Sub Titles)</label>
                        <div className="grid grid-cols-3 gap-2">
                          {WEIGHT_OPTIONS.map(w => (
                            <button
                              key={w.value}
                              onClick={() => setThemeConfig({ ...themeConfig, typography: { ...themeConfig.typography, h3_weight: w.value } })}
                              className={cn(
                                "py-1.5 text-[9px] font-bold border rounded-xl transition-all",
                                (themeConfig.typography.h3_weight || "700") === w.value ? "bg-primary text-white border-primary" : "bg-white text-gray-400 border-gray-100 hover:border-primary/20"
                              )}
                            >
                              {w.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Text Sizing</h3>
                  <div className="p-6 bg-white border border-gray-100 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-gray-400">Base Font Size</span>
                      <span className="text-xs font-black text-primary bg-primary/5 px-3 py-1 rounded-full">{themeConfig.typography.base_size}</span>
                    </div>
                    <input 
                      type="range" 
                      min="14" max="22" 
                      value={parseInt(themeConfig.typography.base_size)} 
                      onChange={(e) => setThemeConfig({ ...themeConfig, typography: { ...themeConfig.typography, base_size: `${e.target.value}px` } })}
                      className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'ui' && (
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-gray-50/30">
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Global Radius</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {RADIUS_OPTIONS.map((opt) => (
                      <button 
                        key={opt.name}
                        onClick={() => setThemeConfig({ ...themeConfig, ui: { ...themeConfig.ui, radius: opt.value } })}
                        className={cn(
                          "p-3 border transition-all text-center rounded-2xl",
                          themeConfig.ui.radius === opt.value ? "bg-primary border-primary text-white" : "bg-white border-gray-100 text-gray-500 hover:border-primary/30"
                        )}
                      >
                        <p className="text-[10px] font-bold">{opt.name}</p>
                        <p className="text-[9px] opacity-60">{opt.value}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Shadow Intensity</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "Soft & Subtle", value: "soft", desc: "Minimal depth" },
                      { name: "Sharp & Defined", value: "sharp", desc: "Visible edges" },
                      { name: "Deep & High", value: "deep", desc: "Elevated look" },
                      { name: "Glassmorphic", value: "glass", desc: "Border + Glow" },
                      { name: "Neon Glow", value: "neon", desc: "Color glow" },
                      { name: "Retro Offset", value: "retro", desc: "Solid shadow" },
                      { name: "Flat (None)", value: "none", desc: "No shadow" },
                    ].map((opt) => (
                      <button 
                        key={opt.value}
                        onClick={() => setThemeConfig({ ...themeConfig, ui: { ...themeConfig.ui, shadow_style: opt.value } })}
                        className={cn(
                          "p-4 border transition-all text-left rounded-2xl space-y-1",
                          themeConfig.ui.shadow_style === opt.value ? "bg-primary border-primary text-white" : "bg-white border-gray-100 text-gray-500 hover:border-primary/30"
                        )}
                      >
                        <p className="text-[11px] font-bold">{opt.name}</p>
                        <p className={cn("text-[9px] opacity-60", themeConfig.ui.shadow_style === opt.value ? "text-white" : "text-gray-400")}>{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'effects' && (
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-gray-50/30">
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Marquee Motion</h3>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-xs font-bold text-gray-700">Animation Speed</label>
                        <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                          {themeConfig.effects.marquee_speed} ({(35 - parseInt(themeConfig.effects.marquee_speed)).toFixed(0)}x speed)
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="5" max="60" step="5"
                        value={parseInt(themeConfig.effects.marquee_speed)} 
                        onChange={(e) => setThemeConfig({ ...themeConfig, effects: { ...themeConfig.effects, marquee_speed: `${e.target.value}s` } })}
                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[8px] font-bold text-gray-300 uppercase tracking-widest">
                         <span>Fast</span>
                         <span>Relaxed</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-xs font-bold text-gray-700">Item Gap</label>
                        <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-tighter">{themeConfig.effects.marquee_gap}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {["1rem", "2rem", "4rem", "6rem"].map(gap => (
                          <button 
                            key={gap}
                            onClick={() => setThemeConfig({ ...themeConfig, effects: { ...themeConfig.effects, marquee_gap: gap } })}
                            className={cn(
                              "py-2 text-[10px] font-bold border rounded-xl transition-all",
                              themeConfig.effects.marquee_gap === gap ? "bg-primary text-white border-primary" : "bg-white text-gray-500 border-gray-100 hover:border-primary/20"
                            )}
                          >
                            {gap}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                   <p className="text-[10px] text-primary/60 font-medium leading-relaxed italic text-center">
                     Marquee settings apply to all scrolling brand banners and animated text carousels.
                   </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Grid Background</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-bold text-gray-700">Grid Movement Speed</label>
                      <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        {themeConfig.effects.grid_speed}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="5" max="40" step="1"
                      value={parseInt(themeConfig.effects.grid_speed)} 
                      onChange={(e) => setThemeConfig({ ...themeConfig, effects: { ...themeConfig.effects, grid_speed: `${e.target.value}s` } })}
                      className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-[8px] font-bold text-gray-300 uppercase tracking-widest">
                       <span>Energetic</span>
                       <span>Subtle</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'blocks' && (
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-gray-50/30">
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Global Block Theme</h3>
                  <p className="text-[10px] text-gray-500">Chọn phong cách mặc định cho tất cả các block trên website.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "SaaS Modern", value: "saas", desc: "Rounded, soft gradients" },
                    ].map((opt) => (
                      <button 
                        key={opt.value}
                        onClick={() => setThemeConfig({ ...themeConfig, blocks: { ...themeConfig.blocks, theme: opt.value } })}
                        className={cn(
                          "p-4 border transition-all text-left rounded-2xl space-y-1 w-full",
                          (themeConfig.blocks?.theme || "saas") === opt.value ? "bg-primary border-primary text-white" : "bg-white border-gray-100 text-gray-500 hover:border-primary/30"
                        )}
                      >
                        <p className="text-[11px] font-bold">{opt.name}</p>
                        <p className={cn("text-[9px] opacity-60", (themeConfig.blocks?.theme || "saas") === opt.value ? "text-white" : "text-gray-400")}>{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Global Spacing (Padding)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700">Padding Top (Mặc định)</label>
                      <select 
                        className="w-full h-10 px-3 bg-white border border-gray-100 rounded-xl text-xs outline-none"
                        value={themeConfig.blocks?.padding_top || "large"}
                        onChange={(e) => setThemeConfig({ ...themeConfig, blocks: { ...themeConfig.blocks, padding_top: e.target.value } })}
                      >
                        <option value="none">None (0px)</option>
                        <option value="small">Small (32px)</option>
                        <option value="medium">Medium (64px)</option>
                        <option value="large">Large (96px)</option>
                        <option value="xlarge">XLarge (128px)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700">Padding Bottom (Mặc định)</label>
                      <select 
                        className="w-full h-10 px-3 bg-white border border-gray-100 rounded-xl text-xs outline-none"
                        value={themeConfig.blocks?.padding_bottom || "large"}
                        onChange={(e) => setThemeConfig({ ...themeConfig, blocks: { ...themeConfig.blocks, padding_bottom: e.target.value } })}
                      >
                        <option value="none">None (0px)</option>
                        <option value="small">Small (32px)</option>
                        <option value="medium">Medium (64px)</option>
                        <option value="large">Large (96px)</option>
                        <option value="xlarge">XLarge (128px)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                   <p className="text-[10px] text-primary/60 font-medium leading-relaxed italic text-center">
                     Cài đặt này sẽ được áp dụng cho tất cả các block trừ khi bạn ghi đè (Override) riêng trong từng block.
                   </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Content: Live Preview */}
        <div className="lg:col-span-4 sticky top-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Live Preview</h3>
            
            {/* Helper to get shadow CSS based on style */}
            {(() => {
              const shadowStyles: any = {
                soft: "0 10px 15px -3px rgba(16, 24, 40, 0.1)",
                sharp: "0 4px 0px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)",
                deep: "0 25px 50px -12px rgba(0,0,0,0.25)",
                glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07), inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
                neon: `0 0 20px -5px ${themeConfig.colors.primary}66, 0 10px 10px -5px ${themeConfig.colors.primary}33`,
                retro: `8px 8px 0px ${themeConfig.colors.secondary}11`,
                none: "none"
              };
              const currentShadow = shadowStyles[themeConfig.ui.shadow_style] || shadowStyles.soft;

              return (
                <div 
                  className="bg-white border border-gray-100 rounded-[40px] p-8 space-y-8 min-h-[500px] flex flex-col justify-center overflow-hidden relative transition-all duration-500"
                  style={{ 
                    fontFamily: themeConfig.typography.body_font,
                    boxShadow: currentShadow
                  }}
                >
                    {/* Fake UI Elements */}
                    <div className={cn(
                      "flex flex-col gap-8",
                      themeConfig.blocks?.theme === "corporate" ? "text-left" : "items-center text-center"
                    )}>
                      {themeConfig.blocks?.theme === "corporate" ? (
                        <div className="grid grid-cols-1 gap-6">
                           <div className="space-y-4">
                              <div className="w-12 h-0.5 bg-primary" />
                              <h2 className="text-4xl font-serif text-slate-900 leading-tight">
                                Delivering Excellence through AI
                              </h2>
                              <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                                Standardizing the future of work with robust, high-performance intelligence.
                              </p>
                              <div className="flex gap-4 pt-2">
                                <div className="h-10 px-6 bg-slate-900 text-white text-[10px] font-bold flex items-center">GET STARTED</div>
                                <div className="h-10 px-6 border border-slate-200 text-slate-900 text-[10px] font-bold flex items-center">LEARN MORE</div>
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">NEXT-GEN AI</div>
                          <h2 
                            className="text-3xl leading-tight" 
                            style={{ 
                              color: themeConfig.colors.secondary, 
                              fontFamily: themeConfig.typography.heading_font,
                              fontWeight: themeConfig.typography.h2_weight || "800"
                            }}
                          >
                            Accelerate your business with AI
                          </h2>
                          <p className="text-gray-500 text-xs leading-relaxed max-w-sm mx-auto" style={{ fontSize: themeConfig.typography.base_size }}>
                            Our platform helps you automate complex workflows and gain deep insights in seconds.
                          </p>
                          <div className="flex items-center justify-center space-x-3">
                            <button 
                              className="px-6 py-3 text-xs font-bold text-white transition-all hover:brightness-110 active:scale-95"
                              style={{ 
                                backgroundColor: themeConfig.colors.primary, 
                                borderRadius: themeConfig.ui.radius,
                                boxShadow: themeConfig.ui.shadow_style !== 'none' ? `0 4px 14px 0 ${themeConfig.colors.primary}66` : 'none'
                              }}
                            >
                              Get Started
                            </button>
                            <button 
                              className="px-6 py-3 text-xs font-bold transition-all border hover:bg-gray-50"
                              style={{ borderColor: themeConfig.colors.primary, color: themeConfig.colors.primary, borderRadius: themeConfig.ui.radius }}
                            >
                              Learn More
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Spacing Visualizer */}
                    <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                      <div className="flex justify-between items-center text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        <span>Block Spacing Preview</span>
                        <span className="text-primary">{themeConfig.blocks?.padding_top || 'large'}</span>
                      </div>
                      <div 
                        className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-[10px] font-bold text-slate-400 italic"
                        style={{ 
                          paddingTop: themeConfig.blocks?.padding_top === 'xlarge' ? '64px' : themeConfig.blocks?.padding_top === 'large' ? '48px' : '24px',
                          paddingBottom: themeConfig.blocks?.padding_bottom === 'xlarge' ? '64px' : themeConfig.blocks?.padding_bottom === 'large' ? '48px' : '24px',
                        }}
                      >
                        Content Area
                      </div>
                    </div>

                  {/* Theme Decoration */}
                  <div 
                    className="absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-20 rounded-full transition-all duration-700"
                    style={{ backgroundColor: themeConfig.colors.primary }}
                  />
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
