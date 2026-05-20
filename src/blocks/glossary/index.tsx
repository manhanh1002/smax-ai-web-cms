import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { GlossarySaaS } from "./themes/saas";
export function GlossaryDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><GlossarySaaS data={data} isDark={data.settings?.background==="dark"} /></BlockWrapper>;
}
