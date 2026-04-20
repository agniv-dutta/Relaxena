import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Sidebar />
      <div className="pl-60">
        <TopBar />
        <main className="pt-16 p-8 min-h-screen">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
