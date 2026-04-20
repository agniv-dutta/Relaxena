"use client";

import { useQueueStore } from "@/stores/queueStore";
import { cn } from "@/lib/utils";
import { Timer, Users, ArrowRight, X, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QueueStatusHero() {
  const { activeQueue, leaveQueue } = useQueueStore();

  if (!activeQueue) {
    return (
      <div className="relative group overflow-hidden rounded-[2.5rem] bg-zinc-950 border border-white/5 p-8 h-full flex flex-col justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-10 border border-primary/20 rounded-lg skew-x-12 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-16 h-8 border border-secondary/20 rounded-lg -skew-x-12 animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tighter sm:text-4xl">Ready to skip the line?</h2>
            <p className="text-muted-foreground text-sm font-medium">Join a virtual queue and enjoy the game while you wait.</p>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/5">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Avg Saved</p>
              <p className="text-xl font-black text-white">8 Min</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Active</p>
              <p className="text-xl font-black text-white">12 Queues</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Total</p>
              <p className="text-xl font-black text-white">340</p>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-warning fill-warning" />
            Pick a location below to get started
          </p>
        </div>
      </div>
    );
  }

  // Active state
  return (
    <div className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-[#0f172a] to-black p-8 h-full shadow-[0_20px_50px_rgba(59,130,246,0.3)]">
      <div className="absolute top-4 right-4 z-20">
        <div className="px-3 py-1 rounded-full bg-success/20 border border-success/30 flex items-center gap-2 animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          <span className="text-[10px] font-black text-success uppercase tracking-widest">Active</span>
        </div>
      </div>

      <div className="flex flex-col items-center text-center space-y-6">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Animated SVG Ring */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="85"
              className="fill-none stroke-white/5"
              strokeWidth="10"
            />
            <circle
              cx="96"
              cy="96"
              r="85"
              className="fill-none stroke-white transition-all duration-1000 ease-out"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 85}
              strokeDashoffset={2 * Math.PI * 85 * (1 - 0.7)} // Mock 70% progress
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Your Spot</p>
            <p className="text-5xl font-black text-white tracking-tighter">#{activeQueue.position}</p>
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-2">In Line</p>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black text-white tracking-tight">{activeQueue.location_name}</h3>
          <p className="text-sm font-medium text-white/60 flex items-center justify-center gap-2">
            <Timer className="w-4 h-4" /> Ready in ~{activeQueue.estimated_wait_minutes} minutes
          </p>
        </div>

        <div className="w-full pt-4 space-y-4">
           <Button 
             variant="ghost" 
             onClick={leaveQueue}
             className="text-white/40 hover:text-danger hover:bg-danger/10 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
           >
             Cancel Position
           </Button>
        </div>
      </div>
    </div>
  );
}
