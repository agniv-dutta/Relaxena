"use client";

import { EventInfoCard } from "@/components/venue/EventInfoCard";
import { CrowdStatusBar } from "@/components/venue/CrowdStatusBar";
import { AITipCard } from "@/components/venue/AITipCard";
import { VenueMapMini } from "@/components/venue/VenueMapMini";
import { ActiveQueueCard } from "@/components/venue/ActiveQueueCard";
import { NearbyWaitsList } from "@/components/venue/NearbyWaitsList";
import { LiveScoreCard } from "@/components/venue/LiveScoreCard";
import { useEffect } from "react";
import { useVenueStore } from "@/stores/venueStore";

export default function DashboardPage() {
  const { setLoading } = useVenueStore();

  useEffect(() => {
    // Simulate initial data loading
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header section with status bars */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter sm:text-4xl">
            Matchday Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Real-time venue intelligence & insights</p>
        </div>
        <CrowdStatusBar />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Event & Map (7 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <EventInfoCard />
              <AITipCard />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Venue Overview</h3>
                <span className="text-[10px] text-primary font-bold cursor-pointer hover:underline">View Full Map</span>
              </div>
              <VenueMapMini />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LiveScoreCard />
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Nearby Wait Times</h3>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Live Updates</span>
              </div>
              <NearbyWaitsList />
            </div>
          </div>
        </div>

        {/* Right Column: Queue & Assistant (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">My Active Queues</h3>
            <ActiveQueueCard />
          </div>

          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-3xl border border-border p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.05),transparent)] pointer-events-none" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#ec4899]" />
              Smart Assistant
            </h3>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              Ask about navigation, food options, or incident reporting.
            </p>
            <div className="space-y-3">
              {['Where is the nearest exit?', 'Show me coffee shops', 'Report a spill'].map((q) => (
                <button 
                  key={q}
                  className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-white hover:bg-white/10 transition-all font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-secondary" />
              </div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">AI Ready to assist</p>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-surface border border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Users</p>
              <p className="text-xl font-black text-white">42.5k</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Avg Wait</p>
              <p className="text-xl font-black text-white">12min</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

import { Zap } from "lucide-react";
