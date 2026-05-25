import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { DownloadCardsSaaS } from "./themes/saas";
export function DownloadCardsDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><DownloadCardsSaaS data={data} isDark={data.settings?.colorMode === "dark" || (!data.settings?.colorMode && (data.settings?.background === "dark" || data.settings?.background === "primary"))} /></BlockWrapper>;
}
