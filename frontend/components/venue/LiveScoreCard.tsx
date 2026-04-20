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
              <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-900 border border-border flex items-center justify-center shadow-lg group-hover:border-primary/50 transition-colors">
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
                <span className="text-[10px] font-bold text-primary uppercase">Live • {data.period}</span>
                <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                <span className="text-[10px] font-bold text-white tabular-nums">03:42</span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-900 border border-border flex items-center justify-center shadow-lg group-hover:border-secondary/50 transition-colors">
                <span className="text-xl font-black text-white">{data.away_team[0]}</span>
              </div>
              <p className="text-sm font-bold text-white truncate">{data.away_team}</p>
            </div>
          </div>

          {/* Match Timeline */}
          <div className="mt-8 relative h-1 bg-zinc-900 rounded-full">
            <div className="absolute top-0 left-0 h-full bg-primary rounded-full shadow-[0_0_8px_#3b82f6]" style={{ width: '67%' }} />
            {/* Goal Markers */}
            {[23, 41, 67].map(min => (
              <div 
                key={min} 
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white border-2 border-primary shadow-[0_0_10px_#fff]"
                style={{ left: `${(min / 90) * 100}%` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-white">{min}'</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[8px] font-black text-muted-foreground">0'</span>
            <span className="text-[8px] font-black text-muted-foreground">90'</span>
          </div>
        </div>

        {/* Event Ticker */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-2 mb-3">
             <div className="px-2 py-1 rounded bg-danger/10 border border-danger/20 flex items-center gap-1.5 animate-pulse">
                <Activity className="w-3 h-3 text-danger" />
                <span className="text-[9px] font-black text-danger uppercase tracking-wider">Last Event</span>
             </div>
             <p className="text-xs font-bold text-white">⚽ Goal - 67' Relaxena FC</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <History className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Highlights</span>
            </div>
            {(data.recent_highlights || []).slice(0, 2).map((highlight, idx) => (
              <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-zinc-900/50 border border-white/5 group-hover:border-white/10 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_#3b82f6]" />
                <p className="text-[10px] text-white/70 font-medium truncate">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
