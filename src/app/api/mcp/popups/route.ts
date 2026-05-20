import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── MCP Tool Schema ──────────────────────────────────────────
export const POPUPS_TOOLS = [
  {
    name: "list_popups",
    description: "Lấy danh sách tất cả popups, bao gồm thống kê lượt xem và chuyển đổi.",
    inputSchema: {
      type: "object",
      properties: {
        active_only: { type: "boolean", description: "Chỉ lấy popup đang bật" },
        limit: { type: "number", description: "Giới hạn số kết quả (mặc định 20)" },
      },
    },
  },
  {
    name: "get_popup",
    description: "Đọc chi tiết đầy đủ một popup gồm content, conditions và settings.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "UUID của popup" },
      },
    },
  },
  {
    name: "create_popup",
    description: "Tạo một popup mới. Hỗ trợ loại: modal, slide-in, bar. Layout: 1col hoặc 2col.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", description: "Tên popup (hiển thị trong admin)" },
        type: { type: "string", enum: ["modal", "slide-in", "bar"], description: "Loại popup" },
        position: {
          type: "string",
          enum: ["center", "top-left", "top-right", "bottom-left", "bottom-right", "top-bar", "bottom-bar"],
        },
        content: {
          type: "object",
          description: "{ layout: '1col'|'2col', cols: [{ type: 'form'|'image'|'pricing_deal'|'text', ...data }] }",
        },
        conditions: {
          type: "object",
          description: "{ trigger: 'time_delay'|'scroll_depth'|'exit_intent'|'on_load', delay_seconds, scroll_percent, page_target: 'all'|'home'|'specific', page_urls: [], devices: ['desktop','mobile'], frequency: 'once_per_session'|'once_per_day'|'always'|'once_ever' }",
        },
        settings: {
          type: "object",
          description: "{ theme: { primary_color, bg_color }, animation: 'fade'|'slide-up'|'zoom', backdrop, show_close, width: 'sm'|'md'|'lg'|'xl' }",
        },
      },
    },
  },
  {
    name: "update_popup",
    description: "Cập nhật nội dung, điều kiện hoặc cài đặt giao diện của popup.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        type: { type: "string" },
        position: { type: "string" },
        content: { type: "object" },
        conditions: { type: "object" },
        settings: { type: "object" },
      },
    },
  },
  {
    name: "toggle_popup",
    description: "Bật hoặc tắt một popup.",
    inputSchema: {
      type: "object",
      required: ["id", "is_active"],
      properties: {
        id: { type: "string", description: "UUID của popup" },
        is_active: { type: "boolean", description: "true = bật, false = tắt" },
      },
    },
  },
  {
    name: "delete_popup",
    description: "Xóa một popup và toàn bộ events liên quan.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
      },
    },
  },
  {
    name: "get_popup_stats",
    description: "Lấy thống kê chi tiết về hiệu quả của một popup (views, conversions, CVR theo ngày).",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "UUID của popup" },
        days: { type: "number", description: "Số ngày gần đây (mặc định 30)" },
      },
    },
  },
];

// ─── GET: Tool discovery ──────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    module: "popups",
    version: "1.0.0",
    description: "MCP tools để quản lý Popup Builder trong Smax AI CMS",
    tools: POPUPS_TOOLS,
  });
}

