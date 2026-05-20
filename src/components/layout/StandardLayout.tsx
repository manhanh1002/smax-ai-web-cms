import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { cn } from "@/lib/utils";
import SidebarRenderer from "@/components/cms/SidebarRenderer";
import { PopupManager } from "@/components/sections/PopupManager";
import { TopNotificationBarManager } from "@/components/sections/TopNotificationBarManager";

interface StandardLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  layoutType?: 'full' | 'left-sidebar' | 'right-sidebar' | 'double-sidebar';
  sidebarLeftId?: string;
  sidebarRightId?: string;
}

export default function StandardLayout({
  children,
  hideHeader = false,
  hideFooter = false,
  layoutType = 'full',
  sidebarLeftId,
  sidebarRightId,
}: StandardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNotificationBarManager />
      {!hideHeader && <Header />}
      
      <main 
        className={cn(
          "flex-1 w-full transition-all duration-300",
          layoutType !== 'full' && "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8",
          layoutType === 'full' && "pb-24 md:pb-0" // Padding for mobile bottom nav
        )}
        style={{ marginTop: "var(--main-offset, 0px)" }}
      >
        <div className={cn(
          layoutType !== 'full' && "grid gap-12",
          layoutType === 'left-sidebar' && "grid-cols-1 lg:grid-cols-[280px_1fr]",
          layoutType === 'right-sidebar' && "grid-cols-1 lg:grid-cols-[1fr_280px]",
          layoutType === 'double-sidebar' && "grid-cols-1 lg:grid-cols-[240px_1fr_240px]"
        )}>
          {/* Left Sidebar */}
          {(layoutType === 'left-sidebar' || layoutType === 'double-sidebar') && (
            <aside className="hidden lg:block">
              <SidebarRenderer sidebarId={sidebarLeftId} />
            </aside>
          )}

          {/* Main Content */}
          <div className="min-w-0">
            {children}
          </div>

          {/* Right Sidebar */}
          {(layoutType === 'right-sidebar' || layoutType === 'double-sidebar') && (
            <aside className="hidden lg:block">
              <SidebarRenderer sidebarId={sidebarRightId} />
            </aside>
          )}
        </div>
      </main>

      {!hideFooter && <Footer />}
      <MobileBottomNav />
      <PopupManager />
    </div>
  );
}
