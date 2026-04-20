"use client";

import { ShieldAlert, MapPin, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const mockIncidents = [
  { id: '1', type: 'Spill', location: 'Section B4', time: '2m ago', severity: 'low' },
  { id: '2', type: 'Crowd Build-up', location: 'West Gate', time: '5m ago', severity: 'medium' },
  { id: '3', type: 'Tech Issue', location: 'POS Terminal 4', time: '12m ago', severity: 'medium' },
  { id: '4', type: 'Medical', location: 'Sector A12', time: '15m ago', severity: 'high' },
];

export function IncidentLiveFeed() {
  return (
    <div className="bg-surface rounded-3xl border border-border overflow-hidden sticky top-24">
      <div className="p-6 border-b border-border bg-black/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center text-danger">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Incident Feed</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
          <span className="text-[10px] font-bold text-danger uppercase">Live</span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {mockIncidents.map((incident) => (
          <div 
            key={incident.id}
            className="group cursor-pointer p-4 rounded-2xl bg-zinc-900/50 border border-transparent hover:border-white/10 hover:bg-zinc-900 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded",
                incident.severity === 'high' ? "bg-danger/20 text-danger" : 
                incident.severity === 'medium' ? "bg-warning/20 text-warning" : "bg-primary/20 text-primary"
              )}>
                {incident.type}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 opacity-60">
                <Clock className="w-3 h-3" /> {incident.time}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-bold text-white/80">{incident.location}</span>
              </div>
              <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
        
        <button className="w-full py-4 text-[10px] font-black text-muted-foreground hover:text-white uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
          View full log <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

import { ChevronDown } from "lucide-react";
