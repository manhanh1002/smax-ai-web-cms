import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { ContactFormSaaS } from "./themes/saas";
export function ContactFormDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><ContactFormSaaS data={data} isDark={data.settings?.colorMode === "dark" || (!data.settings?.colorMode && (data.settings?.background === "dark" || data.settings?.background === "primary"))} /></BlockWrapper>;
}
