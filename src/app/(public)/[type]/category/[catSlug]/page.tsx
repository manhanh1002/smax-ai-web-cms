import { supabase } from "@/lib/supabase";
import StandardLayout from "@/components/layout/StandardLayout";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default async function CPTCategoryArchivePage({ params }: { params: Promise<{ type: string; catSlug: string }> }) {
  const { type: typeSlug, catSlug } = await params;

  // 1. Fetch content type settings
  const { data: ct } = await supabase
    .from("content_types")
    .select("*")
    .eq("slug", typeSlug)
    .single();

  if (!ct) return notFound();

  // 2. Fetch category
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("content_type_slug", typeSlug)
    .eq("slug", catSlug)
    .single();

  if (!category) return notFound();

  // 3. Fetch posts in this category
  const { data: posts } = await supabase
    .from("content_posts")
    .select("*, categories(name)")
    .eq("content_type_slug", typeSlug)
    .eq("category_id", category.id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <StandardLayout 
      sidebarLeftId={ct.archive_sidebar_id}
      hideHeader={false}
      hideFooter={false}
    >
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <header className="mb-16">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-2">
            <Link href={`/${typeSlug}`} className="hover:underline">{ct.name}</Link>
            <ChevronRight className="w-3 h-3" />
            <span>Danh mục</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Chuyên mục: {category.name}
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!posts || posts.length === 0 ? (
            <div className="col-span-full py-32 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold">Chưa có bài viết nào trong chuyên mục này.</p>
            </div>
          ) : (
            posts.map((post: any) => (
              <Link 
                key={post.id} 
                href={`/${typeSlug}/${post.slug}`}
                className="group flex flex-col bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
              >
                <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent group-hover:scale-110 transition-transform duration-700"></div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-500 line-clamp-3 mb-8 text-sm leading-relaxed">
                    {Object.values(post.meta_data || {}).filter(v => typeof v === 'string' && v.length > 20)[0] as string || "Xem chi tiết thông tin về " + post.title}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.created_at).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </StandardLayout>
  );
}
