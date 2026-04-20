"use client";

import { useState } from "react";
import { VenueMapFull } from "@/components/venue/VenueMapFull";
import { ZoneDetailPanel } from "@/components/venue/ZoneDetailPanel";
import { MapLayerControls } from "@/components/venue/MapLayerControls";
import { useVenueStore } from "@/stores/venueStore";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Info, LocateFixed } from "lucide-react";

export default function MapPage() {
  const { zones } = useVenueStore();
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleZoneClick = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    setIsPanelOpen(true);
  };

  const activeZone = zones.find(z => z.id === selectedZoneId) || 
    (selectedZoneId ? { id: selectedZoneId, name: selectedZoneId.replace('_', ' ').toUpperCase(), density: 45 } as any : null);

  return (
    <div className="h-[calc(100vh-128px)] relative flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Live Venue Map</h1>
          <p className="text-muted-foreground mt-1">Real-time zone monitoring and navigation</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full gap-2 border-border bg-surface text-xs font-bold uppercase tracking-wider">
            <LocateFixed className="w-3.5 h-3.5" /> Find My Seat
          </Button>
          <Button variant="outline" className="rounded-full gap-2 border-border bg-surface text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-danger" /> Emergency
          </Button>
        </div>
      </div>

      <div className="flex-1 relative rounded-3xl overflow-hidden border border-border group">
        <MapLayerControls />
        
        <VenueMapFull onZoneClick={handleZoneClick} />
        
        <ZoneDetailPanel 
          zone={activeZone} 
          isOpen={isPanelOpen} 
          onClose={() => setIsPanelOpen(false)} 
        />

        {/* Small floating info for desktop */}
        <div className="absolute right-8 bottom-8 p-4 bg-surface/90 backdrop-blur-md border border-border rounded-2xl max-w-[240px] shadow-2xl z-20 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Venue Status</h4>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Infrastructure monitoring is online. All {zones.length} sectors reporting live data. Use layers to switch between view modes.
          </p>
        </div>
      </div>
    </div>
  );
}
