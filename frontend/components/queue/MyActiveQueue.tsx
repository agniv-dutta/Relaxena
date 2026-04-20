"use client";

import { useQueueStore } from "@/stores/queueStore";
import { Button } from "@/components/ui/button";
import { XCircle, Bell, Navigation, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

export function MyActiveQueue() {
  const { activeQueue, leaveQueue } = useQueueStore();

  if (!activeQueue) return null;

  const progress = Math.min(100, Math.max(0, 100 - (activeQueue.position / 50) * 100));

  return (
    <div className="sticky top-24 space-y-6 animate-in slide-in-from-right-8 duration-700">
      <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/20 via-surface to-zinc-900 border border-primary/20 shadow-2xl relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Live Queue Active
          </div>

          <div className="relative flex justify-center">
            {/* SVG Countdown Ring */}
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-white/5"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={552.92}
                strokeDashoffset={552.92 * (1 - progress / 100)}
                className="text-primary transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Your Position</span>
              <span className="text-6xl font-black text-white leading-none">{activeQueue.position}</span>
              <span className="text-xs font-bold text-primary mt-2">WAITING</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-white">{activeQueue.location_name}</h3>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Timer className="w-4 h-4" /> Estimated Wait: <span className="text-white font-bold">{activeQueue.estimated_wait_minutes} min</span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button className="w-full h-12 rounded-2xl bg-white text-black hover:bg-white/90 font-bold gap-2">
              <Navigation className="w-4 h-4" /> Get Directions
            </Button>
            <Button 
              variant="outline" 
              onClick={leaveQueue}
              className="w-full h-12 rounded-2xl border-white/10 bg-white/5 hover:bg-danger/10 hover:text-danger hover:border-danger/30 transition-all text-muted-foreground font-bold"
            >
              <XCircle className="w-4 h-4" /> Leave Queue
            </Button>
          </div>
        </div>
      </div>

      {/* Status Notifications */}
      <div className="p-5 rounded-2xl bg-zinc-900/50 border border-border flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Bell className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-white">Position Alerts Enabled</p>
          <p className="text-[10px] text-muted-foreground">We'll notify you when you're 5th in line.</p>
        </div>
      </div>
    </div>
  );
}
