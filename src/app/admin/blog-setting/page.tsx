"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Save, Layout, Grid, Sidebar, Columns } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const BLOG_LAYOUTS = [
  { id: "magazine", label: "Magazine Layout", description: "Featured post at top with grid below", icon: Columns },
  { id: "grid", label: "Grid Layout with Search", description: "Searchable grid of posts (no tabs)", icon: Grid },
  { id: "sidebar", label: "Single Column with Sidebar", description: "Traditional blog list with widgets sidebar", icon: Sidebar },
];

const CATEGORY_LAYOUTS = [
  { id: "grid", label: "Grid Layout with Search", description: "Searchable grid of posts (no tabs)", icon: Grid },
  { id: "sidebar", label: "Single Column with Sidebar", description: "Traditional blog list with widgets sidebar", icon: Sidebar },
];

export default function BlogSetting() {
  const [settings, setSettings] = useState<any>(null);
  const [blogLayout, setBlogLayout] = useState("magazine");
  const [categoryLayout, setCategoryLayout] = useState("grid");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase.from("site_settings").select("*").single();
    if (data) {
      setSettings(data);
      const config = data.blog_config || {};
      setBlogLayout(config.blog_layout || "magazine");
      setCategoryLayout(config.category_layout || "grid");
    }
  }

  async function saveSettings() {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ 
        blog_config: { 
          blog_layout: blogLayout, 
          category_layout: categoryLayout 
        } 
      })
      .eq("id", settings.id);
    if (!error) toast.success("Blog settings saved!");
    else toast.error("Error saving blog settings!");
    setSaving(false);
  }

  if (!settings) return <div className="p-8 text-center text-slate-500 font-medium">Loading Blog Settings...</div>;

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Blog Settings</h1>
          <p className="text-slate-500 mt-1 font-medium">Configure layout and behavior for your blog sections.</p>
        </div>
        <Button onClick={saveSettings} disabled={saving} className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Main Blog Page Layout */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Layout className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Main Blog Page (/blog)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_LAYOUTS.map((layout) => {
              const Icon = layout.icon;
              const active = blogLayout === layout.id;
              return (
                <button
                  key={layout.id}
                  onClick={() => setBlogLayout(layout.id)}
                  className={cn(
                    "relative p-6 text-left border-2 rounded-[32px] transition-all group",
                    active 
                      ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" 
                      : "border-slate-100 bg-white hover:border-slate-300"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-colors",
                    active ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900">{layout.label}</h3>
                  <p className="text-sm text-slate-500 mt-1">{layout.description}</p>
                  
                  {active && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Category Page Layout */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Grid className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Topic Page (/blog/topic)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CATEGORY_LAYOUTS.map((layout) => {
              const Icon = layout.icon;
              const active = categoryLayout === layout.id;
              return (
                <button
                  key={layout.id}
                  onClick={() => setCategoryLayout(layout.id)}
                  className={cn(
                    "relative p-6 text-left border-2 rounded-[32px] transition-all group",
                    active 
                      ? "border-blue-500 bg-blue-50 shadow-xl shadow-blue-500/5" 
                      : "border-slate-100 bg-white hover:border-slate-300"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-colors",
                    active ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900">{layout.label}</h3>
                  <p className="text-sm text-slate-500 mt-1">{layout.description}</p>
                  
                  {active && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
