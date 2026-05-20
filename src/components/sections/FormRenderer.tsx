"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, ChevronRight, ChevronLeft, AlertCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { normalizeFieldId } from "@/components/cms/FormBuilderEditor";
import { toast } from "sonner";

interface FormRendererProps {
  formId?: string;
  previewData?: any;
  className?: string;
  onSuccess?: () => void;
}

export function FormRenderer({ formId, previewData, className, onSuccess }: FormRendererProps) {
  const getFieldKey = (field: any) => {
    return field.fieldId || normalizeFieldId(field.label) || field.id;
  };

  const [form, setForm] = useState<any>(previewData || null);
  const [loading, setLoading] = useState(!previewData);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (previewData) {
      setForm(previewData);
      initializeData(previewData);
      setLoading(false);
      return;
    }

    async function fetchForm() {
      const { data, error } = await supabase
        .from("forms")
        .select("*")
        .eq("id", formId)
        .single();
      
      if (data) {
        setForm(data);
        initializeData(data);
      }
      setLoading(false);
    }
    if (formId) fetchForm();
  }, [formId, previewData]);

  const initializeData = (formDataObj: any) => {
    const steps = formDataObj.steps || (formDataObj.previewData?.steps) || [];
    const initialData: Record<string, any> = {};
    const urlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");

    steps.forEach((step: any) => {
      step.fields?.forEach((field: any) => {
        const key = getFieldKey(field);
        let val = field.defaultValue || "";

        // If defaultValue is a query param placeholder like "?source"
        if (val.startsWith("?")) {
          const paramName = val.substring(1);
          val = urlParams.get(paramName) || "";
        } 
        // Fallback: search URL by fieldId or id if no static default value or query placeholder matched
        else if (!val) {
          val = urlParams.get(key) || urlParams.get(field.id) || "";
        }

        if (val) initialData[key] = val;
      });
    });
    setFormData(initialData);
  };

  const isFieldVisible = (field: any) => {
    if (!field.logic || !field.logic.enabled) return true;
    
    const { dependsOnId, operator, value } = field.logic;
    const depValue = formData[dependsOnId];

    switch (operator) {
      case "equals":
        return String(depValue) === String(value);
      case "not_equals":
        return String(depValue) !== String(value);
      case "contains":
        return String(depValue).toLowerCase().includes(String(value).toLowerCase());
      case "filled":
        return !!depValue;
      default:
        return true;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Đang tải form...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="p-8 border-2 border-dashed border-red-100 rounded-3xl text-center">
        <AlertCircle className="w-10 h-10 text-red-300 mx-auto mb-3" />
        <p className="text-sm font-bold text-red-400 uppercase tracking-widest">Không tìm thấy Form (ID: {formId})</p>
      </div>
    );
  }

  const steps = form.steps || [];
  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isMultiStep = form.settings?.type === "multistep" && steps.length > 1;

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (!currentStepData?.fields) return true;
    currentStepData.fields.forEach((field: any) => {
      const key = getFieldKey(field);
      const isVisible = isFieldVisible(field);
      const value = formData[key];

      if (!isVisible || field.hidden) return;

      // Required check
      const isEmpty = !value || (Array.isArray(value) && value.length === 0);
      if (field.required && isEmpty) {
        newErrors[key] = `${field.label} là bắt buộc`;
      } 
      // Phone validation
      else if (field.type === "phone" && value) {
        const cleanPhone = value.replace(/\D/g, "");
        const isVN = value.startsWith("+84");
        const phoneRegex = isVN ? /^84[3|5|7|8|9][0-9]{8}$/ : /^0[3|5|7|8|9][0-9]{8}$/;
        
        if (isVN) {
          if (!/^84[3|5|7|8|9][0-9]{8}$/.test(cleanPhone)) {
            newErrors[key] = "Số điện thoại +84 không hợp lệ";
          }
        } else {
          if (!/^0[3|5|7|8|9][0-9]{8}$/.test(cleanPhone)) {
            newErrors[key] = "Số điện thoại không hợp lệ (ví dụ: 0987654321)";
          }
        }
      }
      // Email validation
      else if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[key] = "Email không hợp lệ (ví dụ: name@company.com)";
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/vi/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_id: formId,
          data: formData,
          page_url: typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        if (onSuccess) onSuccess();

        const action = form.settings?.post_submit_action;
        if (action?.type === "redirect" && action.redirect_url) {
          setTimeout(() => {
            window.location.href = action.redirect_url;
          }, 1500);
        } else if (action?.type === "download" && action.download_url) {
          window.open(action.download_url, "_blank");
        } else if (action?.type === "popup" && action.popup_id) {
          // Open popup logic would go here if integrated with a global popup state
          console.log("Opening popup:", action.popup_id);
        }
      } else {
        toast.error("Có lỗi xảy ra khi gửi form. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12 space-y-6"
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-200/50">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Thành công!</h3>
          <p className="text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
            {form.settings?.success_message || "Cảm ơn bạn đã gửi thông tin. Chúng tôi sẽ phản hồi sớm nhất."}
          </p>
        </div>
        {form.settings?.redirect_url && (
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            Đang chuyển hướng...
          </p>
        )}
      </motion.div>
    );
  }

  const theme = form.settings?.theme || {};

  const radiusValue = (r: string) => {
    if (!r) return undefined;
    if (r === "none") return "0px";
    if (r === "md") return "8px";
    if (r === "xl") return "12px";
    if (r === "2xl") return "16px";
    if (r === "full") return "999px";
    return r.includes("px") ? r : "12px";
  };

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Progress Bar for Multi-step */}
        {isMultiStep && (
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Bước {currentStep + 1} / {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Hoàn tất</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full"
                style={{ 
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                  backgroundColor: theme.primary_color || "var(--primary)" 
                }}
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Step Title & Description */}
        {(currentStepData?.title || currentStepData?.description) && (
          <div className="space-y-1 mb-8">
            {currentStepData.title && (
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">{currentStepData.title}</h4>
            )}
            {currentStepData.description && (
              <p className="text-sm font-medium text-slate-500">{currentStepData.description}</p>
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "grid grid-cols-1 md:grid-cols-2",
              form.settings?.theme?.field_spacing === "compact" ? "gap-x-4 gap-y-3" : 
              form.settings?.theme?.field_spacing === "spacious" ? "gap-x-8 gap-y-7" : "gap-x-6 gap-y-5"
            )}
          >
            {currentStepData?.fields?.map((field: any) => {
              if (field.hidden) return null;
              
              const key = getFieldKey(field);
              const isVisible = isFieldVisible(field);
              const isFull = field.width === "full";

              const appliedRadius = radiusValue(theme.field_radius || theme.border_radius || "xl");
              const fieldStyle = {
                backgroundColor: theme.field_bg_color || "#f8fafc",
                borderColor: theme.field_border_color || "#e2e8f0",
                color: theme.field_text_color || "#1e293b",
                borderRadius: appliedRadius,
              };
              
              return (
                <AnimatePresence key={field.id} mode="popLayout">
                  {isVisible && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={cn("space-y-2 overflow-hidden", isFull ? "md:col-span-2" : "md:col-span-1")}
                    >
                      {/* Label for input fields */}
                      {!["image", "html", "divider", "features"].includes(field.type) && (
                        <label 
                          className={cn(
                            "text-[11px] font-black tracking-widest flex items-center gap-1",
                            theme.label_style === "uppercase" ? "uppercase" : "normal-case"
                          )}
                          style={{ color: theme.label_color || "#64748b" }}
                        >
                          {field.label}
                          {field.required && <span className="text-red-400">*</span>}
                        </label>
                      )}
                      
                      {field.type === "image" ? (
                        <div className="py-2">
                          <img 
                            src={field.imageUrl} 
                            alt={field.altText || field.label} 
                            className="w-full h-auto rounded-2xl object-cover"
                          />
                        </div>
                      ) : field.type === "html" ? (
                        <div 
                          className="prose prose-slate prose-sm max-w-none text-slate-600"
                          dangerouslySetInnerHTML={{ __html: field.content || "" }}
                        />
                      ) : field.type === "divider" ? (
                        <hr className="my-2 border-slate-100" />
                      ) : field.type === "features" ? (
                        <div className="space-y-2 py-2">
                          {field.content?.split("\n").filter(Boolean).map((feat: string, i: number) => (
                            <div key={i} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: theme.primary_color || "var(--primary)" }} />
                              <span className="text-sm text-slate-600 font-medium">{feat}</span>
                            </div>
                          ))}
                        </div>
                      ) : field.type === "textarea" ? (
                        <textarea
                          value={formData[key] || ""}
                          onChange={e => updateField(key, e.target.value)}
                          placeholder={field.placeholder || ""}
                          rows={4}
                          style={fieldStyle}
                          className={cn(
                            "w-full px-4 py-3 border text-sm focus:outline-none focus:ring-4 transition-all resize-none bg-transparent",
                            errors[key] ? "border-red-200 focus:ring-red-50" : "focus:ring-primary/5 focus:border-primary"
                          )}
                        />
                      ) : field.type === "select" ? (
                        <select
                          value={formData[key] || ""}
                          onChange={e => updateField(key, e.target.value)}
                          style={fieldStyle}
                          className={cn(
                            "w-full h-12 px-4 border text-sm focus:outline-none focus:ring-4 transition-all appearance-none cursor-pointer bg-transparent",
                            errors[key] ? "border-red-200 focus:ring-red-50" : "focus:ring-primary/5 focus:border-primary"
                          )}
                        >
                          <option value="">-- Chọn --</option>
                          {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : field.type === "radio" ? (
                        <div className="space-y-2 pt-1">
                          {field.options?.map((opt: string) => (
                            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                              <div className="relative flex items-center justify-center">
                                <input
                                  type="radio"
                                  name={key}
                                  value={opt}
                                  checked={formData[key] === opt}
                                  onChange={() => updateField(key, opt)}
                                  className="sr-only"
                                />
                                <div className={cn(
                                  "w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center",
                                  formData[key] === opt 
                                    ? "border-primary" 
                                    : "border-slate-200 group-hover:border-slate-300"
                                )}
                                style={formData[key] === opt ? { borderColor: theme.primary_color } : {}}
                                >
                                  {formData[key] === opt && (
                                    <div 
                                      className="w-2.5 h-2.5 rounded-full" 
                                      style={{ backgroundColor: theme.primary_color || "var(--primary)" }} 
                                    />
                                  )}
                                </div>
                              </div>
                              <span className="text-sm font-medium text-slate-600">{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : field.type === "checkbox" ? (
                        <div className="space-y-2 pt-1">
                          {field.options?.map((opt: string) => (
                            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                              <div className="relative flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={(formData[key] || []).includes(opt)}
                                  onChange={e => {
                                    const current = formData[key] || [];
                                    const next = e.target.checked 
                                      ? [...current, opt]
                                      : current.filter((i: string) => i !== opt);
                                    updateField(key, next);
                                  }}
                                  className="sr-only"
                                />
                                <div className={cn(
                                  "w-5 h-5 rounded border-2 transition-all flex items-center justify-center",
                                  (formData[key] || []).includes(opt)
                                    ? "border-primary" 
                                    : "border-slate-200 group-hover:border-slate-300"
                                )}
                                style={(formData[key] || []).includes(opt) ? { borderColor: theme.primary_color } : {}}
                                >
                                  {(formData[key] || []).includes(opt) && (
                                    <CheckCircle2 
                                      className="w-3.5 h-3.5" 
                                      style={{ color: theme.primary_color || "var(--primary)" }} 
                                    />
                                  )}
                                </div>
                              </div>
                              <span className="text-sm font-medium text-slate-600">{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : field.type === "rating" ? (
                        <div className="flex items-center gap-2 pt-1">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => updateField(key, val)}
                              className="focus:outline-none group"
                            >
                              <Star 
                                className={cn(
                                  "w-8 h-8 transition-all",
                                  (formData[key] || 0) >= val
                                    ? "fill-current"
                                    : "text-slate-200 group-hover:text-slate-300"
                                )}
                                style={(formData[key] || 0) >= val ? { color: theme.primary_color || "#fbbf24" } : {}}
                              />
                            </button>
                          ))}
                          {formData[key] && (
                            <span className="ml-2 text-sm font-black text-slate-400">{formData[key]}/5</span>
                          )}
                        </div>
                      ) : field.type === "slider" ? (
                        <div className="space-y-4 pt-2">
                          <div className="relative h-2 bg-slate-100 rounded-full">
                            {(() => {
                              const min = field.min ?? 0;
                              const max = field.max ?? 100;
                              const val = formData[key] ?? min;
                              const percent = Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
                              return (
                                <>
                                  <div 
                                    className="absolute inset-y-0 left-0 rounded-full transition-all"
                                    style={{ 
                                      width: `${percent}%`,
                                      backgroundColor: theme.primary_color || "var(--primary)"
                                    }}
                                  />
                                  <input
                                    type="range"
                                    min={min}
                                    max={max}
                                    step={field.step ?? 1}
                                    value={val}
                                    onChange={(e) => updateField(key, parseInt(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                </>
                              );
                            })()}
                          </div>
                          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>{field.min ?? 0}{field.unit}</span>
                            <span className="text-primary" style={{ color: theme.primary_color || "var(--primary)" }}>
                              {formData[key] ?? (field.min ?? 0)}{field.unit || (field.unit === undefined ? "%" : "")}
                            </span>
                            <span>{field.max ?? 100}{field.unit}</span>
                          </div>
                        </div>
                      ) : (
                        <input
                          type={
                            field.type === "phone" ? "tel" : 
                            field.type === "email" ? "email" : 
                            field.type === "date" ? "date" :
                            field.type === "file" ? "file" :
                            "text"
                          }
                          value={field.type === "file" ? undefined : (formData[key] || "")}
                          onChange={e => {
                            if (field.type === "file") {
                              updateField(key, e.target.files?.[0]);
                            } else {
                              updateField(key, e.target.value);
                            }
                          }}
                          placeholder={field.placeholder || ""}
                          style={fieldStyle}
                          className={cn(
                            "w-full h-12 px-4 border text-sm focus:outline-none focus:ring-4 transition-all bg-transparent",
                            field.type === "file" && "py-2 px-1",
                            errors[key] ? "border-red-200 focus:ring-red-50" : "focus:ring-primary/5 focus:border-primary"
                          )}
                        />
                      )}
                      
                      {errors[key] && (
                        <p className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors[key]}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <div 
          className={cn(
            "flex items-center gap-4 pt-4",
            theme.submit_alignment === "left" ? "justify-start" :
            theme.submit_alignment === "right" ? "justify-end" : "justify-center"
          )}
        >
          {isMultiStep && currentStep > 0 && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              className="rounded-2xl h-12 px-6 border-slate-200"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
            </Button>
          )}
          
          {isMultiStep && !isLastStep ? (
            <Button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                nextStep();
              }}
              className={cn(
                "font-black uppercase tracking-widest transition-all shadow-lg",
                (theme.submit_size || "md") === "sm" ? "h-10 px-6 text-[10px]" :
                (theme.submit_size || "md") === "lg" ? "h-16 px-12 text-sm" : "h-14 px-10 text-xs",
                (theme.submit_width || "full") === "full" ? "flex-1" : "w-auto"
              )}
              style={{ 
                borderRadius: radiusValue(theme.submit_radius || theme.border_radius || "xl"),
                backgroundColor: theme.submit_bg_color || theme.primary_color || "var(--primary)"
              }}
            >
              {form.settings?.next_label || "Tiếp tục"} <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={submitting}
              variant={(theme.submit_style || "solid") === "outline" ? "outline" : ((theme.submit_style || "solid") === "soft" ? "ghost" : "primary")}
              className={cn(
                "font-black uppercase tracking-widest transition-all",
                (theme.submit_size || "md") === "sm" ? "h-10 px-6 text-[10px]" :
                (theme.submit_size || "md") === "lg" ? "h-16 px-12 text-sm" : "h-14 px-10 text-xs",
                (theme.submit_width || "full") === "full" ? "flex-1" : "w-auto",
                (theme.submit_style || "solid") === "soft" ? "bg-primary/10 text-primary hover:bg-primary/20 shadow-none" : "shadow-lg"
              )}
              style={{ 
                borderRadius: radiusValue(theme.submit_radius || theme.border_radius || "xl"),
                backgroundColor: (theme.submit_style || "solid") === "solid" ? (theme.submit_bg_color || theme.primary_color) : undefined,
                color: theme.submit_text_color,
                borderColor: (theme.submit_style || "solid") === "outline" ? (theme.submit_bg_color || theme.primary_color) : undefined,
                boxShadow: ((theme.submit_style || "solid") === "solid" && (theme.submit_bg_color || theme.primary_color)) ? `0 10px 15px -3px ${(theme.submit_bg_color || theme.primary_color)}33` : "none"
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Đang gửi...
                </>
              ) : (
                form.settings?.submit_label || "Gửi thông tin"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
