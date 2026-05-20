import React from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { AuthorBioData, SocialLink } from "@/components/sections/AuthorBio";

const PLATFORMS = ["linkedin","twitter","facebook","website","github"] as const;

export function AuthorBioEditor({ data, onChange }: { data: AuthorBioData; onChange: (data: AuthorBioData) => void }) {
  const update = (updates: Partial<AuthorBioData>) => onChange({ ...data, ...updates });

  const updateSocial = (i: number, field: keyof SocialLink, value: string) => {
    const socials = [...(data.socials ?? [])];
    socials[i] = { ...socials[i], [field]: value } as SocialLink;
    update({ socials });
  };
  const addSocial = () => update({ socials: [...(data.socials ?? []), { platform: "linkedin", url: "" }] });
  const removeSocial = (i: number) => update({ socials: (data.socials ?? []).filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Tên tác giả *</Label>
          <Input value={data.name} onChange={(e) => update({ name: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Avatar URL</Label>
          <Input value={data.avatar ?? ""} onChange={(e) => update({ avatar: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Chức danh</Label>
          <Input value={data.title ?? ""} onChange={(e) => update({ title: e.target.value })} placeholder="Senior Developer" />
        </div>
        <div className="space-y-1">
          <Label>Công ty</Label>
          <Input value={data.company ?? ""} onChange={(e) => update({ company: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Tiểu sử *</Label>
        <Textarea value={data.bio} onChange={(e) => update({ bio: e.target.value })} rows={3} placeholder="Giới thiệu ngắn về tác giả..." />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Mạng xã hội</Label>
          <Button size="sm" variant="outline" onClick={addSocial}>+ Thêm</Button>
        </div>
        {(data.socials ?? []).map((s, i) => (
          <div key={i} className="flex gap-2 items-center">
            <select
              className="border border-slate-200 rounded-lg px-2 py-2 text-sm"
              value={s.platform}
              onChange={(e) => updateSocial(i, "platform", e.target.value)}
            >
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <Input value={s.url} onChange={(e) => updateSocial(i, "url", e.target.value)} placeholder="https://..." className="flex-1" />
            <button onClick={() => removeSocial(i)} className="text-red-400 hover:text-red-600 text-lg">×</button>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={data.layout === "vertical"} onCheckedChange={(v) => update({ layout: v ? "vertical" : "horizontal" })} />
          <Label>Căn giữa dọc</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={data.darkMode ?? false} onCheckedChange={(v) => update({ darkMode: v })} />
          <Label>Dark mode</Label>
        </div>
      </div>
    </div>
  );
}
