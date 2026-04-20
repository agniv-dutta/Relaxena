"use client";

import { cn } from "@/lib/utils";
import { Radar, Users, Sun, CloudSun } from "lucide-react";

export function AlertsHero() {
  return (
    <div className="relative h-64 rounded-[2.5rem] bg-zinc-950 border border-white/5 overflow-hidden group">
      {/* Stadium Background Mockup */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540747913346-19e3adbb47c1?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 grayscale group-hover:grayscale-0 transition-all duration-1000" />
      
      {/* Radar Sweep Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/5 rounded-full" />
        {/* The Scanning Line */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-radar" />
      </div>

      {/* Badges & Content */}
      <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10">
        <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
        <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Live Monitoring</span>
      </div>

      <div className="absolute top-6 left-6 flex items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-white">
            <CloudSun className="w-5 h-5 text-warning" />
            <span className="text-xl font-black tabular-nums tracking-tighter">28°C</span>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Clear Sky</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-xl font-black text-white tabular-nums tracking-tighter">23,450</span>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Attendees Inside</span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
           <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto shadow-2xl">
              <Radar className="w-8 h-8 text-primary animate-pulse" />
           </div>
           <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">System Normal</p>
        </div>
      </div>
    </div>
  );
}
