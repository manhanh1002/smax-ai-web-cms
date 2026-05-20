import React from "react";
import { Field, Inp, Txt, DarkToggle } from "./shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";

export function BlogPreviewBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const posts = data.posts || [];
  const upPost = (i: number, patch: any) => { 
    const n = [...posts]; 
    n[i] = { ...n[i], ...patch }; 
    onChange({ ...data, posts: n }); 
  };
  
  return (
    <div className="space-y-6">
      <DarkToggle value={data.darkMode === true} onChange={v => onChange({ ...data, darkMode: v })} />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Badge"><Inp value={data.badge} onChange={v => onChange({ ...data, badge: v })} /></Field>
          <Field label="Highlight tiêu đề"><Inp value={data.titleHighlight} onChange={v => onChange({ ...data, titleHighlight: v })} /></Field>
          <div className="col-span-2"><Field label="Tiêu đề"><Inp value={data.title} onChange={v => onChange({ ...data, title: v })} /></Field></div>
        </div>
        <div className="space-y-3">
          {posts.map((post: any, i: number) => (
            <div key={i} className="p-3 border border-slate-200 rounded-xl bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Bài viết #{i + 1}</span>
                <button onClick={() => onChange({ ...data, posts: posts.filter((_: any, j: number) => j !== i) })}>
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Category"><Inp value={post.category} onChange={v => upPost(i, { category: v })} /></Field>
                <Field label="Ngày"><Inp value={post.date} onChange={v => upPost(i, { date: v })} /></Field>
              </div>
              <Field label="Tiêu đề bài"><Inp value={post.title} onChange={v => upPost(i, { title: v })} /></Field>
              <Field label="Excerpt (Mô tả ngắn)"><Txt value={post.excerpt} onChange={v => upPost(i, { excerpt: v })} rows={2} /></Field>
              <Field label="URL bài viết"><Inp value={post.url} onChange={v => upPost(i, { url: v })} /></Field>
              <Field label="Ảnh bìa">
                <div className="flex gap-2">
                  <Inp value={post.image} onChange={v => upPost(i, { image: v })} />
                  <MediaPicker onSelect={url => upPost(i, { image: url })} trigger={<Button variant="outline" className="h-10 w-10 p-0 rounded-xl shrink-0"><ImageIcon className="w-4 h-4" /></Button>} />
                </div>
              </Field>
            </div>
          ))}
          <button 
            onClick={() => onChange({ ...data, posts: [...posts, { title: "", excerpt: "", date: "", image: "", url: "", category: "" }] })}
            className="w-full h-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-primary hover:text-primary text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Thêm bài viết
          </button>
        </div>
      </div>
    </div>
  );
}
