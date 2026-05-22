"use client";

import React, { useState } from "react";
import { SlideGridData, GridLayout } from "./definition";
import { renderBlockEditor, getBlockDefinition, getBlockDefaultData, MASTER_BLOCK_REGISTRY } from "@/lib/cms/block-system/registry";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Trash2, Plus, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const layouts: { value: GridLayout; label: string }[] = [
  { value: "1x2", label: "2 Cột (1x2)" },
  { value: "2x1", label: "2 Hàng (2x1)" },
  { value: "1-left-2-right", label: "1 Trái, 2 Phải" },
  { value: "2-left-1-right", label: "2 Trái, 1 Phải" },
  { value: "1-top-2-bottom", label: "1 Trên, 2 Dưới" },
  { value: "2-top-1-bottom", label: "2 Trên, 1 Dưới" },
  { value: "2x2", label: "Lưới 4 (2x2)" },
];

export function SlideGridEditor({ data, onChange }: { data: SlideGridData; onChange: (data: SlideGridData) => void }) {
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  const getNumSlots = (layout: GridLayout) => {
    switch (layout) {
      case "1x2":
      case "2x1": return 2;
      case "2x2": return 4;
      default: return 3;
    }
  };

  const handleUpdate = (field: keyof SlideGridData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleSlotBlockChange = (slotIndex: number, newBlockData: any) => {
    const currentSlot = data.slots[`slot${slotIndex}`];
    if (!currentSlot) return;
    onChange({
      ...data,
      slots: {
        ...data.slots,
        [`slot${slotIndex}`]: {
          ...currentSlot,
          data: newBlockData
        }
      }
    });
  };

  const handleAddBlockToSlot = (slotIndex: number, blockType: string) => {
    if (!blockType) return;
    onChange({
      ...data,
      slots: {
        ...data.slots,
        [`slot${slotIndex}`]: {
          id: `slot-${slotIndex}-${Date.now()}`,
          type: blockType,
          data: getBlockDefaultData(blockType)
        }
      }
    });
    setActiveSlot(slotIndex); // Auto open editor
  };

  const handleRemoveBlockFromSlot = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSlots = { ...data.slots };
    newSlots[`slot${slotIndex}`] = null;
    onChange({ ...data, slots: newSlots });
  };

  if (activeSlot !== null) {
    const slotData = data.slots[`slot${activeSlot}`];
    if (!slotData) {
      setActiveSlot(null);
      return null;
    }

    const def = getBlockDefinition(slotData.type);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setActiveSlot(null)}
            className="h-8 px-2 text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Grid
          </Button>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-bold text-violet-600">
            Slot {activeSlot + 1}
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-600">
            {def?.label || slotData.type}
          </span>
        </div>

        <div className="pl-2 border-l-2 border-violet-200">
          {renderBlockEditor(slotData, (newData: any) => handleSlotBlockChange(activeSlot, newData))}
        </div>
      </div>
    );
  }

  const numSlots = getNumSlots(data.layout || "1x2");

  return (
    <div className="space-y-6">
      <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            Bố cục Grid (Layout)
          </label>
          <select 
            value={data.layout || "1x2"} 
            onChange={(e: any) => handleUpdate("layout", e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
          >
            {layouts.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            Khoảng cách (Gap)
          </label>
          <select 
            value={data.gap || "medium"} 
            onChange={(e: any) => handleUpdate("gap", e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
          >
            <option value="none">Không có (0px)</option>
            <option value="small">Nhỏ (16px)</option>
            <option value="medium">Vừa (32px)</option>
            <option value="large">Lớn (48px)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            Hình Nền Grid
          </label>
          <select 
            value={data.background || "default"} 
            onChange={(e: any) => handleUpdate("background", e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
          >
            <option value="default">Mặc định (Trắng)</option>
            <option value="muted">Xám nhạt</option>
            <option value="dark">Tối màu (Dark Mode)</option>
            <option value="primary">Màu thương hiệu (Primary)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4" />
          Nội dung các ô (Slots)
        </label>
        
        <div className="space-y-3">
          {Array.from({ length: numSlots }).map((_, i) => {
            const slotData = data.slots?.[`slot${i}`];
            const def = slotData ? getBlockDefinition(slotData.type) : null;

            return (
              <div 
                key={i}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all flex items-center justify-between group",
                  slotData 
                    ? "border-violet-200 bg-white hover:border-violet-400 cursor-pointer" 
                    : "border-dashed border-slate-200 bg-slate-50"
                )}
                onClick={() => slotData && setActiveSlot(i)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-slate-200 text-slate-500 font-black text-xs flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  
                  {slotData ? (
                    <div>
                      <p className="text-sm font-bold text-slate-900">{def?.label || slotData.type}</p>
                      <p className="text-xs text-slate-500">Bấm để chỉnh sửa nội dung</p>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <select 
                        value=""
                        onChange={(e: any) => handleAddBlockToSlot(i, e.target.value)}
                        className="w-full h-8 text-sm font-semibold border-none bg-transparent hover:bg-slate-100 text-slate-500 rounded px-1 outline-none cursor-pointer"
                      >
                        <option value="">+ Thêm Block...</option>
                        {MASTER_BLOCK_REGISTRY.filter(b => b.type !== "global_ref" && b.type !== "slideGrid").map(b => (
                          <option key={b.type} value={b.type}>{b.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {slotData && (
                  <button 
                    onClick={(e) => handleRemoveBlockFromSlot(i, e)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Xóa block này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
