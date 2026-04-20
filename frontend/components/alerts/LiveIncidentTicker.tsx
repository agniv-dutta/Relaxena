"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";

const mockIncidents = [
  { text: "Gate 5 congestion — use Gate 6", icon: AlertTriangle, color: "text-warning" },
  { text: "Stand 3 wait now 8 min", icon: Info, color: "text-blue-400" },
  { text: "North Exit cleared", icon: CheckCircle2, color: "text-success" },
  { text: "Weather update: 28°C Clear", icon: Info, color: "text-blue-400" },
];

export function LiveIncidentTicker() {
  return (
    <div className="w-full bg-zinc-950 border-y border-white/5 py-3 overflow-hidden whitespace-nowrap relative">
      <div className="flex animate-[ticker_30s_linear_infinite] hover:[animation-play-state:paused] w-max gap-12">
        {/* Repeat twice for seamless loop */}
        {[...mockIncidents, ...mockIncidents].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <item.icon className={cn("w-3 h-3", item.color)} />
            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
              {item.text}
            </span>
            <span className="text-white/20 mx-4">•</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
