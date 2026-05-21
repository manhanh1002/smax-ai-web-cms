# Smax AI Copilot MCP Integration Guide (Copilot Skill)

This guide documents the Smax AI Copilot MCP (Model Context Protocol) API. Other AI agents or clients can read this file to understand how to connect, handshake, and invoke CRUD operations for Pages, Blog Posts, Forms, Popups, and Top Notification Bars.

---

## 1. Connection & Handshake (Development & Production)

The Smax AI Copilot MCP Server uses **SSE (Server-Sent Events)**. To connect:

### Step 1: Obtain SSE Endpoint URL
1. Access the Admin Panel at `/admin/settings` (or the equivalent production domain dashboard).
2. Enable **MCP Server** and generate/copy the connection details:
   - **Production URL template:** `https://[your-domain]/api/mcp/sse?token=[mcp_token]`
   - **Local URL template:** `http://localhost:3000/api/mcp/sse?token=[mcp_token]`

### Step 2: Configure Client Integrations
You can register this MCP server in tool-using agents (e.g., Claude Desktop, Antigravity, Cline) via `mcp_config.json`:
```json
{
  "mcpServers": {
    "smax-ai-copilot": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/client-sse",
        "https://[your-domain]/api/mcp/sse?token=[mcp_token]"
      ]
    }
  }
}
```

### Step 3: Handshake Protocol
1. **Connect to SSE Stream**: Send a GET request to the SSE URL with the header `Accept: text/event-stream`.
2. **Retrieve Message Endpoint**: Listen for the `event: endpoint` message from the stream to extract the relative POST URL path (e.g., `/api/mcp/messages?token=[mcp_token]&sessionId=[session_id]`).
3. **Initialize JSON-RPC**: Send a POST request to that message endpoint:
   ```json
   {
     "jsonrpc": "2.0",
     "id": 1,
     "method": "initialize",
     "params": {
       "protocolVersion": "2024-11-05",
       "capabilities": {},
       "clientInfo": { "name": "mcp-agent-client", "version": "1.0.0" }
     }
   }
   ```
4. **List Tools**: Send a POST request to list the available tools:
   ```json
   {
     "jsonrpc": "2.0",
     "id": 2,
     "method": "tools/list"
   }
   ```

---

## 2. Resource Schema & CRUD Tool Guidelines

To ensure that the created resources do not cause hydration crashes or layout breaking on the Admin panel UI, follow the exact schemas below when calling tools.

### 2.1. Landing Pages (CMS Pages)
*   **Listing**: `list_pages` (takes no arguments)
*   **Getting**: `get_page` (arguments: `{ id }`)
*   **Deleting**: `delete_page` (arguments: `{ id }`)
*   **Saving**: `save_page`
    *   `title` (string, required): Page title.
    *   `slug` (string, required): URL slug.
    *   `status` (string): `"draft"` or `"published"`.
    *   `blocks` (array, optional): Smax AI content blocks.
        *   *Crucial backend behavior:* The backend maps `blocks` to both `content` and `content_config = { blocks: [...] }` to guarantee compatibility with block-by-block admin visual editors.

#### Page Blocks JSON Pattern:
```json
[
  {
    "type": "hero",
    "data": {
      "title": "Giải Pháp CRM & AI Chatbot",
      "subtitle": "Tối ưu hóa quy trình chăm sóc khách hàng.",
      "primaryBtnText": "Khám phá ngay",
      "primaryBtnUrl": "#contact",
      "secondaryBtnText": "Xem bảng giá",
      "secondaryBtnUrl": "#pricing"
    }
  },
  {
    "type": "features",
    "data": {
      "title": "Tính Năng Nổi Bật",
      "subtitle": "Smax AI mang lại những công cụ mạnh mẽ."
    }
  }
]
```

---

