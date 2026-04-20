"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Users, 
  MessageSquare, 
  Bell, 
  BarChart3, 
  Settings,
  Zap
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/map", label: "Live Map", icon: MapIcon },
  { href: "/queue", label: "Queue Manager", icon: Users },
  { href: "/assistant", label: "AI Assistant", icon: MessageSquare },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-screen fixed left-0 top-0 border-r border-border bg-surface flex flex-col z-50">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_-5px_#3b82f6]">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Relaxena
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary/10 text-primary font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-primary" : "group-hover:text-white"
              )} />
              <span className="text-sm">{item.label}</span>
              {isActive && (
                <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-4 border border-primary/20">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Current Event</p>
          <p className="text-sm font-medium text-white truncate">Final Cup 2026</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-muted-foreground">Live Tracking Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
