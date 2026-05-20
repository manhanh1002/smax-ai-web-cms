import React from "react";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { PageHeaderData, Breadcrumb } from "@/components/sections/PageHeader";

export function PageHeaderEditor({ data, onChange }: { data: PageHeaderData; onChange: (data: PageHeaderData) => void }) {
  const update = (updates: Partial<PageHeaderData>) => onChange({ ...data, ...updates });

  const updateBreadcrumb = (i: number, field: keyof Breadcrumb, value: string) => {
    const items = [...(data.breadcrumbs ?? [])];
    items[i] = { ...items[i], [field]: value };
    update({ breadcrumbs: items });
  };

  const addBreadcrumb = () => update({ breadcrumbs: [...(data.breadcrumbs ?? []), { label: "Trang mới" }] });
  const removeBreadcrumb = (i: number) => update({ breadcrumbs: (data.breadcrumbs ?? []).filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title *</Label>
        <Input value={data.title} onChange={(e) => update({ title: e.target.value })} placeholder="Tiêu đề trang" />
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input value={data.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} placeholder="Mô tả ngắn" />
      </div>
      <div className="space-y-2">
        <Label>Tags (phân cách bằng dấu phẩy)</Label>
        <Input
          value={(data.tags ?? []).join(", ")}
          onChange={(e) => update({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
          placeholder="Tin tức, Cập nhật, Sản phẩm"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <Label>Tên tác giả</Label>
          <Input value={data.authorName ?? ""} onChange={(e) => update({ authorName: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Ngày đăng</Label>
          <Input value={data.publishDate ?? ""} onChange={(e) => update({ publishDate: e.target.value })} placeholder="12/06/2025" />
        </div>
        <div className="space-y-1">
          <Label>Thời gian đọc</Label>
          <Input value={data.readTime ?? ""} onChange={(e) => update({ readTime: e.target.value })} placeholder="5 phút đọc" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Avatar tác giả (URL)</Label>
        <Input value={data.authorAvatar ?? ""} onChange={(e) => update({ authorAvatar: e.target.value })} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Breadcrumbs</Label>
          <Button size="sm" variant="outline" onClick={addBreadcrumb}>+ Thêm</Button>
        </div>
        {(data.breadcrumbs ?? []).map((crumb, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input value={crumb.label} onChange={(e) => updateBreadcrumb(i, "label", e.target.value)} placeholder="Tên" />
            <Input value={crumb.url ?? ""} onChange={(e) => updateBreadcrumb(i, "url", e.target.value)} placeholder="URL (để trống = current)" />
            <button onClick={() => removeBreadcrumb(i)} className="text-red-400 hover:text-red-600 text-lg">×</button>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={data.alignment === "center"} onCheckedChange={(v) => update({ alignment: v ? "center" : "left" })} />
          <Label>Căn giữa</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={data.darkMode ?? false} onCheckedChange={(val) => update({ darkMode: val })} />
          <Label>Dark mode</Label>
        </div>
      </div>
    </div>
  );
}
