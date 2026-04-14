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
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-2 h-20 glass rounded-3xl flex items-center gap-1 min-w-[340px] md:min-w-[400px]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center flex-1 h-14 rounded-2xl transition-all duration-300",
              isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-pink-500 rounded-2xl opacity-100 shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
            )}
            <div className="relative z-10 flex flex-col items-center">
              <item.icon className={cn("w-6 h-6", isActive ? "mb-1" : "mb-1.5")} />
              <span className="text-[10px] font-bold tracking-widest">{item.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
