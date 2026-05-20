import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import PageRenderer from "@/components/cms/PageRenderer";
import { ProductTemplate } from "@/components/templates/ProductTemplate";
import StandardLayout from "@/components/layout/StandardLayout";


export default async function PublicPage({ params }: { params: Promise<{ type: string }> }) {
  const { type: slug } = await params;
  
  // 1. Check if it's a custom page
  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (page) {
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

  // 2. Not found
  notFound();
}
