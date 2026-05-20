import { supabase } from "@/lib/supabase";
import PageRenderer from "@/components/cms/PageRenderer";
import { ProductTemplate } from "@/components/templates/ProductTemplate";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import StandardLayout from "@/components/layout/StandardLayout";

export default async function Home() {
  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("is_home", true)
    .single();

  if (!page) {
    return (
      <StandardLayout>
        <main className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-slate-50 text-center rounded-3xl">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome to Smax AI</h1>
          <p className="text-slate-500 max-w-md mb-8">
            Vui lòng vào trang quản trị để thiết lập trang chủ cho website của bạn.
          </p>
          <Link href="/admin/pages">
            <Button className="rounded-2xl px-8 h-12 font-bold shadow-lg shadow-primary/20">
              Đi tới trang quản trị
            </Button>
          </Link>
        </main>
      </StandardLayout>
    );
  }

  // Render content based on type
  const renderContent = () => {
    if (page.type === 'product') {
      return <ProductTemplate config={page.content_config || {}} />;
    }
    const blocks = page.content_config?.blocks || [];
    return <PageRenderer blocks={blocks} />;
  };

  return (
    <StandardLayout
      layoutType={page.layout_type}
      hideHeader={page.hide_header}
      hideFooter={page.hide_footer}
      sidebarLeftId={page.sidebar_left_id}
      sidebarRightId={page.sidebar_right_id}
    >
      {renderContent()}
    </StandardLayout>
  );
}
