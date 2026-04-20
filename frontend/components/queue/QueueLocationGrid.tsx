"use client";

import { WaitTime } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Users, ArrowRight, Star, Pizza, Coffee, Beer, MapPin, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueueStore } from "@/stores/queueStore";

interface QueueLocationGridProps {
  locations: WaitTime[];
}

const mockExtraLocations: WaitTime[] = [
  { location_id: '5', name: 'West Gate Entrance', category: 'gates', minutes: 12, trend: 'stable' },
  { location_id: '6', name: 'Official Merchandise', category: 'merchandise', minutes: 25, trend: 'rising' },
  { location_id: '7', name: 'Drinks & Drills', category: 'drinks', minutes: 4, trend: 'falling' },
  { location_id: '8', name: 'Sector C Restrooms', category: 'restrooms', minutes: 6, trend: 'stable' },
];

export function QueueLocationGrid({ locations }: QueueLocationGridProps) {
  const { joinQueue, activeQueue } = useQueueStore();
  
  const allLocations = [...locations, ...mockExtraLocations].slice(0, 8);

  const handleJoin = (loc: WaitTime) => {
    joinQueue({
      id: Math.random().toString(),
      user_id: 1,
      venue_id: 'arena-1',
      category: loc.category,
      location_name: loc.name,
      joined_at: new Date().toISOString(),
      position: Math.floor(Math.random() * 50) + 10,
      estimated_wait_minutes: loc.minutes
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return <Pizza className="w-5 h-5 text-warning" />;
      case 'drinks': return <Beer className="w-5 h-5 text-blue-400" />;
      case 'merchandise': return <Star className="w-5 h-5 text-pink-500" />;
      case 'gates': return <MapPin className="w-5 h-5 text-success" />;
      default: return <Coffee className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
      {allLocations.map((loc) => {
        const isInQueue = activeQueue?.location_name === loc.name;
        
        return (
          <Card key={loc.location_id} className={cn(
            "bg-zinc-900 border-white/5 hover:border-white/10 transition-all group overflow-hidden rounded-[2rem]",
            isInQueue && "border-primary bg-primary/5"
          )}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                    {getCategoryIcon(loc.category)}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-black text-white group-hover:text-primary transition-colors">{loc.name}</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" /> Close to Sector B • 200m
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "px-2.5 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5",
                  loc.minutes < 10 ? "text-success border-success/30 bg-success/10" : 
                  loc.minutes < 20 ? "text-warning border-warning/30 bg-warning/10" : 
                  "text-danger border-danger/30 bg-danger/10"
                )}>
                  <Timer className="w-3.5 h-3.5" />
                  {loc.minutes} Min
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <span>Queue Density</span>
                  <span className="text-white">{Math.floor(loc.minutes * 2.5)} Users</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      loc.minutes < 10 ? "bg-success shadow-[0_0_8px_#22c55e]" : 
                      loc.minutes < 20 ? "bg-warning shadow-[0_0_8px_#f59e0b]" : 
                      "bg-danger shadow-[0_0_8px_#ef4444]"
                    )} 
                    style={{ width: `${Math.min(100, loc.minutes * 4)}%` }}
                  />
                </div>
              </div>

              <Button 
                disabled={activeQueue !== null && !isInQueue}
                onClick={() => handleJoin(loc)}
                className={cn(
                  "w-full rounded-2xl font-black h-12 text-xs uppercase tracking-widest group/btn transition-all",
                  isInQueue 
                    ? "bg-success text-white hover:bg-success" 
                    : "bg-white text-black hover:bg-zinc-200"
                )}
              >
                {isInQueue ? (
                  <span className="flex items-center gap-2">IN QUEUE <Check className="w-4 h-4" /></span>
                ) : (
                  <span className="flex items-center gap-2">Join Virtual Queue <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></span>
                )}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
