import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role to bypass RLS for MCP server calls
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── MCP Tool Schema (for discovery) ─────────────────────────
export const BLOG_TOOLS = [
  // ── POSTS ──────────────────────────────────────────────────
  {
    name: "list_posts",
    description: "Lấy danh sách bài viết blog với bộ lọc theo trạng thái, danh mục và từ khóa.",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string", description: "Tìm kiếm theo tiêu đề" },
        status: {
          type: "string",
          enum: ["draft", "published"],
          description: "Lọc theo trạng thái: draft | published",
        },
        category_id: { type: "string", description: "Lọc theo UUID danh mục" },
        limit: { type: "number", description: "Số kết quả trả về (mặc định 20)" },
        offset: { type: "number", description: "Bỏ qua N bản ghi đầu (phân trang)" },
      },
    },
  },
  {
    name: "get_post",
    description: "Đọc chi tiết một bài viết theo ID hoặc slug, bao gồm toàn bộ nội dung và SEO.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "UUID của bài viết" },
        slug: { type: "string", description: "Slug của bài viết" },
      },
    },
  },
  {
    name: "create_post",
    description:
      "Tạo một bài viết blog mới. Nội dung (content) là mảng block JSON theo định dạng TipTap/Lexical. Trạng thái mặc định là 'draft'.",
    inputSchema: {
      type: "object",
      required: ["title", "slug"],
      properties: {
        title: { type: "string", description: "Tiêu đề bài viết" },
        slug: { type: "string", description: "Slug URL (phải là unique, dùng dấu gạch ngang)" },
        summary: { type: "string", description: "Tóm tắt ngắn hiển thị ngoài danh sách" },
        content: {
          type: "array",
          description:
            "Mảng block nội dung JSON. Ví dụ: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }]",
        },
        featured_image: { type: "string", description: "URL ảnh đại diện" },
        category_id: { type: "string", description: "UUID danh mục blog" },
        status: {
          type: "string",
          enum: ["draft", "published"],
          description: "Trạng thái: draft (mặc định) hoặc published",
        },
        seo_title: { type: "string", description: "Tiêu đề SEO (nếu khác title)" },
        seo_description: { type: "string", description: "Meta description SEO" },
        seo_keywords: {
          type: "array",
          items: { type: "string" },
          description: "Mảng từ khóa SEO",
        },
      },
    },
  },
  {
    name: "update_post",
    description: "Cập nhật bài viết blog. Chỉ truyền các trường cần thay đổi.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "UUID bài viết cần cập nhật" },
        title: { type: "string" },
        slug: { type: "string" },
        summary: { type: "string" },
        content: { type: "array", description: "Mảng block nội dung JSON" },
        featured_image: { type: "string" },
        category_id: { type: "string" },
        status: { type: "string", enum: ["draft", "published"] },
        seo_title: { type: "string" },
        seo_description: { type: "string" },
        seo_keywords: { type: "array", items: { type: "string" } },
      },
    },
  },
  {
    name: "publish_post",
    description: "Xuất bản (publish) một bài viết đang ở trạng thái draft, đặt published_at = now().",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "UUID bài viết" },
      },
    },
  },
  {
    name: "unpublish_post",
    description: "Chuyển bài viết từ published về draft (ẩn khỏi frontend).",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "UUID bài viết" },
      },
    },
  },
  {
    name: "delete_post",
    description: "Xóa vĩnh viễn một bài viết blog.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "UUID bài viết cần xóa" },
      },
    },
  },

  // ── CATEGORIES ─────────────────────────────────────────────
  {
    name: "list_categories",
    description: "Lấy danh sách tất cả danh mục blog.",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string", description: "Tìm kiếm theo tên danh mục" },
      },
    },
  },
  {
    name: "create_category",
    description: "Tạo danh mục blog mới.",
    inputSchema: {
      type: "object",
      required: ["name", "slug"],
      properties: {
        name: { type: "string", description: "Tên danh mục" },
        slug: { type: "string", description: "Slug URL danh mục" },
        description: { type: "string", description: "Mô tả ngắn" },
      },
    },
  },
  {
    name: "update_category",
    description: "Cập nhật thông tin danh mục blog.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "UUID danh mục" },
        name: { type: "string" },
        slug: { type: "string" },
        description: { type: "string" },
      },
    },
  },
  {
    name: "delete_category",
    description: "Xóa danh mục blog (các bài viết thuộc danh mục này sẽ có category_id = null).",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "UUID danh mục cần xóa" },
      },
    },
  },
];

