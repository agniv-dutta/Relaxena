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

  const fastest = waits.reduce((a, b) => (a.minutes <= b.minutes ? a : b), waits[0]);

  return (
    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
      {waits.map((loc, idx) => (
        <Link 
          key={loc.location_id}
          href={`/queue?category=${loc.category}`}
          className="snap-start flex-shrink-0 w-44 p-4 rounded-3xl border border-white/10 hover:border-white/20 transition-all group glass"
        >
          <div className="flex items-center gap-2 mb-2">
            {loc.location_id === fastest.location_id && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 font-black uppercase tracking-wider">Fastest</span>
            )}
            {idx === 1 && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-200 font-black uppercase tracking-wider">Trending</span>
            )}
          </div>
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
          <div className="mb-2">
            <div className="h-1.5 rounded-full bg-black/30 overflow-hidden">
              <div
                className={cn(
                  "h-full",
                  loc.minutes < 6 ? "bg-emerald-400" : loc.minutes < 15 ? "bg-amber-400" : "bg-rose-400"
                )}
                style={{ width: `${Math.min(100, loc.minutes * 6)}%` }}
              />
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
