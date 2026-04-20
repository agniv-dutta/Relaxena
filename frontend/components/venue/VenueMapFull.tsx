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
    
    if (density < 30) base = "fill-success/20 stroke-success/40 hover:fill-success/40";
    else if (density < 60) base = "fill-warning/20 stroke-warning/40 hover:fill-warning/40";
    else base = "fill-danger/20 stroke-danger/40 hover:fill-danger/40";

    return cn(base, "transition-all duration-300 cursor-pointer", isSelected && "fill-primary/40 stroke-primary stroke-[3px]");
  };

  const handleZoneClick = (id: string) => {
    setActiveZone(id);
    onZoneClick(id);
  };

  // Generate 16 segments for an oval stadium
  const segments = Array.from({ length: 16 }, (_, i) => {
    const angleStart = (i * 360) / 16;
    const angleEnd = ((i + 1) * 360) / 16;
    const radStart = (angleStart * Math.PI) / 180;
    const radEnd = (angleEnd * Math.PI) / 180;
    
    const rOuterX = 350, rOuterY = 250;
    const rInnerX = 220, rInnerY = 140;
    const centerX = 400, centerY = 300;

    const x1 = centerX + rOuterX * Math.cos(radStart);
    const y1 = centerY + rOuterY * Math.sin(radStart);
    const x2 = centerX + rOuterX * Math.cos(radEnd);
    const y2 = centerY + rOuterY * Math.sin(radEnd);
    const x3 = centerX + rInnerX * Math.cos(radEnd);
    const y3 = centerY + rInnerY * Math.sin(radEnd);
    const x4 = centerX + rInnerX * Math.cos(radStart);
    const y4 = centerY + rInnerY * Math.sin(radStart);

    return {
      id: `zone-${i + 1}`,
      path: `M ${x1} ${y1} A ${rOuterX} ${rOuterY} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rInnerX} ${rInnerY} 0 0 0 ${x4} ${y4} Z`,
      label: `${['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(i / 2)]}${i % 2 + 1}`,
      labelX: centerX + ((rOuterX + rInnerX) / 2) * Math.cos((radStart + radEnd) / 2),
      labelY: centerY + ((rOuterY + rInnerY) / 2) * Math.sin((radStart + radEnd) / 2),
      density: Math.floor(Math.random() * 100)
    };
  });

  return (
    <div className="relative w-full h-full bg-[#0a0a0f] rounded-[2.5rem] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)] pointer-events-none" />
      
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow-2xl">
          {/* Pitch */}
          <rect x="250" y="200" width="300" height="200" rx="10" className="fill-zinc-900/50 stroke-white/10 stroke-1" />
          <line x1="400" y1="200" x2="400" y2="400" className="stroke-white/10 stroke-1" />
          <circle cx="400" cy="300" r="40" className="fill-none stroke-white/10 stroke-1" />
          
          {/* Zones */}
          {segments.map((seg) => (
            <g key={seg.id} className="group/zone">
              <path 
                d={seg.path}
                className={getZoneColor(seg.density, seg.id)}
                onClick={() => handleZoneClick(seg.id)}
              />
              <text 
                x={seg.labelX} 
                y={seg.labelY} 
                className="fill-white/40 text-[9px] font-black pointer-events-none uppercase tracking-tighter group-hover/zone:fill-white transition-colors"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {seg.label}
              </text>
            </g>
          ))}

          {/* Highlights for high density */}
          {segments.filter(s => s.density > 80).map(s => (
            <circle 
              key={`pulse-${s.id}`}
              cx={s.labelX} 
              cy={s.labelY + 10} 
              r="2" 
              className="fill-danger animate-pulse" 
            />
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="absolute left-10 bottom-10 flex items-center gap-8 px-8 py-5 glass rounded-3xl border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_10px_#22c55e]" />
          <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Active</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-warning shadow-[0_0_10px_#f59e0b]" />
          <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Busy</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-danger shadow-[0_0_10px_#ef4444] animate-pulse" />
          <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Congested</span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        {[Maximize, ZoomIn, ZoomOut, Info].map((Icon, i) => (
          <Button key={i} variant="ghost" size="icon" className="w-12 h-12 rounded-2xl glass border-white/5 text-muted-foreground hover:text-white hover:bg-primary/20 transition-all">
            <Icon className="w-5 h-5" />
          </Button>
        ))}
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
