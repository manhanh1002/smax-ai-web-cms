"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

export const IconRenderer = ({ name, color, className, size = "md" }: { name: string; color: string; className?: string; size?: "sm" | "md" }) => {
  if (!name) return null;

  // @ts-ignore
  const IconComponent = LucideIcons[name] || LucideIcons.Smile;
  
  const getColorClass = (c: string) => {
    switch (c) {
      case 'primary': return 'text-primary bg-primary/10';
      case 'blue-500': return 'text-blue-600 bg-blue-50';
      case 'green-500': return 'text-green-600 bg-green-50';
      case 'purple-500': return 'text-purple-600 bg-purple-50';
      case 'orange-500': return 'text-orange-600 bg-orange-50';
      case 'red-500': return 'text-red-600 bg-red-50';
      default: return 'text-primary bg-primary/10';
    }
  };

  const sizeClasses = size === "sm" ? "w-7 h-7" : "w-10 h-10";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className={cn("rounded-xl flex items-center justify-center transition-transform", sizeClasses, getColorClass(color), className)}>
      <IconComponent className={iconSize} />
    </div>
  );
};

export const LucideIcon = ({ name, className }: { name: string; className?: string }) => {
  // @ts-ignore
  const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
  return <IconComponent className={className} />;
};

