"use client";

import { useState, useEffect } from "react";
import { VenueMapFull } from "@/components/venue/VenueMapFull";
import { MapDetailSheet } from "@/components/venue/MapDetailSheet";
import { MapLayerControls } from "@/components/venue/MapLayerControls";
import { useVenueStore } from "@/stores/venueStore";
import { Button } from "@/components/ui/button";
import { ShieldAlert, LocateFixed, Navigation, Search, Zap } from "lucide-react";

export default function MapPage() {
  const { zones, setLoading } = useVenueStore();
  const [selectedZone, setSelectedZone] = useState<any | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState('density');

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [setLoading]);

  const handleZoneClick = (zoneId: string) => {
    // Mocking finding the zone data from segments logic or store
    setSelectedZone({ id: zoneId, label: zoneId.replace('zone-', 'Sector '), density: 45 + Math.floor(Math.random() * 40) });
    setIsSheetOpen(true);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-8">
      {/* Header section */}
      <div className="page-header">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Stadium Explorer</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Interactive live venue intelligence map</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-900 border border-white/5 mr-4">
             <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
             <span className="text-[10px] font-black text-white uppercase tracking-widest text-nowrap">Live - 42.5k In Stadium</span>
          </div>
          <Button className="rounded-2xl gap-2 h-12 bg-white text-black font-black uppercase tracking-widest hover:bg-zinc-200 shadow-xl shadow-white/5">
            <LocateFixed className="w-4 h-4" /> Near Me
          </Button>
        </div>
      </div>

      <div className="flex-1 relative rounded-[3rem] overflow-hidden border border-white/5 bg-zinc-950 group">
        {/* Layer Controls */}
        <MapLayerControls activeLayer={activeLayer} onLayerChange={setActiveLayer} />
        
        {/* Search Overlay */}
        <div className="absolute right-10 top-10 z-20 flex items-center gap-4">
           <div className="relative group/search">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
             <input 
               type="text" 
               placeholder="Find gate, food, seat..."
               className="h-14 w-64 bg-zinc-900/80 backdrop-blur-xl border border-white/5 rounded-2xl py-2 pl-12 pr-4 text-xs focus:outline-none focus:border-primary/50 transition-all shadow-2xl"
             />
           </div>
        </div>

        {/* The Map */}
        <div className="absolute inset-0">
          <VenueMapFull onZoneClick={handleZoneClick} />
        </div>

        {/* Dynamic Overlay Info (Bottom Left) */}
        <div className="absolute left-10 bottom-32 z-10 max-w-sm space-y-4 pointer-events-none">
           <div className="glass p-6 rounded-[2.5rem] border-white/5 bg-gradient-to-br from-primary/10 to-transparent pointer-events-auto">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                    <Zap className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-tight">Active Guidance</h4>
                    <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] animate-pulse">Syncing GPS...</p>
                 </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Switch to the <span className="text-white">Navigation</span> layer to see dynamic exit routes optimized for current crowd density.
              </p>
           </div>
        </div>

        <MapDetailSheet 
          zone={selectedZone} 
          isOpen={isSheetOpen} 
          onClose={() => setIsSheetOpen(false)} 
        />
      </div>
    </div>
  );
}
