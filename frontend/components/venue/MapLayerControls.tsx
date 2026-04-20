"use client";

import { Layers, MapPin, Navigation, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapLayerControlsProps {
  activeLayer: string;
  onLayerChange: (layer: string) => void;
}

export function MapLayerControls({ activeLayer, onLayerChange }: MapLayerControlsProps) {
  const layers = [
    { id: 'density', label: 'Heatmap', icon: Layers, color: 'text-primary' },
    { id: 'facilities', label: 'Facilities', icon: MapPin, color: 'text-warning' },
    { id: 'navigation', label: 'Exits', icon: Navigation, color: 'text-success' },
    { id: 'network', label: 'Network', icon: Wifi, color: 'text-blue-400' },
  ];

  return (
    <div className="absolute left-10 top-10 z-20 flex flex-col gap-2 p-2 glass rounded-3xl border-white/5">
      {layers.map((layer) => {
        const isActive = activeLayer === layer.id;
        return (
          <button
            key={layer.id}
            onClick={() => onLayerChange(layer.id)}
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group",
              isActive ? "bg-white/10 text-white shadow-xl" : "text-muted-foreground hover:text-white hover:bg-white/5"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
              isActive ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-white/5 group-hover:bg-white/10"
            )}>
              <layer.icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest mr-4">{layer.label}</span>
          </button>
        );
      })}
    </div>
  );
}
