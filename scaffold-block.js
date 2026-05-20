const fs = require('fs');
const path = require('path');

const blockName = process.argv[2];

if (!blockName) {
  console.log("Usage: node scaffold-block.js BlockName");
  process.exit(1);
}

const type = blockName.charAt(0).toLowerCase() + blockName.slice(1);
const componentsDir = path.join(__dirname, 'src/components/sections');
const editorsDir = path.join(__dirname, 'src/components/cms/block-editors');

// 1. Create Renderer
const rendererContent = `import React from "react";
import { cn } from "@/lib/utils";

export interface ${blockName}Data {
  title: string;
  darkMode?: boolean;
}

export function ${blockName}({ data }: { data: ${blockName}Data }) {
  return (
    <section className={cn("py-20", data.darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900")}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-black">{data.title || "${blockName} Content"}</h2>
      </div>
    </section>
  );
}
`;

// 2. Create Editor
const editorContent = `import React from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { ${blockName}Data } from "@/components/sections/${blockName}";

export function ${blockName}Editor({ data, onChange }: { data: ${blockName}Data; onChange: (data: any) => void }) {
  const update = (updates: Partial<${blockName}Data>) => onChange({ ...data, ...updates });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input 
          value={data.title} 
          onChange={(e) => update({ title: e.target.value })} 
          placeholder="Enter section title..."
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={data.darkMode} onCheckedChange={(val) => update({ darkMode: val })} />
        <Label>Dark Mode</Label>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(componentsDir, `${blockName}.tsx`), rendererContent);
fs.writeFileSync(path.join(editorsDir, `${blockName}Editor.tsx`), editorContent);

console.log(`✅ Created renderer: src/components/sections/${blockName}.tsx`);
console.log(`✅ Created editor: src/components/cms/block-editors/${blockName}Editor.tsx`);
console.log(`\nNext step: Open src/lib/cms/block-system/registry.tsx and register the block:`);
console.log(`--------------------------------------------------`);
console.log(`{
  type: "${type}",
  label: "📦 ${blockName}",
  description: "New custom block description.",
  renderer: ${blockName},
  editor: ${blockName}Editor,
  defaultData: { title: "", darkMode: false }
}`);