// ─── POST: Execute tool ───────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, ...params } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Thiếu 'action'. GET /api/mcp/popups để xem danh sách tools." },
        { status: 400 }
      );
    }

    // ── list_popups ───────────────────────────────────────────
    if (action === "list_popups") {
      let query = supabase
        .from("popups")
        .select("id, name, type, position, is_active, views_count, conversions_count, created_at, updated_at")
        .order("created_at", { ascending: false })
        .limit(params.limit || 20);

      if (params.active_only) {
        query = query.eq("is_active", true);
      }

      const { data, error } = await query;
      if (error) throw error;

      const enriched = (data || []).map((p) => ({
        ...p,
        cvr: p.views_count > 0 ? ((p.conversions_count / p.views_count) * 100).toFixed(1) + "%" : "0%",
        admin_url: `/admin/popups/${p.id}`,
      }));

      return NextResponse.json({ success: true, count: enriched.length, popups: enriched });
    }

    // ── get_popup ─────────────────────────────────────────────
    if (action === "get_popup") {
      if (!params.id) return NextResponse.json({ error: "Thiếu 'id'" }, { status: 400 });

      const { data, error } = await supabase
        .from("popups")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        popup: {
          ...data,
          cvr: data.views_count > 0 ? ((data.conversions_count / data.views_count) * 100).toFixed(1) + "%" : "0%",
          admin_url: `/admin/popups/${data.id}`,
        },
      });
    }

    // ── create_popup ──────────────────────────────────────────
    if (action === "create_popup") {
      if (!params.name) return NextResponse.json({ error: "Thiếu 'name'" }, { status: 400 });

      const payload = {
        name: params.name,
        type: params.type || "modal",
        position: params.position || "center",
        is_active: false,
        content: params.content || {
          layout: "1col",
          cols: [{ type: "form", form_id: null, heading: "Đăng ký ngay", subheading: "" }],
        },
        conditions: params.conditions || {
          trigger: "time_delay",
          delay_seconds: 5,
          scroll_percent: 50,
          page_target: "all",
          page_urls: [],
          devices: ["desktop", "mobile"],
          frequency: "once_per_session",
          show_after_convert: false,
        },
        settings: params.settings || {
          theme: { primary_color: "#3b82f6", bg_color: "#ffffff" },
          animation: "fade",
          backdrop: true,
          show_close: true,
          width: "md",
        },
      };

      const { data, error } = await supabase.from("popups").insert(payload).select().single();
      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Đã tạo popup "${params.name}". Popup đang TẮT - bật bằng toggle_popup khi sẵn sàng.`,
        popup: data,
        admin_url: `/admin/popups/${data.id}`,
      });
    }

    // ── update_popup ──────────────────────────────────────────
    if (action === "update_popup") {
      if (!params.id) return NextResponse.json({ error: "Thiếu 'id'" }, { status: 400 });

      const updates: Record<string, any> = {};
      for (const key of ["name", "type", "position", "content", "conditions", "settings"]) {
        if (params[key] !== undefined) updates[key] = params[key];
      }

      if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: "Không có trường nào để cập nhật." }, { status: 400 });
      }

      const { data, error } = await supabase
        .from("popups")
        .update(updates)
        .eq("id", params.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, message: "Cập nhật popup thành công.", popup: data });
    }

    // ── toggle_popup ──────────────────────────────────────────
    if (action === "toggle_popup") {
      if (!params.id || params.is_active === undefined) {
        return NextResponse.json({ error: "Thiếu 'id' hoặc 'is_active'" }, { status: 400 });
      }

      const { data, error } = await supabase
        .from("popups")
        .update({ is_active: params.is_active })
        .eq("id", params.id)
        .select("id, name, is_active")
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Popup "${data.name}" đã được ${params.is_active ? "BẬT" : "TẮT"}.`,
        popup: data,
      });
    }

    // ── delete_popup ──────────────────────────────────────────
    if (action === "delete_popup") {
      if (!params.id) return NextResponse.json({ error: "Thiếu 'id'" }, { status: 400 });

      const { error } = await supabase.from("popups").delete().eq("id", params.id);
      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Đã xóa popup ${params.id} và toàn bộ dữ liệu liên quan.`,
      });
    }

    // ── get_popup_stats ───────────────────────────────────────
    if (action === "get_popup_stats") {
      if (!params.id) return NextResponse.json({ error: "Thiếu 'id'" }, { status: 400 });

      const days = params.days || 30;
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      const [popupRes, eventsRes] = await Promise.all([
        supabase.from("popups").select("id, name, views_count, conversions_count").eq("id", params.id).single(),
        supabase
          .from("popup_events")
          .select("event_type, created_at")
          .eq("popup_id", params.id)
          .gte("created_at", since),
      ]);

      if (popupRes.error) throw popupRes.error;

      const popup = popupRes.data;
      const events = eventsRes.data || [];

      // Group by date
      const byDate: Record<string, { views: number; closes: number; converts: number }> = {};
      for (const e of events) {
        const date = e.created_at.substring(0, 10);
        if (!byDate[date]) byDate[date] = { views: 0, closes: 0, converts: 0 };
        if (e.event_type === "view") byDate[date].views++;
        if (e.event_type === "close") byDate[date].closes++;
        if (e.event_type === "convert") byDate[date].converts++;
      }

      const totalViews = popup.views_count || 0;
      const totalConversions = popup.conversions_count || 0;

      return NextResponse.json({
        success: true,
        popup: {
          id: popup.id,
          name: popup.name,
        },
        summary: {
          total_views: totalViews,
          total_conversions: totalConversions,
          cvr: totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(2) + "%" : "0%",
          period_days: days,
          events_in_period: events.length,
        },
        daily_breakdown: Object.entries(byDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, stats]) => ({ date, ...stats })),
      });
    }

    // ── Unknown action ────────────────────────────────────────
    return NextResponse.json(
      {
        error: `Action "${action}" không hợp lệ.`,
        available_actions: POPUPS_TOOLS.map((t) => t.name),
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[MCP Popups Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
