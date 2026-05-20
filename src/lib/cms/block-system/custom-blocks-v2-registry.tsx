/**
 * custom-blocks-v2-registry.tsx — đăng ký tất cả 25 custom blocks vào MASTER_BLOCK_REGISTRY
 */

// ── Dispatchers ──────────────────────────────────────────────────────────────
import { AnnouncementBarDispatcher } from "@/blocks/announcement-bar";
import { AuthorBioDispatcher }       from "@/blocks/author-bio";
import { BeforeAfterDispatcher }     from "@/blocks/before-after";
import { CompareTableDispatcher }    from "@/blocks/compare-table";
import { ContactFormDispatcher }     from "@/blocks/contact-form";
import { CountUpStatsDispatcher }    from "@/blocks/count-up-stats";
import { DownloadCardsDispatcher }   from "@/blocks/download-cards";
import { FeatureChecklistDispatcher }from "@/blocks/feature-checklist";
import { GlossaryDispatcher }        from "@/blocks/glossary";
import { HeroCenteredDispatcher }    from "@/blocks/hero-centered";
import { ImageGalleryDispatcher }    from "@/blocks/image-gallery";
import { IntegrationsHubDispatcher } from "@/blocks/integrations-hub";
import { JobListingsDispatcher }     from "@/blocks/job-listings";
import { MapContactDispatcher }      from "@/blocks/map-contact";
import { MobileAppPreviewDispatcher }from "@/blocks/mobile-app-preview";
import { NewsletterSignupDispatcher }from "@/blocks/newsletter-signup";
import { PageHeaderDispatcher }      from "@/blocks/page-header";
import { PricingToggleDispatcher }   from "@/blocks/pricing-toggle";
import { QuoteHighlightDispatcher }  from "@/blocks/quote-highlight";
import { RelatedContentDispatcher }  from "@/blocks/related-content";
import { ReviewBadgesDispatcher }    from "@/blocks/review-badges";
import { RichAccordionDispatcher }   from "@/blocks/rich-accordion";
import { TeamGridDispatcher }        from "@/blocks/team-grid";
import { TimelineDispatcher }        from "@/blocks/timeline";
import { VideoSectionDispatcher }    from "@/blocks/video-section";

// ── Editors ───────────────────────────────────────────────────────────────────
import { AnnouncementBarEditor } from "@/blocks/announcement-bar/editor";
import { AuthorBioEditor }       from "@/blocks/author-bio/editor";
import { BeforeAfterEditor }     from "@/blocks/before-after/editor";
import { CompareTableEditor }    from "@/blocks/compare-table/editor";
import { ContactFormEditor }     from "@/blocks/contact-form/editor";
import { CountUpStatsEditor }    from "@/blocks/count-up-stats/editor";
import { DownloadCardsEditor }   from "@/blocks/download-cards/editor";
import { FeatureChecklistEditor }from "@/blocks/feature-checklist/editor";
import { GlossaryEditor }        from "@/blocks/glossary/editor";
import { HeroCenteredEditor }    from "@/blocks/hero-centered/editor";
import { ImageGalleryEditor }    from "@/blocks/image-gallery/editor";
import { IntegrationsHubEditor } from "@/blocks/integrations-hub/editor";
import { JobListingsEditor }     from "@/blocks/job-listings/editor";
import { MapContactEditor }      from "@/blocks/map-contact/editor";
import { MobileAppPreviewEditor }from "@/blocks/mobile-app-preview/editor";
import { NewsletterSignupEditor }from "@/blocks/newsletter-signup/editor";
import { PageHeaderEditor }      from "@/blocks/page-header/editor";
import { PricingToggleEditor }   from "@/blocks/pricing-toggle/editor";
import { QuoteHighlightEditor }  from "@/blocks/quote-highlight/editor";
import { RelatedContentEditor }  from "@/blocks/related-content/editor";
import { ReviewBadgesEditor }    from "@/blocks/review-badges/editor";
import { RichAccordionEditor }   from "@/blocks/rich-accordion/editor";
import { TeamGridEditor }        from "@/blocks/team-grid/editor";
import { TimelineEditor }        from "@/blocks/timeline/editor";
import { VideoSectionEditor }    from "@/blocks/video-section/editor";

