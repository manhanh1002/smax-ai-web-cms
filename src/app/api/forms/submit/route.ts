import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { form_id, data, page_url } = body;

    if (!form_id) {
      return NextResponse.json({ error: "Missing form_id" }, { status: 400 });
    }

    // Get client info
    const userAgent = req.headers.get("user-agent") || "unknown";
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // Insert submission
    const { error } = await supabase.from("form_submissions").insert([
      {
        form_id,
        data,
        page_url,
        user_agent: userAgent,
        ip_address: ip,
      },
    ]);

    if (error) {
      console.error("Error saving submission:", error);
      return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
    }

    // Trigger Webhooks (Async)
    try {
      const { data: formRecord } = await supabase
        .from("forms")
        .select("settings")
        .eq("id", form_id)
        .single();

      const webhooks = (formRecord?.settings as any)?.webhooks;
      if (webhooks && Array.isArray(webhooks)) {
        webhooks.forEach((url: string) => {
          fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: "form_submission",
              form_id,
              data,
              page_url,
              metadata: {
                user_agent: userAgent,
                ip_address: ip,
                timestamp: new Date().toISOString(),
              }
            })
          }).catch(webhookErr => {
            console.error(`Webhook failed for ${url}:`, webhookErr);
          });
        });
      }
    } catch (webhookTriggerErr) {
      console.error("Error triggering webhooks:", webhookTriggerErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Form submission error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
