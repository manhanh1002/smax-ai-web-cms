import { CTABlockDispatcher } from "./index";
import { CTABlockEditor } from "./editor";
import { BlockDefinition } from "../types";

export interface CTABlockData {
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  bullets?: string[];
  formUrl?: string;
  formHeight?: number;
  btnText?: string;
  url?: any; // ButtonAction | string
}

export const CTABlockDef: BlockDefinition<CTABlockData> = {
  type: "cta",
  label: "📣 Call to Action (CTA)",
  description: "Khối kêu gọi hành động với Form liên hệ hoặc Iframe.",
  category: "marketing",
  supportedThemes: ["saas"],
  renderer: CTABlockDispatcher as any,
  editor: CTABlockEditor as any,
  defaultData: { title: "Ready to scale?", subtitle: "Start your free trial today.", bullets: ["No credit card required"], formUrl: "", formHeight: 500 }
};
