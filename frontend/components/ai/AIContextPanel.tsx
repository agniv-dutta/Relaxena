"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useVenueStore } from "@/stores/venueStore";
import { useLiveScore } from "@/hooks/useLiveScore";
import { Zap, MapPin, Trophy, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const quickChips = [
  "Where is the nearest exit?",
  "Food with shortest wait?",
  "Live score update",
  "Report an incident",
  "Toilet availability",
];

export function AIContextPanel() {
  const { zones } = useVenueStore();
  const { score } = useLiveScore("evt_001");

  return (
    <div className="space-y-6 h-full overflow-y-auto no-scrollbar pr-2">
      <div className="p-1 px-3 rounded-full bg-primary/10 border border-primary/20 inline-block">
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Context Awareness</p>
      </div>
      
      <h3 className="text-xl font-black text-white tracking-tight">Current Venue State</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Match State */}
        <Card className="bg-surface border-border overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-4 h-4 text-warning" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Match Progress</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-lg font-black text-white">{score?.home_score || 84} - {score?.away_score || 79}</p>
              <div className="px-2 py-1 rounded bg-zinc-900 border border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{score?.period || '4th Quarter'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crowd State */}
        <Card className="bg-surface border-border overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Crowd Status</span>
            </div>
            <div className="space-y-3">
              {zones.slice(0, 2).map((zone) => (
                <div key={zone.id} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                    <span className="text-muted-foreground">{zone.name}</span>
                    <span className={cn(
                      zone.density < 71 ? "text-success" : "text-danger"
                    )}>{zone.density}%</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${zone.density}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location State */}
        <Card className="bg-surface border-border overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-4 h-4 text-secondary" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Current Location</span>
            </div>
            <p className="text-sm font-bold text-white">Section A4, Row 12</p>
            <p className="text-xs text-muted-foreground">Nearby: Gate 4, Restroom B</p>
          </CardContent>
        </Card>
      </div>

      <div className="pt-4 space-y-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          {quickChips.map((chip) => (
            <button 
              key={chip}
              className="px-3 py-2 rounded-xl bg-surface border border-border text-[11px] text-muted-foreground font-medium hover:bg-white/5 hover:text-white transition-all text-left"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-8 flex items-center gap-3">
        <div className="p-2 rounded-full bg-secondary/10 border border-secondary/20">
          <Zap className="w-4 h-4 text-secondary" />
        </div>
        <div>
          <p className="text-[10px] font-black text-secondary uppercase tracking-widest">AI Engine</p>
          <p className="text-[10px] text-muted-foreground">Tailored for Section A4</p>
        </div>
      </div>
    </div>
  );
}
