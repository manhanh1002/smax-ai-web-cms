# AI Guide: How to Create and Register a Custom Block

This guide explains the standardized process for adding a new "Block" to the Smax AI CMS. Follow these steps to ensure the block is available in the Admin Editor and renders correctly on the public site.

## 📂 Folder Structure
Each block consists of two main parts:
1. **Renderer**: How the block looks to the visitor (`src/components/sections/`)
2. **Editor**: How the block is configured in the Admin (`src/components/cms/block-editors/`)

## 🛠 Step 1: Create the Renderer Component
Create a new file in `src/components/sections/MyNewBlock.tsx`.

```tsx
import React from "react";
import { cn } from "@/lib/utils";

export interface MyNewBlockData {
  title: string;
  subtitle?: string;
  darkMode?: boolean;
}

export function MyNewBlock({ data }: { data: MyNewBlockData }) {
  return (
    <section className={cn("py-20", data.darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900")}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-black">{data.title}</h2>
        {data.subtitle && <p className="mt-4 opacity-70">{data.subtitle}</p>}
      </div>
    </section>
  );
}
```

## 📝 Step 2: Create the Editor Component
Create a new file in `src/components/cms/block-editors/MyNewBlockEditor.tsx`.

```tsx
import React from "react";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { MyNewBlockData } from "@/components/sections/MyNewBlock";

export function MyNewBlockEditor({ data, onChange }: { data: MyNewBlockData; onChange: (data: MyNewBlockData) => void }) {
  const update = (updates: Partial<MyNewBlockData>) => onChange({ ...data, ...updates });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={data.title} onChange={(e) => update({ title: e.target.value })} />
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={data.darkMode} onCheckedChange={(val) => update({ darkMode: val })} />
        <Label>Dark Mode</Label>
      </div>
    </div>
  );
}
```

## 🚀 Step 3: Register the Block (New Modular System)

We use a central registry at `src/lib/cms/block-system/registry.tsx`. This file is the "Source of Truth" for all blocks.

1. **Import your components** at the top of `registry.tsx`.
2. **Add an entry** to the `MASTER_BLOCK_REGISTRY` array:

```tsx
{
  type: "myNewBlock",
  label: "📦 My New Block",
  description: "Short description of what this block does.",
  renderer: MyNewBlock,
  editor: MyNewBlockEditor,
  defaultData: { title: "", darkMode: false }
}
```

## 🛠 Automated Scaffolding
You can use the provided script to generate the boilerplate files:
```bash
node scaffold-block.js FeatureGrid
```
This will create:
- `src/components/sections/FeatureGrid.tsx`
- `src/components/cms/block-editors/FeatureGridEditor.tsx`

---

## ☁️ Working with Cloud AIs (ChatGPT, Claude, etc.)

If you want an external AI to write a block for you, provide it with the following files from this folder:
1. `BlockCreatorGuide.md` (The instructions)
2. `types.ts` (The data structures)
3. `ExistingBlocks.md` (The "Don't Rewrite" list)

### Recommended Prompt for Cloud AI:
> "I am sending you a documentation folder for my CMS block system. Please read `BlockCreatorGuide.md` and `types.ts`. 
> 
> Your task: Design a new block called [NAME]. 
> First, check `ExistingBlocks.md` to ensure a similar block doesn't already exist. 
> Then, provide the code for:
> 1. The Renderer component (`src/components/sections/[NAME].tsx`)
> 2. The Editor component (`src/components/cms/block-editors/[NAME]Editor.tsx`)
> 3. The JSON entry for `registry.tsx`."

---

## 🤖 AI Instructions for Registration
When asked to "create a new block", first check `ExistingBlocks.md`. If the block or a similar one exists, inform the user. Otherwise, run the scaffold script and then update the `registry.tsx` file.