### 2.2. Blog Posts
*   **Listing**: `list_blog_posts` (takes no arguments)
*   **Getting**: `get_blog_post` (arguments: `{ id }`)
*   **Deleting**: `delete_blog_post` (arguments: `{ id }`)
*   **Saving**: `save_blog_post`
    *   `title` (string, required)
    *   `slug` (string, required)
    *   `summary` (string, optional)
    *   `featured_image` (string, optional)
    *   `status` (string): `"draft"` or `"published"`
    *   `html_content` (string, optional): Rich-text HTML content.
        *   *Crucial backend behavior:* The backend wraps `html_content` into block format:
            `content: [{ type: "richText", data: { content: html_content } }]`
    *   `seo_title` (string, optional): Custom title tag for SEO optimization.
    *   `seo_description` (string, optional): Custom meta description for search engines.
    *   `seo_keywords` (string, optional): Comma-separated keywords for SEO targeting.

---

### 2.3. Marketing & Lead Capture Forms
*   **Listing**: `list_forms` (takes no arguments)
*   **Getting**: `get_form` (arguments: `{ id }`)
*   **Saving**: `save_form`
    *   `name` (string, required)
    *   `description` (string, optional)
    *   `steps` (array of step objects, optional)
    *   `settings` (object, optional)

#### Form Steps & Settings JSON Pattern:
```json
{
  "name": "Form Đăng Ký Tư Vấn AI Chatbot",
  "description": "Form thu thập thông tin khách hàng tiềm năng",
  "steps": [
    {
      "id": "step-1",
      "title": "Thông tin liên hệ",
      "fields": [
        { "id": "f1", "fieldId": "name", "type": "text", "label": "Họ và tên", "placeholder": "Nhập họ tên...", "required": true, "width": "full" },
        { "id": "f2", "fieldId": "email", "type": "email", "label": "Email", "placeholder": "example@gmail.com", "required": true, "width": "half" },
        { "id": "f3", "fieldId": "phone", "type": "phone", "label": "Số điện thoại", "placeholder": "090...", "required": true, "width": "half" }
      ]
    }
  ],
  "settings": {
    "type": "onestep",
    "submit_label": "Đăng ký tư vấn ngay",
    "success_message": "Cảm ơn bạn đã đăng ký! Đội ngũ tư vấn sẽ liên hệ lại sớm nhất.",
    "theme": {
      "primary_color": "#2563eb",
      "border_radius": "xl"
    }
  }
}
```

---

### 2.4. Promotional Popups
*   **Listing**: `list_popups` (takes no arguments)
*   **Getting**: `get_popup` (arguments: `{ id }`)
*   **Saving**: `save_popup`
    *   `name` (string, required)
    *   `type` (string): `"modal"`, `"slide-in"`, or `"bar"`.
    *   `position` (string): `"center"`, `"bottom-right"`, `"top-left"`, etc.
    *   `content` (object): Layout columns definition. Supports columns types: `"pricing_deal"`, `"form"`, `"image"`, `"text"`.
    *   `settings` (object): Corner radius, width, animations, theme color configurations.
    *   `conditions` (object): Activation rules (trigger delay, percent scroll, page targeting, devices, showing frequency).

#### Popup Content, Settings & Conditions JSON Pattern:
```json
{
  "name": "Popup Flash Sale",
  "type": "slide-in",
  "position": "bottom-right",
  "content": {
    "layout": "1col",
    "cols": [
      {
        "type": "pricing_deal",
        "badge": "🔥 Flash Sale",
        "original_price": "2.000.000đ",
        "sale_price": "990.000đ",
        "heading": "AI Automation Tool",
        "description": "Tự động hóa chốt đơn.",
        "highlights": ["Tích hợp GPT-4", "Báo cáo doanh số"],
        "cta_label": "Nhận ngay"
      }
    ]
  },
  "settings": {
    "theme": {
      "primary_color": "#2563eb",
      "bg_color": "#ffffff",
      "text_color": "#0f172a"
    },
    "animation": "zoom",
    "backdrop": false,
    "show_close": true,
    "width": "md",
    "corner_radius": "2xl"
  },
  "conditions": {
    "trigger": "time_delay",
    "delay_seconds": 3,
    "scroll_percent": 50,
    "page_target": "all",
    "page_urls": [],
    "devices": ["desktop", "mobile"],
    "frequency": "always",
    "show_after_convert": false
  }
}
```

