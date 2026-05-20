import React from "react";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { 
  HeroBlock, TrustedByBlock, FeaturesBlock, SuitableForBlock, 
  BentoGridBlock, TestimonialsBlock, FAQBlock, CTABlock,
  VerticalTabsBlock, HorizontalTabsBlock, ProcessStepsBlock,
  HeroSecondaryBlock, StatsCounterBlock, FeatureIconGrid,
  BlogPreviewBlock, CaseStudySliderBlock, CardCarouselBlock,
  PricingComparisonBlock, RichTextBlock
} from "@/components/sections";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { extractHeadings } from "@/lib/toc-utils";

// Dynamic components mapping
const COMPONENTS: Record<string, any> = {
  hero: HeroBlock,
  trustedBy: TrustedByBlock,
  features: FeaturesBlock,
  suitableFor: SuitableForBlock,
  bentoGrid: BentoGridBlock,
  testimonials: TestimonialsBlock,
  faq: FAQBlock,
  cta: CTABlock,
  verticalTabs: VerticalTabsBlock,
  horizontalTabs: HorizontalTabsBlock,
  process: ProcessStepsBlock,
  heroSecondary: HeroSecondaryBlock,
  stats: StatsCounterBlock,
  featureIconGrid: FeatureIconGrid,
  blogPreview: BlogPreviewBlock,
  caseStudy: CaseStudySliderBlock,
  cardCarousel: CardCarouselBlock,
  pricing: PricingComparisonBlock,
  richText: RichTextBlock,
};

async function getPost(slug: string) {
  const { data } = await supabase
    .from("posts")
    .select("*, categories(name)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const blocks = post.content || [];

  // Extract headings for ToC from richText blocks
  const headings: { id: string; text: string; level: number }[] = [];
  blocks.forEach((block: any) => {
    if (block.type === 'richText' && block.data?.content) {
      headings.push(...extractHeadings(block.data.content));
    }
  });

  return (
    <article className="min-h-screen bg-white">
      {/* Article Header (for SEO/GEO) */}
      <header className="py-24 px-6 bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
            {post.categories?.name || "Tin tức"}
          </span>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.05]">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-400 font-medium">
            <span>{new Date(post.published_at || post.created_at).toLocaleDateString('vi-VN', { dateStyle: 'long' })}</span>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span>{Math.max(1, Math.ceil(JSON.stringify(blocks).length / 2000))} phút đọc</span>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="space-y-0">
              {blocks.map((block: any, index: number) => {
                const Component = COMPONENTS[block.type];
                if (!Component) return null;
                return <Component key={index} data={block.data} />;
              })}
            </div>
          </div>

          {/* Sidebar Area (Table of Contents) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </div>

      {/* Structured Data (GEO Optimization) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "image": [post.featured_image],
            "datePublished": post.published_at || post.created_at,
            "dateModified": post.updated_at,
            "author": [{
                "@type": "Person",
                "name": "Smax AI Team",
                "url": "https://smax.ai"
              }],
            "description": post.summary || post.seo_description
          })
        }}
      />
    </article>
  );
}
