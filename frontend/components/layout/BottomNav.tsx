"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map as MapIcon, Layers, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "HOME", icon: Home, href: "/dashboard" },
  { label: "MAP", icon: MapIcon, href: "/map" },
  { label: "QUEUE", icon: Layers, href: "/queue" },
  { label: "ALERTS", icon: Bell, href: "/alerts" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5 h-20 md:h-24 px-4 flex items-center justify-between gap-2 max-w-full lg:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center flex-1 h-16 rounded-2xl transition-all duration-300 active:scale-90",
              isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {isActive && (
              <div className="absolute inset-x-2 inset-y-1 bg-gradient-to-br from-blue-500/20 to-pink-500/20 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]" />
            )}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <item.icon className={cn(
                "w-5 h-5 transition-transform",
                isActive ? "scale-110 text-primary" : ""
              )} />
              <span className={cn(
                "text-[10px] font-black tracking-widest uppercase",
                isActive ? "text-white" : "text-muted-foreground/60"
              )}>
                {item.label}
              </span>
            </div>
            {isActive && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_#3b82f6]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
