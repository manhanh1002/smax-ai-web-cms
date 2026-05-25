import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { FeatureChecklistSaaS } from "./themes/saas";
export function FeatureChecklistDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><FeatureChecklistSaaS data={data} isDark={data.settings?.colorMode === "dark" || (!data.settings?.colorMode && (data.settings?.background === "dark" || data.settings?.background === "primary"))} /></BlockWrapper>;
}
