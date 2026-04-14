"use client";

import { useEffect, useMemo, useState } from "react";
import { EventBanner } from "@/components/venue/EventBanner";
import { CrowdDensityCard } from "@/components/venue/CrowdDensityCard";
import { QuickActions } from "@/components/venue/QuickActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchEventSchedule, fetchHeatmap, fetchLiveScore } from "@/lib/api";
import { CrowdHeatmapPoint, LiveScore } from "@/types/api";
import { useWebSocket } from "@/hooks/useWebSocket";

const DEFAULT_VENUE_ID = Number(process.env.NEXT_PUBLIC_DEFAULT_VENUE_ID || 1);

export default function Dashboard() {
  const [liveScore, setLiveScore] = useState<LiveScore | null>(null);
  const [latestDensity, setLatestDensity] = useState(0);
  const [loading, setLoading] = useState(true);
  const { data: crowdUpdate } = useWebSocket<{ density_score?: number }>(
    `/ws/crowd/${DEFAULT_VENUE_ID}`
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [schedule, heatmap] = await Promise.all([
          fetchEventSchedule(DEFAULT_VENUE_ID),
          fetchHeatmap(DEFAULT_VENUE_ID),
        ]);

        if (schedule.length > 0) {
          const score = await fetchLiveScore(schedule[0].event_id);
          setLiveScore(score);
        }

        if (heatmap.length > 0) {
          const latest = heatmap[heatmap.length - 1] as CrowdHeatmapPoint;
          setLatestDensity(latest.density_score);
        }
      } catch {
        setLiveScore(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (crowdUpdate?.density_score !== undefined) {
      setLatestDensity(crowdUpdate.density_score);
    }
  }, [crowdUpdate]);

  const scoreForBanner = useMemo(
    () =>
      liveScore || {
        event_id: 0,
        home_team: "Home",
        away_team: "Away",
        home_score: 0,
        away_score: 0,
        status: loading ? "Loading..." : "No live event",
      },
    [liveScore, loading]
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <EventBanner
        homeTeam={scoreForBanner.home_team}
        awayTeam={scoreForBanner.away_team}
        homeScore={scoreForBanner.home_score}
        awayScore={scoreForBanner.away_score}
        status={scoreForBanner.status}
        isLive={Boolean(liveScore)}
      />

      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        <CrowdDensityCard
          sectionLabel="Section N-101"
          seatLabel="Row G • Seat 22"
          densityScore={latestDensity}
        />
        <QuickActions />
      </div>

      {/* Stadium Explorer */}
      <div className="relative w-full h-[300px] rounded-[40px] overflow-hidden group">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110 duration-1000" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1200')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 p-12 flex flex-col justify-end items-start text-left">
          <h3 className="text-4xl font-bold mb-2">Stadium Explorer</h3>
          <p className="text-zinc-400 max-w-md mb-6">
            Real-time heatmaps for restrooms and concession stands.
          </p>
          <Button asChild className="rounded-full px-8 h-12 bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-90 shadow-[0_0_20px_rgba(59,130,246,0.5)] border-0">
            <Link href="/map">OPEN MAP</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
