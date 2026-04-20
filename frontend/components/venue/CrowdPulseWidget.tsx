"use client";

import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

export function CrowdPulseWidget() {
  const score = 74; // Mock crowd score

  return (
    <div className="glass p-6 rounded-3xl border-white/5 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Crowd Pulse
        </h3>
        <span className="text-[10px] font-black text-primary uppercase tracking-widest animate-pulse">Live</span>
      </div>

      <div className="flex flex-col items-center justify-center p-4">
        {/* Circular Gauge */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              className="fill-none stroke-zinc-900"
              strokeWidth="10"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              className={cn(
                "fill-none transition-all duration-1000 ease-out",
                score < 50 ? "stroke-success" : score < 80 ? "stroke-warning" : "stroke-danger"
              )}
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 58}
              strokeDashoffset={2 * Math.PI * 58 * (1 - score / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white tabular-nums">{score}</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Energy</span>
          </div>
        </div>

        <div className="mt-6 text-center space-y-1">
          <p className="text-xs font-bold text-white">Peak expected at halftime</p>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Current vibe: Energetic</p>
        </div>
      </div>
    </div>
  );
}
