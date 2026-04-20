"use client";

import { useState } from "react";
import { useVenueStore } from "@/stores/venueStore";
import { cn } from "@/lib/utils";
import { Info, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VenueMapFullProps {
  onZoneClick: (zoneId: string) => void;
}

export function VenueMapFull({ onZoneClick }: VenueMapFullProps) {
  const { zones } = useVenueStore();
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const getZoneColor = (density: number, id: string) => {
    const isSelected = activeZone === id;
    let base = "";
    
    if (density < 40) base = "fill-success/20 stroke-success/60 hover:fill-success/30";
    else if (density < 71) base = "fill-warning/20 stroke-warning/60 hover:fill-warning/30";
    else base = "fill-danger/20 stroke-danger/60 hover:fill-danger/30";

    return cn(base, isSelected && "fill-primary/40 stroke-primary stroke-[3px]");
  };

  const handleZoneClick = (id: string) => {
    setActiveZone(id);
    onZoneClick(id);
  };

  return (
    <div className="relative w-full h-full bg-zinc-950 rounded-3xl border border-border overflow-hidden shadow-2xl">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] pointer-events-none" />
      
      {/* Map Content */}
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow-[0_0_30px_rgba(59,130,246,0.1)]">
          {/* Main Stadium Outer */}
          <rect x="50" y="50" width="700" height="500" rx="150" className="fill-zinc-900 stroke-border stroke-2" />
          
          {/* Inner Field */}
          <rect x="150" y="150" width="500" height="300" rx="80" className="fill-zinc-950 stroke-border/30 stroke-1" />
          <path d="M400,150 L400,450" className="stroke-white/10 stroke-1 dashed" />
          
          {/* Zones - North */}
          <path 
            onClick={() => handleZoneClick('north_a')}
            d="M200,50 L600,50 L550,150 L250,150 Z" 
            className={cn("transition-all duration-300 cursor-pointer", getZoneColor(zones[0]?.density || 25, 'north_a'))} 
          />
          <text x="400" y="100" className="fill-white/80 text-[12px] font-bold pointer-events-none text-center" textAnchor="middle">NORTH SECTOR</text>

          {/* Zones - South */}
          <path 
            onClick={() => handleZoneClick('south_b')}
            d="M200,550 L600,550 L550,450 L250,450 Z" 
            className={cn("transition-all duration-300 cursor-pointer", getZoneColor(zones[2]?.density || 84, 'south_b'))} 
          />
          <text x="400" y="510" className="fill-white/80 text-[12px] font-bold pointer-events-none text-center" textAnchor="middle">SOUTH SECTOR</text>

          {/* Zones - West */}
          <path 
            onClick={() => handleZoneClick('west_c')}
            d="M50,200 L50,400 L150,350 L150,250 Z" 
            className={cn("transition-all duration-300 cursor-pointer", getZoneColor(zones[1]?.density || 68, 'west_c'))} 
          />
          <text x="100" y="305" className="fill-white/80 text-[12px] font-bold pointer-events-none [writing-mode:vertical-rl]" textAnchor="middle" transform="rotate(-90 100,305)">WEST SECTOR</text>

          {/* Zones - East */}
          <path 
            onClick={() => handleZoneClick('east_d')}
            d="M750,200 L750,400 L650,350 L650,250 Z" 
            className={cn("transition-all duration-300 cursor-pointer", getZoneColor(45, 'east_d'))} 
          />
          <text x="700" y="305" className="fill-white/80 text-[12px] font-bold pointer-events-none" textAnchor="middle" transform="rotate(90 700,305)">EAST SECTOR</text>
        </svg>
      </div>

      {/* Map Controls */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <MapControlButton icon={<Maximize className="w-4 h-4" />} />
        <div className="h-4" />
        <MapControlButton icon={<ZoomIn className="w-4 h-4" />} />
        <MapControlButton icon={<ZoomOut className="w-4 h-4" />} />
      </div>

      {/* Map Legend */}
      <div className="absolute left-8 bottom-8 flex items-center gap-6 px-6 py-4 bg-surface/80 backdrop-blur-md rounded-2xl border border-border shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Med</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-danger shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">High</span>
        </div>
      </div>
    </div>
  );
}

function MapControlButton({ icon }: { icon: React.ReactNode }) {
  return (
    <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl bg-surface border-border hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-all shadow-lg">
      {icon}
    </Button>
  );
}
