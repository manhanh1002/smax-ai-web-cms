import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { PageHeaderSaaS } from "./themes/saas";
export function PageHeaderDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><PageHeaderSaaS data={data} isDark={data.settings?.colorMode === "dark" || (!data.settings?.colorMode && (data.settings?.background === "dark" || data.settings?.background === "primary"))} /></BlockWrapper>;
}