// ── Definitions ───────────────────────────────────────────────────────────────
import { AnnouncementBarDef } from "@/blocks/announcement-bar/definition";
import { AuthorBioDef }       from "@/blocks/author-bio/definition";
import { BeforeAfterDef }     from "@/blocks/before-after/definition";
import { CompareTableDef }    from "@/blocks/compare-table/definition";
import { ContactFormDef }     from "@/blocks/contact-form/definition";
import { CountUpStatsDef }    from "@/blocks/count-up-stats/definition";
import { DownloadCardsDef }   from "@/blocks/download-cards/definition";
import { FeatureChecklistDef }from "@/blocks/feature-checklist/definition";
import { GlossaryDef }        from "@/blocks/glossary/definition";
import { HeroCenteredDef }    from "@/blocks/hero-centered/definition";
import { ImageGalleryDef }    from "@/blocks/image-gallery/definition";
import { IntegrationsHubDef } from "@/blocks/integrations-hub/definition";
import { JobListingsDef }     from "@/blocks/job-listings/definition";
import { MapContactDef }      from "@/blocks/map-contact/definition";
import { MobileAppPreviewDef }from "@/blocks/mobile-app-preview/definition";
import { NewsletterSignupDef }from "@/blocks/newsletter-signup/definition";
import { PageHeaderDef }      from "@/blocks/page-header/definition";
import { PricingToggleDef }   from "@/blocks/pricing-toggle/definition";
import { QuoteHighlightDef }  from "@/blocks/quote-highlight/definition";
import { RelatedContentDef }  from "@/blocks/related-content/definition";
import { ReviewBadgesDef }    from "@/blocks/review-badges/definition";
import { RichAccordionDef }   from "@/blocks/rich-accordion/definition";
import { TeamGridDef }        from "@/blocks/team-grid/definition";
import { TimelineDef }        from "@/blocks/timeline/definition";
import { VideoSectionDef }    from "@/blocks/video-section/definition";
import { CustomCodeBlockDef } from "@/blocks/custom-code/definition";

import type { BlockDefinition } from "@/blocks/types";

// ── Assembled registry ────────────────────────────────────────────────────────
export const CUSTOM_BLOCKS_V2: BlockDefinition[] = [
  // Layout
  { ...HeroCenteredDef,    renderer: HeroCenteredDispatcher,    editor: HeroCenteredEditor },
  { ...PageHeaderDef,      renderer: PageHeaderDispatcher,      editor: PageHeaderEditor },

  // Content
  { ...TimelineDef,        renderer: TimelineDispatcher,        editor: TimelineEditor },
  { ...QuoteHighlightDef,  renderer: QuoteHighlightDispatcher,  editor: QuoteHighlightEditor },
  { ...AuthorBioDef,       renderer: AuthorBioDispatcher,       editor: AuthorBioEditor },
  { ...RichAccordionDef,   renderer: RichAccordionDispatcher,   editor: RichAccordionEditor },
  { ...GlossaryDef,        renderer: GlossaryDispatcher,        editor: GlossaryEditor },
  { ...ImageGalleryDef,    renderer: ImageGalleryDispatcher,    editor: ImageGalleryEditor },
  { ...VideoSectionDef,    renderer: VideoSectionDispatcher,    editor: VideoSectionEditor },
  { ...BeforeAfterDef,     renderer: BeforeAfterDispatcher,     editor: BeforeAfterEditor },
  CustomCodeBlockDef,

  // Marketing
  { ...PricingToggleDef,   renderer: PricingToggleDispatcher,   editor: PricingToggleEditor },
  { ...CountUpStatsDef,    renderer: CountUpStatsDispatcher,    editor: CountUpStatsEditor },
  { ...AnnouncementBarDef, renderer: AnnouncementBarDispatcher, editor: AnnouncementBarEditor },
  { ...FeatureChecklistDef,renderer: FeatureChecklistDispatcher,editor: FeatureChecklistEditor },
  { ...DownloadCardsDef,   renderer: DownloadCardsDispatcher,   editor: DownloadCardsEditor },
  { ...CompareTableDef,    renderer: CompareTableDispatcher,    editor: CompareTableEditor },
  { ...IntegrationsHubDef, renderer: IntegrationsHubDispatcher, editor: IntegrationsHubEditor },
  { ...MobileAppPreviewDef,renderer: MobileAppPreviewDispatcher,editor: MobileAppPreviewEditor },

  // Social / Forms
  { ...TeamGridDef,        renderer: TeamGridDispatcher,        editor: TeamGridEditor },
  { ...NewsletterSignupDef,renderer: NewsletterSignupDispatcher,editor: NewsletterSignupEditor },
  { ...ContactFormDef,     renderer: ContactFormDispatcher,     editor: ContactFormEditor },
  { ...RelatedContentDef,  renderer: RelatedContentDispatcher,  editor: RelatedContentEditor },
  { ...ReviewBadgesDef,    renderer: ReviewBadgesDispatcher,    editor: ReviewBadgesEditor },
  { ...JobListingsDef,     renderer: JobListingsDispatcher,     editor: JobListingsEditor },
  { ...MapContactDef,      renderer: MapContactDispatcher,      editor: MapContactEditor },
];
