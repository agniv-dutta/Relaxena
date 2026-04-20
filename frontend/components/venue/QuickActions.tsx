"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Layers, Utensils, Send, Bell } from "lucide-react";

const actions = [
  { label: "My Queue", icon: Layers, href: "/queue", color: "from-blue-500 to-blue-600", glow: "shadow-blue-500/20" },
  { label: "Find Food", icon: Utensils, href: "/queue?category=food", color: "from-amber-400 to-orange-500", glow: "shadow-orange-500/20" },
  { label: "Navigate", icon: Send, href: "/map", color: "from-pink-500 to-rose-600", glow: "shadow-pink-500/20" },
  { label: "Alerts", icon: Bell, href: "/alerts", color: "from-red-500 to-red-600", glow: "shadow-red-500/20" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {actions.map((action) => (
        <Link 
          key={action.label}
          href={action.href}
          className={cn(
            "relative group flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-zinc-900/50 border border-white/5 transition-all duration-300",
            "hover:bg-zinc-800/80 hover:border-white/10 hover:-translate-y-1 hover:shadow-2xl",
            action.glow ? `hover:${action.glow}` : ""
          )}
        >
          <div className={cn(
            "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-lg",
            action.color
          )}>
            <action.icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-[11px] font-black tracking-widest text-zinc-400 group-hover:text-white uppercase transition-colors">
            {action.label}
          </span>
          <div className={cn(
            "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 dark:opacity-[0.03] transition-opacity bg-gradient-to-br",
            action.color
          )} />
        </Link>
      ))}
    </div>
  );
}
