"use client";

import { useQueueStore } from "@/stores/queueStore";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Timer, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ActiveQueueCard() {
  const { activeQueue, leaveQueue } = useQueueStore();

  if (!activeQueue) {
    return (
      <Card className="bg-surface border-dashed border-border flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent)]">
        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4 border border-border">
          <Users className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-white mb-1">No Active Queues</p>
        <p className="text-xs text-muted-foreground mb-4">Join a queue for food, drinks, or restrooms to save time.</p>
        <Button variant="outline" size="sm" className="rounded-full h-8 px-6 text-xs hover:bg-primary hover:text-white hover:border-primary transition-all">
          Browse Locations
        </Button>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-primary/20 relative overflow-hidden group border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Timer className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{activeQueue.location_name}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{activeQueue.category} Queue</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-danger"
            onClick={leaveQueue}
          >
            <XCircle className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Position</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">{activeQueue.position}</span>
              <span className="text-xs text-muted-foreground font-medium">of 42</span>
            </div>
          </div>

          <div className="text-right space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Est. Wait</p>
            <div className="flex items-baseline justify-end gap-1 text-primary">
              <span className="text-3xl font-black">{activeQueue.estimated_wait_minutes}</span>
              <span className="text-xs font-bold uppercase tracking-tighter">min</span>
            </div>
          </div>
        </div>

        <div className="mt-6 h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000" 
            style={{ width: `${Math.max(10, 100 - (activeQueue.position / 42) * 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
