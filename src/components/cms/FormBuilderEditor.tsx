"use client";

import React, { useState, useEffect } from "react";
import { Field, Inp, Txt } from "./block-editors/shared";
import { Plus, Trash2, GripVertical, Settings2, PlusCircle, Layout, MousePointer2, Type, Mail, Phone, List, CheckSquare, Calendar, FileUp, Star, SlidersHorizontal, CircleDot, AlignLeft, Globe, Download, Layers, Link2, ChevronRight, Image, Minus, CheckCircle, Code, X, Sparkles, Send, Check, AlertCircle, Loader2 } from "lucide-react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { MediaPicker } from "@/components/cms/MediaPicker";

export interface FormFieldLogic {
  enabled: boolean;
  dependsOnId: string; // Refers to the fieldId of the dependency
  operator: "equals" | "not_equals" | "contains" | "filled";
  value: string;
}

export interface FormField {
  id: string;
  fieldId: string; // ASCII unique key
  type: "text" | "email" | "phone" | "textarea" | "select" | "checkbox" | "radio" | "date" | "file" | "rating" | "slider" | "image" | "html" | "divider" | "features";
  label: string;
  placeholder?: string;
  defaultValue?: string;
  required: boolean;
  hidden?: boolean;
  logic?: FormFieldLogic;
  options?: string[];
  width: "full" | "half";
  content?: string;
  imageUrl?: string;
  altText?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export type PostSubmitActionType = "none" | "redirect" | "download" | "popup";

export interface PostSubmitAction {
  type: PostSubmitActionType;
  redirect_url?: string;  // for type=redirect
  download_url?: string;  // for type=download
  download_label?: string;
  popup_id?: string;      // for type=popup
}

export interface FormSettings {
  type: "onestep" | "multistep";
  submit_label: string;
  next_label?: string;
  success_message: string;
  /** @deprecated use post_submit_action instead */
  redirect_url?: string;
  post_submit_action?: PostSubmitAction;
  webhooks?: string[];
  theme?: {
    primary_color?: string;
    border_radius?: string;
    // Advanced Design Settings
    submit_style?: "solid" | "outline" | "soft";
    submit_bg_color?: string;
    submit_text_color?: string;
    submit_size?: "sm" | "md" | "lg";
    submit_width?: "auto" | "full";
    submit_alignment?: "left" | "center" | "right";
    submit_radius?: string;
    
    field_bg_color?: string;
    field_border_color?: string;
    field_focus_color?: string;
    field_text_color?: string;
    label_color?: string;
    field_size?: "sm" | "md" | "lg";
    field_radius?: string;
    field_spacing?: "compact" | "comfortable" | "spacious";
    label_style?: "normal" | "uppercase";
    border_width?: "thin" | "medium";
  };
}

interface FormBuilderEditorProps {
  steps: FormStep[];
  settings: FormSettings;
  onChange: (steps: FormStep[], settings: FormSettings) => void;
}

const FIELD_TYPES = [
  { type: "text", label: "Văn bản", icon: Type },
  { type: "email", label: "Email", icon: Mail },
  { type: "phone", label: "Số điện thoại", icon: Phone },
  { type: "textarea", label: "Đoạn văn", icon: AlignLeft },
  { type: "select", label: "Lựa chọn (Dropdown)", icon: List },
  { type: "radio", label: "Một lựa chọn (Radio)", icon: CircleDot },
  { type: "checkbox", label: "Nhiều lựa chọn (Checkbox)", icon: CheckSquare },
  { type: "rating", label: "Đánh giá (Rating)", icon: Star },
  { type: "slider", label: "Thanh trượt (Slider)", icon: SlidersHorizontal },
  { type: "date", label: "Ngày tháng", icon: Calendar },
  { type: "file", label: "Tải file", icon: FileUp },
] as const;

const STATIC_TYPES = [
  { type: "image", label: "Hình ảnh", description: "Chèn ảnh minh họa hoặc banner vào form", icon: Image, color: "bg-blue-50 text-blue-500" },
  { type: "html", label: "Văn bản / HTML", description: "Thêm nội dung văn bản, tiêu đề hoặc code", icon: Code, color: "bg-emerald-50 text-emerald-500" },
  { type: "features", label: "Tính năng", description: "Danh sách đặc điểm với icon tích xanh", icon: CheckCircle, color: "bg-amber-50 text-amber-500" },
  { type: "divider", label: "Phân cách", description: "Đường kẻ ngang chia tách các phần", icon: Minus, color: "bg-slate-50 text-slate-500" },
] as const;

export function normalizeFieldId(label: string): string {
  if (!label) return "";
  let id = label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_") // Replace non-alphanumeric with _
    .replace(/^[^a-z]/, (match) => `field_${match}`) // Ensure starts with letter
    .replace(/_+/g, "_") // Remove multiple underscores
    .replace(/^_|_$/g, ""); // Remove leading/trailing underscores

  return id || "field_" + Math.random().toString(36).substr(2, 4);
}

export function FormBuilderEditor({ steps, settings, onChange }: FormBuilderEditorProps) {
  const [activeTab, setActiveTab] = useState<"builder" | "settings" | "integrations">("builder");
  const [pickingMiniBlockForStepId, setPickingMiniBlockForStepId] = useState<string | null>(null);
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<Record<string, "success" | "error" | null>>({});

  const updateSettings = (newSettings: Partial<FormSettings>) => {
    if (newSettings.theme) {
      onChange(steps, { ...settings, ...newSettings, theme: { ...settings.theme, ...newSettings.theme } });
    } else {
      onChange(steps, { ...settings, ...newSettings });
    }
  };

  const addStep = () => {
    const newStep: FormStep = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Bước ${steps.length + 1}`,
      fields: [],
    };
    onChange([...steps, newStep], settings);
  };

  const removeStep = (stepId: string) => {
    onChange(steps.filter(s => s.id !== stepId), settings);
  };

  const updateStep = (stepId: string, updates: Partial<FormStep>) => {
    onChange(steps.map(s => s.id === stepId ? { ...s, ...updates } : s), settings);
  };

  const handleTestWebhook = async (url: string) => {
    setTestingWebhook(url);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: "test_webhook",
          timestamp: new Date().toISOString(),
          source: "Smax AI Form Builder",
          data: {
            message: "Đây là dữ liệu test từ Form Builder",
            test_field: "Giá trị mẫu",
            email: "test@example.com"
          }
        })
      });
      
      if (response.ok) {
        setTestStatus({ ...testStatus, [url]: "success" });
      } else {
        setTestStatus({ ...testStatus, [url]: "error" });
      }
    } catch (err) {
      setTestStatus({ ...testStatus, [url]: "error" });
    } finally {
      setTestingWebhook(null);
      setTimeout(() => {
        setTestStatus(prev => ({ ...prev, [url]: null }));
      }, 3000);
    }
  };

  const addField = (stepId: string, type: FormField["type"]) => {
    const fieldIdBase = [...FIELD_TYPES, ...STATIC_TYPES].find(f => f.type === type)?.label || type;
    const initialFieldId = normalizeFieldId(fieldIdBase);
    
    // Ensure uniqueness
    let finalFieldId = initialFieldId;
    let counter = 1;
    const allExistingFieldIds = steps.flatMap(s => s.fields.map(f => f.fieldId));
    while (allExistingFieldIds.includes(finalFieldId)) {
      finalFieldId = `${initialFieldId}_${counter}`;
      counter++;
    }

    const isStatic = STATIC_TYPES.some(s => s.type === type);
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      fieldId: isStatic ? "" : finalFieldId,
      type,
      label: isStatic ? `Nội dung mới (${type})` : `Trường mới (${type})`,
      placeholder: "",
      required: false,
      width: "full",
      options: (type === "select" || type === "radio" || type === "checkbox") ? ["Lựa chọn 1", "Lựa chọn 2"] : undefined,
    };
    onChange(steps.map(s => s.id === stepId ? { ...s, fields: [...s.fields, newField] } : s), settings);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
      <div className="flex border-b border-slate-100 bg-slate-50/50">
        <button
          onClick={() => setActiveTab("builder")}
          className={cn(
            "flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all",
            activeTab === "builder" ? "bg-white text-primary border-b-2 border-primary" : "text-slate-400 hover:text-slate-600"
          )}
        >
          Trình dựng Form
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={cn(
            "flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all",
            activeTab === "settings" ? "bg-white text-primary border-b-2 border-primary" : "text-slate-400 hover:text-slate-600"
          )}
        >
          Cấu hình chung
        </button>
        <button
          onClick={() => setActiveTab("integrations")}
          className={cn(
            "flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all",
            activeTab === "integrations" ? "bg-white text-primary border-b-2 border-primary" : "text-slate-400 hover:text-slate-600"
          )}
        >
          Tích hợp
        </button>
      </div>

      <div className="p-8">
        {activeTab === "builder" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Danh sách các bước</h3>
              {settings.type === "multistep" && (
                <Button onClick={addStep} size="sm" className="rounded-xl h-9">
                  <Plus className="w-4 h-4 mr-2" /> Thêm bước mới
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {steps.map((step, sIdx) => (
                <div key={step.id} className="relative group">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-slate-100 group-hover:bg-primary/20 rounded-full transition-colors" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black">
                          {sIdx + 1}
                        </div>
                        <div className="flex-1 space-y-1">
                          <input
                            value={step.title}
                            onChange={(e) => updateStep(step.id, { title: e.target.value })}
                            className="bg-transparent border-none p-0 text-sm font-black text-slate-900 uppercase tracking-wider focus:ring-0 w-full"
                            placeholder="Tên bước..."
                          />
                          <input
                            value={step.description || ""}
                            onChange={(e) => updateStep(step.id, { description: e.target.value })}
                            className="bg-transparent border-none p-0 text-xs text-slate-400 font-medium focus:ring-0 w-full"
                            placeholder="Mô tả phụ cho bước này (không bắt buộc)..."
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            if (steps.length > 1) {
                              onChange(steps.filter(s => s.id !== step.id), settings);
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="pl-11 space-y-3">
                      <Reorder.Group axis="y" values={step.fields} onReorder={(newFields) => updateStep(step.id, { fields: newFields })}>
                        <AnimatePresence mode="popLayout">
                          {step.fields.map((field) => (
                            <Reorder.Item
                              key={field.id}
                              value={field}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className={cn(
                                "relative bg-white border border-slate-100 rounded-[20px] p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group/field",
                                STATIC_TYPES.some(t => t.type === field.type) && "border-amber-100 bg-amber-50/10 hover:border-amber-200"
                              )}
                            >
                              <div className="flex items-start gap-4">
                                <div className="mt-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-400">
                                  <GripVertical className="w-4 h-4" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  {STATIC_TYPES.some(t => t.type === field.type) ? (
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-2">
                                        <div className={cn(
                                          "w-6 h-6 rounded-lg flex items-center justify-center",
                                          STATIC_TYPES.find(t => t.type === field.type)?.color
                                        )}>
                                          {React.createElement(STATIC_TYPES.find(t => t.type === field.type)?.icon || Code, { className: "w-3.5 h-3.5" })}
                                        </div>
                                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Mini-block: {STATIC_TYPES.find(t => t.type === field.type)?.label}</span>
                                      </div>
                                      <MiniBlockEditor 
                                        field={field} 
                                        onChange={(updates) => {
                                          const newFields = step.fields.map(f => f.id === field.id ? { ...f, ...updates } : f);
                                          updateStep(step.id, { fields: newFields });
                                        }} 
                                      />
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                                      <Field label="Nhãn hiển thị">
                                        <Inp 
                                          value={field.label} 
                                          onChange={v => {
                                            const newFields = step.fields.map(f => {
                                              if (f.id === field.id) {
                                                const oldNormalized = normalizeFieldId(f.label);
                                                const currentNormalized = normalizeFieldId(f.fieldId);
                                                
                                                const updates: any = { label: v };
                                                if (oldNormalized === currentNormalized || !f.fieldId) {
                                                  updates.fieldId = normalizeFieldId(v);
                                                }
                                                return { ...f, ...updates };
                                              }
                                              return f;
                                            });
                                            updateStep(step.id, { fields: newFields });
                                          }} 
                                          placeholder="Ví dụ: Họ và tên"
                                        />
                                      </Field>

                                      <Field label="Mã Field (ID)">
                                        <Inp 
                                          value={field.fieldId} 
                                          onChange={v => {
                                            const newFields = step.fields.map(f => f.id === field.id ? { ...f, fieldId: normalizeFieldId(v) } : f);
                                            updateStep(step.id, { fields: newFields });
                                          }} 
                                          placeholder="ho_va_ten"
                                        />
                                      </Field>

                                      <Field label="Placeholder">
                                        <Inp 
                                          value={field.placeholder || ""} 
                                          onChange={v => {
                                            const newFields = step.fields.map(f => f.id === field.id ? { ...f, placeholder: v } : f);
                                            updateStep(step.id, { fields: newFields });
                                          }} 
                                          placeholder="Gợi ý nhập liệu..."
                                        />
                                      </Field>

                                      <div className="flex flex-col justify-end pb-1">
                                        <div className="flex items-center gap-6">
                                          <label className="flex items-center gap-2 cursor-pointer group/check">
                                            <input
                                              type="checkbox"
                                              checked={field.required}
                                              onChange={e => {
                                                const newFields = step.fields.map(f => f.id === field.id ? { ...f, required: e.target.checked } : f);
                                                updateStep(step.id, { fields: newFields });
                                              }}
                                              className="w-4 h-4 rounded border-slate-200 text-primary focus:ring-primary/20"
                                            />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/check:text-slate-600 transition-colors">Bắt buộc</span>
                                          </label>

                                          <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rộng:</span>
                                            <div className="flex p-0.5 bg-slate-100 rounded-lg">
                                              <button 
                                                onClick={() => {
                                                  const newFields: FormField[] = step.fields.map(f => f.id === field.id ? { ...f, width: "full" as const } : f);
                                                  updateStep(step.id, { fields: newFields });
                                                }}
                                                className={cn(
                                                  "px-2 py-1 text-[9px] font-black uppercase rounded-md transition-all",
                                                  field.width === "full" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                                                )}
                                              >Full</button>
                                              <button 
                                                onClick={() => {
                                                  const newFields: FormField[] = step.fields.map(f => f.id === field.id ? { ...f, width: "half" as const } : f);
                                                  updateStep(step.id, { fields: newFields });
                                                }}
                                                className={cn(
                                                  "px-2 py-1 text-[9px] font-black uppercase rounded-md transition-all",
                                                  field.width === "half" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                                                )}
                                              >Half</button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
                                        <div className="md:col-span-2">
                                          <Field label="Các lựa chọn (Mỗi dòng một lựa chọn)">
                                            <Txt 
                                              value={field.options?.join("\n") || ""}
                                              onChange={v => {
                                                const newFields = step.fields.map(f => f.id === field.id ? { ...f, options: v.split("\n") } : f);
                                                updateStep(step.id, { fields: newFields });
                                              }}
                                              rows={3}
                                              placeholder="Lựa chọn 1\nLựa chọn 2..."
                                            />
                                          </Field>
                                        </div>
                                      )}

                                      {field.type === "slider" && (
                                        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                                          <Field label="Min">
                                            <input 
                                              type="number"
                                              value={field.min ?? 0}
                                              onChange={e => {
                                                const newFields = step.fields.map(f => f.id === field.id ? { ...f, min: parseInt(e.target.value) } : f);
                                                updateStep(step.id, { fields: newFields });
                                              }}
                                              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white font-bold"
                                            />
                                          </Field>
                                          <Field label="Max">
                                            <input 
                                              type="number"
                                              value={field.max ?? 100}
                                              onChange={e => {
                                                const newFields = step.fields.map(f => f.id === field.id ? { ...f, max: parseInt(e.target.value) } : f);
                                                updateStep(step.id, { fields: newFields });
                                              }}
                                              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white font-bold"
                                            />
                                          </Field>
                                          <Field label="Step">
                                            <input 
                                              type="number"
                                              value={field.step ?? 1}
                                              onChange={e => {
                                                const newFields = step.fields.map(f => f.id === field.id ? { ...f, step: parseInt(e.target.value) } : f);
                                                updateStep(step.id, { fields: newFields });
                                              }}
                                              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white font-bold"
                                            />
                                          </Field>
                                          <Field label="Đơn vị">
                                            <Inp 
                                              value={field.unit || ""}
                                              onChange={v => {
                                                const newFields = step.fields.map(f => f.id === field.id ? { ...f, unit: v } : f);
                                                updateStep(step.id, { fields: newFields });
                                              }}
                                              placeholder="%, VNĐ..."
                                            />
                                          </Field>
                                        </div>
                                      )}

                                      <div className="pt-2">
                                        <FieldSettings field={field} onChange={(updates) => {
                                          const newFields = step.fields.map(f => f.id === field.id ? { ...f, ...updates } : f);
                                          updateStep(step.id, { fields: newFields });
                                        }} />
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="pt-2 border-t border-slate-50">
                                    <LogicEditor 
                                      field={field} 
                                      allFields={steps.flatMap(s => s.fields)}
                                      onUpdate={logic => {
                                        const newFields = step.fields.map(f => f.id === field.id ? { ...f, logic } : f);
                                        updateStep(step.id, { fields: newFields });
                                      }}
                                    />
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    const newFields = step.fields.filter(f => f.id !== field.id);
                                    updateStep(step.id, { fields: newFields });
                                  }}
                                  className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover/field:opacity-100"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </Reorder.Item>
                          ))}
                        </AnimatePresence>
                      </Reorder.Group>

                      <div className="flex items-center gap-2 pt-4">
                        <div className="h-[1px] flex-1 bg-slate-100" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Trường nhập liệu</span>
                        <div className="h-[1px] flex-1 bg-slate-100" />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {FIELD_TYPES.map(t => (
                          <button
                            key={t.type}
                            onClick={() => addField(step.id, t.type)}
                            className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 hover:border-primary hover:bg-primary/5 transition-all gap-2 group"
                          >
                            <t.icon className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight text-center group-hover:text-slate-900">{t.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <div className="h-[1px] flex-1 bg-slate-100" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Nội dung bổ sung</span>
                        <div className="h-[1px] flex-1 bg-slate-100" />
                      </div>
                      <button
                        onClick={() => setPickingMiniBlockForStepId(step.id)}
                        className="w-full flex items-center justify-center p-4 rounded-2xl border border-dashed border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                          <Plus className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-black text-slate-900 uppercase tracking-wider">Mở Mini-block Library</div>
                          <div className="text-[10px] text-slate-400 font-medium">Thêm hình ảnh, văn bản hoặc danh sách tính năng</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-8 max-w-2xl">
            <div className="space-y-6">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-primary" /> Cài đặt vận hành
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Kiểu Form">
                  <div className="flex bg-slate-100 rounded-2xl p-1.5">
                    {[
                      { id: "onestep", label: "Một bước", icon: Layout },
                      { id: "multistep", label: "Nhiều bước", icon: PlusCircle }
                    ].map(type => (
                      <button
                        key={type.id}
                        onClick={() => updateSettings({ type: type.id as any })}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all",
                          settings.type === type.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        <type.icon className="w-4 h-4" />
                        <span className="text-xs font-bold">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Nhãn nút Tiếp tục (Nhiều bước)">
                  <Inp value={settings.next_label || "Tiếp tục"} onChange={v => updateSettings({ next_label: v })} placeholder="Tiếp tục" />
                </Field>
                <Field label="Nhãn nút Hoàn tất (Submit)">
                  <Inp value={settings.submit_label} onChange={v => updateSettings({ submit_label: v })} placeholder="Gửi thông tin" />
                </Field>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-100">
                <Field label="Thông báo thành công">
                  <Txt value={settings.success_message} onChange={v => updateSettings({ success_message: v })} rows={2} />
                </Field>

                <PostSubmitActionEditor
                  value={settings.post_submit_action || { type: settings.redirect_url ? "redirect" : "none", redirect_url: settings.redirect_url }}
                  onChange={action => updateSettings({ post_submit_action: action, redirect_url: undefined })}
                />
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-slate-100">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Layout className="w-4 h-4 text-primary" /> Giao diện Form
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Màu sắc chủ đạo (Primary Color)">
                  <ColorInput 
                    value={settings.theme?.primary_color || "#3b82f6"} 
                    onChange={v => updateSettings({ theme: { primary_color: v } })}
                    placeholder="#3b82f6" 
                  />
                </Field>
                <Field label="Bo góc (Border Radius)">
                  <select 
                    value={settings.theme?.border_radius || "xl"} 
                    onChange={e => updateSettings({ theme: { ...settings.theme, border_radius: e.target.value } })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value="none">Không bo (0px)</option>
                    <option value="md">Vừa (8px)</option>
                    <option value="xl">Lớn (12px)</option>
                    <option value="2xl">Rất lớn (16px)</option>
                    <option value="full">Tròn (999px)</option>
                  </select>
                </Field>
                <Field label="Màu Nút (Button Background)">
                  <ColorInput 
                    value={settings.theme?.submit_bg_color || settings.theme?.primary_color || "#3b82f6"} 
                    onChange={v => updateSettings({ theme: { submit_bg_color: v } })}
                    placeholder="#3b82f6" 
                  />
                </Field>
                <Field label="Màu chữ Nút (Button Text)">
                  <ColorInput 
                    value={settings.theme?.submit_text_color || "#ffffff"} 
                    onChange={v => updateSettings({ theme: { submit_text_color: v } })}
                    placeholder="#ffffff" 
                  />
                </Field>
              </div>

              <div className="pt-4">
                <AdvancedThemeSettings 
                  settings={settings} 
                  updateSettings={updateSettings} 
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "integrations" && (
          <div className="space-y-8 max-w-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" /> Kết nối Webhooks
                  </h4>
                  <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">Tự động đẩy dữ liệu sang n8n, Zapier, Make...</p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-100 rounded-[24px] space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input 
                      id="new-webhook-url"
                      placeholder="Dán link Webhook của bạn tại đây (https://...)"
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          const input = e.currentTarget;
                          const url = input.value.trim();
                          if (url) {
                            const current = settings.webhooks || [];
                            if (!current.includes(url)) {
                              updateSettings({ webhooks: [...current, url] });
                              input.value = "";
                            }
                          }
                        }
                      }}
                    />
                  </div>
                  <button 
                    onClick={() => {
                      const input = document.getElementById('new-webhook-url') as HTMLInputElement;
                      const url = input?.value.trim();
                      if (url) {
                        const current = settings.webhooks || [];
                        if (!current.includes(url)) {
                          updateSettings({ webhooks: [...current, url] });
                          input.value = "";
                        }
                      }
                    }}
                    className="px-6 h-11 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-colors"
                  >
                    Kết nối
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Danh sách Webhooks hoạt động</h5>
                {(settings.webhooks || []).length === 0 ? (
                  <div className="py-12 border-2 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center text-slate-300 gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                      <Link2 className="w-8 h-8 opacity-20" />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest">Chưa có kết nối nào</p>
                      <p className="text-[9px] font-medium mt-1">Dữ liệu hiện chỉ được lưu vào database nội bộ</p>
                    </div>
                  </div>
                ) : (
                  (settings.webhooks || []).map((url, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl group hover:border-primary/30 transition-all hover:shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 group-hover:scale-110 transition-transform">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-widest">POST</span>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Webhook Endpoint</div>
                        </div>
                        <div className="text-xs font-bold text-slate-700 truncate">{url}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleTestWebhook(url)}
                          disabled={testingWebhook === url}
                          className={cn(
                            "p-2.5 rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                            testStatus[url] === "success" ? "bg-emerald-50 text-emerald-600" :
                            testStatus[url] === "error" ? "bg-red-50 text-red-600" :
                            "hover:bg-slate-50 text-slate-400 hover:text-primary"
                          )}
                        >
                          {testingWebhook === url ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : testStatus[url] === "success" ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : testStatus[url] === "error" ? (
                            <AlertCircle className="w-3.5 h-3.5" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                          <span>{testStatus[url] === "success" ? "Thành công" : testStatus[url] === "error" ? "Lỗi" : "Gửi Test"}</span>
                        </button>
                        <button 
                          onClick={() => {
                            const current = settings.webhooks || [];
                            updateSettings({ webhooks: current.filter(w => w !== url) });
                          }}
                          className="p-2.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-8 border-t border-slate-100 space-y-6">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> Ứng dụng phổ biến
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { name: "n8n", color: "bg-[#ff6d5a]/10 text-[#ff6d5a]" },
                    { name: "Zapier", color: "bg-[#ff4f00]/10 text-[#ff4f00]" },
                    { name: "Make", color: "bg-[#7146ff]/10 text-[#7146ff]" },
                    { name: "Pabbly", color: "bg-[#1865ff]/10 text-[#1865ff]" },
                    { name: "Custom API", color: "bg-slate-100 text-slate-600" }
                  ].map(app => (
                    <div key={app.name} className="p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 hover:border-slate-200 transition-colors cursor-help group">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-transform group-hover:scale-110", app.color)}>
                        {app.name[0]}
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{app.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mini-block Library Modal */}
      <AnimatePresence>
        {pickingMiniBlockForStepId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPickingMiniBlockForStepId(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-amber-500" /> Mini-block Library
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-1">Chọn nội dung tĩnh để chèn vào form của bạn</p>
                </div>
                <button 
                  onClick={() => setPickingMiniBlockForStepId(null)}
                  className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {STATIC_TYPES.map((t) => (
                    <button
                      key={t.type}
                      onClick={() => {
                        addField(pickingMiniBlockForStepId, t.type);
                        setPickingMiniBlockForStepId(null);
                      }}
                      className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-amber-400 hover:bg-amber-50 transition-all text-left group"
                    >
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", t.color)}>
                        <t.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{t.label}</div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-slate-50 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Smax AI Form Builder</p>
                <button 
                  onClick={() => setPickingMiniBlockForStepId(null)}
                  className="px-6 py-2 text-xs font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Smax Form Builder Engine • Beta v1.0</p>
        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
          <span>{steps.reduce((acc, s) => acc + s.fields.length, 0)} trường dữ liệu</span>
          <span>{steps.length} bước</span>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function LogicEditor({ field, allFields, onUpdate }: { 
  field: FormField, 
  allFields: FormField[], 
  onUpdate: (logic: FormFieldLogic | undefined) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const fieldIndex = allFields.findIndex(f => f.id === field.id);
  const availableFields = allFields.slice(0, fieldIndex).filter(f => f.fieldId);

  const logic = field.logic || { enabled: false, dependsOnId: "", operator: "equals", value: "" };

  if (!isOpen && !logic.enabled) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors pl-11"
      >
        <PlusCircle className="w-3 h-3" /> Thiết lập Logic hiển thị
      </button>
    );
  }

  return (
    <div className="ml-11 space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Điều kiện hiển thị</span>
        </div>
        <button 
          onClick={() => {
            setIsOpen(false);
            onUpdate(undefined);
          }}
          className="text-[10px] font-bold text-red-400 hover:text-red-600"
        >
          Xóa Logic
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id={`logic-en-${field.id}`}
          checked={logic.enabled}
          onChange={e => onUpdate({ ...logic, enabled: e.target.checked })}
          className="rounded border-slate-300 text-primary focus:ring-primary"
        />
        <label htmlFor={`logic-en-${field.id}`} className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer">
          Kích hoạt điều kiện
        </label>
      </div>

      {logic.enabled && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nếu trường</label>
            <select 
              value={logic.dependsOnId}
              onChange={e => onUpdate({ ...logic, dependsOnId: e.target.value })}
              className="w-full h-8 px-2 rounded-lg border border-slate-200 text-[10px] bg-white font-bold"
            >
              <option value="">-- Chọn trường --</option>
              {availableFields.map(f => (
                <option key={f.id} value={f.fieldId}>{f.label || f.fieldId}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Điều kiện</label>
            <select 
              value={logic.operator}
              onChange={e => onUpdate({ ...logic, operator: e.target.value as any })}
              className="w-full h-8 px-2 rounded-lg border border-slate-200 text-[10px] bg-white font-bold"
            >
              <option value="equals">Bằng</option>
              <option value="not_equals">Khác</option>
              <option value="contains">Chứa</option>
              <option value="filled">Có dữ liệu</option>
            </select>
          </div>
          {logic.operator !== "filled" && (
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Giá trị</label>
              <input 
                value={logic.value}
                onChange={e => onUpdate({ ...logic, value: e.target.value })}
                placeholder="..."
                className="w-full h-8 px-2 rounded-lg border border-slate-200 text-[10px] bg-white font-bold"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MiniBlockEditor({ field, onChange }: { field: FormField, onChange: (v: any) => void }) {
  if (field.type === "image") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
        <Field label="Hình ảnh hiển thị">
          <MediaPicker
            onSelect={url => onChange({ imageUrl: url })}
            trigger={
              <button className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary hover:bg-blue-50 transition-all overflow-hidden group">
                {field.imageUrl ? (
                  <img src={field.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Plus className="w-6 h-6 text-slate-300 group-hover:text-primary" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-primary">Chọn ảnh</span>
                  </div>
                )}
              </button>
            }
          />
        </Field>
        <Field label="Mô tả ảnh (Alt)">
          <Inp value={field.altText || ""} onChange={v => onChange({ altText: v })} placeholder="SEO text..." />
        </Field>
      </div>
    );
  }

  if (field.type === "html" || field.type === "features") {
    return (
      <div className="animate-in fade-in duration-300">
        <Field label={field.type === "html" ? "Nội dung văn bản / HTML" : "Danh sách (Mỗi dòng một mục)"}>
          <Txt 
            value={field.content || ""} 
            onChange={v => onChange({ content: v })} 
            rows={4} 
            placeholder={field.type === "html" ? "Nhập văn bản..." : "Tính năng 1\nTính năng 2..."} 
          />
        </Field>
      </div>
    );
  }

  return null;
}

function FieldSettings({ field, onChange }: { field: FormField, onChange: (v: any) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-1"
      >
        <SlidersHorizontal className="w-3 h-3" /> Nâng cao
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" onClick={() => setIsOpen(false)} />
      <div className="relative w-full max-w-lg bg-white rounded-[24px] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Cấu hình: {field.label}</h4>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X className="w-4 h-4" /></button>
        </div>
        
        <div className="p-6 space-y-6">
          {(field.type === "select" || field.type === "checkbox" || field.type === "radio") && (
            <Field label="Các lựa chọn (Mỗi dòng một lựa chọn)">
              <Txt 
                value={field.options?.join("\n") || ""}
                onChange={v => onChange({ options: v.split("\n") })}
                rows={5}
                placeholder="Lựa chọn 1\nLựa chọn 2..."
              />
            </Field>
          )}



          <div className="grid grid-cols-2 gap-4">
            <Field label="Mặc định ẩn">
              <select 
                value={field.hidden ? "yes" : "no"} 
                onChange={e => onChange({ hidden: e.target.value === "yes" })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="no">Không</option>
                <option value="yes">Có</option>
              </select>
            </Field>
            <Field label="Giá trị mặc định">
              <Inp value={field.defaultValue || ""} onChange={v => onChange({ defaultValue: v })} placeholder="Ví dụ: ?ref_code" />
            </Field>
          </div>
        </div>

        <div className="p-6 bg-slate-50 flex justify-end">
          <Button onClick={() => setIsOpen(false)} className="rounded-xl">Hoàn tất</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Components (Extracted from file) ───────────────────

function AdvancedThemeSettings({ settings, updateSettings }: { settings: FormSettings, updateSettings: (v: any) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = settings.theme || {};

  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-slate-400" />
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">Advanced Design Settings</span>
        </div>
        <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform", isOpen && "rotate-90")} />
      </button>

      {isOpen && (
        <div className="p-6 space-y-8 bg-white border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Submit Button Section */}
          <div className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-primary">Cấu hình Nút Gửi (Submit Button)</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Kiểu nút">
                <select 
                  value={theme.submit_style || "solid"} 
                  onChange={e => updateSettings({ theme: { submit_style: e.target.value as any } })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="solid">Solid (Đậm)</option>
                  <option value="outline">Outline (Viền)</option>
                  <option value="soft">Soft (Nhẹ)</option>
                </select>
              </Field>
              <Field label="Kích thước">
                <select 
                  value={theme.submit_size || "md"} 
                  onChange={e => updateSettings({ theme: { submit_size: e.target.value as any } })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="sm">Nhỏ</option>
                  <option value="md">Vừa</option>
                  <option value="lg">Lớn</option>
                </select>
              </Field>
              <Field label="Màu nền nút">
                <ColorInput value={theme.submit_bg_color || ""} onChange={v => updateSettings({ theme: { submit_bg_color: v } })} placeholder="#000000" />
              </Field>
              <Field label="Màu chữ nút">
                <ColorInput value={theme.submit_text_color || ""} onChange={v => updateSettings({ theme: { submit_text_color: v } })} placeholder="#ffffff" />
              </Field>
              <Field label="Bo góc nút">
                <select 
                  value={theme.submit_radius || "xl"} 
                  onChange={e => updateSettings({ theme: { submit_radius: e.target.value as any } })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="">Theo mặc định</option>
                  <option value="none">Không bo (0px)</option>
                  <option value="md">Vừa (8px)</option>
                  <option value="xl">Lớn (12px)</option>
                  <option value="2xl">Rất lớn (16px)</option>
                  <option value="full">Tròn (999px)</option>
                </select>
              </Field>
              <Field label="Độ rộng nút">
                <select 
                  value={theme.submit_width || "full"} 
                  onChange={e => updateSettings({ theme: { submit_width: e.target.value as any } })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="auto">Tự động (Auto)</option>
                  <option value="full">Toàn bộ (Full)</option>
                </select>
              </Field>
              <Field label="Căn lề nút">
                <select 
                  value={theme.submit_alignment || "center"} 
                  onChange={e => updateSettings({ theme: { submit_alignment: e.target.value as any } })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="left">Trái</option>
                  <option value="center">Giữa</option>
                  <option value="right">Phải</option>
                </select>
              </Field>
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="space-y-4 pt-6 border-t border-slate-50">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-primary">Cấu hình Ô nhập liệu (Form Fields)</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Màu nền ô nhập">
                <ColorInput value={theme.field_bg_color || ""} onChange={v => updateSettings({ theme: { field_bg_color: v } })} placeholder="#f8fafc" />
              </Field>
              <Field label="Màu viền ô nhập">
                <ColorInput value={theme.field_border_color || ""} onChange={v => updateSettings({ theme: { field_border_color: v } })} placeholder="#e2e8f0" />
              </Field>
              <Field label="Màu chữ ô nhập">
                <ColorInput value={theme.field_text_color || ""} onChange={v => updateSettings({ theme: { field_text_color: v } })} placeholder="#1e293b" />
              </Field>
              <Field label="Màu nhãn (Label)">
                <ColorInput value={theme.label_color || ""} onChange={v => updateSettings({ theme: { label_color: v } })} placeholder="#64748b" />
              </Field>
              <Field label="Bo góc ô nhập">
                <select 
                  value={theme.field_radius || "xl"} 
                  onChange={e => updateSettings({ theme: { field_radius: e.target.value as any } })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="">Theo mặc định</option>
                  <option value="none">Không bo (0px)</option>
                  <option value="md">Vừa (8px)</option>
                  <option value="xl">Lớn (12px)</option>
                  <option value="2xl">Rất lớn (16px)</option>
                  <option value="full">Tròn (999px)</option>
                </select>
              </Field>
              <Field label="Khoảng cách (Spacing)">
                <select 
                  value={theme.field_spacing || "comfortable"} 
                  onChange={e => updateSettings({ theme: { field_spacing: e.target.value as any } })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="compact">Gọn (Compact)</option>
                  <option value="comfortable">Vừa (Comfortable)</option>
                  <option value="spacious">Rộng (Spacious)</option>
                </select>
              </Field>
              <Field label="Kiểu nhãn">
                <select 
                  value={theme.label_style || "normal"} 
                  onChange={e => updateSettings({ theme: { label_style: e.target.value as any } })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="normal">Bình thường</option>
                  <option value="uppercase">Viết hoa toàn bộ</option>
                </select>
              </Field>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ColorInput({ value, onChange, placeholder }: { value: string, onChange: (v: string) => void, placeholder: string }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-xl">
      <input 
        type="color" 
        value={value.startsWith("#") ? value : "#3b82f6"} 
        onChange={e => onChange(e.target.value)}
        className="w-8 h-8 rounded-lg border-none bg-transparent cursor-pointer"
      />
      <Inp 
        value={value} 
        onChange={onChange}
        placeholder={placeholder} 
      />
    </div>
  );
}

const ACTION_TYPES = [
  { id: "none",     label: "Không làm gì",    icon: Link2,     desc: "Chỉ hiển thị thông báo thành công" },
  { id: "redirect", label: "Chuyển trang",     icon: Globe,     desc: "Redirect sang URL sau khi gửi" },
  { id: "download", label: "Tải file xuống",   icon: Download,  desc: "Cho phép tải file từ Media Library" },
  { id: "popup",    label: "Mở Popup khác",    icon: Layers,    desc: "Hiển thị Offer / Upsell popup" },
] as const;

function PostSubmitActionEditor({ value, onChange }: { value: PostSubmitAction, onChange: (v: PostSubmitAction) => void }) {
  const [popups, setPopups] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    import("@/lib/supabase").then(({ supabase }) => {
      supabase.from("popups").select("id, name").order("name").then(({ data }) => {
        if (data) setPopups(data);
      });
    });
  }, []);

  const current = value?.type || "none";

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hành động sau khi gửi form</p>
      <div className="grid grid-cols-2 gap-2">
        {ACTION_TYPES.map(({ id, label, icon: Icon, desc }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange({ ...value, type: id as any })}
            className={cn(
              "flex items-start gap-3 p-3 rounded-2xl border text-left transition-all",
              current === id ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-500 hover:border-primary/40 hover:bg-slate-50"
            )}
          >
            <Icon className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black leading-tight">{label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{desc}</p>
            </div>
          </button>
        ))}
      </div>
      
      {current === "redirect" && (
        <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">URL Chuyển hướng</p>
          <input
            type="url"
            value={value.redirect_url || ""}
            onChange={e => onChange({ ...value, redirect_url: e.target.value })}
            placeholder="https://example.com/thanks"
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
          />
        </div>
      )}

      {current === "download" && (
        <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">File tải về</p>
          <MediaPicker
            onSelect={url => onChange({ ...value, download_url: url })}
            trigger={
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 h-10 px-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 text-primary text-xs font-bold hover:bg-primary/10 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                {value.download_url ? "Đổi file" : "Chọn file từ Thư viện"}
              </button>
            }
          />
        </div>
      )}

      {current === "popup" && (
        <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chọn Popup hiển thị</p>
          <select
            value={value.popup_id || ""}
            onChange={e => onChange({ ...value, popup_id: e.target.value })}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm bg-white"
          >
            <option value="">-- Chọn Popup --</option>
            {popups.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
