import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { TeamGridSaaS } from "./themes/saas";
export function TeamGridDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><TeamGridSaaS data={data} isDark={data.settings?.background==="dark"} /></BlockWrapper>;
}
