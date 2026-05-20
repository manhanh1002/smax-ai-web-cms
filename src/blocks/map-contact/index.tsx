import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { MapContactSaaS } from "./themes/saas";
export function MapContactDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><MapContactSaaS data={data} isDark={data.settings?.background==="dark"} /></BlockWrapper>;
}
