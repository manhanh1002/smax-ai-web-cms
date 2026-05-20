import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { HeroCenteredSaaS } from "./themes/saas";
export function HeroCenteredDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><HeroCenteredSaaS data={data} isDark={data.settings?.background==="dark"} settings={data.settings} /></BlockWrapper>;
}
