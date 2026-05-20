import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { NewsletterSignupSaaS } from "./themes/saas";
export function NewsletterSignupDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><NewsletterSignupSaaS data={data} isDark={data.settings?.background==="dark"} /></BlockWrapper>;
}
