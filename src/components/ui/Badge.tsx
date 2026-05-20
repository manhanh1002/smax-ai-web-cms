import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'brand' | 'success' | 'warning' | 'gray';
}

function Badge({ className, variant = 'brand', ...props }: BadgeProps) {
  const variants = {
    brand: "bg-[#FFF1EE] text-[#E36B53] border-[#FFE4DE]",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-[#FFF9EA] text-[#D98A34] border-[#FDEBCA]",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
