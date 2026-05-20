"use client";

import React from "react";
import dynamic from "next/dynamic";
import { BlockData } from "../types";
import { CardCarouselBlockData } from "./definition";
import { BlockWrapper } from "../BlockWrapper";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const CardCarouselSaaS = dynamic(() => import("./themes/saas").then(mod => mod.CardCarouselSaaS));

export function CardCarouselDispatcher({ data }: { data: BlockData<CardCarouselBlockData> }) {
  const { settings: globalSettings } = useSiteSettings();
  const globalTheme = globalSettings?.theme_config?.blocks?.theme || "saas";
  
  const theme = data.theme || globalTheme;
  const wrapperSettings = { ...data.settings };
  
  if ((data as any).darkMode && !wrapperSettings.background) {
    wrapperSettings.background = "dark";
  }

  const renderTheme = () => {
    const props = {
      data: data as CardCarouselBlockData,
      isDark: wrapperSettings.colorMode === "dark" || (!wrapperSettings.colorMode && (wrapperSettings.background === "dark" || wrapperSettings.background === "primary" || (data as any).darkMode)),
      settings: wrapperSettings
    };

    switch (theme) {
      case "saas":
      default:
        return <CardCarouselSaaS {...props} />;
    }
  };

  return (
    <BlockWrapper settings={wrapperSettings}>
      {renderTheme()}
    </BlockWrapper>
  );
}
