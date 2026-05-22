"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface SiteSettings {
  id: string;
  theme_config: {
    colors: any;
    typography: any;
    ui: any;
    effects: any;
    blocks?: {
      theme?: string;
      padding_top?: string;
      padding_bottom?: string;
    };
  };
  site_name: string;
  logo_url?: string;
  logo_dark_url?: string;
  favicon_url?: string;
  course_config?: {
    list_layout?: "grid" | "list";
    banner_bg_style?: "dark" | "primary" | "gradient-royal" | "gradient-ocean" | "light" | "custom-image";
    banner_image_url?: string;
    banner_badge?: string;
    banner_title?: string;
    banner_description?: string;
    banner_search_placeholder?: string;
    show_prices?: boolean;
    show_progress?: boolean;
    primary_color_override?: string;
    detail_back_text?: string;
    detail_learning_type_text?: string;
    detail_cta_disclaimer?: string;
  };
}

const SiteSettingsContext = createContext<{
  settings: SiteSettings | null;
  loading: boolean;
}>({
  settings: null,
  loading: true,
});

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from("site_settings").select("*").single();
      if (data) {
        setSettings(data);
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
