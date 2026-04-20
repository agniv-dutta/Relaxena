"use client";

import { useVenueStore } from "@/stores/venueStore";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

export function CrowdStatusBar() {
  const { zones } = useVenueStore();
  
  // Showcase 3 main zones or fallback
  const displayZones = zones.length > 0 
    ? zones.slice(0, 3) 
    : [
        { id: '1', name: 'West Gate', density: 25 },
        { id: '2', name: 'Main Concourse', density: 68 },
        { id: '3', name: 'Food Court A', density: 84 },
      ];

  const getDensityColor = (density: number) => {
    if (density < 40) return "bg-success/20 text-success border-success/30";
    if (density < 71) return "bg-warning/20 text-warning border-warning/30";
    return "bg-danger/20 text-danger border-danger/30";
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 mr-2">
        <div className="p-2 rounded-lg bg-zinc-900 border border-border">
          <Users3 className="w-4 h-4 text-primary" />
        </div>
        <span className="text-sm font-bold text-white whitespace-nowrap">Crowd Density:</span>
      </div>
      
      {displayZones.map((zone) => (
        <div 
          key={zone.id}
          className={cn(
            "px-4 py-1.5 rounded-full border text-xs font-bold transition-all hover:scale-105",
            getDensityColor(zone.density)
          )}
        >
          <span className="mr-2 uppercase tracking-tight">{zone.name}</span>
          <span>{zone.density}%</span>
        </div>
      ))}
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
