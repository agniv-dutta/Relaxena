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

import { QuickActions } from "@/components/venue/QuickActions";
import { NearbyWaitsStrip } from "@/components/venue/NearbyWaitsStrip";
import { CrowdPulseWidget } from "@/components/venue/CrowdPulseWidget";
import { Zap, MapPin, Navigation } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { setLoading } = useVenueStore();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <div className="space-y-10 pb-20">
      {/* Header section */}
      <div className="page-header">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <Zap className="w-4 h-4 fill-primary" />
            Relaxena Live
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter sm:text-5xl">
            Arena Dashboard
          </h1>
          <p className="text-muted-foreground font-medium">Welcome back! Here's what's happening now.</p>
        </div>
        <CrowdStatusBar />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8/12) */}
        <div className="lg:col-span-8 space-y-10">
          
          <LiveScoreCard />

          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Nearby Fast Lanes</h3>
              </div>
              <Link href="/queue" className="text-[10px] font-black text-primary uppercase hover:underline">View All</Link>
            </div>
            <NearbyWaitsStrip />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Venue Preview</h3>
                <span className="text-[10px] text-muted-foreground font-bold uppercase">Dynamic Map</span>
              </div>
              <VenueMapMini />
              <Button className="w-full h-12 rounded-2xl bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-white font-bold gap-2">
                <Navigation className="w-4 h-4" /> Open Full Interactive Map
              </Button>
            </div>
            <div className="space-y-8">
               <AITipCard />
               <div className="glass-blue p-6 rounded-3xl border-primary/20 space-y-4">
                 <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Your Nearest Exit</h4>
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-black">N4</div>
                   <div>
                     <p className="font-bold text-white">Gate N4 (North Exit)</p>
                     <p className="text-xs text-muted-foreground">Approx. 2 min walk from your seat</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column (4/12) */}
        <div className="lg:col-span-4 space-y-10">
          <div className="space-y-6">
            <h3 className="px-2 text-xs font-black text-white uppercase tracking-widest">Quick Actions</h3>
            <QuickActions />
          </div>

          <div className="space-y-6">
            <h3 className="px-2 text-xs font-black text-white uppercase tracking-widest">Venue Vibe</h3>
            <CrowdPulseWidget />
          </div>

          <div className="space-y-4">
            <h3 className="px-2 text-xs font-black text-white uppercase tracking-widest">Active Queue</h3>
            <ActiveQueueCard />
          </div>
        </div>

      </div>
    </div>
  );
}

