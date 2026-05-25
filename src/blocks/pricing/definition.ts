import { BlockDefinition } from "../types";

export interface PricingPlan {
  name: string;
  priceMonthly: string;
  priceYearly: string;
  periodLabel?: string;
  description?: string;
  features: string[];
  isPopular?: boolean;
  popularText?: string;
  btnText?: string;
  btnUrl?: any; // ActionPicker data
}

export interface PricingCategory {
  id: string;
  name: string;
  plans: PricingPlan[];
}

export interface PricingBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  showSwitcher?: boolean;
  monthlyLabel?: string;
  yearlyLabel?: string;
  discountLabel?: string;
  categories: PricingCategory[];
}

export const PricingBlockDef: BlockDefinition<PricingBlockData> = {
  type: "pricing",
  label: "💰 Bảng giá Dịch vụ",
  description: "Bảng giá đa dịch vụ với các tab phân loại và bộ chuyển đổi Tháng/Năm chuyên nghiệp.",
  category: "marketing",
  supportedThemes: ["saas"],
  renderer: null as any,
  editor: null as any,
  defaultData: {
    badge: "BẢNG GIÁ",
    title: "Giải pháp linh hoạt",
    titleHighlight: "Theo nhu cầu",
    subtitle: "Chúng tôi cung cấp đa dạng gói dịch vụ phù hợp với mọi quy mô doanh nghiệp.",
    showSwitcher: true,
    monthlyLabel: "Tháng",
    yearlyLabel: "Năm",
    discountLabel: "Tiết kiệm 20%",
    categories: [
      {
        id: "cat-1",
        name: "Dịch vụ AI",
        plans: [
          {
            name: "AI Basic",
            priceMonthly: "19",
            priceYearly: "15",
            features: ["1,000 tokens/tháng", "Hỗ trợ Email"],
            btnText: "Bắt đầu ngay"
          },
          {
            name: "AI Pro",
            priceMonthly: "99",
            priceYearly: "79",
            features: ["Không giới hạn tokens", "Ưu tiên xử lý", "Hỗ trợ 24/7"],
            isPopular: true,
            popularText: "KHUYÊN DÙNG",
            btnText: "Nâng cấp ngay"
          }
        ]
      },
      {
        id: "cat-2",
        name: "Cloud Hosting",
        plans: [
          {
            name: "Shared",
            priceMonthly: "5",
            priceYearly: "4",
            features: ["10GB SSD", "1 Website", "SSL miễn phí"],
            btnText: "Đăng ký"
          },
          {
            name: "VPS",
            priceMonthly: "25",
            priceYearly: "20",
            features: ["100GB SSD", "Vùng độc lập", "Toàn quyền quản trị"],
            btnText: "Đăng ký ngay"
          }
        ]
      }
    ]
  }
};
