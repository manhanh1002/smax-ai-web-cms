import { NextResponse } from "next/server";
import { FORMS_TOOLS } from "@/app/api/mcp/forms/route";
import { POPUPS_TOOLS } from "@/app/api/mcp/popups/route";
import { BLOG_TOOLS } from "@/app/api/mcp/blog/route";

/**
 * MCP Discovery Endpoint
 * GET /api/mcp
 *
 * Returns all available MCP tools across all modules.
 * Compatible with MCP protocol tool discovery.
 */
export async function GET(req: Request) {
  const { origin } = new URL(req.url);

  const modules = [
    {
      module: "forms",
      endpoint: `${origin}/api/mcp/forms`,
      description: "Quản lý Forms và Form Submissions",
      tools: FORMS_TOOLS,
    },
    {
      module: "popups",
      endpoint: `${origin}/api/mcp/popups`,
      description: "Quản lý Popup Builder và conversion tracking",
      tools: POPUPS_TOOLS,
    },
    {
      module: "blog",
      endpoint: `${origin}/api/mcp/blog`,
      description: "Quản lý Blog Posts và Categories",
      tools: BLOG_TOOLS,
    },
  ];

  const allTools = modules.flatMap((m) =>
    m.tools.map((t) => ({
      ...t,
      module: m.module,
      endpoint: m.endpoint,
    }))
  );

  return NextResponse.json({
    name: "Smax AI CMS - MCP Server",
    version: "1.0.0",
    description: "Model Context Protocol server cho Smax AI CMS. Hỗ trợ quản lý Forms, Popups, Blog và nhiều module khác.",
    protocol: "http-json",
    usage: {
      discovery: "GET /api/mcp",
      execute: "POST /api/mcp/{module} với body: { action: 'tool_name', ...params }",
      example: {
        url: `${origin}/api/mcp/forms`,
        method: "POST",
        body: { action: "list_forms", limit: 10 },
      },
    },
    modules: modules.map((m) => ({
      module: m.module,
      endpoint: m.endpoint,
      description: m.description,
      tool_count: m.tools.length,
      tools: m.tools.map((t) => t.name),
    })),
    all_tools: allTools,
  });
}
