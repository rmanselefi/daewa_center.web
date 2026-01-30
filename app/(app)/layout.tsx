"use client";
import { PlayerBar } from "@/components/common/PlayerBar";
import { Sidebar } from "@/components/common/Sidebar";
import { MobileMenu } from "@/components/common/MobileMenu";
import { useIsMobile } from "@/hooks/useMobile";
import { CourseProgressProvider } from "@/contexts/CourseProgressContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  return (
    <CourseProgressProvider>
      <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
        {/* Mobile header with menu button */}
        {isMobile && (
          <header className="shrink-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
            <div className="flex h-14 items-center px-4">
              <MobileMenu />
            </div>
          </header>
        )}

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {!isMobile && <Sidebar />}
          <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden pb-32 md:pb-24">
            {children}
          </main>
        </div>

        <PlayerBar />
      </div>
    </CourseProgressProvider>
  );
}
