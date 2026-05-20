import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response(JSON.stringify({ error: "Missing token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Fetch site settings to verify MCP is active and the token is valid
  const { data: settings, error } = await supabase
    .from("site_settings")
    .select("mcp_enabled, mcp_token")
    .single();

  if (error || !settings || !settings.mcp_enabled || settings.mcp_token !== token) {
    return new Response(JSON.stringify({ error: "Unauthorized or MCP disabled" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create event stream response
  const responseStream = new ReadableStream({
    start(controller) {
      // Send the endpoint event immediately back to the client
      const sessionId = crypto.randomUUID();
      const messageEndpoint = `/api/mcp/messages?token=${token}&sessionId=${sessionId}`;
      
      controller.enqueue(`event: endpoint\ndata: ${messageEndpoint}\n\n`);

      // Send periodic heartbeats to prevent connection timeouts
      const interval = setInterval(() => {
        try {
          controller.enqueue(`:\n\n`);
        } catch (e) {
          clearInterval(interval);
        }
      }, 15000);

      // Clean up when connection closes
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        try {
          controller.close();
        } catch (e) {}
      });
    }
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
