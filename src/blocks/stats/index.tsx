"use client";

import React from "react";
import dynamic from "next/dynamic";
import { BlockData } from "../types";
import { StatsBlockData } from "./definition";
import { BlockWrapper } from "../BlockWrapper";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const StatsSaaS = dynamic(() => import("./themes/saas").then(mod => mod.StatsSaaS));

export function StatsBlockDispatcher({ data }: { data: BlockData<StatsBlockData> }) {
  const { settings: globalSettings } = useSiteSettings();
  const globalTheme = globalSettings?.theme_config?.blocks?.theme || "saas";
  
  const theme = data.theme || globalTheme;
  const wrapperSettings = { ...data.settings };
  
  if ((data as any).darkMode && !wrapperSettings.background) {
    wrapperSettings.background = "dark";
  }

  const renderTheme = () => {
    const props = {
      data: data as StatsBlockData,
      isDark: wrapperSettings.colorMode === "dark" || (!wrapperSettings.colorMode && (wrapperSettings.background === "dark" || wrapperSettings.background === "primary" || (data as any).darkMode)),
      settings: wrapperSettings
    };

    switch (theme) {
      case "saas":
      default:
        return <StatsSaaS {...props} />;
    }
  };

  return (
    <BlockWrapper settings={wrapperSettings}>
      {renderTheme()}
    </BlockWrapper>
  );
}
