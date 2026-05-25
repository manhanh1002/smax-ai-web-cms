import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { JobListingsSaaS } from "./themes/saas";
export function JobListingsDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><JobListingsSaaS data={data} isDark={data.settings?.colorMode === "dark" || (!data.settings?.colorMode && (data.settings?.background === "dark" || data.settings?.background === "primary"))} /></BlockWrapper>;
}
