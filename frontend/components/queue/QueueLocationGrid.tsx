"use client";

import { WaitTime } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Users, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueueStore } from "@/stores/queueStore";

interface QueueLocationGridProps {
  locations: WaitTime[];
}

export function QueueLocationGrid({ locations }: QueueLocationGridProps) {
  const { joinQueue, activeQueue } = useQueueStore();

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {locations.map((loc) => (
        <Card key={loc.location_id} className="bg-surface border-border hover:border-primary/30 transition-all group overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{loc.name}</h3>
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-900 border border-border">
                    <Star className="w-2.5 h-2.5 text-warning fill-warning" />
                    <span className="text-[10px] font-bold text-white">4.8</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Nearby Sector Northwest</p>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900 border border-border">
                <Timer className={cn(
                  "w-5 h-5",
                  loc.minutes < 10 ? "text-success" : loc.minutes < 20 ? "text-warning" : "text-danger"
                )} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Wait Time</p>
                <div className="flex items-baseline gap-1">
                  <span className={cn(
                    "text-2xl font-black",
                    loc.minutes < 10 ? "text-success" : loc.minutes < 20 ? "text-warning" : "text-danger"
                  )}>{loc.minutes}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">min</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">In Queue</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">{Math.floor(loc.minutes * 2.5)}</span>
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Queue Density Bar */}
            <div className="h-1.5 w-full bg-zinc-950 rounded-full mb-6 overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  loc.minutes < 10 ? "bg-success" : loc.minutes < 20 ? "bg-warning" : "bg-danger"
                )} 
                style={{ width: `${Math.min(100, loc.minutes * 4)}%` }}
              />
            </div>

            <Button 
              disabled={activeQueue !== null}
              onClick={() => handleJoin(loc)}
              className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold h-11 group/btn"
            >
              {activeQueue?.location_name === loc.name ? "Currently In Queue" : "Join Smart Queue"}
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
