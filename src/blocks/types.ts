import { ReactNode } from "react";

export type BlockType = string;

export interface ButtonAction {
  type: "url" | "page" | "block" | "popup";
  url?: string;
  pageSlug?: string;
  blockId?: string;
  popupId?: string;
  target?: "_blank" | "_self";
}

export interface BlockSettings {
  colorMode?: "light" | "dark";
  paddingTop?: "none" | "small" | "medium" | "large" | "xlarge";
  paddingBottom?: "none" | "small" | "medium" | "large" | "xlarge";
  containerWidth?: "boxed" | "full" | "narrow";
  background?: "default" | "muted" | "dark" | "primary" | "gradient" | "custom";
  backgroundType?: "color" | "image" | "gradient";
  customBackgroundColor?: string;
  customGradient?: string;
  gradientStart?: string;
  gradientEnd?: string;
  gradientAngle?: number;
  backgroundImage?: string;
  textAlign?: "left" | "center" | "right";
  anchorId?: string;
  entranceAnimation?: "none" | "fadeUp" | "fadeIn" | "slideIn" | "zoomIn";
  shadowSize?: "none" | "sm" | "md" | "lg" | "xl";
  borderRadius?: "none" | "md" | "lg" | "xl" | "full";
  hideOnMobile?: boolean;
  hideOnDesktop?: boolean;
  customCss?: string;
}

export interface BlockData<T = any> {
  theme?: string;
  settings?: BlockSettings;
  [key: string]: any; // Allow specific block data
}

export interface PageBlock {
  type: BlockType;
  data: BlockData;
}

export interface BlockDefinition<T = any> {
  type: BlockType;
  label: string;
  description: string;
  icon?: string; // Lucide icon name
  category?: "layout" | "content" | "marketing" | "social";
  supportedThemes?: string[];
  
  // Default data for the block when created
  defaultData: T;

  // The component that renders the block on the public site
  renderer: React.ComponentType<{ data: T }>;

  // The component used in the admin panel to edit the block's data
  editor: React.ComponentType<{ data: T; onChange: (data: T) => void }>;
}
