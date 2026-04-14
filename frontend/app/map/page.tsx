"use client";

import { useEffect, useMemo, useState } from "react";
import { InteractiveMap } from "@/components/venue/InteractiveMap";
import { Button } from "@/components/ui/button";
import { Crosshair, Layers } from "lucide-react";
import { fetchHeatmap } from "@/lib/api";
import { useWebSocket } from "@/hooks/useWebSocket";

const DEFAULT_VENUE_ID = Number(process.env.NEXT_PUBLIC_DEFAULT_VENUE_ID || 1);

export default function MapPage() {
  const [densitiesByZoneId, setDensitiesByZoneId] = useState<Record<number, number>>({});
  const { data: crowdUpdate } = useWebSocket<{ zone_id?: number; density_score?: number }>(
    `/ws/crowd/${DEFAULT_VENUE_ID}`
  );

  useEffect(() => {
    const load = async () => {
      try {
        const heatmap = await fetchHeatmap(DEFAULT_VENUE_ID);
        const latestByZone: Record<number, number> = {};
        heatmap.forEach((point) => {
          latestByZone[point.zone_id] = point.density_score;
        });
        setDensitiesByZoneId(latestByZone);
      } catch {
        setDensitiesByZoneId({});
      }
    };

    load();
  }, []);

  const mergedDensitiesByZoneId = useMemo(() => {
    if (!crowdUpdate?.zone_id || crowdUpdate?.density_score === undefined) {
      return densitiesByZoneId;
    }

    return {
      ...densitiesByZoneId,
      [crowdUpdate.zone_id]: crowdUpdate.density_score,
    };
  }, [densitiesByZoneId, crowdUpdate]);

  const bestZone = useMemo(() => {
    const entries = Object.entries(mergedDensitiesByZoneId);
    if (!entries.length) {
      return { zone: "Zone 1", density: 0 };
    }

    const sorted = [...entries].sort((a, b) => a[1] - b[1]);
    return { zone: `Zone ${sorted[0][0]}`, density: Math.round(sorted[0][1] * 100) };
  }, [mergedDensitiesByZoneId]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Venue Map</h1>
          <p className="text-zinc-500">Live crowd density and points of interest.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="glass h-12 w-12 rounded-2xl text-zinc-400 hover:text-white">
                <Layers className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="glass h-12 w-12 rounded-2xl text-zinc-400 hover:text-white">
                <Crosshair className="w-5 h-5" />
            </Button>
        </div>
      </div>

      <div className="relative">
        <InteractiveMap densitiesByZoneId={mergedDensitiesByZoneId} />

        {/* Floating POI Card */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[400px] px-8">
            <div className="glass p-4 rounded-[32px] flex items-center justify-between bg-zinc-900/80 shadow-2xl border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[24px] bg-zinc-800 flex items-center justify-center overflow-hidden">
                        <img 
                            src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=100" 
                            alt="Restroom"
                            className="w-full h-full object-cover opacity-50"
                        />
                    </div>
                    <div>
                        <h4 className="font-bold">Restroom A4</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">BEST ROUTE</span>
                            <span className="text-zinc-500">•</span>
                          <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">{bestZone.zone} {bestZone.density}%</span>
                        </div>
                    </div>
                </div>
                <Button className="rounded-2xl px-6 h-12 bg-gradient-to-r from-blue-600 to-pink-500 border-0 font-bold tracking-tight">
                    Route
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
