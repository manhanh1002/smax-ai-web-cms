import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { IntegrationsHubSaaS } from "./themes/saas";
export function IntegrationsHubDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><IntegrationsHubSaaS data={data} isDark={data.settings?.background==="dark"} /></BlockWrapper>;
}
