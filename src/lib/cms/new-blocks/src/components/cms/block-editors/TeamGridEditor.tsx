import React from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { TeamGridData, TeamMember } from "@/components/sections/TeamGrid";

const defaultMember = (): TeamMember => ({ name: "Nguyễn Văn A", role: "CEO & Co-founder", avatar: "", bio: "", linkedin: "", twitter: "" });

export function TeamGridEditor({ data, onChange }: { data: TeamGridData; onChange: (data: TeamGridData) => void }) {
  const update = (updates: Partial<TeamGridData>) => onChange({ ...data, ...updates });
  const updateMember = (i: number, field: keyof TeamMember, value: string) => {
    const members = [...(data.members ?? [])];
    members[i] = { ...members[i], [field]: value };
    update({ members });
  };
  const addMember = () => update({ members: [...(data.members ?? []), defaultMember()] });
  const removeMember = (i: number) => update({ members: (data.members ?? []).filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Section label</Label><Input value={data.sectionLabel ?? ""} onChange={(e) => update({ sectionLabel: e.target.value })} placeholder="Đội ngũ" /></div>
        <div><Label>Title *</Label><Input value={data.title} onChange={(e) => update({ title: e.target.value })} /></div>
      </div>
      <div><Label>Subtitle</Label><Input value={data.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} /></div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Số cột</Label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mt-1" value={data.columns ?? 3} onChange={(e) => update({ columns: Number(e.target.value) as 3 | 4 })}>
            <option value={3}>3 cột</option><option value={4}>4 cột</option>
          </select>
        </div>
        <div>
          <Label>Kiểu avatar</Label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mt-1" value={data.avatarShape ?? "circle"} onChange={(e) => update({ avatarShape: e.target.value as "circle" | "rounded" })}>
            <option value="circle">Tròn</option><option value="rounded">Bo góc</option>
          </select>
        </div>
        <div className="flex items-end pb-2">
          <div className="flex items-center gap-2"><Switch checked={data.showBio ?? false} onCheckedChange={(v) => update({ showBio: v })} /><Label>Hiện bio</Label></div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Thành viên</Label>
          <Button size="sm" variant="outline" onClick={addMember}>+ Thêm</Button>
        </div>
        {(data.members ?? []).map((m, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="flex justify-between"><span className="text-xs font-semibold text-slate-500">{m.name || `Thành viên ${i + 1}`}</span><button onClick={() => removeMember(i)} className="text-red-400 text-sm">Xóa</button></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Tên</Label><Input value={m.name} onChange={(e) => updateMember(i, "name", e.target.value)} /></div>
              <div><Label>Chức danh</Label><Input value={m.role} onChange={(e) => updateMember(i, "role", e.target.value)} /></div>
            </div>
            <div><Label>Avatar URL</Label><Input value={m.avatar ?? ""} onChange={(e) => updateMember(i, "avatar", e.target.value)} /></div>
            {data.showBio && <div><Label>Bio</Label><Textarea value={m.bio ?? ""} onChange={(e) => updateMember(i, "bio", e.target.value)} rows={2} /></div>}
            <div className="grid grid-cols-2 gap-2">
              <div><Label>LinkedIn URL</Label><Input value={m.linkedin ?? ""} onChange={(e) => updateMember(i, "linkedin", e.target.value)} /></div>
              <div><Label>Twitter URL</Label><Input value={m.twitter ?? ""} onChange={(e) => updateMember(i, "twitter", e.target.value)} /></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2"><Switch checked={data.darkMode ?? false} onCheckedChange={(v) => update({ darkMode: v })} /><Label>Dark mode</Label></div>
    </div>
  );
}
