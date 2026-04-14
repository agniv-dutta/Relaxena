"use client";

import Link from "next/link";
import { Layers, Utensils, Send, Bell } from "lucide-react";

const actions = [
  { label: "MY QUEUE", icon: Layers, href: "/queue", color: "text-blue-400" },
  { label: "FIND FOOD", icon: Utensils, href: "/queue?filter=food", color: "text-cyan-400" },
  { label: "NAVIGATE", icon: Send, href: "/navigate", color: "text-pink-500" },
  { label: "ALERTS", icon: Bell, href: "/alerts", color: "text-red-400" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4 w-full md:w-auto md:min-w-[320px]">
      {actions.map((action) => (
        <Link 
          key={action.label}
          href={action.href}
          className="glass aspect-square flex flex-col items-center justify-center gap-4 rounded-[40px] hover:bg-zinc-800/60 transition-all duration-300 group"
        >
          <action.icon className={`w-8 h-8 ${action.color} group-hover:scale-110 transition-transform`} />
          <span className="text-[10px] font-black tracking-widest text-zinc-500 group-hover:text-zinc-300">
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
