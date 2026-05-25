import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { CountUpStatsSaaS } from "./themes/saas";
export function CountUpStatsDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><CountUpStatsSaaS data={data} isDark={data.settings?.colorMode === "dark" || (!data.settings?.colorMode && (data.settings?.background === "dark" || data.settings?.background === "primary"))} /></BlockWrapper>;
}
