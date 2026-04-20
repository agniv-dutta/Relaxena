"use client";

import { useVenueStore } from "@/stores/venueStore";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const hours = Array.from({ length: 8 }, (_, i) => `${15 + i}:00`);
const zonesMock = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'];

export function ZoneHeatmapGrid() {
  const getDensityColor = (density: number) => {
    if (density < 20) return "bg-zinc-900";
    if (density < 40) return "bg-primary/20";
    if (density < 60) return "bg-primary/40";
    if (density < 80) return "bg-primary/70";
    return "bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]";
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="grid grid-cols-[80px,1fr] gap-4">
          <div />
          <div className="flex justify-between px-2">
            {hours.map(h => (
              <span key={h} className="text-[10px] font-bold text-muted-foreground uppercase">{h}</span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {zonesMock.map((zone) => (
            <div key={zone} className="grid grid-cols-[80px,1fr] gap-4 items-center">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{zone}</span>
              <div className="flex gap-1 h-8">
                {hours.map((h, idx) => {
                  const density = Math.floor(Math.random() * 100);
                  return (
                    <Tooltip key={h}>
                      <TooltipTrigger>
                        <div 
                          className={cn(
                            "flex-1 rounded-sm transition-all hover:scale-110 cursor-help",
                            getDensityColor(density)
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-surface border-border text-[10px] font-bold">
                        {zone} @ {h}: {density}% density
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
