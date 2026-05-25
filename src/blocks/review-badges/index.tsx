import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { ReviewBadgesSaaS } from "./themes/saas";
export function ReviewBadgesDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><ReviewBadgesSaaS data={data} isDark={data.settings?.colorMode === "dark" || (!data.settings?.colorMode && (data.settings?.background === "dark" || data.settings?.background === "primary"))} /></BlockWrapper>;
}
