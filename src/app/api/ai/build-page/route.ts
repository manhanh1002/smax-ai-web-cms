import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Thuật toán bóc tách khối JSON nâng cao
function extractJSON(text: string) {
  const match = text.match(/[\{\[]/);
  if (!match) throw new Error("Không tìm thấy ký tự bắt đầu JSON ({ hoặc [)");
  
  const startChar = match[0];
  const endChar = startChar === "{" ? "}" : "]";
  const startIndex = match.index!;

  let count = 0;
  let endIndex = -1;

  for (let i = startIndex; i < text.length; i++) {
    if (text[i] === startChar) count++;
    if (text[i] === endChar) count--;

    if (count === 0) {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) throw new Error(`Không tìm thấy dấu đóng '${endChar}' tương ứng`);

  const jsonStr = text.substring(startIndex, endIndex + 1);
  try {
    const cleaned = jsonStr.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    return JSON.parse(cleaned);
  } catch (e: any) {
    console.error("Lỗi parse JSON:", jsonStr);
    throw new Error("Dữ liệu JSON bị lỗi cấu trúc: " + e.message);
  }
}

const IMAGE_LIBRARY: Record<string, string[]> = {
  interior: [
    "photo-1616486338812-3dadae4b4ace",
    "photo-1618221195710-dd6b41faaea6",
    "photo-1618219908412-a29a1bb7b86e",
    "photo-1600210492486-724fe5c67fb0",
    "photo-1600607687939-ce8a6c25118c",
    "photo-1600585154340-be6161a56a0c",
    "photo-1513694203232-719a280e022f",
    "photo-1616046229478-9901c5536a45",
    "photo-1615529182904-14819c35db37"
  ],
  fashion: [
    "photo-1483985988355-763728e1935b",
    "photo-1490481651871-ab68de25d43d",
    "photo-1479064555552-3ef4979f8908",
    "photo-1515886657613-9f3515b0c78f",
    "photo-1529139574466-a303027c1d8b",
    "photo-1485230895905-ec40ba36b9bc",
    "photo-1539109136881-3be0616acf4b"
  ],
  kids: [
    "photo-1503919545889-aef636e10ad4",
    "photo-1519689680058-324335c77eb2",
    "photo-1602810318383-e386cc2a3ccf",
    "photo-1596464716127-f2a82984de30",
    "photo-1502086223501-7ea6ecd79368",
    "photo-1516627145497-ae6968895b74"
  ],
  tech: [
    "photo-1551434678-e076c223a692",
    "photo-1518770660439-4636190af475",
    "photo-1526374965328-7f61d4dc18c5",
    "photo-1460925895917-afdab827c52f",
    "photo-1498050108023-c5249f4df085",
    "photo-1531403009284-440f080d1e12",
    "photo-1504639725590-34d0984388bd",
    "photo-1517694712202-14dd9538aa97"
  ],
  business: [
    "photo-1557804506-669a67965ba0",
    "photo-1486406146926-c627a92ad1ab",
    "photo-1522071820081-009f0129c71c",
    "photo-1431540015161-0bf868a2d407",
    "photo-1454165804606-c3d57bc86b40",
    "photo-1542744094-3a31f103e35f"
  ],
  education: [
    "photo-1427504494785-3a9ca7044f45",
    "photo-1509062522246-3755977927d7",
    "photo-1523050854058-8df90110c9f1",
    "photo-1516321318423-f06f85e504b3",
    "photo-1544717305-2782549b5136"
  ],
  food: [
    "photo-1504674900247-0877df9cc836",
    "photo-1498837167922-ddd27525d352",
    "photo-1554118811-1e0d58224f24",
    "photo-1517248135467-4c7edcad34c4",
    "photo-1504754524776-8f4f37790ca0",
    "photo-1493770348161-369560ae357d"
  ],
  health: [
    "photo-1517838277536-f5f99be501cd",
    "photo-1544367567-0f2fcb009e0b",
    "photo-1571019613454-1cb2f99b2d8b",
    "photo-1518611012118-696072aa579a",
    "photo-1506126613408-eca07ce68773"
  ],
  beauty: [
    "photo-1608248597481-496100c8c836",
    "photo-1522335789203-aabd1fc54bc9",
    "photo-1598440947619-2c35fc9aa908",
    "photo-1512290923902-8a9f81dc236c"
  ],
  avatar_male: [
    "photo-1500648767791-00dcc994a43e",
    "photo-1507003211169-0a1dd7228f2d",
    "photo-1539571696357-5a69c17a67c6",
    "photo-1506794778202-cad84cf45f1d",
    "photo-1522075469751-3a6694fb2f61"
  ],
  avatar_female: [
    "photo-1494790108377-be9c29b29330",
    "photo-1438761681033-6461ffad8d80",
    "photo-1534528741775-53994a69daeb",
    "photo-1544005313-94ddf0286df2",
    "photo-1580489944761-15a19d654956"
  ],
  general: [
    "photo-1507525428034-b723cf961d3e",
    "photo-1451187580459-43490279c0fa",
    "photo-1469854523086-cc02fe5d8800",
    "photo-1501854140801-50d01698950b"
  ]
};

function detectCategory(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("nội thất") || p.includes("kiến trúc") || p.includes("nhà cửa") || p.includes("thiết kế nội thất") || p.includes("interior") || p.includes("furniture") || p.includes("decor")) {
    return "interior";
  }
  if (p.includes("thời trang trẻ em") || p.includes("trẻ em") || p.includes("baby") || p.includes("kids") || p.includes("sơ sinh") || p.includes("bỉm sữa")) {
    return "kids";
  }
  if (p.includes("thời trang") || p.includes("quần áo") || p.includes("váy") || p.includes("túi xách") || p.includes("fashion") || p.includes("clothing") || p.includes("shoes")) {
    return "fashion";
  }
  if (p.includes("công nghệ") || p.includes("phần mềm") || p.includes("saas") || p.includes("lập trình") || p.includes("ai") || p.includes("trí tuệ nhân tạo") || p.includes("tech") || p.includes("software") || p.includes("app")) {
    return "tech";
  }
  if (p.includes("giáo dục") || p.includes("trường học") || p.includes("học tập") || p.includes("tiếng anh") || p.includes("khóa học") || p.includes("education") || p.includes("school") || p.includes("course") || p.includes("class")) {
    return "education";
  }
  if (p.includes("ẩm thực") || p.includes("nhà hàng") || p.includes("cafe") || p.includes("đồ ăn") || p.includes("nước uống") || p.includes("food") || p.includes("restaurant") || p.includes("drink")) {
    return "food";
  }
  if (p.includes("sức khỏe") || p.includes("gym") || p.includes("yoga") || p.includes("thể hình") || p.includes("fitness") || p.includes("health") || p.includes("workout")) {
    return "health";
  }
  if (p.includes("mỹ phẩm") || p.includes("spa") || p.includes("làm đẹp") || p.includes("son") || p.includes("skincare") || p.includes("beauty") || p.includes("cosmetics")) {
    return "beauty";
  }
  if (p.includes("doanh nghiệp") || p.includes("công ty") || p.includes("dịch vụ") || p.includes("marketing") || p.includes("kinh doanh") || p.includes("business") || p.includes("office")) {
    return "business";
  }
  return "general";
}

function isImageUrlField(key: string, val: string): boolean {
  const k = key.toLowerCase();
  const v = val.toLowerCase();

  // Loại trừ các link form hay link điều hướng thông thường
  if (k.includes("form") || k.includes("redirect") || k.includes("action") || (k.includes("link") && !v.includes("image") && !v.includes("unsplash") && !v.includes("picsum"))) {
    if (k === "link" || k === "url" || k === "href") return false;
  }

  const imageKeys = ["image", "imageurl", "bgimage", "avatar", "avatarurl", "thumbnail", "photo", "logo", "icon", "featured_image", "bg_image", "beforeimage", "afterimage", "src"];
  const matchesKey = imageKeys.some(ik => k.includes(ik));
  const matchesValue = v.startsWith("http") && (
    v.includes("placeholder") || 
    v.includes("unsplash.com") || 
    v.includes("picsum.photos") || 
    v.includes(".jpg") || 
    v.includes(".jpeg") || 
    v.includes(".png") || 
    v.includes(".webp") || 
    v.includes(".svg")
  );

  return matchesKey || matchesValue;
}

function substituteWithRealImage(key: string, originalVal: string, category: string, usedIds: Set<string>): string {
  const k = key.toLowerCase();
  let cat = category;
  
  if (k.includes("avatar")) {
    cat = Math.random() > 0.5 ? "avatar_male" : "avatar_female";
  }

  const ids = IMAGE_LIBRARY[cat] || IMAGE_LIBRARY["general"];
  let availableIds = ids.filter(id => !usedIds.has(id));
  if (availableIds.length === 0) {
    availableIds = ids;
  }

  const selectedId = availableIds[Math.floor(Math.random() * availableIds.length)];
  usedIds.add(selectedId);

  if (k.includes("avatar")) {
    return `https://images.unsplash.com/${selectedId}?auto=format&fit=crop&w=150&h=150&q=80&crop=face`;
  }
  
  return `https://images.unsplash.com/${selectedId}?auto=format&fit=crop&w=1200&h=800&q=80`;
}

function processImageFields(obj: any, category: string, usedIds: Set<string>): any {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => processImageFields(item, category, usedIds));
  }

  if (typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const val = obj[key];
        if (typeof val === "string" && isImageUrlField(key, val)) {
          newObj[key] = substituteWithRealImage(key, val, category, usedIds);
        } else if (typeof val === "object") {
          newObj[key] = processImageFields(val, category, usedIds);
        } else {
          newObj[key] = val;
        }
      }
    }
    return newObj;
  }

  return obj;
}