// ─── GET: Tool discovery ──────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    module: "blog",
    version: "1.0.0",
    description: "MCP tools để quản lý Blog Posts và Categories trong Smax AI CMS",
    tools: BLOG_TOOLS,
  });
}

// ─── POST: Execute tool ───────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, ...params } = body;

    if (!action) {
      return NextResponse.json(
        {
          error:
            "Thiếu trường 'action'. Gọi GET /api/mcp/blog để xem danh sách tools.",
        },
        { status: 400 }
      );
    }

    // ─────────────────────────────────────────────────────────
    // POSTS
    // ─────────────────────────────────────────────────────────

    // ── list_posts ────────────────────────────────────────────
    if (action === "list_posts") {
      let query = supabase
        .from("posts")
        .select(
          "id, title, slug, summary, featured_image, status, category_id, published_at, created_at, updated_at, categories(id, name, slug)"
        )
        .order("created_at", { ascending: false })
        .limit(params.limit || 20);

      if (params.offset) {
        query = query.range(
          params.offset,
          params.offset + (params.limit || 20) - 1
        );
      }
      if (params.search) query = query.ilike("title", `%${params.search}%`);
      if (params.status) query = query.eq("status", params.status);
      if (params.category_id) query = query.eq("category_id", params.category_id);

      const { data, error } = await query;
      if (error) throw error;

      return NextResponse.json({
        success: true,
        count: data?.length || 0,
        posts: data,
      });
    }

    // ── get_post ──────────────────────────────────────────────
    if (action === "get_post") {
      if (!params.id && !params.slug) {
        return NextResponse.json(
          { error: "Cần cung cấp 'id' hoặc 'slug'" },
          { status: 400 }
        );
      }

      let query = supabase
        .from("posts")
        .select("*, categories(id, name, slug)");

      if (params.id) query = query.eq("id", params.id);
      else query = query.eq("slug", params.slug);

      const { data, error } = await (query as any).single();
      if (error) throw error;

      return NextResponse.json({ success: true, post: data });
    }

    // ── create_post ───────────────────────────────────────────
    if (action === "create_post") {
      if (!params.title || !params.slug) {
        return NextResponse.json(
          { error: "Thiếu 'title' hoặc 'slug'" },
          { status: 400 }
        );
      }

      const insertPayload: Record<string, any> = {
        title: params.title,
        slug: params.slug,
        summary: params.summary || "",
        content: params.content || [],
        featured_image: params.featured_image || null,
        category_id: params.category_id || null,
        status: params.status || "draft",
        seo_title: params.seo_title || null,
        seo_description: params.seo_description || null,
        seo_keywords: params.seo_keywords || null,
      };

      if (params.status === "published") {
        insertPayload.published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("posts")
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Đã tạo bài viết "${params.title}" thành công.`,
        post: data,
        admin_url: `/admin/blog/${data.id}`,
        public_url: `/blog/${data.slug}`,
      });
    }

    // ── update_post ───────────────────────────────────────────
    if (action === "update_post") {
      if (!params.id)
        return NextResponse.json({ error: "Thiếu 'id'" }, { status: 400 });

      const ALLOWED = [
        "title",
        "slug",
        "summary",
        "content",
        "featured_image",
        "category_id",
        "status",
        "seo_title",
        "seo_description",
        "seo_keywords",
        "published_at",
      ];

      const updates: Record<string, any> = {};
      for (const key of ALLOWED) {
        if (params[key] !== undefined) updates[key] = params[key];
      }

      if (Object.keys(updates).length === 0) {
        return NextResponse.json(
          { error: "Không có trường nào để cập nhật." },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from("posts")
        .update(updates)
        .eq("id", params.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: "Đã cập nhật bài viết thành công.",
        post: data,
      });
    }

    // ── publish_post ──────────────────────────────────────────
    if (action === "publish_post") {
      if (!params.id)
        return NextResponse.json({ error: "Thiếu 'id'" }, { status: 400 });

      const { data, error } = await supabase
        .from("posts")
        .update({ status: "published", published_at: new Date().toISOString() })
        .eq("id", params.id)
        .select("id, title, slug, status, published_at")
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Đã xuất bản bài viết "${data.title}".`,
        post: data,
        public_url: `/blog/${data.slug}`,
      });
    }

    // ── unpublish_post ────────────────────────────────────────
    if (action === "unpublish_post") {
      if (!params.id)
        return NextResponse.json({ error: "Thiếu 'id'" }, { status: 400 });

      const { data, error } = await supabase
        .from("posts")
        .update({ status: "draft", published_at: null })
        .eq("id", params.id)
        .select("id, title, slug, status")
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Bài viết "${data.title}" đã được chuyển về draft.`,
        post: data,
      });
    }

    // ── delete_post ───────────────────────────────────────────
    if (action === "delete_post") {
      if (!params.id)
        return NextResponse.json({ error: "Thiếu 'id'" }, { status: 400 });

      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", params.id);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Đã xóa bài viết ${params.id}.`,
      });
    }

    // ─────────────────────────────────────────────────────────
    // CATEGORIES
    // ─────────────────────────────────────────────────────────

    // ── list_categories ───────────────────────────────────────
    if (action === "list_categories") {
      let query = supabase
        .from("categories")
        .select("id, name, slug, description, created_at")
        .order("name", { ascending: true });

      if (params.search) query = query.ilike("name", `%${params.search}%`);

      const { data, error } = await query;
      if (error) throw error;

      return NextResponse.json({
        success: true,
        count: data?.length || 0,
        categories: data,
      });
    }

    // ── create_category ───────────────────────────────────────
    if (action === "create_category") {
      if (!params.name || !params.slug) {
        return NextResponse.json(
          { error: "Thiếu 'name' hoặc 'slug'" },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: params.name,
          slug: params.slug,
          description: params.description || null,
          // Không set content_type_slug để phân biệt với CPT categories
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Đã tạo danh mục "${params.name}".`,
        category: data,
      });
    }

    // ── update_category ───────────────────────────────────────
    if (action === "update_category") {
      if (!params.id)
        return NextResponse.json({ error: "Thiếu 'id'" }, { status: 400 });

      const updates: Record<string, any> = {};
      if (params.name !== undefined) updates.name = params.name;
      if (params.slug !== undefined) updates.slug = params.slug;
      if (params.description !== undefined) updates.description = params.description;

      if (Object.keys(updates).length === 0) {
        return NextResponse.json(
          { error: "Không có trường nào để cập nhật." },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", params.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: "Đã cập nhật danh mục thành công.",
        category: data,
      });
    }

    // ── delete_category ───────────────────────────────────────
    if (action === "delete_category") {
      if (!params.id)
        return NextResponse.json({ error: "Thiếu 'id'" }, { status: 400 });

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", params.id);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Đã xóa danh mục ${params.id}.`,
      });
    }

    // ── Unknown action ────────────────────────────────────────
    return NextResponse.json(
      {
        error: `Action "${action}" không hợp lệ.`,
        available_actions: BLOG_TOOLS.map((t) => t.name),
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[MCP Blog Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
