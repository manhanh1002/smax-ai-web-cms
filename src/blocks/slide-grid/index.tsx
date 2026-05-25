"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SlideGridData, GridLayout } from "./definition";
import { renderBlockRenderer } from "@/lib/cms/block-system/global-registry-handler";

const bgMap: Record<string, string> = {
  default: "bg-white",
  muted: "bg-slate-50",
  dark: "bg-slate-900",
  primary: "bg-blue-600"
};

const layoutConfigs: Record<GridLayout, { containerClass: string; slotClasses: string[] }> = {
  "1x2": {
    containerClass: "grid-cols-2",
    slotClasses: ["", ""],
  },
  "2x1": {
    containerClass: "grid-cols-1 grid-rows-2",
    slotClasses: ["", ""],
  },
  "1-left-2-right": {
    containerClass: "grid-cols-2 grid-rows-2",
    slotClasses: ["row-span-2", "", ""],
  },
  "2-left-1-right": {
    containerClass: "grid-cols-2 grid-rows-2",
    slotClasses: ["", "row-span-2", ""],
  },
  "1-top-2-bottom": {
    containerClass: "grid-cols-2 grid-rows-2",
    slotClasses: ["col-span-2", "", ""],
  },
  "2-top-1-bottom": {
    containerClass: "grid-cols-2 grid-rows-2",
    slotClasses: ["", "", "col-span-2"],
  },
  "2x2": {
    containerClass: "grid-cols-2 grid-rows-2",
    slotClasses: ["", "", "", ""],
  },
};

const gapMap = {
  none: "gap-0",
  small: "gap-4",
  medium: "gap-8",
  large: "gap-12",
};

export function SlideGridDispatcher({ data }: { data: SlideGridData }) {
  const { layout = "1x2", gap = "medium", background = "default", slots = {} } = data;
  
  const config = layoutConfigs[layout] || layoutConfigs["1x2"];
  const numSlots = config.slotClasses.length;

  // Render slots safely
  const renderedSlots = Array.from({ length: numSlots }).map((_, index) => {
    const slotData = slots[`slot${index}`];
    const slotClass = config.slotClasses[index];

    return (
      <div 
        key={index} 
        className={cn(
          "relative overflow-hidden flex flex-col w-full h-full",
          slotClass
        )}
      >
        {slotData ? (
          renderBlockRenderer(slotData, index)
        ) : (
          // Khung rỗng nếu chưa có block (public thì có thể ẩn, hoặc báo lỗi nhẹ)
          <div className="w-full h-full min-h-[200px] border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400">
            <span className="text-sm font-medium">Empty Slot {index + 1}</span>
          </div>
        )}
      </div>
    );
  });

  return (
    <div 
      className={cn(
        "w-full h-full min-h-full flex",
        background !== "custom" && (bgMap[background as keyof typeof bgMap] || bgMap.default)
      )}
    >
      <div 
        className={cn(
          "w-full h-full flex-1 grid",
          config.containerClass,
          gapMap[gap] || gapMap.medium
        )}
      >
        {renderedSlots}
      </div>
    </div>
  );
}