---

### 2.5. Top Notification Bars
*   **Listing**: `list_notification_bars` (takes no arguments)
*   **Getting**: `get_notification_bar` (arguments: `{ id }`)
*   **Deleting**: `delete_notification_bar` (arguments: `{ id }`)
*   **Saving**: `save_notification_bar`
    *   `name` (string, required)
    *   `is_active` (boolean, optional)
    *   `content` (object): Text items carousel, thumbnail icon, or CTA button behavior.
    *   `settings` (object): Layout options (`static` vs `marquee`), sticky settings, height, gradient themes.
    *   `conditions` (object): Target urls, target devices.

#### Top Notification Bar Content, Settings & Conditions JSON Pattern:
```json
{
  "name": "Khóa Học AI Top Announcement Bar",
  "is_active": true,
  "content": {
    "type": "single",
    "items": [
      { "text": "Khóa học AI Automation bắt đầu ngày 28/05/2026!", "link": "/course" }
    ],
    "image_url": "Sparkles",
    "cta_label": "Đăng ký ngay",
    "cta_link": "/register-course"
  },
  "settings": {
    "layout": "static",
    "sticky": true,
    "show_close": true,
    "height": 42,
    "speed": 20,
    "theme": {
      "bg_type": "gradient",
      "bg_color": "#2563eb",
      "bg_gradient": "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
      "text_color": "#ffffff",
      "primary_color": "#ffffff",
      "primary_text_color": "#2563eb"
    }
  },
  "conditions": {
    "page_target": "all",
    "page_urls": [],
    "devices": ["desktop", "mobile"]
  }
}
```

---

## 3. General Implementation Checklist for Visual Consistency

When writing tools that create or update these items, ensure you:
1.  **Never leave title/name fields blank**: Smax UI relies on headings to draw elements, so ensure a descriptive name is always passed.
2.  **Avoid hardcoding IDs on inserts**: Let the server generate UUIDs by omitting the `id` field when creating new entries. Include the `id` string strictly for edits/updates.
3.  **Sync related fields**: When editing blocks in Landing Pages, keep them in `blocks` and `content_config` structures. For blog posts, write content as HTML string in the `html_content` argument.
4.  **Enforce strict JSON schema conformance**: Check schemas to avoid database errors and Next.js frontend hydration or runtime page rendering crashes.

---

## 4. Agent Quality Self-Correction & Iterative Refinement (Crucial)

To ensure the highest quality results, every agent connecting to this MCP server MUST adhere to the following workflow for quality control:

1.  **Study Existing Designs & Content Styles (Learn from Production)**:
    *   For **Landing Pages** and **Blog Posts**, do not build blindly. First, call `list_pages` or `list_blog_posts` to inspect already published or active entries.
    *   Read the detailed JSON/HTML structures of those published items (using `get_page` or `get_blog_post`) to **study their copywriting style, block layouts, design tokens, color coordination, and structural flow**.
    *   Use these existing high-quality templates as inspiration to design and refine new content or layouts based on the user's specific request.
2.  **Read and Analyze Target Resource First**: Before making any modification to an existing item, fetch its current state to understand its schema, variables, and formatting. Do not assume or guess.
3.  **Verify Quality Post-Generation**: After calling `save_page`, `save_form`, `save_popup`, `save_blog_post`, or `save_notification_bar`:
    *   **Proactively read back the newly saved resource** using its ID.
    *   Inspect the returned structure, blocks, contents, and settings carefully.
    *   Ensure there are no missing blocks, misplaced parameters, empty text blocks, or generic placeholders.
4.  **Iterative Self-Update**:
    *   Evaluate the visual hierarchy, completeness, responsiveness, and aesthetic appeal of the generated config.
    *   If any part of the generated content/settings is subpar, lacks styling, or contains syntax/structural omissions, **you must immediately call the save tool again** with the updated, refined configuration.
    *   Repeat this verification and refinement cycle until you are 100% confident that the resource is premium, modern, visually outstanding, and renders with zero errors.
