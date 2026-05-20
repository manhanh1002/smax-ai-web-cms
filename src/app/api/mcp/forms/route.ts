import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role to bypass RLS for MCP server calls
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── MCP Tool Schema (for discovery) ─────────────────────────
export const FORMS_TOOLS = [
  {
    name: "list_forms",
    description: "Lấy danh sách tất cả forms trong hệ thống.",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string", description: "Tìm kiếm theo tên form" },
        limit: { type: "number", description: "Giới hạn số kết quả (mặc định 20)" },
      },
    },
  },
  {
    name: "get_form",
    description: "Đọc chi tiết một form bao gồm toàn bộ steps, fields và settings.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "UUID của form" },
      },
    },
  },
  {
    name: "create_form",
    description: "Tạo một form mới với tên và cấu hình ban đầu.",
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", description: "Tên form" },
        description: { type: "string", description: "Mô tả ngắn" },
        settings: {
          type: "object",
          description: "Cài đặt: { type: 'onestep'|'multistep', submit_label, success_message, redirect_url, theme: { primary_color } }",
        },
        steps: {
          type: "array",
          description: "Danh sách các bước, mỗi bước có fields. Field có các type: text, email, phone, textarea, select, radio, checkbox, rating, slider, date, file.",
        },
      },
    },
  },
  {
    name: "update_form",
    description: "Cập nhật nội dung, steps hoặc settings của một form.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "UUID của form cần cập nhật" },
        name: { type: "string" },
        description: { type: "string" },
        settings: { type: "object" },
        steps: { type: "array" },
      },
    },
  },
  {
    name: "delete_form",
    description: "Xóa một form và toàn bộ submissions liên quan.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "UUID của form" },
      },
    },
  },
  {
    name: "list_submissions",
    description: "Đọc danh sách submissions (phản hồi) của một form.",
    inputSchema: {
      type: "object",
      properties: {
        form_id: { type: "string", description: "Lọc theo form ID (tùy chọn)" },
        limit: { type: "number", description: "Giới hạn số kết quả (mặc định 50)" },
        offset: { type: "number", description: "Phân trang (bỏ qua N bản ghi đầu)" },
      },
    },
  },
];

// ─── GET: Tool discovery ──────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    module: "forms",
    version: "1.0.0",
    description: "MCP tools để quản lý Forms và Form Submissions trong Smax AI CMS",
    tools: FORMS_TOOLS,
  });
}

// ─── POST: Execute tool ───────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, ...params } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Thiếu trường 'action'. Xem GET /api/mcp/forms để biết danh sách tools." },
        { status: 400 }
      );
    }

    // ── list_forms ────────────────────────────────────────────
    if (action === "list_forms") {
      let query = supabase
        .from("forms")
        .select("id, name, description, settings, created_at, updated_at")
        .order("created_at", { ascending: false })
        .limit(params.limit || 20);

      if (params.search) {
        query = query.ilike("name", `%${params.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return NextResponse.json({
        success: true,
        count: data?.length || 0,
        forms: data,
      });
    }

    // ── get_form ──────────────────────────────────────────────
    if (action === "get_form") {
      if (!params.id) return NextResponse.json({ error: "Thiếu 'id'" }, { status: 400 });

      const { data, error } = await supabase
        .from("forms")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, form: data });
    }

    // ── create_form ───────────────────────────────────────────
    if (action === "create_form") {
      if (!params.name) return NextResponse.json({ error: "Thiếu 'name'" }, { status: 400 });

      const defaultSteps = params.steps || [
        {
          id: `step-${Date.now()}`,
          title: "Thông tin",
          fields: [],
        },
      ];

      const defaultSettings = {
        type: "onestep",
        submit_label: "Gửi thông tin",
        success_message: "Cảm ơn bạn đã gửi thông tin!",
        theme: { primary_color: "#3b82f6" },
        ...params.settings,
      };

      const { data, error } = await supabase
        .from("forms")
        .insert({
          name: params.name,
          description: params.description || "",
          steps: defaultSteps,
          settings: defaultSettings,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Đã tạo form "${params.name}" thành công.`,
        form: data,
        admin_url: `/admin/forms/${data.id}`,
      });
    }

    // ── update_form ───────────────────────────────────────────
    if (action === "update_form") {
      if (!params.id) return NextResponse.json({ error: "Thiếu 'id'" }, { status: 400 });

      const updates: Record<string, any> = {};
      if (params.name !== undefined) updates.name = params.name;
      if (params.description !== undefined) updates.description = params.description;
      if (params.settings !== undefined) updates.settings = params.settings;
      if (params.steps !== undefined) updates.steps = params.steps;

      if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: "Không có trường nào để cập nhật." }, { status: 400 });
      }

      const { data, error } = await supabase
        .from("forms")
        .update(updates)
        .eq("id", params.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Đã cập nhật form thành công.`,
        form: data,
      });
    }

    // ── delete_form ───────────────────────────────────────────
    if (action === "delete_form") {
      if (!params.id) return NextResponse.json({ error: "Thiếu 'id'" }, { status: 400 });

      const { error } = await supabase.from("forms").delete().eq("id", params.id);
      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Đã xóa form ${params.id} và toàn bộ submissions liên quan.`,
      });
    }

    // ── list_submissions ──────────────────────────────────────
    if (action === "list_submissions") {
      let query = supabase
        .from("form_submissions")
        .select("id, form_id, data, page_url, ip_address, created_at")
        .order("created_at", { ascending: false })
        .limit(params.limit || 50)
        .range(params.offset || 0, (params.offset || 0) + (params.limit || 50) - 1);

      if (params.form_id) {
        query = query.eq("form_id", params.form_id);
      }

      const { data, error } = await query;
      if (error) throw error;

      return NextResponse.json({
        success: true,
        count: data?.length || 0,
        submissions: data,
      });
    }

    // ── Unknown action ────────────────────────────────────────
    return NextResponse.json(
      {
        error: `Action "${action}" không hợp lệ.`,
        available_actions: FORMS_TOOLS.map((t) => t.name),
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[MCP Forms Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
