import { supabase } from "@/lib/supabase";
import PageRenderer from "@/components/cms/PageRenderer";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import StandardLayout from "@/components/layout/StandardLayout";

export default async function NotFound() {
  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("is_404", true)
    .single();

  if (!page) {
    return (
      <StandardLayout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-slate-50 text-center rounded-3xl">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8 animate-bounce">
            <span className="text-4xl font-black italic">404</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Oops! Trang không tồn tại</h1>
          <p className="text-slate-500 max-w-md mb-10 leading-relaxed">
            Có vẻ như đường dẫn bạn đang truy cập không tồn tại hoặc đã bị gỡ bỏ.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/">
              <Button className="rounded-2xl px-10 h-14 font-bold shadow-xl shadow-primary/25 hover:scale-105 transition-transform">
                Về Trang Chủ
              </Button>
            </Link>
            <Button variant="outline" className="rounded-2xl px-10 h-14 font-bold border-slate-200 hover:bg-white hover:border-slate-300">
              Liên Hệ Hỗ Trợ
            </Button>
          </div>
        </div>
      </StandardLayout>
    );
  }

  // Render content based on type
  const renderContent = () => {
    return <PageRenderer config={page.content_config || {}} />;
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
