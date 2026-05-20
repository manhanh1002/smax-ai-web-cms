"use client";

import { renderBlockRenderer } from "@/lib/cms/block-system/registry";
import { type PageBlock } from "@/components/sections";

interface DynamicPageProps {
  config: any;
}

// ─── Map block type → component ──────────────────────────────────────────────
function renderBlock(block: PageBlock, index: number) {
  return renderBlockRenderer(block, index);
}


// ─── Compatibility: convert old flat config → blocks array ───────────────────
function legacyToBlocks(config: any): PageBlock[] {
  const blocks: PageBlock[] = [];

  if (config.hero) {
    blocks.push({
      type: "hero",
      data: {
        badge: config.hero.badge,
        title: config.hero.title,
        highlight: config.hero.highlight,
        subtitle: config.hero.subtitle,
        primaryBtn: config.hero.primaryBtn,
        primaryBtnUrl: config.hero.primaryBtnUrl,
        secondaryBtn: config.hero.secondaryBtn,
        secondaryBtnUrl: config.hero.secondaryBtnUrl,
        image: config.hero.image,
      },
    });
  }

  if (config.trustedBy?.length > 0) {
    blocks.push({
      type: "trustedBy",
      data: { logos: config.trustedBy },
    });
  }

  if (config.features?.length > 0) {
    blocks.push({
      type: "features",
      data: {
        badge: "Giải pháp giao tiếp toàn diện",
        titleHighlight: "Không còn bỏ lỡ",
        title: "bất kỳ khách hàng tiềm năng",
        subtitle: "Nền tảng chat của Smax giúp tất cả tin nhắn, bình luận ở các nền tảng về chung 1 nơi để kịp phản hồi.",
        items: config.features.map((f: any) => ({
          tag: f.tag,
          title: f.title,
          points: f.points,
          stat: f.stat,
          image: f.image,
        })),
      },
    });
  }

  // Suitable for (now configurable)
  blocks.push({
    type: "suitableFor",
    data: {
      badge: config.suitableForSection?.badge || "Thúc đẩy tăng trưởng",
      titleHighlight: config.suitableForSection?.titleHighlight || "Live Chat đa kênh",
      title: config.suitableForSection?.title || "phù hợp cho doanh nghiệp cần tăng trưởng",
      subtitle: config.suitableForSection?.subtitle || "Smax giúp doanh nghiệp ở hầu hết lĩnh vực - đáp ứng nhu cầu mở rộng việc chăm sóc và bán hàng mọi kênh, mọi lúc",
      darkMode: config.suitableForSection?.darkMode !== false,
      cards: config.suitableFor || [
        { tag: "Tối ưu chi phí", title: "Doanh nghiệp cần giảm quỹ nhân sự", description: "Live chat giúp giảm số lượng nhân sự trực page trên đa kênh, để nhân sự tập trung vào những khách hàng chất lượng hơn" },
        { tag: "Tối đa kết quả", title: "Thương hiệu chạy quảng cáo tin nhắn", description: "Nền tảng cho phép nhân sự dễ dàng phân biệt được nguồn khách hàng từ bài quảng cáo nào" },
        { tag: "Tăng cường doanh thu", title: "Nhóm đang bán hàng đa kênh", description: "Nhân sự vừa có thể hỗ trợ khách trên sàn TMDT như Shopee, lại thu thập thông tin cá nhân để tiếp cận qua nền tảng khác" },
      ],
    },
  });

  if (config.impactCards?.length > 0) {
    blocks.push({
      type: "bentoGrid",
      data: {
        badge: "Tính năng nổi bật",
        title: "Công cụ quản lý hội thoại",
        titleHighlight: "đa dụng và tiện lợi",
        subtitle: "Giúp doanh nghiệp có trợ lý bot mạnh mẽ hỗ trợ kinh doanh mà không cần code",
        cards: config.impactCards,
      },
    });
  }

  if (config.testimonials?.length > 0) {
    blocks.push({
      type: "testimonials",
      data: {
        badge: "Kết quả thực tế",
        title: "Doanh nghiệp hài lòng về",
        titleHighlight: "kết quả sử dụng",
        items: config.testimonials,
      },
    });
  }

  if (config.faq?.length > 0) {
    blocks.push({
      type: "faq",
      data: {
        badge: "Câu hỏi thường gặp",
        titleHighlight: "Gặp chuyên gia tư vấn",
        title: "khi đăng ký đặt lịch demo",
        items: config.faq,
      },
    });
  }

  blocks.push({
    type: "cta",
    data: {
      title: config.cta?.title || "Tìm hiểu cách để doanh nghiệp bạn có thể tư vấn, chăm sóc và bán hàng 24/7 với chi phí tối thiểu",
      subtitle: config.cta?.subtitle || "Smax AI sẽ trình bày bộ giải pháp phù hợp riêng với mô hình kinh doanh hiện tại.",
      bullets: config.cta?.bullets || [
        "Tự động hoá tương tác, chăm sóc khách hàng đa kênh hàng loạt",
        "Tự động gợi ý sản phẩm, chốt đơn và lên đơn phần mềm bán hàng",
        "Tự động thu thập lead, hành vi để báo cáo và đồng bộ dataset",
      ],
      formUrl: config.cta?.formUrl || "https://crm.smax.ai/forms/wtl/46e0a65bf7ba0b1a87759c83c09146f6?styled=2",
      formHeight: config.cta?.formHeight || 500,
    },
  });

  return blocks;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function ProductTemplate({ config }: DynamicPageProps) {
  if (!config) return null;

  // New format: config has a `blocks` array
  const blocks: PageBlock[] = config.blocks
    ? config.blocks
    : legacyToBlocks(config);

  return (
    <div className="bg-white font-sans text-[#0F1836] overflow-x-hidden">
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}
