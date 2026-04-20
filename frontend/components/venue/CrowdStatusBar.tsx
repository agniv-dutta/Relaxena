"use client";

import { useVenueStore } from "@/stores/venueStore";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

export function CrowdStatusBar() {
  const { zones } = useVenueStore();
  
  const avgDensity = Math.round(zones.reduce((acc, z) => acc + (z.density || 0), 0) / (zones.length || 1));

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 glass p-2 px-6 rounded-3xl border-white/5 animate-in fade-in slide-in-from-right-4 duration-1000">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-12">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Venue Density</span>
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase",
            avgDensity < 40 ? "text-success" : avgDensity < 70 ? "text-warning" : "text-danger"
          )}>
            {avgDensity}% Capacity
          </span>
        </div>
        <div className="w-48 h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]",
              avgDensity < 40 ? "bg-success shadow-[0_0_8px_#22c55e]" : avgDensity < 70 ? "bg-warning shadow-[0_0_8px_#f59e0b]" : "bg-danger shadow-[0_0_8px_#ef4444]"
            )}
            style={{ width: `${avgDensity}%` }}
          />
        </div>
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">
          23,450 / 60,000 attendees inside
        </p>
      </div>

      <div className="hidden sm:block w-px h-10 bg-white/10" />

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_5px_#3b82f6]" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Dynamic Exit</span>
        </div>
        <p className="text-xs font-bold text-white">Gate N4 <span className="text-muted-foreground font-medium ml-1">• 2 min walk</span></p>
        <p className="text-[9px] font-bold text-success uppercase tracking-widest leading-none">Recommended Route Clear</p>
      </div>
    </div>
  );
}

// Simple fallback icon if Users3 is not available in lucide-react standard
const Users3 = (props: any) => (
  <svg 
    {...props} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
