"use client";

import { WaitTime } from "@/types/api";
import { Coffee, Pizza, Beer, TrendingDown, TrendingUp, Minus, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NearbyWaitsStripProps {
  waits?: WaitTime[];
}

const mockWaits: WaitTime[] = [
  { location_id: '1', name: 'Cloud Coffee', category: 'food', minutes: 5, trend: 'falling' },
  { location_id: '2', name: 'Pizza Hub North', category: 'food', minutes: 18, trend: 'rising' },
  { location_id: '3', name: 'Draft Bar West', category: 'food', minutes: 12, trend: 'stable' },
  { location_id: '4', name: 'Burger Point', category: 'food', minutes: 8, trend: 'falling' },
  { location_id: '5', name: 'Taco Stand', category: 'food', minutes: 15, trend: 'rising' },
];

export function NearbyWaitsStrip({ waits = mockWaits }: NearbyWaitsStripProps) {
  const getIcon = (category: string) => {
    switch (category) {
      case 'food': return <Pizza className="w-5 h-5 text-warning" />;
      case 'drinks': return <Beer className="w-5 h-5 text-blue-400" />;
      default: return <Coffee className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
      {waits.map((loc) => (
        <Link 
          key={loc.location_id}
          href={`/queue?category=${loc.category}`}
          className="flex-shrink-0 w-40 p-4 rounded-3xl bg-zinc-900 border border-white/5 hover:border-white/10 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
              {getIcon(loc.category)}
            </div>
            <div className={cn(
              "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border",
              loc.minutes < 10 ? "text-success border-success/30 bg-success/10" : 
              loc.minutes < 20 ? "text-warning border-warning/30 bg-warning/10" : 
              "text-danger border-danger/30 bg-danger/10"
            )}>
              {loc.minutes} Min
            </div>
          </div>
          <h4 className="text-xs font-bold text-white mb-1 truncate">{loc.name}</h4>
          <div className="flex items-center gap-1.5">
            <Timer className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Wait Time</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
