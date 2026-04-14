"use client";

import { useEffect, useMemo, useState } from "react";
import { ActiveQueueCard } from "@/components/venue/ActiveQueueCard";
import { QueueCard } from "@/components/venue/QueueCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchConcessionSuggestion, fetchQueueStatus, joinQueue } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const poiData = [
  { 
    name: "Ballpark Hot Dogs", 
    category: "Hot Food", 
    section: "104", 
    waitTime: 5, 
    type: "concessions",
    image: "https://images.unsplash.com/photo-1541214113241-21578d2d9b62?auto=format&fit=crop&q=80&w=200" 
  },
  { 
    name: "West Wing Restrooms", 
    category: "40ft away", 
    section: "112", 
    waitTime: 2, 
    type: "restrooms",
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=200" 
  },
  { 
    name: "Arena Pizza Co.", 
    category: "Quick Service", 
    section: "108", 
    waitTime: 12, 
    type: "concessions",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200" 
  },
];

export default function QueuePage() {
  const [filter, setFilter] = useState("all");
  const [loadingName, setLoadingName] = useState<string | null>(null);
  const [queueStatus, setQueueStatus] = useState<{
    in_queue: boolean;
    position?: number | null;
    estimated_wait_minutes?: number | null;
    resource_id?: string | null;
  }>({ in_queue: false });
  const { user } = useAuth();

  const ticketId = user?.ticket_id ?? null;
  const venueId = Number(process.env.NEXT_PUBLIC_DEFAULT_VENUE_ID || 1);

  const filteredData = poiData.filter(poi => filter === "all" || poi.type === filter);

  useEffect(() => {
    const loadQueueState = async () => {
      if (!ticketId) {
        return;
      }
      try {
        const status = await fetchQueueStatus(ticketId);
        setQueueStatus(status);
      } catch {
        setQueueStatus({ in_queue: false });
      }
    };

    loadQueueState();
  }, [ticketId]);

  const activeResourceName = useMemo(() => {
    if (!queueStatus.resource_id) {
      return "Not in Queue";
    }
    return queueStatus.resource_id;
  }, [queueStatus.resource_id]);

  const handleJoin = async (resourceName: string, queueType: "concession" | "restroom") => {
    if (!ticketId) {
      toast.error("No ticket linked to your account.");
      return;
    }

    setLoadingName(resourceName);
    try {
      let resourceId = resourceName.toLowerCase().replace(/\s+/g, "-");
      if (queueType === "concession") {
        const suggestion = await fetchConcessionSuggestion(venueId);
        resourceId = suggestion.recommended_resource_id;
      }

      await joinQueue({
        ticket_id: ticketId,
        venue_id: venueId,
        queue_type: queueType,
        resource_id: resourceId,
      });

      const status = await fetchQueueStatus(ticketId);
      setQueueStatus(status);
      toast.success("Joined queue successfully");
    } catch {
      toast.error("Unable to join queue right now");
    } finally {
      setLoadingName(null);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div>
        <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Your Active Status</span>
        <div className="mt-4">
          <ActiveQueueCard
            resourceName={activeResourceName}
            position={queueStatus.position ?? 0}
            estimatedWaitMinutes={queueStatus.estimated_wait_minutes ?? 0}
            isActive={queueStatus.in_queue}
          />
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex gap-4">
          {["all", "concessions", "restrooms"].map((t) => (
            <Button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "rounded-full px-8 h-12 text-[10px] font-black tracking-widest border-0 transition-all duration-300",
                filter === t 
                  ? "bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]" 
                  : "bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10"
              )}
            >
              {t === "all" ? "ALL NEARBY" : t.toUpperCase()}
            </Button>
          ))}
        </div>

        <div>
          <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Available Points of Interest</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {filteredData.map((poi) => (
              <QueueCard
                key={poi.name}
                {...poi}
                loading={loadingName === poi.name}
                onJoin={() => handleJoin(poi.name, poi.type === "concessions" ? "concession" : "restroom")}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
