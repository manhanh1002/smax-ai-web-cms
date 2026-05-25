import type { BlockDefinition, BlockData } from "@/blocks/types";
import { PricingToggleDispatcher } from "./index";
import { PricingToggleEditor } from "./editor";

export interface PricingPlan { name: string; monthlyPrice: number; annualPrice: number; currency: string; description?: string; features: string[]; ctaText: string; ctaAction?: any; popular?: boolean; badge?: string; }
export interface PricingToggleData {
  sectionLabel?: string;
  title: string;
  subtitle?: string;
  plans: PricingPlan[];
  savingsBadge?: string;
  monthlyLabel?: string;
  yearlyLabel?: string;
  settings?: any;
}

export const PricingToggleDef: BlockDefinition<BlockData<PricingToggleData>> = {
  type: "pricingToggle",
  label: "💰 Pricing Toggle",
  description: "Bảng giá với toggle tháng/năm.",
  category: "marketing",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    title: "Bảng giá",
    plans: [],
    savingsBadge: "Tiết kiệm 20%",
    monthlyLabel: "Tháng",
    yearlyLabel: "Năm",
  },
  renderer: PricingToggleDispatcher,
  editor: PricingToggleEditor,
};
