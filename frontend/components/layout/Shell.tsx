import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { RexiChatbot } from "../ai/RexiChatbot";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-foreground selection:bg-primary/30">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      <div className="lg:pl-60 min-h-screen flex flex-col">
        <TopBar />
        <main className="flex-1 pt-16 p-4 md:p-8 pb-32 md:pb-8">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {children}
          </div>
        </main>
      </div>

      {/* Global AI Floating Assistant */}
      <RexiChatbot />

      {/* Mobile Navigation */}
      <BottomNav />
    </div>
  );
}
