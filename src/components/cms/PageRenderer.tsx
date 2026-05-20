import React from "react";
import { PageBlock } from "@/lib/cms/block-system/types";
import { renderBlockRenderer } from "@/lib/cms/block-system/registry";

interface PageRendererProps {
  blocks: PageBlock[];
}

export default function PageRenderer({ blocks }: PageRendererProps) {
  if (!blocks || !Array.isArray(blocks)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Chưa có nội dung cho trang này.
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col w-full">
      {blocks.map((block, index) => {
        // Sử dụng hàm renderBlockRenderer từ Registry để hiển thị đúng giao diện từng loại block
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
