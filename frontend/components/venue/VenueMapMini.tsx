"use client";

import { useVenueStore } from "@/stores/venueStore";
import { cn } from "@/lib/utils";

export function VenueMapMini() {
  const { zones } = useVenueStore();

  const getZoneColor = (density: number) => {
    if (density < 40) return "fill-success/40 stroke-success/60";
    if (density < 71) return "fill-warning/40 stroke-warning/60";
    return "fill-danger/40 stroke-danger/60";
  };

  return (
    <div className="aspect-square bg-zinc-900/50 rounded-2xl border border-border flex items-center justify-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)] pointer-events-none" />
      
      <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 drop-shadow-2xl">
        {/* Simple stadium floor plan */}
        <ellipse 
          cx="100" cy="100" rx="90" ry="70" 
          className="fill-zinc-800 stroke-border stroke-2" 
        />
        <ellipse 
          cx="100" cy="100" rx="60" ry="40" 
          className="fill-zinc-950 stroke-border/50 stroke-1" 
        />
        
        {/* Dynamic Zones */}
        <path 
          d="M30,100 A70,70 0 0,1 100,30 L100,60 A40,40 0 0,0 60,100 Z" 
          className={cn("transition-colors duration-500", getZoneColor(zones[0]?.density || 25))} 
        />
        <path 
          d="M100,30 A70,70 0 0,1 170,100 L140,100 A40,40 0 0,0 100,60 Z" 
          className={cn("transition-colors duration-500", getZoneColor(zones[1]?.density || 68))} 
        />
        <path 
          d="M170,100 A70,70 0 0,1 100,170 L100,140 A40,40 0 0,0 140,100 Z" 
          className={cn("transition-colors duration-500", getZoneColor(zones[2]?.density || 84))} 
        />
        <path 
          d="M100,170 A70,70 0 0,1 30,100 L60,100 A40,40 0 0,0 100,140 Z" 
          className={cn("transition-colors duration-500", getZoneColor(20))} 
        />
      </svg>

      <div className="absolute bottom-4 left-4 flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Clear</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-warning" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Busy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-danger" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Congested</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 group-hover:scale-110 transition-transform">
        <div className="p-2 rounded-lg bg-surface/80 backdrop-blur-sm border border-border shadow-lg">
          <MapIcon className="w-4 h-4 text-primary" />
        </div>
      </div>
    </div>
  );
}

import { Map as MapIcon } from "lucide-react";
