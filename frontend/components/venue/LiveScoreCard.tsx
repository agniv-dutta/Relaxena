"use client";

import { useLiveScore } from "@/hooks/useLiveScore";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Activity, History } from "lucide-react";
import { cn } from "@/lib/utils";

export function LiveScoreCard() {
  const { score, isLoading } = useLiveScore("evt_001");

  // Fallback mock if loading or no data
  const data = score || {
    home_team: "Warriors",
    away_team: "Eagles",
    home_score: 84,
    away_score: 79,
    period: "4th Quarter",
    time_remaining: "03:42",
    status: "live",
    recent_highlights: ["3 pointer by Curry", "Dunk by Green"]
  };

  return (
    <Card className="bg-zinc-950 border-border overflow-hidden relative group">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent)]" />
      
      <CardContent className="p-0 relative">
        <div className="bg-surface/80 backdrop-blur-sm px-6 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-warning" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Live Match Feed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            <span className="text-[10px] font-bold text-danger uppercase">{data.status}</span>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-900 border border-border flex items-center justify-center shadow-lg">
                <span className="text-xl font-black text-white">{data.home_team[0]}</span>
              </div>
              <p className="text-sm font-bold text-white truncate">{data.home_team}</p>
            </div>

            <div className="text-center px-4">
              <div className="flex items-center gap-3 justify-center mb-1">
                <span className="text-4xl font-black text-white tabular-nums tracking-tighter">{data.home_score}</span>
                <span className="text-xl font-bold text-muted-foreground">:</span>
                <span className="text-4xl font-black text-white tabular-nums tracking-tighter">{data.away_score}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-zinc-900 border border-border inline-flex items-center gap-2">
                <span className="text-[10px] font-bold text-primary uppercase">{data.period}</span>
                <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                <span className="text-[10px] font-bold text-muted-foreground">{data.time_remaining}</span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-900 border border-border flex items-center justify-center shadow-lg">
                <span className="text-xl font-black text-white">{data.away_team[0]}</span>
              </div>
              <p className="text-sm font-bold text-white truncate">{data.away_team}</p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <History className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest italic">Recent Highlights</span>
          </div>
          {data.recent_highlights?.map((highlight, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface/30 border border-border/30 animate-in fade-in slide-in-from-right-2 duration-500">
              <Activity className="w-3 h-3 text-primary shrink-0" />
              <p className="text-[11px] text-white/80 font-medium truncate">{highlight}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
