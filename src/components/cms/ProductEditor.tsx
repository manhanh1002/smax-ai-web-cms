"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Plus, Trash2, ChevronUp, ChevronDown, Image as ImageIcon,
  Layout, HelpCircle, MessageSquare, Star, Layers, Users, Zap, Globe
} from "lucide-react";
import { IconPicker } from "@/components/cms/IconPicker";
import { MediaPicker } from "@/components/cms/MediaPicker";

interface ProductEditorProps {
  config: any;
  onChange: (config: any) => void;
}

export function ProductEditor({ config, onChange }: ProductEditorProps) {

  const updateConfig = (path: string, value: any) => {
    const newConfig = { ...config };
    const parts = path.split('.');
    let current = newConfig;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    onChange(newConfig);
  };

  const addArrayItem = (path: string, defaultValue: any) => {
    const newConfig = { ...config };
    if (!newConfig[path]) newConfig[path] = [];
    newConfig[path].push(defaultValue);
    onChange(newConfig);
  };

  const removeArrayItem = (path: string, index: number) => {
    const newConfig = { ...config };
    newConfig[path] = newConfig[path].filter((_: any, i: number) => i !== index);
    onChange(newConfig);
  };

  const updateArrayItem = (path: string, index: number, value: any) => {
    const newConfig = { ...config };
    newConfig[path][index] = { ...newConfig[path][index], ...value };
    onChange(newConfig);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Layout className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">Hero Section</h3>
        </div>
        <Card className="rounded-[32px] border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Badge Text</label>
                <Input value={config.hero?.badge || ""} onChange={(e) => updateConfig('hero.badge', e.target.value)} placeholder="🚀 Smax AI Solutions" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Headline</label>
                <Input value={config.hero?.title || ""} onChange={(e) => updateConfig('hero.title', e.target.value)} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Highlight (Primary Color)</label>
                <Input value={config.hero?.highlight || ""} onChange={(e) => updateConfig('hero.highlight', e.target.value)} className="h-12 rounded-xl" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Subtitle</label>
                <Input value={config.hero?.subtitle || ""} onChange={(e) => updateConfig('hero.subtitle', e.target.value)} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Hero Image URL</label>
                <div className="flex space-x-2">
                  <Input value={config.hero?.image || ""} onChange={(e) => updateConfig('hero.image', e.target.value)} placeholder="https://..." className="h-12 rounded-xl" />
                  <MediaPicker
                    onSelect={(url) => updateConfig('hero.image', url)}
                    trigger={
                      <Button variant="outline" className="h-12 w-12 p-0 rounded-xl">
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Trusted By Logos */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">Trusted By Logos</h3>
          </div>
          <Button variant="outline" size="sm" onClick={() => addArrayItem('trustedBy', "")} className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Thêm Logo
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {config.trustedBy?.map((logo: string, i: number) => (
            <div key={i} className="relative group">
              <Input
                value={logo}
                onChange={(e) => {
                  const newLogos = [...config.trustedBy];
                  newLogos[i] = e.target.value;
                  updateConfig('trustedBy', newLogos);
                }}
                placeholder="Logo URL"
                className="h-12 rounded-xl pr-10"
              />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <MediaPicker
                  onSelect={(url) => {
                    const newLogos = [...config.trustedBy];
                    newLogos[i] = url;
                    updateConfig('trustedBy', newLogos);
                  }}
                  trigger={
                    <button className="text-slate-400 hover:text-primary p-1">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                  }
                />
              </div>
              <button
                onClick={() => removeArrayItem('trustedBy', i)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">Top Benefits (Grid 3)</h3>
          </div>
          <Button variant="outline" size="sm" onClick={() => addArrayItem('benefits', { title: "New Benefit", description: "", icon: "Zap" })} className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Thêm Lợi ích
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.benefits?.map((item: any, i: number) => (
            <Card key={i} className="rounded-[32px] border-slate-200 relative group overflow-visible">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <IconPicker value={item.icon} onChange={(val) => updateArrayItem('benefits', i, { icon: val })} />
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 rounded-full h-8 w-8 p-0" onClick={() => removeArrayItem('benefits', i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input value={item.title} onChange={(e) => updateArrayItem('benefits', i, { title: e.target.value })} placeholder="Title" className="font-bold border-transparent focus:border-primary px-0" />
                <textarea
                  value={item.description}
                  onChange={(e) => updateArrayItem('benefits', i, { description: e.target.value })}
                  placeholder="Mô tả..."
                  className="w-full bg-transparent text-sm text-slate-500 resize-none outline-none min-h-[80px]"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Alternating Features */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">Alternating Features</h3>
          </div>
          <Button variant="outline" size="sm" onClick={() => addArrayItem('features', { title: "New Feature", points: [""], image: "", tag: "PRO", stat: "" })} className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Thêm Section Chi tiết
          </Button>
        </div>
        <div className="space-y-10">
          {config.features?.map((item: any, i: number) => (
            <Card key={i} className="rounded-[40px] border-slate-200 overflow-hidden bg-slate-50/50">
              <CardContent className="p-8 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tag</label>
                      <Input value={item.tag} onChange={(e) => updateArrayItem('features', i, { tag: e.target.value })} className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Title</label>
                      <Input value={item.title} onChange={(e) => updateArrayItem('features', i, { title: e.target.value })} className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Feature Image URL</label>
                      <Input value={item.image} onChange={(e) => updateArrayItem('features', i, { image: e.target.value })} className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Impact Stat Box (Optional)</label>
                      <Input value={item.stat} onChange={(e) => updateArrayItem('features', i, { stat: e.target.value })} placeholder="e.g. Tăng 25% doanh thu..." className="rounded-xl h-12" />
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-500 ml-4 hover:bg-red-50" onClick={() => removeArrayItem('features', i)}>
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Danh sách điểm nổi bật</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {item.points?.map((point: string, j: number) => (
                      <div key={j} className="flex space-x-2 items-center bg-white p-2 rounded-xl border border-slate-100">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Plus className="w-3 h-3 text-primary" />
                        </div>
                        <input
                          value={point}
                          onChange={(e) => {
                            const newPoints = [...item.points];
                            newPoints[j] = e.target.value;
                            updateArrayItem('features', i, { points: newPoints });
                          }}
                          className="flex-1 bg-transparent text-sm outline-none"
                        />
                        <button onClick={() => {
                          const newPoints = item.points.filter((_: any, k: number) => k !== j);
                          updateArrayItem('features', i, { points: newPoints });
                        }} className="text-slate-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    ))}
                    <button
                      onClick={() => updateArrayItem('features', i, { points: [...(item.points || []), ""] })}
                      className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-3 text-slate-400 hover:text-primary hover:border-primary transition-all text-sm font-bold"
                    >
                      + Thêm điểm tin
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Suitable For Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">Phù hợp với</h3>
          </div>
          <Button variant="outline" size="sm" onClick={() => addArrayItem('suitableFor', { tag: "", title: "", description: "" })} className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Thêm Card
          </Button>
        </div>
        <Card className="rounded-[32px] border-slate-200 shadow-sm overflow-hidden mb-6">
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Badge</label>
                <Input value={config.suitableForSection?.badge || ""} onChange={(e) => updateConfig('suitableForSection.badge', e.target.value)} className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Highlight Tiêu đề</label>
                <Input value={config.suitableForSection?.titleHighlight || ""} onChange={(e) => updateConfig('suitableForSection.titleHighlight', e.target.value)} className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tiêu đề</label>
                <Input value={config.suitableForSection?.title || ""} onChange={(e) => updateConfig('suitableForSection.title', e.target.value)} className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mô tả phụ</label>
                <Input value={config.suitableForSection?.subtitle || ""} onChange={(e) => updateConfig('suitableForSection.subtitle', e.target.value)} className="rounded-xl h-12" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer">
              <input 
                type="checkbox" 
                checked={config.suitableForSection?.darkMode !== false} 
                onChange={e => updateConfig('suitableForSection.darkMode', e.target.checked)} 
                className="rounded text-primary"
              />
              Chế độ Dark Mode (Nền tối)
            </label>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.suitableFor?.map((item: any, i: number) => (
            <Card key={i} className="rounded-[32px] border-slate-200 relative group overflow-visible bg-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Card #{i+1}</span>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 rounded-full h-8 w-8 p-0" onClick={() => removeArrayItem('suitableFor', i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Tag</label>
                    <Input value={item.tag} onChange={(e) => updateArrayItem('suitableFor', i, { tag: e.target.value })} className="h-10 rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Tiêu đề</label>
                    <Input value={item.title} onChange={(e) => updateArrayItem('suitableFor', i, { title: e.target.value })} className="h-10 rounded-xl font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Mô tả</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateArrayItem('suitableFor', i, { description: e.target.value })}
                      className="w-full bg-slate-50 p-3 rounded-xl text-sm text-slate-500 outline-none min-h-[80px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Impact Cards Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">Tính năng nổi bật</h3>
          </div>
          <Button variant="outline" size="sm" onClick={() => addArrayItem('impactCards', { title: "Title", description: "", image: "" })} className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Thêm Card
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.impactCards?.map((card: any, i: number) => (
            <Card key={i} className="rounded-[40px] border-slate-200 group overflow-visible">
              <CardContent className="p-6 space-y-4">
                <div className="h-32 bg-slate-100 rounded-[24px] mb-4 overflow-hidden relative border-4 border-white shadow-sm">
                  {card.image ? (
                    <img src={card.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-300 italic text-xs">No image</div>
                  )}
                  <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-red-400 bg-white shadow-sm opacity-0 group-hover:opacity-100 h-8 w-8 p-0 rounded-full" onClick={() => removeArrayItem('impactCards', i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <MediaPicker
                      onSelect={(url) => updateArrayItem('impactCards', i, { image: url })}
                      trigger={
                        <Button variant="secondary" size="sm" className="rounded-full shadow-lg">
                          Thay đổi ảnh
                        </Button>
                      }
                    />
                  </div>
                </div>
                <Input value={card.title} onChange={(e) => updateArrayItem('impactCards', i, { title: e.target.value })} placeholder="Title" className="font-bold border-transparent px-0 h-8" />
                <div className="flex gap-2 items-center">
                  <Input value={card.image} onChange={(e) => updateArrayItem('impactCards', i, { image: e.target.value })} placeholder="Image URL" className="text-[10px] h-8 rounded-lg flex-1" />
                  <MediaPicker
                    onSelect={(url) => updateArrayItem('impactCards', i, { image: url })}
                    trigger={
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg shrink-0">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </Button>
                    }
                  />
                </div>
                <textarea
                  value={card.description}
                  onChange={(e) => updateArrayItem('impactCards', i, { description: e.target.value })}
                  placeholder="Mô tả chi tiết..."
                  className="w-full bg-transparent text-sm text-slate-500 resize-none outline-none min-h-[60px]"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">Testimonials</h3>
          </div>
          <Button variant="outline" size="sm" onClick={() => addArrayItem('testimonials', { author: "", role: "", quote: "", avatar: "" })} className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Thêm Đánh giá
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.testimonials?.map((t: any, i: number) => (
            <Card key={i} className="rounded-[32px] border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                    <img src={t.avatar || `https://i.pravatar.cc/150?u=${i}`} />
                  </div>
                  <div>
                    <Input value={t.author} onChange={(e) => updateArrayItem('testimonials', i, { author: e.target.value })} placeholder="Tên khách hàng" className="font-bold border-transparent px-0 h-6" />
                    <Input value={t.role} onChange={(e) => updateArrayItem('testimonials', i, { role: e.target.value })} placeholder="Chức vụ" className="text-xs text-primary font-semibold border-transparent px-0 h-4" />
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-red-400 h-8 w-8 p-0" onClick={() => removeArrayItem('testimonials', i)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <textarea
                value={t.quote}
                onChange={(e) => updateArrayItem('testimonials', i, { quote: e.target.value })}
                placeholder="Nội dung đánh giá..."
                className="w-full bg-transparent text-sm text-slate-500 italic resize-none outline-none min-h-[80px]"
              />
              <div className="flex gap-2 items-center mt-2">
                <Input value={t.avatar} onChange={(e) => updateArrayItem('testimonials', i, { avatar: e.target.value })} placeholder="Avatar URL" className="text-[10px] h-8 rounded-lg flex-1" />
                <MediaPicker
                  onSelect={(url) => updateArrayItem('testimonials', i, { avatar: url })}
                  trigger={
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg shrink-0">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </Button>
                  }
                />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">FAQ Items</h3>
          </div>
          <Button variant="outline" size="sm" onClick={() => addArrayItem('faq', { question: "Question?", answer: "" })} className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Thêm FAQ
          </Button>
        </div>
        <div className="space-y-4">
          {config.faq?.map((item: any, i: number) => (
            <Card key={i} className="rounded-2xl border-slate-100 shadow-sm">
              <CardContent className="p-6 flex gap-6 items-start">
                <div className="flex-1 space-y-4">
                  <Input placeholder="Câu hỏi" value={item.question} onChange={(e) => updateArrayItem('faq', i, { question: e.target.value })} className="font-bold border-transparent focus:border-primary px-0 text-lg" />
                  <textarea
                    placeholder="Câu trả lời..."
                    value={item.answer}
                    onChange={(e) => updateArrayItem('faq', i, { answer: e.target.value })}
                    className="w-full bg-transparent text-slate-500 outline-none resize-none min-h-[60px]"
                  />
                </div>
                <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-50 h-10 w-10 p-0 rounded-full shrink-0" onClick={() => removeArrayItem('faq', i)}>
                  <Trash2 className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
