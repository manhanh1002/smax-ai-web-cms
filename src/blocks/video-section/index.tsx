import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { VideoSectionSaaS } from "./themes/saas";
export function VideoSectionDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><VideoSectionSaaS data={data} isDark={data.settings?.colorMode === "dark" || (!data.settings?.colorMode && (data.settings?.background === "dark" || data.settings?.background === "primary"))} /></BlockWrapper>;
}
