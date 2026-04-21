import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { RexiChatbot } from "../ai/RexiChatbot";
import { PageTransition } from "@/components/motion/PageTransition";
import { CommandPalette } from "@/components/system/CommandPalette";
import { WebsocketStatusBanner } from "@/components/system/WebsocketStatusBanner";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const { reduceMotion, compactMode } = useUIStore();

  return (
    <div className={cn("min-h-screen text-foreground selection:bg-primary/30", reduceMotion && "reduce-motion", compactMode && "compact-mode")}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      <div className="lg:pl-60 min-h-screen flex flex-col">
        <TopBar />
        <WebsocketStatusBanner />
        <main className="flex-1 pt-16 p-4 md:p-8 pb-32 md:pb-8">
          <div className="max-w-[1600px] mx-auto">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>

      {/* Global AI Floating Assistant */}
      <RexiChatbot />

      {/* Mobile Navigation */}
      <BottomNav />
      <CommandPalette />
    </div>
  );
}