export async function POST(req: Request) {
  try {
    const { session_id, prompt, block_schema, action = "generate", type = "page", messages } = await req.json();
    const detectedCategory = detectCategory(prompt);
    const usedImageIds = new Set<string>();

    const openai = new OpenAI({
      apiKey: process.env.TOKEN_AI_VN_API_KEY,
      baseURL: 'https://token.ai.vn/v1'
    });

    const modelName = "gpt-5-chat";

    const updateStatus = async (status: string, current_step: string, progress: number) => {
      await supabase.from('ai_generation_status').upsert({
        session_id,
        status,
        current_step,
        progress,
        updated_at: new Date().toISOString()
      }, { onConflict: 'session_id' });
    };

    if (action === "discuss") {
      const systemPrompt = `Bạn là một trợ lý ảo tư vấn thiết kế Website & Marketing chuyên nghiệp của Smax AI.
Nhiệm vụ của bạn là thảo luận, đóng góp ý kiến và hoàn thiện ý tưởng thiết kế/viết nội dung của người dùng trước khi tiến hành khởi tạo thực sự.

Dựa trên yêu cầu của người dùng đối với loại tài sản: "${type}", hãy phản hồi bằng định dạng JSON có cấu trúc sau:
{
  "outline": "Dưới dạng Markdown. Liệt kê cấu trúc đề xuất (ví dụ: các block đối với Page, các tiêu đề đối với Blog, các trường/bước đối với Form, hay layout/nội dung đối với Popup).",
  "suggestion": "Tư vấn tổng quan về phong cách thiết kế, tone giọng viết bài, hoặc gợi ý giao diện phù hợp.",
  "questions": [
    "Câu hỏi làm rõ 1 (ví dụ: Bạn muốn dùng tone giọng chuyên nghiệp hay thân thiện?)",
    "Câu hỏi làm rõ 2 (ví dụ: Bạn có muốn thêm phần bảng giá dịch vụ không?)"
  ]
}`;

      const chatCompletion = await openai.chat.completions.create({
        model: modelName,
        messages: [
          { role: "system", content: systemPrompt },
          ...(messages || []).map((m: any) => ({ role: m.role, content: m.content })),
          { role: "user", content: `Tôi muốn làm một ${type} với yêu cầu: "${prompt}"` }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const responseText = chatCompletion.choices[0].message.content || "";
      const discussResult = extractJSON(responseText);
      return NextResponse.json({ success: true, ...discussResult });
    }

    if (type === "blog") {
      await updateStatus('running', 'Đang thiết kế bố cục bài viết...', 20);
      const blogPrompt = `
        Bạn là chuyên gia Content Writer và SEO hàng đầu. 
        Hãy tạo một bài viết blog chất lượng cao dưới dạng mã HTML theo yêu cầu: "${prompt}".
        
        CẤU TRÚC JSON CẦN TRẢ VỀ:
        {
          "title": "Tiêu đề bài viết",
          "summary": "Tóm tắt ngắn gọn dưới 150 ký tự",
          "seo_title": "Tiêu đề SEO",
          "seo_description": "Mô tả SEO",
          "seo_keywords": ["từ khóa 1", "từ khóa 2"],
          "featured_image": "https://images.unsplash.com/photo-placeholder?auto=format&fit=crop&w=1200&h=800&q=80",
          "html_content": "<h2>Tiêu đề phần 1</h2><p>Nội dung chi tiết...</p><img src=\\"https://images.unsplash.com/photo-placeholder?auto=format&fit=crop&w=800&q=80\\" alt=\\"mô tả ảnh\\" />..."
        }
        
        LƯU Ý QUAN TRỌNG:
        - Viết bằng Tiếng Việt.
        - Độ dài tối thiểu: BẮT BUỘC viết ít nhất 800 - 1000 từ. Phân tích thật chi tiết và chuyên sâu cho từng khía cạnh, tránh viết ngắn hay qua loa đại khái.
        - Cấu trúc bài viết: Phải mạch lạc và phân cấp rõ ràng bằng các thẻ <h2> và <h3>. Có tối thiểu 4 tiêu đề chính (<h2>) và mỗi tiêu đề chính cần đi kèm ít nhất 2-3 đoạn văn dài chi tiết cùng các ý nhỏ (<h3>).
        - Nội dung trong 'html_content' phải là mã HTML sạch, sử dụng các thẻ phong phú: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote> để bài viết sinh động, dễ đọc.
        - Chèn ít nhất 2 - 3 thẻ <img> ở các đoạn phù hợp trong bài với nguồn là các placeholder dạng: https://images.unsplash.com/photo-[placeholder]... để hệ thống tự động thay bằng ảnh thật chất lượng từ Unsplash.
      `;

      const blogCompletion = await openai.chat.completions.create({
        model: modelName,
        messages: [
          { role: "system", content: "Bạn là chuyên gia Copywriting & SEO. Trả về JSON." },
          { role: "user", content: blogPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const responseText = blogCompletion.choices[0].message.content || "";
      const blogData = extractJSON(responseText);
      const processedBlogData = processImageFields(blogData, detectedCategory, usedImageIds);

      await updateStatus('running', 'Đang lưu bài viết...', 80);

      const dbContent = [
        {
          type: "richText",
          data: {
            content: processedBlogData.html_content
          }
        }
      ];

      const slug = `blog-${session_id.substring(0, 8)}-${Math.floor(Math.random() * 1000)}`;
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          title: processedBlogData.title,
          slug: slug,
          summary: processedBlogData.summary,
          content: dbContent,
          featured_image: processedBlogData.featured_image || null,
          seo_title: processedBlogData.seo_title,
          seo_description: processedBlogData.seo_description,
          seo_keywords: processedBlogData.seo_keywords,
          status: 'published',
          published_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (postError) throw postError;

      await updateStatus('completed', 'Bài viết đã được tạo thành công!', 100);
      return NextResponse.json({ success: true, id: postData?.id, type: "blog" });
    }

    if (type === "form") {
      await updateStatus('running', 'Đang thiết kế cấu trúc form...', 20);
      const formPrompt = `
        Bạn là chuyên gia thiết kế form thu thập lead & tối ưu chuyển đổi (CRO).
        Hãy tạo cấu trúc form theo yêu cầu: "${prompt}".
        
        CẤU TRÚC JSON CẦN TRẢ VỀ:
        {
          "name": "Tên form (Ví dụ: Form Đăng Ký Khóa Học)",
          "description": "Mô tả ngắn của form",
          "settings": {
            "type": "onestep" hoặc "multistep",
            "submit_label": "Nhãn nút gửi (Ví dụ: Đăng ký nhận ưu đãi)",
            "success_message": "Lời chúc mừng hoặc cảm ơn khi gửi thành công",
            "theme": { "primary_color": "#3b82f6" }
          },
          "steps": [
            {
              "id": "step-1",
              "title": "Tiêu đề bước",
              "fields": [
                {
                  "type": "text",
                  "name": "tên_trường_không_dấu_viết_liền",
                  "label": "Nhãn hiển thị",
                  "placeholder": "Gợi ý nhập liệu",
                  "required": true,
                  "options": []
                }
              ]
            }
          ]
        }
        
        LƯU Ý: các field type chỉ có các loại: text, email, phone, textarea, select, radio, checkbox, rating, slider, date, file.
      `;

      const formCompletion = await openai.chat.completions.create({
        model: modelName,
        messages: [
          { role: "system", content: "Bạn là chuyên gia CRO. Trả về JSON." },
          { role: "user", content: formPrompt }
        ],
        temperature: 0.6,
        response_format: { type: "json_object" }
      });

      const responseText = formCompletion.choices[0].message.content || "";
      const formData = extractJSON(responseText);

      await updateStatus('running', 'Đang lưu form...', 80);

      const { data: newFormData, error: formError } = await supabase
        .from('forms')
        .insert({
          name: formData.name,
          description: formData.description || "",
          steps: formData.steps || [],
          settings: formData.settings || {}
        })
        .select('id')
        .single();

      if (formError) throw formError;

      await updateStatus('completed', 'Form đã được tạo thành công!', 100);
      return NextResponse.json({ success: true, id: newFormData?.id, type: "form" });
    }

    if (type === "popup") {
      await updateStatus('running', 'Đang thiết kế giao diện popup...', 20);
      const popupPrompt = `
        Bạn là chuyên gia marketing và tối ưu chuyển đổi.
        Hãy tạo popup tiếp thị theo yêu cầu: "${prompt}".
        
        CẤU TRÚC JSON CẦN TRẢ VỀ:
        {
          "name": "Tên popup (Ví dụ: Popup Tặng Mã Giảm Giá)",
          "type": "modal" hoặc "slide-in" hoặc "bar",
          "position": "center" hoặc "top-left" hoặc "top-right" hoặc "bottom-left" hoặc "bottom-right",
          "content": {
            "layout": "1col" hoặc "2col",
            "cols": [
              {
                "type": "text",
                "heading": "Tiêu đề nổi bật",
                "subheading": "Tiêu đề phụ",
                "body": "Đoạn văn mô tả chi tiết"
              },
              {
                "type": "image",
                "imageUrl": "https://images.unsplash.com/photo-placeholder?q=80"
              }
            ]
          },
          "conditions": {
            "trigger": "time_delay" hoặc "scroll_depth" hoặc "exit_intent" hoặc "on_load",
            "delay_seconds": 5,
            "scroll_percent": 50,
            "page_target": "all",
            "page_urls": [],
            "devices": ["desktop", "mobile"],
            "frequency": "once_per_session"
          },
          "settings": {
            "theme": { "primary_color": "#3b82f6", "bg_color": "#ffffff" },
            "animation": "fade" hoặc "slide-up" hoặc "zoom",
            "backdrop": true,
            "show_close": true,
            "width": "md"
          }
        }
      `;

      const popupCompletion = await openai.chat.completions.create({
        model: modelName,
        messages: [
          { role: "system", content: "Bạn là chuyên gia Marketing. Trả về JSON." },
          { role: "user", content: popupPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const responseText = popupCompletion.choices[0].message.content || "";
      const popupData = extractJSON(responseText);
      const processedPopupData = processImageFields(popupData, detectedCategory, usedImageIds);

      await updateStatus('running', 'Đang lưu popup...', 80);

      const { data: newPopupData, error: popupError } = await supabase
        .from('popups')
        .insert({
          name: processedPopupData.name,
          type: processedPopupData.type || "modal",
          position: processedPopupData.position || "center",
          is_active: true,
          content: processedPopupData.content || {},
          conditions: processedPopupData.conditions || {},
          settings: processedPopupData.settings || {}
        })
        .select('id')
        .single();

      if (popupError) throw popupError;

      await updateStatus('completed', 'Popup đã được tạo thành công!', 100);
      return NextResponse.json({ success: true, id: newPopupData?.id, type: "popup" });
    }

    await updateStatus('running', 'Đang thiết kế cấu trúc trang...', 10);

    // Group blocks by category for better AI understanding
    const blocksByCategory = block_schema.reduce((acc: any, block: any) => {
      const cat = block.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(block);
      return acc;
    }, {});

    const blockDescriptionList = Object.entries(blocksByCategory).map(([category, blocks]: [string, any]) => {
      return `### NHÓM: ${category}\n` + blocks.map((b: any) => `- TYPE: "${b.type}" | TÊN: ${b.label} | MÔ TẢ: ${b.description}`).join("\n");
    }).join("\n\n");

    // Step 1: Architect
    const architectPrompt = `
      Bạn là một chuyên gia kiến trúc Website Landing Page. 
      NHIỆM VỤ: Thiết kế cấu trúc trang hoàn chỉnh cho yêu cầu: "${prompt}"
      
      DƯỚI ĐÂY LÀ KHO BLOCK BẠN CÓ (ĐÃ PHÂN LOẠI):
      ${blockDescriptionList}
      
      QUY TẮC THIẾT KẾ:
      1. Bắt đầu bằng 1 block nhóm "layout" (thường là "hero").
      2. Tiếp theo là các block giới thiệu giá trị (Features, Content, Social...).
      3. Kết thúc bằng "cta" hoặc "faq".
      4. Tổng cộng chọn ít nhất 6-8 block. 
      5. CHÚ Ý: Sử dụng CHÍNH XÁC giá trị trong cột "TYPE" (ví dụ: "hero", "features", "pricing"...).
      
      TRẢ VỀ JSON: { "blocks": ["type_1", "type_2", ...] }
    `;

    const architectCompletion = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: "Bạn là chuyên gia UI/UX Architect. Chỉ trả về JSON." },
        { role: "user", content: architectPrompt }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const architectResponse = architectCompletion.choices[0].message.content || "";
    const architectData = extractJSON(architectResponse);
    const selectedBlocksRaw = architectData.blocks || [];
    
    console.log("🔍 AI ARCHITECT RETURNED:", selectedBlocksRaw);

    // Chuẩn hóa type (chuyển về chữ thường để khớp registry)
    const selectedBlocks = selectedBlocksRaw.map((t: string) => t.toLowerCase());

    if (selectedBlocks.length === 0) {
      throw new Error("AI Architect không chọn được block nào.");
    }

    await updateStatus('running', `Đã chọn ${selectedBlocks.length} blocks. Đang viết nội dung...`, 30);

    const finalBlocks = [];
    let progressCount = 30;
    const progressStep = Math.floor(60 / selectedBlocks.length);

    // Step 2: Copywriter
    for (let i = 0; i < selectedBlocks.length; i++) {
      const blockType = selectedBlocks[i];
      // Tìm kiếm case-insensitive
      const blockDef = block_schema.find((b: any) => b.type.toLowerCase() === blockType);
      
      if (!blockDef) {
        console.warn(`❌ KHÔNG TÌM THẤY BLOCK TYPE: "${blockType}" trong registry. Bỏ qua.`);
        continue;
      }

      console.log(`✍️ Viết nội dung cho block: ${blockType}`);
      await updateStatus('running', `Đang viết nội dung: ${blockDef.label} (${i+1}/${selectedBlocks.length})...`, progressCount);

      const copywriterPrompt = `
        Bạn là bậc thầy Copywriter. Viết nội dung cho block "${blockDef.label}".
        Yêu cầu trang: "${prompt}"
        Mô tả block: ${blockDef.description}
        
        CẤU TRÚC JSON CẦN ĐIỀN:
        ${JSON.stringify(blockDef.dataSchema, null, 2)}
        
        LƯU Ý: 
        - Viết tiếng Việt hấp dẫn.
        - Với mảng (items), hãy tạo ra số lượng item phù hợp (3-6 mục).
        - Với các trường hình ảnh (như image, imageUrl, avatar, avatarUrl, bgImage, logo, icon, src v.v.), điền đường dẫn ảnh mẫu Unsplash thực tế: "https://images.unsplash.com/photo-..." kèm từ khóa tiếng Anh phù hợp.
        - Trả về JSON hoàn chỉnh.
      `;

      const copywriterCompletion = await openai.chat.completions.create({
        model: modelName,
        messages: [
          { role: "system", content: "Bạn là chuyên gia Content Marketing. Trả về JSON." },
          { role: "user", content: copywriterPrompt }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" }
      });

      const copywriterResponse = copywriterCompletion.choices[0].message.content || "";
      const blockData = extractJSON(copywriterResponse);
      const processedData = processImageFields(blockData, detectedCategory, usedImageIds);
      
      finalBlocks.push({
        type: blockDef.type, // Dùng type gốc từ registry
        data: processedData
      });

      progressCount += progressStep;
    }

    if (finalBlocks.length === 0) {
      throw new Error("Hệ thống không khớp được bất kỳ Block nào AI chọn với Registry.");
    }

    await updateStatus('running', 'Đang lưu trang...', 95);

    const slug = `ai-page-${session_id.substring(0, 8)}-${Math.floor(Math.random() * 1000)}`;
    const { data: pageData, error: pageError } = await supabase
      .from('pages')
      .insert([
        {
          title: `AI Generated Page - ${new Date().toLocaleTimeString()}`,
          slug: slug,
          blocks: finalBlocks
        }
      ])
      .select('id')
      .single();

    if (pageError) throw pageError;

    await updateStatus('completed', 'Hoàn tất! Trang của bạn đã có đầy đủ nội dung.', 100);
    return NextResponse.json({ success: true, slug, id: pageData?.id, finalBlocks });

  } catch (error: any) {
    console.error("❌ AI Builder Detailed Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
