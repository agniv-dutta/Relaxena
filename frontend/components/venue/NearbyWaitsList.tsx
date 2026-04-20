"use client";

import { useVenueData } from "@/hooks/useVenueData";
import { WaitTime } from "@/types/api";
import { Coffee, Pizza, Beer, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function NearbyWaitsList() {
  const { waits } = useVenueData("arena-1");

  const displayWaits = (waits?.length ? waits.slice(0, 4) : [
    { location_id: '1', name: 'Cloud Coffee', category: 'food' as const, minutes: 5, trend: 'falling' as const },
    { location_id: '2', name: 'Pizza Hub Sector A', category: 'food' as const, minutes: 18, trend: 'rising' as const },
    { location_id: '3', name: 'Draft Bar West', category: 'food' as const, minutes: 12, trend: 'stable' as const },
    { location_id: '4', name: 'Burger Point', category: 'food' as const, minutes: 8, trend: 'falling' as const },
  ]) as WaitTime[];

  const getIcon = (name: string) => {
    if (name.includes('Coffee')) return <Coffee className="w-4 h-4" />;
    if (name.includes('Pizza')) return <Pizza className="w-4 h-4" />;
    if (name.includes('Bar')) return <Beer className="w-4 h-4" />;
    return <Pizza className="w-4 h-4" />;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'falling') return <TrendingDown className="w-3 h-3 text-success" />;
    if (trend === 'rising') return <TrendingUp className="w-3 h-3 text-danger" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  return (
    <div className="space-y-3">
      {displayWaits.map((item) => (
        <div 
          key={item.location_id}
          className="flex items-center justify-between p-3 rounded-xl bg-surface/50 border border-border/50 hover:border-primary/20 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-900 border border-border group-hover:text-primary transition-colors">
              {getIcon(item.name)}
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">{item.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {getTrendIcon(item.trend)}
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  {item.trend}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-baseline gap-1 justify-end">
              <span className={cn(
                "text-lg font-black",
                item.minutes < 10 ? "text-success" : item.minutes < 20 ? "text-warning" : "text-danger"
              )}>
                {item.minutes}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">min</span>
            </div>
            <p className="text-[10px] text-muted-foreground">wait time</p>
          </div>
        </div>
      ))}
    </div>
  );
}
