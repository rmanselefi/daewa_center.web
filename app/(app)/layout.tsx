"use client";
import { PlayerBar } from "@/components/common/PlayerBar";
import { Sidebar } from "@/components/common/Sidebar";
import { useIsMobile } from "@/hooks/useMobile";
import { CourseProgressProvider } from "@/contexts/CourseProgressContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  return (
    <CourseProgressProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <div className="flex flex-1 overflow-hidden">
          {!isMobile && <Sidebar />}
          <main className="flex-1 overflow-y-auto pb-32 md:pb-24">
            {children}
          </main>
        </div>

        <PlayerBar />
      </div>
    </CourseProgressProvider>
  );
}
