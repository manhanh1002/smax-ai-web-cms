import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { MobileAppPreviewSaaS } from "./themes/saas";
export function MobileAppPreviewDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><MobileAppPreviewSaaS data={data} isDark={data.settings?.colorMode === "dark" || (!data.settings?.colorMode && (data.settings?.background === "dark" || data.settings?.background === "primary"))} /></BlockWrapper>;
}
