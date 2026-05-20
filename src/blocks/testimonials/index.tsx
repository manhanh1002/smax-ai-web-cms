"use client";

import React from "react";
import dynamic from "next/dynamic";
import { BlockData } from "../types";
import { TestimonialsBlockData } from "./definition";
import { BlockWrapper } from "../BlockWrapper";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const TestimonialsSaaS = dynamic(() => import("./themes/saas").then(mod => mod.TestimonialsSaaS));

export function TestimonialsBlockDispatcher({ data }: { data: BlockData<TestimonialsBlockData> }) {
  const { settings: globalSettings } = useSiteSettings();
  const globalTheme = globalSettings?.theme_config?.blocks?.theme || "saas";
  
  const theme = data.theme || globalTheme;
  const wrapperSettings = { ...data.settings };
  
  if ((data as any).darkMode && !wrapperSettings.background) {
    wrapperSettings.background = "dark";
  }

  const renderTheme = () => {
    const props = {
      data: data as TestimonialsBlockData,
      isDark: wrapperSettings.colorMode === "dark" || (!wrapperSettings.colorMode && (wrapperSettings.background === "dark" || wrapperSettings.background === "primary" || (data as any).darkMode)),
      settings: wrapperSettings
    };

    switch (theme) {
      case "saas":
      default:
        return <TestimonialsSaaS {...props} />;
    }
  };

  return (
    <BlockWrapper settings={wrapperSettings}>
      {renderTheme()}
    </BlockWrapper>
  );
}
