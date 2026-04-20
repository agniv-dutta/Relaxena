"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Palmtree, 
  ShieldAlert, 
  Layers,
  ThermometerSnowflake
} from "lucide-react";
import { useState } from "react";

const layers = [
  { id: 'density', label: 'Density', icon: Users },
  { id: 'incidents', label: 'Incidents', icon: ShieldAlert },
  { id: 'amenities', label: 'Facilities', icon: Layers },
  { id: 'thermal', label: 'Heatmap', icon: ThermometerSnowflake },
];

export function MapLayerControls() {
  const [activeLayer, setActiveLayer] = useState('density');

  return (
    <div className="absolute left-8 top-8 flex flex-col gap-2 p-2 bg-surface/80 backdrop-blur-md rounded-2xl border border-border shadow-2xl z-20">
      {layers.map((layer) => (
        <Button
          key={layer.id}
          variant="ghost"
          size="sm"
          onClick={() => setActiveLayer(layer.id)}
          className={cn(
            "h-10 px-4 gap-3 rounded-xl transition-all justify-start",
            activeLayer === layer.id 
              ? "bg-primary text-white shadow-lg shadow-primary/20" 
              : "text-muted-foreground hover:bg-white/5 hover:text-white"
          )}
        >
          <layer.icon className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">{layer.label}</span>
        </Button>
      ))}
    </div>
  );
}
