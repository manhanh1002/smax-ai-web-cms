"use client";

import React, { useState } from "react";
import { BlockSettingsEditor } from "@/components/cms/block-editors/shared";
import { RichTextBlockEditor as TiptapEditor } from "@/components/cms/block-editors/RichTextBlockEditor";
import { Type, LayoutTemplate } from "lucide-react";
import { RichTextBlockData } from "./definition";
import { BlockData } from "../types";

export function RichTextBlockEditor({ data, onChange }: { data: BlockData<RichTextBlockData>; onChange: (d: BlockData<RichTextBlockData>) => void }) {
  
  return (
    <div className="space-y-6">
      <div className="space-y-6 animate-in fade-in duration-200">
          <TiptapEditor 
            data={{ 
              content: data.content || "", 
              darkMode: data.darkMode 
            }} 
            onChange={(newData) => onChange({ 
              ...data, 
              content: newData.content, 
              darkMode: newData.darkMode 
            })} 
          />
        </div>
    </div>
  );
}
