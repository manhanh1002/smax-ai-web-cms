import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with service role key to bypass RLS in administrative migration
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "Missing 'url'" }, { status: 400 });
    }

    console.log("🚀 [API upload-url] Migrating external URL:", url);

    // Fetch the image from external source on the server-side to bypass CORS blocks
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch external image: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "image/png";
    const fileExt = contentType.split("/")[1] || "png";
    const fileName = `external_${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // Get the array buffer from fetched image
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage inside 'media' bucket
    const { data: storageData, error: storageError } = await supabase.storage
      .from("media")
      .upload(filePath, buffer, {
        contentType,
        upsert: false,
      });

    if (storageError || !storageData) {
      console.error("❌ [API upload-url] Storage upload failed:", storageError);
      throw storageError || new Error("Failed to upload to storage");
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("media")
      .getPublicUrl(filePath);

    console.log("✅ [API upload-url] Storage upload success:", publicUrl);

    // Get original filename from URL
    let originalName = "pasted-external-image." + fileExt;
    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;
      const lastSegment = pathname.substring(pathname.lastIndexOf('/') + 1);
      if (lastSegment && lastSegment.includes('.')) {
        originalName = decodeURIComponent(lastSegment);
      }
    } catch (_) {}

    // Insert into media_assets database table to register in Media Picker
    const { data: dbData, error: dbError } = await supabase
      .from("media_assets")
      .insert({
        name: fileName,
        original_name: originalName,
        file_path: filePath,
        public_url: publicUrl,
        mime_type: contentType,
        file_type: "image",
        size_bytes: buffer.byteLength,
        folder_id: null,
        folder: "/",
      })
      .select()
      .single();

    if (dbError) {
      console.error("❌ [API upload-url] Database insert failed:", dbError);
    } else {
      console.log("✅ [API upload-url] Database entry created:", dbData.id);
    }

    return NextResponse.json({ success: true, publicUrl });
  } catch (error: any) {
    console.error("❌ [API upload-url] Error migrating URL:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
