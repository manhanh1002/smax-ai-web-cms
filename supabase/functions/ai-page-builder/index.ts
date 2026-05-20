import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import OpenAI from "https://esm.sh/openai@4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { session_id, prompt, block_schema } = await req.json()

    // Initialize Supabase Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Initialize OpenAI Client with Google AI Studio
    const openaiKey = 'AIzaSyBL-vKBHRGGcj9O7TtVDjkAy_d1upWM23Q';
    const openai = new OpenAI({ 
      apiKey: openaiKey,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });

    // Helper to update status
    const updateStatus = async (status: string, current_step: string, progress: number) => {
      await supabase.from('ai_generation_status').upsert({
        session_id,
        status,
        current_step,
        progress,
        updated_at: new Date().toISOString()
      }, { onConflict: 'session_id' })
    }

    await updateStatus('running', 'Đang thiết kế cấu trúc trang...', 10)

    // Step 1: Architect - Select blocks
    const architectPrompt = `
      Bạn là một chuyên gia thiết kế Landing Page.
      Người dùng yêu cầu: "${prompt}"
      
      Dưới đây là danh sách các Block có sẵn trong hệ thống:
      ${JSON.stringify(block_schema.map((b: any) => ({ type: b.type, description: b.description })), null, 2)}
      
      Hãy chọn ra một danh sách các block phù hợp nhất để tạo thành một trang web hoàn chỉnh (nên từ 4-7 blocks, bắt đầu bằng hero).
      Trả về kết quả dưới dạng JSON mảng các chuỗi, ví dụ: ["hero", "features", "cta"]
      KHÔNG trả về bất kỳ text nào khác ngoài JSON array.
    `

    const architectCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Or whatever model is available
      messages: [{ role: "user", content: architectPrompt }],
      temperature: 0.2,
      response_format: { type: "json_object" } // Using json_object might require a wrapper object, let's use standard JSON array parsing or force json object
    })

    // To be safe with response_format: { type: "json_object" }, we ask for an object containing an array.
    // Let's modify the architect prompt slightly.
    const architectPromptSafe = `
      Bạn là một chuyên gia thiết kế Landing Page.
      Người dùng yêu cầu: "${prompt}"
      
      Danh sách Blocks:
      ${JSON.stringify(block_schema.map((b: any) => ({ type: b.type, description: b.description }))) }
      
      Hãy chọn các block phù hợp. Trả về JSON theo format: { "blocks": ["type1", "type2", ...] }
    `

    const architectCompletionSafe = await openai.chat.completions.create({
      model: "gemma-4-31b-it",
      messages: [{ role: "user", content: architectPromptSafe }],
      temperature: 0.2,
      response_format: { type: "json_object" }
    })

    const selectedBlocks = JSON.parse(architectCompletionSafe.choices[0].message.content || '{"blocks":[]}').blocks
    
    if (!selectedBlocks || selectedBlocks.length === 0) {
      throw new Error("AI không chọn được block nào.")
    }

    await updateStatus('running', \`Đã chọn \${selectedBlocks.length} blocks. Đang viết nội dung...\`, 30)

    const finalBlocks = []
    let progress = 30
    const progressStep = Math.floor(60 / selectedBlocks.length)

    // Step 2: Copywriter - Generate content for each block
    for (let i = 0; i < selectedBlocks.length; i++) {
      const blockType = selectedBlocks[i]
      const blockDef = block_schema.find((b: any) => b.type === blockType)
      
      if (!blockDef) continue;

      await updateStatus('running', \`Đang viết nội dung cho phần: \${blockDef.label}...\`, progress)

      const copywriterPrompt = `
        Bạn là một copywriter chuyên nghiệp.
        Nhiệm vụ: Viết nội dung cho một phần (block) của Landing Page.
        Yêu cầu tổng thể của trang: "${prompt}"
        
        Block hiện tại: ${blockDef.label} - ${blockDef.description}
        
        Bạn cần điền dữ liệu theo cấu trúc JSON sau (dựa vào defaultData của hệ thống):
        ${JSON.stringify(blockDef.dataSchema, null, 2)}
        
        Quy tắc:
        - Giữ nguyên cấu trúc JSON (đúng tên biến, mảng, object).
        - Điền nội dung tiếng Việt chuyên nghiệp, hấp dẫn.
        - Không trả về text nào khác ngoài cục JSON.
        - Với hình ảnh (ảnh minh họa), hãy dùng URL placeholder tạm thời hoặc bỏ trống (chuỗi rỗng) nếu cấu trúc yêu cầu chuỗi.
      `

      const copywriterCompletion = await openai.chat.completions.create({
        model: "gemma-4-31b-it",
        messages: [{ role: "user", content: copywriterPrompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })

      const blockData = JSON.parse(copywriterCompletion.choices[0].message.content || '{}')
      
      finalBlocks.push({
        type: blockType,
        data: blockData
      })

      progress += progressStep
    }

    await updateStatus('running', 'Đang hoàn tất và lưu trang...', 95)

    // Step 3: Save to Database
    const slug = \`ai-page-\${session_id.substring(0, 8)}\`
    const { data: pageData, error: pageError } = await supabase
      .from('pages')
      .insert([
        {
          title: `Trang tự tạo ${new Date().toLocaleDateString()}`,
          slug: slug,
          blocks: finalBlocks
        }
      ])
      .select()

    if (pageError) {
      console.error("Lỗi khi lưu trang:", pageError)
      throw new Error("Không thể lưu trang vào CSDL.")
    }

    await updateStatus('completed', 'Trang đã được tạo thành công!', 100)

    return new Response(
      JSON.stringify({ success: true, slug, finalBlocks }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )

  } catch (error: any) {
    console.error("Function error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    )
  }
})
