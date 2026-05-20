"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Save, Settings, Globe, BarChart3,
  Image as ImageIcon, Code2, AlertCircle,
  Link as LinkIcon, Briefcase, FileSearch
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { toast } from "sonner";

export default function GeneralSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'general' | 'tracking' | 'mcp'>('general');

  const [formData, setFormData] = useState({
    site_name: "",
    site_description: "",
    site_category: "",
    company_name: "",
    logo_url: "",
    logo_dark_url: "",
    favicon_url: "",
    favicon_dark_url: "",
    social_image_url: "",
    mcp_enabled: false,
    mcp_token: "",
    tracking_config: {
      custom_js: "",
      google_ads_id: "",
      facebook_pixel_id: "",
      google_analytics_id: ""
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase.from("site_settings").select("*").single();
      if (data) {
        setSettings(data);
        setFormData({
          site_name: data.site_name || "",
          site_description: data.site_description || "",
          site_category: data.site_category || "",
          company_name: data.company_name || "",
          logo_url: data.logo_url || "",
          logo_dark_url: data.logo_dark_url || "",
          favicon_url: data.favicon_url || "",
          favicon_dark_url: data.favicon_dark_url || "",
          social_image_url: data.social_image_url || "",
          mcp_enabled: data.mcp_enabled || false,
          mcp_token: data.mcp_token || "",
          tracking_config: {
            custom_js: data.tracking_config?.custom_js || "",
            google_ads_id: data.tracking_config?.google_ads_id || "",
            facebook_pixel_id: data.tracking_config?.facebook_pixel_id || "",
            google_analytics_id: data.tracking_config?.google_analytics_id || ""
          }
        });
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          site_name: formData.site_name,
          site_description: formData.site_description,
          site_category: formData.site_category,
          company_name: formData.company_name,
          logo_url: formData.logo_url,
          logo_dark_url: formData.logo_dark_url,
          favicon_url: formData.favicon_url,
          favicon_dark_url: formData.favicon_dark_url,
          social_image_url: formData.social_image_url,
          mcp_enabled: formData.mcp_enabled,
          mcp_token: formData.mcp_token,
          tracking_config: formData.tracking_config
        })
        .eq("id", settings.id);

      if (error) throw error;
      toast.success("Cấu hình đã được lưu thành công!");
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Lỗi khi lưu cấu hình.");
    } finally {
      setSaving(false);
    }
  }

  const updateTracking = (key: string, value: string) => {
    setFormData({
      ...formData,
      tracking_config: {
        ...formData.tracking_config,
        [key]: value
      }
    });
  };

  const generateNewToken = () => {
    const randomBytes = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const token = `smax_mcp_${randomBytes}`;
    setFormData((prev) => ({ ...prev, mcp_token: token }));
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Cài đặt hệ thống
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Quản lý thông tin cơ bản và mã theo dõi cho website của bạn.</p>
        </div>
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
        >
          {saving ? "Đang lưu..." : <><Save className="w-4 h-4" /> Lưu thay đổi</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Navigation */}
        <div className="lg:col-span-3 space-y-2">
          <button
            onClick={() => setActiveSection('general')}
            className={cn(
              "w-full flex items-center space-x-3 px-5 py-4 rounded-2xl font-bold transition-all",
              activeSection === 'general' ? "bg-white text-primary shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <Globe className="w-5 h-5" />
            <span>Thông tin chung</span>
          </button>
          <button
            onClick={() => setActiveSection('tracking')}
            className={cn(
              "w-full flex items-center space-x-3 px-5 py-4 rounded-2xl font-bold transition-all",
              activeSection === 'tracking' ? "bg-white text-primary shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Mã theo dõi & SEO</span>
          </button>
          <button
            onClick={() => setActiveSection('mcp')}
            className={cn(
              "w-full flex items-center space-x-3 px-5 py-4 rounded-2xl font-bold transition-all",
              activeSection === 'mcp' ? "bg-white text-primary shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <Code2 className="w-5 h-5" />
            <span>MCP Co-pilot</span>
          </button>

          <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Lưu ý</span>
            </div>
            <p className="text-[11px] text-blue-700/70 leading-relaxed font-medium">
              Các thay đổi sẽ được áp dụng ngay lập tức cho toàn bộ người dùng truy cập website. Hãy kiểm tra kỹ thông tin trước khi lưu.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <Card className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden ring-1 ring-slate-100">
            <CardContent className="p-8">
              {activeSection === 'general' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tên Website</label>
                      <Input
                        value={formData.site_name}
                        onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                        placeholder="Ví dụ: Smax AI"
                        className="h-12 px-4 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Danh mục web</label>
                      <Input
                        value={formData.site_category}
                        onChange={(e) => setFormData({ ...formData, site_category: e.target.value })}
                        placeholder="Ví dụ: AI Platform, SaaS..."
                        className="h-12 px-4 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tên công ty / Thương hiệu</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        placeholder="Ví dụ: Công ty TNHH Smax AI"
                        className="h-12 pl-12 pr-4 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mô tả website (SEO)</label>
                    <div className="relative">
                      <FileSearch className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                      <textarea
                        value={formData.site_description}
                        onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                        rows={3}
                        placeholder="Mô tả ngắn gọn về website của bạn..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium text-sm outline-none focus:ring-2 focus:ring-primary/5 min-h-[100px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Logo Website (Light)</label>
                      <div className="flex items-center gap-6 p-4 rounded-3xl bg-slate-50/50 border border-dashed border-slate-200">
                        <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                          {formData.logo_url ? (
                            <img src={formData.logo_url} alt="Logo Light" className="w-full h-full object-contain p-2" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-slate-200" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <MediaPicker onSelect={(url) => setFormData({ ...formData, logo_url: url })} />
                          <p className="text-[10px] text-slate-400 font-medium leading-tight">Dùng cho Header sáng màu.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Logo Website (Dark)</label>
                      <div className="flex items-center gap-6 p-4 rounded-3xl bg-slate-900 border border-dashed border-slate-700">
                        <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                          {formData.logo_dark_url ? (
                            <img src={formData.logo_dark_url} alt="Logo Dark" className="w-full h-full object-contain p-2" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-slate-600" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <MediaPicker onSelect={(url) => setFormData({ ...formData, logo_dark_url: url })} />
                          <p className="text-[10px] text-slate-500 font-medium leading-tight">Dùng cho Header tối màu.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Favicon (Light)</label>
                      <div className="flex items-center gap-6 p-4 rounded-3xl bg-slate-50/50 border border-dashed border-slate-200">
                        <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                          {formData.favicon_url ? (
                            <img src={formData.favicon_url} alt="Favicon Light" className="w-10 h-10 object-contain" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-slate-200" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <MediaPicker onSelect={(url) => setFormData({ ...formData, favicon_url: url })} />
                          <p className="text-[10px] text-slate-400 font-medium leading-tight">Khuyên dùng: ICO hoặc PNG (32x32px).</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Favicon (Dark)</label>
                      <div className="flex items-center gap-6 p-4 rounded-3xl bg-slate-900 border border-dashed border-slate-700">
                        <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                          {formData.favicon_dark_url ? (
                            <img src={formData.favicon_dark_url} alt="Favicon Dark" className="w-10 h-10 object-contain" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-slate-600" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <MediaPicker onSelect={(url) => setFormData({ ...formData, favicon_dark_url: url })} />
                          <p className="text-[10px] text-slate-500 font-medium leading-tight">Hiển thị khi trình duyệt ở chế độ tối.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
                    <div className="space-y-4 md:col-span-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ảnh chia sẻ (Social Share Image / OpenGraph)</label>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-3xl bg-slate-50/50 border border-dashed border-slate-200">
                        <div className="w-full md:w-60 h-32 rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative">
                          {formData.social_image_url ? (
                            <img src={formData.social_image_url} alt="Social Share Image" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-12 h-12 text-slate-200" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <MediaPicker onSelect={(url) => setFormData({ ...formData, social_image_url: url })} />
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Ảnh này sẽ hiển thị khi bạn chia sẻ liên kết website lên các mạng xã hội (Facebook, Zalo, Twitter, LinkedIn...).
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            Kích thước khuyên dùng: 1200x630px (tỷ lệ 1.91:1) để hiển thị tối ưu nhất. Định dạng JPG, PNG.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'tracking' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Google Analytics 4 ID</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">G-</div>
                        <Input
                          value={formData.tracking_config.google_analytics_id.replace(/^G-/, '')}
                          onChange={(e) => updateTracking('google_analytics_id', `G-${e.target.value}`)}
                          placeholder="XXXXXXXXXX"
                          className="h-12 pl-12 pr-4 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium ml-1">Mã định danh Measurement ID (Native Support).</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Google Ads ID</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">AW-</div>
                        <Input
                          value={formData.tracking_config.google_ads_id.replace(/^AW-/, '')}
                          onChange={(e) => updateTracking('google_ads_id', `AW-${e.target.value}`)}
                          placeholder="XXXXXXXXXX"
                          className="h-12 pl-12 pr-4 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Facebook Pixel ID</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          value={formData.tracking_config.facebook_pixel_id}
                          onChange={(e) => updateTracking('facebook_pixel_id', e.target.value)}
                          placeholder="123456789012345"
                          className="h-12 pl-12 pr-4 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Code2 className="w-3 h-3" /> Custom Global Script
                    </label>
                    <textarea
                      value={formData.tracking_config.custom_js}
                      onChange={(e) => updateTracking('custom_js', e.target.value)}
                      rows={6}
                      placeholder={`<script>\n  console.log('Smax AI loaded');\n</script>`}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-900 text-slate-300 font-mono text-xs focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                    <p className="text-[10px] text-slate-400 font-medium ml-1 italic">Mã Script này sẽ được chèn vào thẻ &lt;head&gt; của tất cả các trang.</p>
                  </div>
                </div>
              )}

              {activeSection === 'mcp' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight">Cấu hình Model Context Protocol (MCP)</h2>
                    <p className="text-slate-400 text-xs mt-1">Expose website data as a remote MCP server so you can query/manage marketing pages, blogs, and forms directly from external AI CLIs (Claude Desktop, Antigravity CLI, etc.).</p>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-3xl">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-slate-700">Kích hoạt kết nối MCP</div>
                      <p className="text-xs text-slate-400">Cho phép các yêu cầu truy cập bên ngoài qua giao thức Server-Sent Events (SSE).</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.mcp_enabled}
                        onChange={(e) => setFormData({ ...formData, mcp_enabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {formData.mcp_enabled && (
                    <div className="space-y-6 pt-2">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">MCP Access Token (API Key)</label>
                        <div className="flex gap-3">
                          <Input
                            value={formData.mcp_token}
                            readOnly
                            placeholder="Chưa có token, vui lòng tạo mới"
                            className="h-12 px-4 rounded-2xl border-slate-100 bg-slate-100/50 transition-all font-medium font-mono text-sm"
                          />
                          <Button
                            type="button"
                            onClick={generateNewToken}
                            className="bg-slate-800 hover:bg-slate-700 text-white rounded-2xl h-12 px-5 font-bold text-xs shrink-0"
                          >
                            Tạo Token mới
                          </Button>
                        </div>
                      </div>

                      {formData.mcp_token && (
                        <>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Đường dẫn kết nối (SSE Endpoint URL)</label>
                            <div className="relative">
                              <Input
                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/mcp/sse?token=${formData.mcp_token}`}
                                readOnly
                                className="h-12 pl-4 pr-24 rounded-2xl border-slate-100 bg-slate-50 font-medium font-mono text-xs"
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(`${window.location.origin}/api/mcp/sse?token=${formData.mcp_token}`);
                                  toast.success("Đã sao chép đường dẫn kết nối!");
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl h-8 px-3 text-[10px] font-bold"
                              >
                                Sao chép
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Cấu hình Claude Desktop / Antigravity / Cline (mcp_config.json)</label>
                            <div className="relative">
                              <textarea
                                readOnly
                                value={JSON.stringify({
                                  mcpServers: {
                                    "smax-ai-copilot": {
                                      command: "npx",
                                      args: [
                                        "-y",
                                        "@modelcontextprotocol/client-sse",
                                        `${typeof window !== 'undefined' ? window.location.origin : ''}/api/mcp/sse?token=${formData.mcp_token}`
                                      ]
                                    }
                                  }
                                }, null, 2)}
                                rows={8}
                                className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-900 text-slate-300 font-mono text-xs focus:ring-0 outline-none"
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(JSON.stringify({
                                    mcpServers: {
                                      "smax-ai-copilot": {
                                        command: "npx",
                                        args: [
                                          "-y",
                                          "@modelcontextprotocol/client-sse",
                                          `${window.location.origin}/api/mcp/sse?token=${formData.mcp_token}`
                                        ]
                                      }
                                    }
                                  }, null, 2));
                                  toast.success("Đã sao chép cấu hình!");
                                }}
                                className="absolute right-4 top-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl h-8 px-3 text-[10px] font-bold"
                              >
                                Sao chép JSON
                              </Button>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium ml-1">Dán cấu hình trên vào danh sách mcpServers trong file cấu hình Claude Desktop, Antigravity, hoặc Cline để AI CLI gọi các tools chỉnh sửa trực tiếp.</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
