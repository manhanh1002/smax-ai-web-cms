"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { generateAISchema } from "@/lib/cms/ai-schema-generator";
import { Button } from "@/components/ui/Button";

interface Message {
  role: "user" | "assistant";
  content: string;
  outline?: string;
  suggestion?: string;
  questions?: string[];
}

const MODES = [
  { id: "page", label: "Landing Page", icon: "📄", desc: "AI kiến trúc cấu trúc, bố cục và viết toàn bộ nội dung khối trang." },
  { id: "blog", label: "Bài viết Blog", icon: "✍️", desc: "AI viết bài viết chất lượng cao định dạng chuẩn SEO và chèn ảnh Unsplash." },
  { id: "form", label: "Form thu thập Lead", icon: "📋", desc: "AI sinh cấu trúc Form (text, email, số điện thoại...) tăng chuyển đổi." },
  { id: "popup", label: "Popup tiếp thị", icon: "💬", desc: "AI sinh popup chào mừng, giảm giá, cấu hình điều kiện hiển thị tự động." }
] as const;

type Mode = typeof MODES[number]["id"];

export default function AIBuilderPage() {
  const [activeMode, setActiveMode] = useState<Mode>("page");
  const [inputPrompt, setInputPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Xin chào! Tôi là trợ lý thiết kế Smax AI. Hãy chọn loại tài sản bạn muốn tạo ở danh mục trên, sau đó mô tả ý tưởng sơ bộ. Chúng ta sẽ thảo luận để lên cấu trúc tốt nhất trước khi bắt đầu viết nhé!"
    }
  ]);
  const [isDiscussing, setIsDiscussing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [status, setStatus] = useState<any>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isDiscussing]);

  // Listen to realtime status from Supabase
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`ai_status_${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ai_generation_status",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setStatus((prev: any) => ({ ...prev, ...payload.new }));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ai_generation_status",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setStatus((prev: any) => ({ ...prev, ...payload.new }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const handleDiscuss = async (overridePrompt?: string) => {
    const promptToSend = overridePrompt || inputPrompt;
    if (!promptToSend.trim()) return;

    setIsDiscussing(true);
    setInputPrompt("");

    // Append user message
    const userMsg: Message = { role: "user", content: promptToSend };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch("/api/ai/build-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "discuss",
          type: activeMode,
          prompt: promptToSend,
          messages: [...messages, userMsg].slice(-6) // Send recent history context
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Không thể thảo luận ý tưởng.");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Tôi đã phân tích ý tưởng của bạn và phác thảo cấu trúc đề xuất như sau:",
          outline: data.outline,
          suggestion: data.suggestion,
          questions: data.questions
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Có lỗi xảy ra trong cuộc thảo luận: ${err.message}`
        }
      ]);
    } finally {
      setIsDiscussing(false);
    }
  };

  const handleGenerate = async () => {
    // Find the latest user prompt or compile from history
    const lastUserPrompt = [...messages].reverse().find(m => m.role === "user")?.content || inputPrompt;
    if (!lastUserPrompt) return;

    setIsGenerating(true);
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    setStatus({ current_step: "Đang bắt đầu liên kết với trợ lý...", progress: 0 });

    try {
      const blockSchema = generateAISchema();

      const response = await fetch("/api/ai/build-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          type: activeMode,
          session_id: newSessionId,
          prompt: lastUserPrompt,
          block_schema: blockSchema
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gặp sự cố khi khởi tạo.");
      }

      setStatus((prev: any) => ({
        ...prev,
        current_step: "Khởi tạo thành công!",
        progress: 100,
        completed: true,
        entityId: data.id,
        entityType: data.type
      }));

    } catch (err: any) {
      console.error(err);
      setStatus({ current_step: `Lỗi: ${err.message}`, progress: 0, error: true });
    } finally {
      setIsGenerating(false);
    }
  };

  const getRedirectUrl = () => {
    if (!status || !status.entityId) return "#";
    const type = status.entityType || "page";
    if (type === "blog") return `/admin/blog/${status.entityId}`;
    if (type === "form") return `/admin/forms/${status.entityId}`;
    if (type === "popup") return `/admin/popups/${status.entityId}`;
    return `/admin/pages/${status.entityId}`;
  };

  const renderMarkdown = (text?: string) => {
    if (!text) return null;
    return text.split("\n").map((line, index) => {
      if (line.startsWith("### ")) {
        return <h4 key={index} className="text-sm font-bold text-slate-800 mt-3 mb-1">{line.replace("### ", "")}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={index} className="text-base font-bold text-slate-800 mt-4 mb-2">{line.replace("## ", "")}</h3>;
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return <li key={index} className="text-xs text-slate-600 ml-4 list-disc my-0.5">{line.substring(2)}</li>;
      }
      return <p key={index} className="text-xs text-slate-600 my-1">{line}</p>;
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Title Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tight text-slate-800 bg-gradient-to-r from-indigo-500 via-purple-500 to-[#fa6e5b] bg-clip-text text-transparent mb-2">
          ✨ Smax AI Multipurpose Co-pilot
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-sm">
          Thảo luận cùng trợ lý AI để thiết kế, lập bố cục và viết nội dung tối ưu cho Landing Page, Blog, Form hoặc Popup.
        </p>
      </div>

      {/* Mode Selectors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {MODES.map((m) => {
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                if (isGenerating) return;
                setActiveMode(m.id);
                setMessages([
                  {
                    role: "assistant",
                    content: `Tôi đã chuyển sang thiết kế ${m.label}. Hãy mô tả ý tưởng của bạn cho ${m.label} này để bắt đầu cuộc trò chuyện nhé!`
                  }
                ]);
              }}
              disabled={isGenerating}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 group ${
                isActive
                  ? "bg-white border-purple-500 shadow-md ring-2 ring-purple-100"
                  : "bg-slate-50 hover:bg-white border-slate-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">{m.icon}</span>
                <span className={`font-bold text-sm ${isActive ? "text-purple-700" : "text-slate-700 group-hover:text-slate-900"}`}>
                  {m.label}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{m.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: AI Assistant Chat */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[600px] overflow-hidden">
          {/* Chat header */}
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <div className="text-sm font-bold text-slate-700">Trợ lý Thiết kế Smax AI</div>
          </div>

          {/* Chat Message Scroll */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-slate-50 text-slate-800 border border-slate-100"
                  }`}
                >
                  <p className="whitespace-pre-line font-medium text-[13px]">{m.content}</p>

                  {/* Recommendations Outline card */}
                  {m.outline && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-purple-600 mb-2">
                        📋 Cấu trúc đề xuất
                      </div>
                      <div className="space-y-1">{renderMarkdown(m.outline)}</div>
                    </div>
                  )}

                  {/* Recommendation Suggestions */}
                  {m.suggestion && (
                    <div className="mt-2.5 p-3 bg-indigo-50/40 rounded-xl border border-indigo-100/50">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 mb-1">
                        💡 Ý tưởng & Tone giọng
                      </div>
                      <p className="text-xs text-slate-600 leading-normal">{m.suggestion}</p>
                    </div>
                  )}

                  {/* Custom Questions to refine */}
                  {m.questions && m.questions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-[11px] font-extrabold text-slate-500">Gợi ý tinh chỉnh nhanh:</div>
                      <div className="flex flex-col gap-1.5">
                        {m.questions.map((q, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => handleDiscuss(q)}
                            disabled={isDiscussing || isGenerating}
                            className="text-left text-xs bg-white text-slate-600 border border-slate-200 hover:border-purple-400 p-2 rounded-lg transition-colors font-medium hover:text-purple-600"
                          >
                            👉 {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isDiscussing && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Trợ lý đang phân tích ý tưởng...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat input box */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-end gap-2.5">
            <textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={`Mô tả ý tưởng của bạn cho ${MODES.find(m => m.id === activeMode)?.label}...`}
              rows={2}
              className="flex-1 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm resize-none"
              disabled={isDiscussing || isGenerating}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleDiscuss();
                }
              }}
            />
            <Button
              onClick={() => handleDiscuss()}
              disabled={isDiscussing || isGenerating || !inputPrompt.trim()}
              className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
            >
              Gửi
            </Button>
          </div>
        </div>

        {/* Right Column: Generation Status Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              🚀 Trình tạo thông minh
            </h3>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400">LOẠI TÀI SẢN</div>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-purple-50/50 rounded-xl text-purple-700 border border-purple-100">
                <span className="text-xl">{MODES.find((m) => m.id === activeMode)?.icon}</span>
                <span className="font-bold text-sm">{MODES.find((m) => m.id === activeMode)?.label}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 leading-relaxed">
              <strong>Hướng dẫn:</strong> Bắt đầu bằng cách nhập ý tưởng sơ khai vào chat bên trái để thảo luận và chốt cấu trúc. 
              Khi bạn cảm thấy ưng ý, hãy nhấn nút <strong>"Chốt ý tưởng & Khởi tạo"</strong> để kích hoạt AI tiến hành lắp ráp và xuất bản.
            </div>

            {/* Confirm & Build Button */}
            <Button
              onClick={handleGenerate}
              disabled={isDiscussing || isGenerating || messages.length < 2}
              className="w-full rounded-xl gap-2 font-bold shadow-lg shadow-primary/20"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang khởi tạo...
                </>
              ) : (
                "🎯 Chốt ý tưởng & Khởi tạo"
              )}
            </Button>
          </div>

          {/* Realtime progress card */}
          {status && (
            <div className="mt-6 bg-slate-900 text-white rounded-3xl p-6 shadow-lg border border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span>TIẾN TRÌNH THỰC THI</span>
                <span className="text-green-400">{status.progress}%</span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-[#fa6e5b] h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${status.progress}%` }}
                />
              </div>

              <div className="text-sm font-semibold text-slate-200">
                {status.current_step}
              </div>

              {status.completed && (
                <div className="pt-2 text-center">
                  <a
                    href={getRedirectUrl()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-500 text-slate-950 text-xs font-black rounded-xl hover:bg-green-400 transition-colors shadow-sm"
                  >
                    Xem sản phẩm vừa tạo ⚡
                  </a>
                </div>
              )}

              {status.error && (
                <div className="text-red-400 text-xs font-semibold pt-1">
                  ❌ Có lỗi trong quá trình khởi tạo. Hãy thử lại.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
