import React from "react";
import { PageBlock } from "@/lib/cms/block-system/types";
import { renderBlockRenderer } from "@/lib/cms/block-system/registry";

// ─── Compatibility: convert old flat config → blocks array ───────────────────
export function legacyToBlocks(config: any): PageBlock[] {
  const blocks: PageBlock[] = [];
  if (!config) return blocks;

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

export function getBackgroundStyle(bg: any): React.CSSProperties {
  if (!bg) return {};
  const style: React.CSSProperties = {};
  if (bg.type === "color" && bg.color) {
    style.backgroundColor = bg.color;
  } else if (bg.type === "gradient") {
    if (bg.gradientColor1 && bg.gradientColor2) {
      style.background = `linear-gradient(${bg.gradientAngle ?? 90}deg, ${bg.gradientColor1} 0%, ${bg.gradientColor2} 100%)`;
    }
  } else if (bg.type === "image" && bg.imageUrl) {
    style.backgroundImage = `url(${bg.imageUrl})`;
    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
    style.backgroundRepeat = "no-repeat";
    style.backgroundAttachment = "fixed";
  }
  return style;
}

interface PageRendererProps {
  blocks?: PageBlock[];
  config?: any;
  pageBackground?: any;
}

export default function PageRenderer({ blocks, config, pageBackground }: PageRendererProps) {
  let finalBlocks = blocks;

  if (config) {
    if (config.blocks && config.blocks.length > 0) {
      finalBlocks = config.blocks;
    } else if (config.product_config?.blocks && config.product_config.blocks.length > 0) {
      finalBlocks = config.product_config.blocks;
    } else {
      const legacyConfig = config.product_config || config;
      if (legacyConfig && !legacyConfig.blocks) {
        finalBlocks = legacyToBlocks(legacyConfig);
      }
    }
  }

  if (!finalBlocks || !Array.isArray(finalBlocks) || finalBlocks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Chưa có nội dung cho trang này.
      </div>
    );
  }

  const bgStyle = getBackgroundStyle(pageBackground || config?.pageBackground || config?.product_config?.pageBackground);
  const finalStyle = Object.keys(bgStyle).length > 0 ? bgStyle : { backgroundColor: "#ffffff" };

  return (
    <main className="min-h-screen flex flex-col w-full" style={finalStyle}>
      {finalBlocks.map((block, index) => {
        const renderedBlock = renderBlockRenderer(block, index);
        
        if (!renderedBlock) {
          return (
            <div key={index} className="py-8 bg-slate-50 border-y border-dashed border-slate-200 text-center text-slate-400 text-xs uppercase tracking-widest font-bold">
              [ Không tìm thấy Renderer cho Block: {block.type} ]
            </div>
          );
        }

        return renderedBlock;
      })}
    </main>
  );
}
