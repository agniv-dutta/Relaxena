"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCard } from "@/components/venue/AlertCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";
import { fetchHeatmap } from "@/lib/api";
import { useWebSocket } from "@/hooks/useWebSocket";

const DEFAULT_VENUE_ID = Number(process.env.NEXT_PUBLIC_DEFAULT_VENUE_ID || 1);

type LiveAlert = {
  type: "info" | "warning" | "urgent" | "staff" | "queue";
  title: string;
  message: string;
  timestamp: string;
  location?: string;
  actionLabel?: string;
};

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const { data: crowdUpdate } = useWebSocket<{ zone_id?: number; density_score?: number }>(
    `/ws/crowd/${DEFAULT_VENUE_ID}`
  );

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const points = await fetchHeatmap(DEFAULT_VENUE_ID);
        const seeded = points.slice(-5).reverse().map((point) => {
          const pct = Math.round(point.density_score * 100);
          const urgent = pct >= 85;
          return {
            type: urgent ? "urgent" : "info",
            title: urgent ? "Crowd Surge Warning" : "Crowd Status Update",
            message: `Zone ${point.zone_id} density is ${pct}%.`,
            timestamp: "RECENT",
            location: `Zone ${point.zone_id}`,
            actionLabel: urgent ? "See Alternate Route" : undefined,
          } as LiveAlert;
        });
        setAlerts(seeded);
      } catch {
        setAlerts([]);
      }
    };

    loadInitial();
  }, []);

  const liveAlert = useMemo(() => {
    if (!crowdUpdate?.zone_id || crowdUpdate?.density_score === undefined) {
      return null;
    }
    const pct = Math.round(crowdUpdate.density_score * 100);
    const urgent = pct >= 85;
    return {
      type: urgent ? "urgent" : "info",
      title: urgent ? "Live Crowd Threshold Breach" : "Live Crowd Update",
      message: `Zone ${crowdUpdate.zone_id} density moved to ${pct}%.`,
      timestamp: "NOW",
      location: `Zone ${crowdUpdate.zone_id}`,
      actionLabel: urgent ? "See Alternate Route" : undefined,
    } as LiveAlert;
  }, [crowdUpdate]);

  const filteredAlerts = useMemo(() => {
    const combined = liveAlert ? [liveAlert, ...alerts] : alerts;
    if (activeTab === "all") {
      return combined;
    }
    if (activeTab === "crowd") {
      return combined.filter((a) => a.type === "urgent" || a.type === "warning" || a.type === "info");
    }
    return combined.filter((a) => a.type === activeTab);
  }, [activeTab, alerts, liveAlert]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl font-bold tracking-tight">Live Updates</h1>
        <p className="text-zinc-500 font-medium text-lg">Stay connected with the heartbeat of the stadium.</p>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass h-14 p-1.5 rounded-full mb-8 bg-zinc-900/40">
          {["all", "queue", "crowd", "staff"].map((tab) => (
            <TabsTrigger 
                key={tab} 
                value={tab}
                className="rounded-full px-8 h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-pink-500 data-[state=active]:text-white font-bold text-[10px] tracking-widest"
            >
              {tab.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="space-y-8">
          {filteredAlerts.map((alert, i) => (
            <AlertCard key={i} {...alert} />
          ))}
        </div>
      </Tabs>

      {/* Footer Visual */}
      <div className="relative w-full h-[300px] rounded-[48px] overflow-hidden">
         <div 
            className="absolute inset-0 bg-cover bg-center opacity-40" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=1200')" }}
         />
         <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
         <div className="absolute inset-0 flex flex-col items-center justify-end p-12">
            <div className="glass p-8 rounded-[40px] w-full max-w-md flex items-center justify-between border-white/5">
                <div>
                    <h4 className="text-xl font-bold">South Exit Status</h4>
                    <span className="text-[10px] font-black tracking-widest text-pink-500">CRITICAL CONGESTION</span>
                </div>
                <div className="glass p-4 rounded-3xl flex items-center gap-3">
                    <Clock className="w-6 h-6 text-pink-500" />
                    <span className="text-2xl font-black">22m</span>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
