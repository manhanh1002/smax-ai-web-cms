import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to wrap response content in MCP text format
function mcpTextResponse(text: string) {
  return NextResponse.json({
    jsonrpc: "2.0",
    result: {
      content: [
        {
          type: "text",
          text: text,
        },
      ],
    },
  });
}

// Helper to wrap response JSON in MCP format
function mcpJsonResponse(data: any) {
  return mcpTextResponse(JSON.stringify(data, null, 2));
}

// Tool definitions schema
const TOOLS = [
  // 1. Pages
  {
    name: "list_pages",
    description: "Get a list of all landing pages (ID, title, slug, status).",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "get_page",
    description: "Retrieve full details and JSON layout blocks of a specific page.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The UUID of the page" }
      },
      required: ["id"]
    }
  },
  {
    name: "save_page",
    description: "Create or update a landing page (upsert blocks and title).",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Optional UUID to update an existing page" },
        title: { type: "string", description: "Page title" },
        slug: { type: "string", description: "URL path slug" },
        blocks: { type: "array", description: "Array of Smax AI block configuration objects" },
        status: { type: "string", enum: ["draft", "published"] }
      },
      required: ["title", "slug"]
    }
  },
  {
    name: "delete_page",
    description: "Delete a landing page by ID.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "UUID of page to delete" }
      },
      required: ["id"]
    }
  },

  // 2. Blog
  {
    name: "list_blog_posts",
    description: "Get list of all blog posts (ID, title, slug, status).",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "get_blog_post",
    description: "Retrieve details and HTML content of a specific blog post.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The UUID of the post" }
      },
      required: ["id"]
    }
  },
  {
    name: "save_blog_post",
    description: "Create or update a blog post. Wraps rich text HTML correctly.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Optional UUID to update" },
        title: { type: "string" },
        slug: { type: "string" },
        summary: { type: "string" },
        html_content: { type: "string", description: "Standard HTML body text for the blog post" },
        featured_image: { type: "string" },
        status: { type: "string", enum: ["draft", "published"] },
        seo_title: { type: "string", description: "Meta title for SEO" },
        seo_description: { type: "string", description: "Meta description for SEO" },
        seo_keywords: { type: "string", description: "Meta keywords (comma separated) for SEO" },
        category_id: { type: "string", description: "Optional UUID of the blog category" }
      },
      required: ["title", "slug"]
    }
  },
  {
    name: "delete_blog_post",
    description: "Delete a blog post by ID.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" }
      },
      required: ["id"]
    }
  },
  {
    name: "list_blog_categories",
    description: "List all blog categories.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "create_blog_category",
    description: "Create a new blog category.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        slug: { type: "string" }
      },
      required: ["name", "slug"]
    }
  },

  // 3. Forms & Popups
  {
    name: "list_forms",
    description: "List lead capture forms.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "get_form",
    description: "Retrieve steps and field configurations of a form.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"]
    }
  },
  {
    name: "save_form",
    description: "Create or update a marketing form.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        description: { type: "string" },
        steps: { type: "array" },
        settings: { type: "object" }
      },
      required: ["name"]
    }
  },
  {
    name: "list_popups",
    description: "List popup templates.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "get_popup",
    description: "Retrieve conditions, placement, content and settings of a popup.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"]
    }
  },
  {
    name: "save_popup",
    description: "Create or update a popup.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        type: { type: "string", enum: ["modal", "slide-in", "bar"] },
        position: { type: "string" },
        content: { type: "object" },
        settings: { type: "object" },
        conditions: { type: "object" }
      },
      required: ["name"]
    }
  },
  {
    name: "list_notification_bars",
    description: "List top notification bars (ID, name, status, statistics).",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "get_notification_bar",
    description: "Retrieve full config and contents of a specific notification bar.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"]
    }
  },
  {
    name: "save_notification_bar",
    description: "Create or update a top notification bar.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        is_active: { type: "boolean" },
        content: { type: "object" },
        settings: { type: "object" },
        conditions: { type: "object" }
      },
      required: ["name"]
    }
  },
  {
    name: "delete_notification_bar",
    description: "Delete a top notification bar by ID.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"]
    }
  },

  // 4. Analytics & Leads
  {
    name: "get_form_submissions",
    description: "Retrieve customer leads submitted through forms.",
    inputSchema: {
      type: "object",
      properties: {
        form_id: { type: "string", description: "Optional filter by Form UUID" }
      }
    }
  },
  {
    name: "get_popup_analytics",
    description: "Get view and conversion count statistics for all active popups.",
    inputSchema: { type: "object", properties: {} }
  },

  // 5. Media Asset Library
  {
    name: "list_media_assets",
    description: "List files uploaded to the media library.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "register_media_asset",
    description: "Register a media file/image URL into the library database.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        url: { type: "string" },
        type: { type: "string", enum: ["image", "video", "document"] },
        size_bytes: { type: "integer" }
      },
      required: ["name", "url"]
    }
  },

  // 6. Branding & Design settings
  {
    name: "get_site_settings",
    description: "Read active theme configuration, colors, company branding.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "update_site_settings",
    description: "Modify branding titles, description, dark/light logos, and color tokens.",
    inputSchema: {
      type: "object",
      properties: {
        site_name: { type: "string" },
        site_description: { type: "string" },
        company_name: { type: "string" },
        theme_config: { type: "object", description: "Theme config containing ui, colors, effects, and typography" }
      }
    }
  },

  // 7. Generic CRUD Helpers
  {
    name: "fetch_table_records",
    description: "Generic fetcher to list rows of any public table.",
    inputSchema: {
      type: "object",
      properties: {
        table: { type: "string", description: "Name of target database table" },
        select: { type: "string", description: "Comma-separated columns to query, default '*'" },
        limit: { type: "integer", description: "Max count of rows, default 50" }
      },
      required: ["table"]
    }
  },
  {
    name: "save_table_record",
    description: "Generic upsert to save a row in any public table.",
    inputSchema: {
      type: "object",
      properties: {
        table: { type: "string", description: "Name of target table" },
        record: { type: "object", description: "Object containing columns and values to save" }
      },
      required: ["table", "record"]
    }
  }
];

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  // Validate settings token
  const { data: settings, error: settingsErr } = await supabase
    .from("site_settings")
    .select("mcp_enabled, mcp_token")
    .single();

  if (settingsErr || !settings || !settings.mcp_enabled || settings.mcp_token !== token) {
    return NextResponse.json({ error: "Unauthorized or MCP disabled" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON-RPC request" }, { status: 400 });
  }

  const { method, params, id } = body;

  // Handle standard JSON-RPC 2.0 methods
  if (method === "initialize") {
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: "smax-ai-copilot",
          version: "1.0.0"
        }
      }
    });
  }

  if (method === "tools/list") {
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: {
        tools: TOOLS
      }
    });
  }

  if (method === "tools/call") {
    const { name, arguments: args } = params || {};
    try {
      switch (name) {
        // --- 1. Pages ---
        case "list_pages": {
          const { data, error } = await supabase
            .from("pages")
            .select("id, title, slug, status, created_at")
            .order("created_at", { ascending: false });
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        case "get_page": {
          const { data, error } = await supabase
            .from("pages")
            .select("*")
            .eq("id", args.id)
            .single();
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        case "save_page": {
          const pageData = {
            title: args.title,
            slug: args.slug,
            status: args.status || "draft",
            updated_at: new Date().toISOString()
          } as any;
          if (args.blocks) {
            pageData.blocks = args.blocks;
            pageData.content = args.blocks; // Sync content field
            pageData.content_config = { blocks: args.blocks }; // Set content_config too!
          }

          let query = supabase.from("pages");
          let result;
          if (args.id) {
            result = await query.update(pageData).eq("id", args.id).select().single();
          } else {
            result = await query.insert(pageData).select().single();
          }
          if (result.error) throw result.error;
          return mcpJsonResponse({ success: true, page: result.data });
        }

        case "delete_page": {
          const { error } = await supabase.from("pages").delete().eq("id", args.id);
          if (error) throw error;
          return mcpJsonResponse({ success: true, message: `Page ${args.id} deleted` });
        }

        // --- 2. Blog posts ---
        case "list_blog_posts": {
          const { data, error } = await supabase
            .from("posts")
            .select("id, title, slug, status, published_at")
            .order("created_at", { ascending: false });
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        case "get_blog_post": {
          const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("id", args.id)
            .single();
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        case "save_blog_post": {
          const postData = {
            title: args.title,
            slug: args.slug,
            summary: args.summary || "",
            status: args.status || "draft",
            featured_image: args.featured_image || null,
            updated_at: new Date().toISOString()
          } as any;

          if (args.category_id !== undefined) postData.category_id = args.category_id || null;
          if (args.seo_title !== undefined) postData.seo_title = args.seo_title;
          if (args.seo_description !== undefined) postData.seo_description = args.seo_description;
          if (args.seo_keywords !== undefined) {
            if (typeof args.seo_keywords === "string") {
              postData.seo_keywords = args.seo_keywords.split(",").map((k: string) => k.trim()).filter(Boolean);
            } else {
              postData.seo_keywords = args.seo_keywords;
            }
          }

          if (args.html_content) {
            postData.content = [
              {
                type: "richText",
                data: {
                  content: args.html_content
                }
              }
            ];
          }

          let query = supabase.from("posts");
          let result;
          if (args.id) {
            result = await query.update(postData).eq("id", args.id).select().single();
          } else {
            result = await query.insert(postData).select().single();
          }
          if (result.error) throw result.error;
          return mcpJsonResponse({ success: true, post: result.data });
        }

        case "delete_blog_post": {
          const { error } = await supabase.from("posts").delete().eq("id", args.id);
          if (error) throw error;
          return mcpJsonResponse({ success: true, message: `Blog post ${args.id} deleted` });
        }

        case "list_blog_categories": {
          const { data, error } = await supabase.from("categories").select("*");
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        case "create_blog_category": {
          const { data, error } = await supabase
            .from("categories")
            .insert({ name: args.name, slug: args.slug })
            .select()
            .single();
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        // --- 3. Forms & Popups ---
        case "list_forms": {
          const { data, error } = await supabase.from("forms").select("id, name, description, created_at");
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        case "get_form": {
          const { data, error } = await supabase.from("forms").select("*").eq("id", args.id).single();
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        case "save_form": {
          const formData = {
            name: args.name,
            description: args.description || "",
            updated_at: new Date().toISOString()
          } as any;
          if (args.steps) {
            formData.steps = args.steps;
          }
          if (args.settings) {
            formData.settings = args.settings;
          }

          let query = supabase.from("forms");
          let result;
          if (args.id) {
            result = await query.update(formData).eq("id", args.id).select().single();
          } else {
            result = await query.insert(formData).select().single();
          }
          if (result.error) throw result.error;
          return mcpJsonResponse({ success: true, form: result.data });
        }

        case "list_popups": {
          const { data, error } = await supabase.from("popups").select("id, name, is_active, type, created_at");
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        case "get_popup": {
          const { data, error } = await supabase.from("popups").select("*").eq("id", args.id).single();
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        case "save_popup": {
          const popupData = {
            name: args.name,
            updated_at: new Date().toISOString()
          } as any;
          if (args.type) popupData.type = args.type;
          if (args.position) popupData.position = args.position;
          if (args.content) popupData.content = args.content;
          if (args.settings) popupData.settings = args.settings;
          if (args.conditions) popupData.conditions = args.conditions;

          let query = supabase.from("popups");
          let result;
          if (args.id) {
            result = await query.update(popupData).eq("id", args.id).select().single();
          } else {
            result = await query.insert(popupData).select().single();
          }
          if (result.error) throw result.error;
          return mcpJsonResponse({ success: true, popup: result.data });
        }

        // --- 3.5. Notification Bars ---
        case "list_notification_bars": {
          const { data, error } = await supabase
            .from("notification_bars")
            .select("id, name, is_active, views_count, conversions_count, created_at, settings")
            .order("created_at", { ascending: false });
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        case "get_notification_bar": {
          const { data, error } = await supabase
            .from("notification_bars")
            .select("*")
            .eq("id", args.id)
            .single();
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        case "save_notification_bar": {
          const barData = {
            name: args.name,
            updated_at: new Date().toISOString()
          } as any;
          if (args.is_active !== undefined) barData.is_active = args.is_active;
          if (args.content) barData.content = args.content;
          if (args.settings) barData.settings = args.settings;
          if (args.conditions) barData.conditions = args.conditions;

          let query = supabase.from("notification_bars");
          let result;
          if (args.id) {
            result = await query.update(barData).eq("id", args.id).select().single();
          } else {
            result = await query.insert(barData).select().single();
          }
          if (result.error) throw result.error;
          return mcpJsonResponse({ success: true, notification_bar: result.data });
        }

        case "delete_notification_bar": {
          const { error } = await supabase.from("notification_bars").delete().eq("id", args.id);
          if (error) throw error;
          return mcpJsonResponse({ success: true, message: `Notification bar ${args.id} deleted` });
        }

        // --- 4. Analytics & Lead list ---
        case "get_form_submissions": {
          let query = supabase.from("form_submissions").select("*").order("created_at", { ascending: false });
          if (args.form_id) {
            query = query.eq("form_id", args.form_id);
          }
          const { data, error } = await query;
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        case "get_popup_analytics": {
          const { data, error } = await supabase
            .from("popups")
            .select("id, name, type, views_count, conversions_count");
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        // --- 5. Media ---
        case "list_media_assets": {
          const { data, error } = await supabase
            .from("media_assets")
            .select("id, name, file_path, public_url, mime_type, file_type, size_bytes")
            .order("created_at", { ascending: false })
            .limit(100);
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        case "register_media_asset": {
          const assetData = {
            name: args.name,
            original_name: args.name,
            file_path: args.url,
            public_url: args.url,
            mime_type: "image/jpeg",
            file_type: args.type || "image",
            size_bytes: args.size_bytes || 0
          };
          const { data, error } = await supabase
            .from("media_assets")
            .insert(assetData)
            .select()
            .single();
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        // --- 6. Site Settings & UI Theme ---
        case "get_site_settings": {
          const { data, error } = await supabase
            .from("site_settings")
            .select("site_name, site_description, company_name, theme_config")
            .single();
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        case "update_site_settings": {
          const updateData = {} as any;
          if (args.site_name !== undefined) updateData.site_name = args.site_name;
          if (args.site_description !== undefined) updateData.site_description = args.site_description;
          if (args.company_name !== undefined) updateData.company_name = args.company_name;
          if (args.theme_config !== undefined) updateData.theme_config = args.theme_config;

          const { data: settingsRow } = await supabase.from("site_settings").select("id").single();
          if (!settingsRow) throw new Error("Settings row not found");

          const { data, error } = await supabase
            .from("site_settings")
            .update(updateData)
            .eq("id", settingsRow.id)
            .select()
            .single();
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        // --- 7. Generic CRUD table access ---
        case "fetch_table_records": {
          const selectQuery = args.select || "*";
          const limitValue = args.limit || 50;
          const { data, error } = await supabase
            .from(args.table)
            .select(selectQuery)
            .limit(limitValue);
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        case "save_table_record": {
          const { data, error } = await supabase
            .from(args.table)
            .upsert(args.record)
            .select()
            .single();
          if (error) throw error;
          return mcpJsonResponse(data);
        }

        default:
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            error: {
              code: -32601,
              message: `Method not found: ${name}`
            }
          }, { status: 404 });
      }
    } catch (err: any) {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        error: {
          code: -32603,
          message: err.message || "Internal error executing tool"
        }
      }, { status: 500 });
    }
  }

  return NextResponse.json({
    jsonrpc: "2.0",
    id,
    error: {
      code: -32601,
      message: `Unsupported JSON-RPC method: ${method}`
    }
  }, { status: 400 });
}
