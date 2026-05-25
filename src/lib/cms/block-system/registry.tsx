import React from "react";
import { BlockDefinition, PageBlock } from "./types";
import { registerGlobalRegistry } from "./global-registry-handler";

// Import all dispatchers (renderers)
import { HeroBlockDispatcher } from "@/blocks/hero";
import { HeroSecondaryDispatcher } from "@/blocks/hero-secondary";
import { CTABlockDispatcher } from "@/blocks/cta";
import { FeaturesBlockDispatcher } from "@/blocks/features";
import { RichTextBlockDispatcher } from "@/blocks/rich-text";
import { TestimonialsBlockDispatcher } from "@/blocks/testimonials";
import { FAQBlockDispatcher } from "@/blocks/faq";
import { TrustedByBlockDispatcher } from "@/blocks/trusted-by";
import { StatsBlockDispatcher } from "@/blocks/stats";
import { BentoBlockDispatcher } from "@/blocks/bento";
import { IconGridDispatcher } from "@/blocks/icon-grid";
import { VerticalTabsDispatcher } from "@/blocks/vertical-tabs";
import { HorizontalTabsDispatcher } from "@/blocks/horizontal-tabs";
import { ProcessDispatcher } from "@/blocks/process";
import { PricingDispatcher } from "@/blocks/pricing";
import { SuitableForDispatcher } from "@/blocks/suitable-for";
import { BlogPreviewDispatcher } from "@/blocks/blog-preview";
import { CardCarouselDispatcher } from "@/blocks/card-carousel";
import { CaseStudyDispatcher } from "@/blocks/case-study";
import { FormBlock } from "@/components/sections/FormBlock";

// Import all editors
import { HeroBlockEditor } from "@/blocks/hero/editor";
import { HeroSecondaryEditor } from "@/blocks/hero-secondary/editor";
import { CTABlockEditor } from "@/blocks/cta/editor";
import { FeaturesBlockEditor } from "@/blocks/features/editor";
import { RichTextBlockEditor } from "@/blocks/rich-text/editor";
import { TestimonialsBlockEditor } from "@/blocks/testimonials/editor";
import { FAQBlockEditor } from "@/blocks/faq/editor";
import { TrustedByBlockEditor } from "@/blocks/trusted-by/editor";
import { StatsBlockEditor } from "@/blocks/stats/editor";
import { BentoBlockEditor } from "@/blocks/bento/editor";
import { IconGridEditor } from "@/blocks/icon-grid/editor";
import { VerticalTabsEditor } from "@/blocks/vertical-tabs/editor";
import { HorizontalTabsEditor } from "@/blocks/horizontal-tabs/editor";
import { ProcessEditor } from "@/blocks/process/editor";
import { PricingEditor } from "@/blocks/pricing/editor";
import { SuitableForEditor } from "@/blocks/suitable-for/editor";
import { BlogPreviewEditor } from "@/blocks/blog-preview/editor";
import { CardCarouselEditor } from "@/blocks/card-carousel/editor";
import { CaseStudyEditor } from "@/blocks/case-study/editor";
import { FormBlockEditor } from "@/components/cms/block-editors/FormBlockEditor";

// Import new blocks definitions
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

// Import global_ref block components
import { GlobalRefRenderer } from "@/components/cms/GlobalRefRenderer";
import { GlobalRefBlockEditor } from "@/components/cms/block-editors/GlobalRefBlockEditor";

export const MASTER_BLOCK_REGISTRY: BlockDefinition[] = [
  { ...HeroBlockDef, renderer: HeroBlockDispatcher, editor: HeroBlockEditor },
  { ...HeroSecondaryDef, renderer: HeroSecondaryDispatcher, editor: HeroSecondaryEditor },
  { ...CTABlockDef, renderer: CTABlockDispatcher, editor: CTABlockEditor },
  { ...FeaturesBlockDef, renderer: FeaturesBlockDispatcher, editor: FeaturesBlockEditor },
  { ...RichTextBlockDef, renderer: RichTextBlockDispatcher, editor: RichTextBlockEditor },
  { ...TestimonialsBlockDef, renderer: TestimonialsBlockDispatcher, editor: TestimonialsBlockEditor },
  { ...FAQBlockDef, renderer: FAQBlockDispatcher, editor: FAQBlockEditor },
  { ...TrustedByBlockDef, renderer: TrustedByBlockDispatcher, editor: TrustedByBlockEditor },
  { ...StatsBlockDef, renderer: StatsBlockDispatcher, editor: StatsBlockEditor },
  { ...BentoBlockDef, renderer: BentoBlockDispatcher, editor: BentoBlockEditor },
  { ...IconGridDef, renderer: IconGridDispatcher, editor: IconGridEditor },
  { ...VerticalTabsBlockDef, renderer: VerticalTabsDispatcher, editor: VerticalTabsEditor },
  { ...HorizontalTabsBlockDef, renderer: HorizontalTabsDispatcher, editor: HorizontalTabsEditor },
  { ...ProcessBlockDef, renderer: ProcessDispatcher, editor: ProcessEditor },
  { ...PricingBlockDef, renderer: PricingDispatcher, editor: PricingEditor },
  { ...SuitableForBlockDef, renderer: SuitableForDispatcher, editor: SuitableForEditor },
  { ...BlogPreviewBlockDef, renderer: BlogPreviewDispatcher, editor: BlogPreviewEditor },
  { ...CardCarouselBlockDef, renderer: CardCarouselDispatcher, editor: CardCarouselEditor },
  { ...CaseStudyBlockDef, renderer: CaseStudyDispatcher, editor: CaseStudyEditor },
  { ...FormBlockDef, renderer: FormBlock, editor: FormBlockEditor },
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

registerGlobalRegistry({
  renderBlockRenderer,
  renderBlockEditor,
  getBlockDefinition,
  getBlockDefaultData,
  MASTER_BLOCK_REGISTRY,
});
