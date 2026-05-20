"use client";

import React from "react";
import dynamic from "next/dynamic";
import { BlockData } from "../types";
import { HeroBlockData } from "./definition";
import { BlockWrapper } from "../BlockWrapper";

// Dynamically import themes so only the used one is loaded in the bundle
const HeroSaaS = dynamic(() => import("./themes/saas").then(mod => mod.HeroSaaS));
import { useSiteSettings } from "@/context/SiteSettingsContext";

export function HeroBlockDispatcher({ data }: { data: BlockData<HeroBlockData> }) {
  const { settings: globalSettings } = useSiteSettings();
  const globalTheme = globalSettings?.theme_config?.blocks?.theme || "saas";
  
  const theme = data.theme || globalTheme;

  // Provide fallback to ensure dark mode works with background settings
  // If the old data has darkMode: true, we override the background to 'dark' for the wrapper
  const wrapperSettings = { ...data.settings };
  if (data.darkMode && !wrapperSettings.background) {
    wrapperSettings.background = "dark";
  }

  // Render the selected theme
  const renderTheme = () => {
    const themeProps = {
      data: data as HeroBlockData,
      isDark: wrapperSettings.colorMode === "dark" || (!wrapperSettings.colorMode && (wrapperSettings.background === "dark" || wrapperSettings.background === "primary" || data.darkMode)),
      settings: wrapperSettings
    };

    return <HeroSaaS {...themeProps} />;
  };

  return (
    <BlockWrapper settings={wrapperSettings}>
      {renderTheme()}
    </BlockWrapper>
  );
}
