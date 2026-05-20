// Block type → data type mapping
export type { HeroBlockData } from "./HeroBlock";
export type { TrustedByBlockData } from "./TrustedByBlock";
export type { FeaturesBlockData, FeatureItem } from "./FeaturesBlock";
export type { SuitableForBlockData, SuitableCard } from "./SuitableForBlock";
export type { BentoGridBlockData, BentoCard } from "./BentoGridBlock";
export type { TestimonialsBlockData, TestimonialItem } from "./TestimonialsBlock";
export type { FAQBlockData, FAQItem } from "./FAQBlock";
export type { CTABlockData } from "./CTABlock";
export type { VerticalTabsBlockData, VerticalTabItem } from "./VerticalTabsBlock";
export type { HorizontalTabsBlockData, HorizontalTabItem } from "./HorizontalTabsBlock";
export type { ProcessStepsBlockData, ProcessStep } from "./ProcessStepsBlock";
export type { HeroSecondaryBlockData } from "./HeroSecondaryBlock";
export type { StatsCounterBlockData, StatItem } from "./StatsCounterBlock";
export type { FeatureIconGridData, FeatureIconItem } from "./FeatureIconGrid";
export type { BlogPreviewBlockData, BlogPostItem } from "./BlogPreviewBlock";
export type { CaseStudySliderBlockData, CaseStudyItem } from "./CaseStudySliderBlock";
export type { CardCarouselBlockData, CarouselCard } from "./CardCarouselBlock";
export type { PricingComparisonBlockData, PricingPlan } from "./PricingComparisonBlock";
export type { RichTextBlockData } from "./RichTextBlock";
export type { FormBlockData } from "./FormBlock";

export { HeroBlock } from "./HeroBlock";
export { TrustedByBlock } from "./TrustedByBlock";
export { FeaturesBlock } from "./FeaturesBlock";
export { SuitableForBlock } from "./SuitableForBlock";
export { BentoGridBlock } from "./BentoGridBlock";
export { TestimonialsBlock } from "./TestimonialsBlock";
export { FAQBlock } from "./FAQBlock";
export { CTABlock } from "./CTABlock";
export { VerticalTabsBlock } from "./VerticalTabsBlock";
export { HorizontalTabsBlock } from "./HorizontalTabsBlock";
export { ProcessStepsBlock } from "./ProcessStepsBlock";
export { HeroSecondaryBlock } from "./HeroSecondaryBlock";
export { StatsCounterBlock } from "./StatsCounterBlock";
export { FeatureIconGrid } from "./FeatureIconGrid";
export { BlogPreviewBlock } from "./BlogPreviewBlock";
export { CaseStudySliderBlock } from "./CaseStudySliderBlock";
export { CardCarouselBlock } from "./CardCarouselBlock";
export { PricingComparisonBlock } from "./PricingComparisonBlock";
export { RichTextBlock } from "./RichTextBlock";
export { FormBlock } from "./FormBlock";

// Block registry – maps type string → component + label for the editor
export const BLOCK_REGISTRY = [
  { type: "hero",        label: "🚀 Hero Main",           description: "Tiêu đề chính, badge, 2 nút bấm và ảnh hero." },
  { type: "heroSecondary",label: "🖼️ Hero Left Image",    description: "Ảnh bên trái, nội dung bên phải (Hero phụ)." },
  { type: "trustedBy",  label: "🤝 Tin dùng bởi",       description: "Dải logo đối tác chạy marquee." },
  { type: "features",   label: "⚡ Tính năng Row",       description: "Các hàng tính năng xen kẽ với điểm nhấn và stat." },
  { type: "verticalTabs",label: "📂 Vertical Tabs",      description: "Menu dọc bên trái, nội dung thay đổi bên phải." },
  { type: "horizontalTabs",label: "📑 Horizontal Tabs",    description: "Các tab ngang phân loại giải pháp." },
  { type: "process",     label: "🛤️ Quy trình",           description: "Các bước triển khai (1, 2, 3...)." },
  { type: "bentoGrid",  label: "✨ Bento Grid",          description: "Lưới 7 tính năng nổi bật (2+1 / 3 / 1+2)." },
  { type: "featureIconGrid",label: "🛠️ Icon Grid",         description: "Lưới 4 cột icon kèm tính năng kỹ thuật." },
  { type: "stats",       label: "📊 Số liệu ấn tượng",     description: "Các con số thống kê nổi bật trên nền tối." },
  { type: "cardCarousel",label: "🎠 Card Slider",        description: "Dải card tính năng trượt ngang." },
  { type: "testimonials",label: "💬 Đánh giá",           description: "Trích dẫn khách hàng với ảnh đại diện." },
  { type: "blogPreview", label: "📝 Blog Samples",       description: "Xem trước các bài viết mới nhất." },
  { type: "caseStudy",   label: "🏆 Case Studies",        description: "Slider dự án thực tế kèm số liệu và quote." },
  { type: "suitableFor",label: "🎯 Phù hợp với",         description: "Lưới 3 cột trên nền navy." },
  { type: "pricing",     label: "💰 Bảng giá",           description: "Bảng so sánh các gói dịch vụ." },
  { type: "faq",        label: "❓ FAQ",                 description: "Câu hỏi thường gặp với accordion." },
  { type: "cta",        label: "📋 CTA & Form",         description: "Nội dung chốt kèm form đăng ký iframe." },
  { type: "form",       label: "📋 Native Form",        description: "Nhúng form tự thiết kế từ Form Builder." },
  { type: "richText",   label: "📝 Rich Text / Blog",    description: "Nội dung văn bản dài, hỗ trợ Markdown và dán từ Word/WP." },
] as const;

export type BlockType = typeof BLOCK_REGISTRY[number]["type"];

export interface PageBlock {
  type: BlockType;
  data: any;
}
