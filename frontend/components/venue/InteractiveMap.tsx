"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ZoneInfoPopover } from "./ZoneInfoPopover";

interface Zone {
  id: string;
  backendZoneId: number;
  name: string;
  density: number;
  status: "LOW" | "MED" | "HIGH";
  coords: string; // Simplified for this demo
}

const baseZones: Zone[] = [
  { id: "north", backendZoneId: 1, name: "North Concourse", density: 88, status: "HIGH", coords: "M 150 100 L 450 100 L 450 150 L 150 150 Z" },
  { id: "south", backendZoneId: 2, name: "South Plaza", density: 24, status: "LOW", coords: "M 150 500 L 450 500 L 450 550 L 150 550 Z" },
  { id: "west", backendZoneId: 3, name: "West Entrance", density: 56, status: "MED", coords: "M 50 150 L 100 150 L 100 500 L 50 500 Z" },
  { id: "east", backendZoneId: 4, name: "East Entry", density: 12, status: "LOW", coords: "M 500 150 L 550 150 L 550 500 L 500 500 Z" },
];

interface InteractiveMapProps {
  densitiesByZoneId?: Record<number, number>;
}

export function InteractiveMap({ densitiesByZoneId = {} }: InteractiveMapProps) {
  const zones = baseZones.map((zone) => {
    const density = Math.round((densitiesByZoneId[zone.backendZoneId] ?? zone.density / 100) * 100);
    const status: Zone["status"] = density >= 80 ? "HIGH" : density >= 45 ? "MED" : "LOW";

    return {
      ...zone,
      density,
      status,
    };
  });

  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "HIGH": return "fill-red-500/30 stroke-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]";
      case "MED": return "fill-yellow-500/30 stroke-yellow-500";
      case "LOW": return "fill-emerald-500/30 stroke-emerald-500";
      default: return "fill-zinc-800/30 stroke-zinc-700";
    }
  };

  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] glass rounded-[40px] overflow-hidden flex items-center justify-center p-8">
      {/* Legend */}
      <div className="absolute top-8 right-8 flex flex-col gap-4 z-10 glass p-4 rounded-3xl">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-[10px] font-black tracking-widest text-zinc-400">HIGH</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-[10px] font-black tracking-widest text-zinc-400">MED</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black tracking-widest text-zinc-400">LOW</span>
         </div>
      </div>

      <svg viewBox="0 0 600 600" className="w-full h-full max-w-[500px]">
        {/* Stadium Perimeter */}
        <rect x="25" y="25" width="550" height="550" rx="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
        <rect x="50" y="50" width="500" height="500" rx="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        
        {/* Center Pitch Grid Lines */}
        <ellipse cx="300" cy="300" rx="100" ry="150" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <ellipse cx="300" cy="300" rx="60" ry="90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="300" y1="50" x2="300" y2="550" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="50" y1="300" x2="550" y2="300" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

        {/* Zones */}
        {zones.map((zone) => (
          <path
            key={zone.id}
            d={zone.coords}
            className={cn(
              "cursor-pointer transition-all duration-300 stroke-2",
              getStatusColor(zone.status),
              selectedZone?.id === zone.id ? "stroke-white opacity-100" : "opacity-70 hover:opacity-100"
            )}
            onClick={() => setSelectedZone(zone)}
          />
        ))}

        {/* Labels */}
        {zones.map((zone) => {
          // Simplistic center calculation for labels
          const midX = zone.id === "west" ? 75 : zone.id === "east" ? 525 : 300;
          const midY = zone.id === "north" ? 125 : zone.id === "south" ? 525 : 325;
          return (
            <text
              key={`${zone.id}-label`}
              x={midX}
              y={midY}
              textAnchor="middle"
              className={cn(
                "text-[10px] font-black tracking-widest transition-opacity pointer-events-none",
                zone.id === "east" || zone.id === "west" ? "rotate-90" : "",
                zone.status === "HIGH" ? "fill-red-400" : zone.status === "MED" ? "fill-yellow-400" : "fill-emerald-400"
              )}
              style={zone.id === "east" || zone.id === "west" ? { transformBox: 'fill-box', transformOrigin: 'center' } : {}}
            >
              {zone.name.toUpperCase()}
            </text>
          );
        })}

        {/* User Indicator */}
        <circle cx="370" cy="450" r="12" fill="rgba(59,130,246,0.3)" className="animate-pulse" />
        <circle cx="370" cy="450" r="6" fill="#3b82f6" stroke="white" strokeWidth="2" />
        <g transform="translate(355, 470)">
            <rect width="30" height="15" rx="4" fill="rgba(255,255,255,0.1)" />
            <text x="15" y="11" textAnchor="middle" fill="white" className="text-[8px] font-bold">YOU</text>
        </g>
      </svg>

      {/* Popover */}
      {selectedZone && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <ZoneInfoPopover 
                zone={selectedZone} 
                onClose={() => setSelectedZone(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
