import React from "react";
import { BlockDefinition, PageBlock } from "./types";

// Import all renderers
import { 
  TrustedByBlock, FeaturesBlock, SuitableForBlock, 
  BentoGridBlock, TestimonialsBlock, FAQBlock, CTABlock, 
  VerticalTabsBlock, HorizontalTabsBlock, ProcessStepsBlock, 
  HeroSecondaryBlock, StatsCounterBlock, FeatureIconGrid, 
  BlogPreviewBlock, CaseStudySliderBlock, CardCarouselBlock, 
  PricingComparisonBlock, RichTextBlock
} from "@/components/sections";

// Import new blocks
import { HeroBlockDef } from "@/blocks/hero/definition";
import { CTABlockDef } from "@/blocks/cta/definition";
import { FeaturesBlockDef } from "@/blocks/features/definition";
import { RichTextBlockDef } from "@/blocks/rich-text/definition";
import { TestimonialsBlockDef } from "@/blocks/testimonials/definition";
import { FAQBlockDef } from "@/blocks/faq/definition";
import { TrustedByBlockDef } from "@/blocks/trusted-by/definition";
import { StatsBlockDef } from "@/blocks/stats/definition";
import { HeroSecondaryDef } from "@/blocks/hero-secondary/definition";
import { BentoBlockDef } from "@/blocks/bento/definition";
import { IconGridDef } from "@/blocks/icon-grid/definition";
import { VerticalTabsBlockDef } from "@/blocks/vertical-tabs/definition";
import { HorizontalTabsBlockDef } from "@/blocks/horizontal-tabs/definition";
import { ProcessBlockDef } from "@/blocks/process/definition";
import { PricingBlockDef } from "@/blocks/pricing/definition";
import { SuitableForBlockDef } from "@/blocks/suitable-for/definition";
import { BlogPreviewBlockDef } from "@/blocks/blog-preview/definition";
import { CardCarouselBlockDef } from "@/blocks/card-carousel/definition";
import { CaseStudyBlockDef } from "@/blocks/case-study/definition";
import { FormBlockDef } from "@/blocks/form/definition";
import { CUSTOM_BLOCKS_V2 } from "./custom-blocks-v2-registry";

// Import all editors
import { TrustedByBlockEditor } from "@/components/cms/block-editors/TrustedByBlockEditor";
import { FeaturesBlockEditor } from "@/components/cms/block-editors/FeaturesBlockEditor";
import { SuitableForBlockEditor } from "@/components/cms/block-editors/SuitableForBlockEditor";
import { BentoGridBlockEditor } from "@/components/cms/block-editors/BentoGridBlockEditor";
import { TestimonialsBlockEditor } from "@/components/cms/block-editors/TestimonialsBlockEditor";
import { FAQBlockEditor } from "@/components/cms/block-editors/FAQBlockEditor";
import { CTABlockEditor } from "@/components/cms/block-editors/CTABlockEditor";
import { VerticalTabsBlockEditor } from "@/components/cms/block-editors/VerticalTabsBlockEditor";
import { HorizontalTabsBlockEditor } from "@/components/cms/block-editors/HorizontalTabsBlockEditor";
import { ProcessStepsBlockEditor } from "@/components/cms/block-editors/ProcessStepsBlockEditor";
import { HeroSecondaryBlockEditor } from "@/components/cms/block-editors/HeroSecondaryBlockEditor";
import { StatsCounterBlockEditor } from "@/components/cms/block-editors/StatsCounterBlockEditor";
import { FeatureIconGridEditor } from "@/components/cms/block-editors/FeatureIconGridEditor";
import { BlogPreviewBlockEditor } from "@/components/cms/block-editors/BlogPreviewBlockEditor";
import { CaseStudySliderBlockEditor } from "@/components/cms/block-editors/CaseStudySliderBlockEditor";
import { CardCarouselBlockEditor } from "@/components/cms/block-editors/CardCarouselBlockEditor";
import { PricingComparisonBlockEditor } from "@/components/cms/block-editors/PricingComparisonBlockEditor";
import { RichTextBlockEditor } from "@/components/cms/block-editors/RichTextBlockEditor";

// Import global_ref block components
import { GlobalRefRenderer } from "@/components/cms/GlobalRefRenderer";
import { GlobalRefBlockEditor } from "@/components/cms/block-editors/GlobalRefBlockEditor";

export const MASTER_BLOCK_REGISTRY: BlockDefinition[] = [
  HeroBlockDef,
  HeroSecondaryDef,
  CTABlockDef,
  FeaturesBlockDef,
  RichTextBlockDef,
  TestimonialsBlockDef,
  FAQBlockDef,
  TrustedByBlockDef,
  StatsBlockDef,
  BentoBlockDef,
  IconGridDef,
  VerticalTabsBlockDef,
  HorizontalTabsBlockDef,
  ProcessBlockDef,
  PricingBlockDef,
  SuitableForBlockDef,
  BlogPreviewBlockDef,
  CardCarouselBlockDef,
  { ...CaseStudyBlockDef },
  { ...FormBlockDef },
  ...CUSTOM_BLOCKS_V2,
];

// Global Ref block definition (not in MASTER_BLOCK_REGISTRY since it's not selectable from standard picker)
export const GLOBAL_REF_BLOCK_DEF: BlockDefinition = {
  type: "global_ref",
  label: "🔗 Global Block",
  description: "Một block được đồng bộ toàn hệ thống",
  category: "layout",
  defaultData: { block_id: "" },
  renderer: GlobalRefRenderer as any,
  editor: GlobalRefBlockEditor as any,
};

export function getBlockDefinition(type: string): BlockDefinition | undefined {
  if (type === "global_ref") return GLOBAL_REF_BLOCK_DEF;
  return MASTER_BLOCK_REGISTRY.find(b => b.type === type);
}

export function renderBlockRenderer(block: PageBlock, index: number) {
  const def = getBlockDefinition(block.type);
  if (!def) return null;
  const Renderer = def.renderer;
  return <Renderer key={index} data={block.data} />;
}

export function renderBlockEditor(block: PageBlock, onChange: (data: any) => void) {
  const def = getBlockDefinition(block.type);
  if (!def) return <div className="text-slate-400 text-sm italic">Không tìm thấy editor cho block này ({block.type}).</div>;
  const Editor = def.editor;
  return <Editor data={block.data} onChange={onChange} />;
}

export function getBlockDefaultData(type: string): any {
  const def = getBlockDefinition(type);
  return def ? def.defaultData : { darkMode: false };
}
