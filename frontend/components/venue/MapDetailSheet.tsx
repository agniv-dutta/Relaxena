"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Users, Timer, MapPin, Pizza, Coffee, ArrowRight, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapDetailSheetProps {
  zone: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MapDetailSheet({ zone, isOpen, onClose }: MapDetailSheetProps) {
  if (!zone) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md bg-zinc-950 border-white/5 p-0 overflow-y-auto no-scrollbar"
      >
        <div className="relative h-48 bg-zinc-900 border-b border-white/5 overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                 <div className="w-16 h-16 rounded-3xl bg-primary text-white flex items-center justify-center mx-auto shadow-2xl">
                    <span className="text-2xl font-black">{zone.label || zone.id?.slice(-2).toUpperCase()}</span>
                 </div>
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Sector Active</p>
              </div>
           </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tighter">Sector {zone.label || zone.name}</h2>
            <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" /> North-West Wing • Level 2
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 rounded-3xl bg-zinc-900 border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Density</span>
                   <Users className="w-3 h-3 text-primary" />
                </div>
                <p className={cn(
                  "text-2xl font-black tabular-nums",
                  zone.density < 40 ? "text-success" : zone.density < 70 ? "text-warning" : "text-danger"
                )}>
                  {zone.density}%
                </p>
             </div>
             <div className="p-4 rounded-3xl bg-zinc-900 border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Avg Wait</span>
                   <Timer className="w-3 h-3 text-warning" />
                </div>
                <p className="text-2xl font-black tabular-nums text-white">14 Min</p>
             </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-xs font-black text-white uppercase tracking-widest">Nearby Hotspots</h3>
             <div className="space-y-2">
                {[
                  { name: "Draft Bar N2", distance: "40m", icon: Coffee, color: "text-blue-400" },
                  { name: "Pizza Slice", distance: "65m", icon: Pizza, color: "text-warning" }
                ].map((spot, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-800 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                          <spot.icon className={cn("w-5 h-5", spot.color)} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white">{spot.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{spot.distance} away</p>
                       </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
             </div>
          </div>

          <div className="pt-4 space-y-3">
             <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                Join Smart Queue
             </Button>
             <Button variant="ghost" className="w-full h-14 rounded-2xl border border-danger/20 text-danger font-black uppercase tracking-widest hover:bg-danger/10">
                <ShieldAlert className="w-4 h-4 mr-2" /> Report Incident
             </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
