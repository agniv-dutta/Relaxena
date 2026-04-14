"use client";

import { useEffect, useState } from "react";
import { DirectionList } from "@/components/venue/DirectionList";
import { DestinationSearch } from "@/components/venue/DestinationSearch";
import { fetchNavigationSuggestion } from "@/lib/api";
import { NavigationSuggestion } from "@/types/api";

export default function NavigatePage() {
  const [suggestion, setSuggestion] = useState<NavigationSuggestion | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNavigationSuggestion();
        setSuggestion(data);
      } catch {
        setSuggestion(null);
      }
    };

    load();
  }, []);

  const route = suggestion?.route ?? ["Entrance", "Main Concourse", "Section Corridor", "Seat"];
  const eta = suggestion?.estimated_minutes ?? 8;

  return (
    <div className="relative min-h-[calc(100vh-12rem)] space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Background Stylized Map */}
      <div className="absolute inset-0 -mx-8 opacity-20 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 800 800" className="w-full h-full text-zinc-800">
            <ellipse cx="400" cy="400" rx="350" ry="250" fill="none" stroke="currentColor" strokeWidth="2" />
            <ellipse cx="400" cy="400" rx="300" ry="200" fill="none" stroke="currentColor" strokeWidth="1" />
            <ellipse cx="400" cy="400" rx="150" ry="100" fill="none" stroke="currentColor" strokeWidth="1" />
            <line x1="400" y1="150" x2="400" y2="650" stroke="currentColor" strokeWidth="1" />
            <line x1="100" y1="400" x2="700" y2="400" stroke="currentColor" strokeWidth="1" />
            <path d="M 400 650 L 400 450 L 550 450 L 550 350 L 700 350" fill="none" stroke="#ec4899" strokeWidth="16" strokeDasharray="20 10" className="opacity-80" />
            <circle cx="400" cy="650" r="12" fill="#3b82f6" fillOpacity="0.5" />
            <circle cx="400" cy="650" r="6" fill="#3b82f6" />
        </svg>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold">In-Venue Navigation</h1>
              <p className="text-zinc-500">Fastest routes while avoiding high-traffic zones. Destination: {suggestion?.destination ?? "Seat"}.</p>
            </div>
            <DirectionList route={route} estimatedMinutes={eta} />
        </div>
        
        <div className="space-y-8">
            <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Set Destination</span>
            <DestinationSearch />
        </div>
      </div>
    </div>
  );
}
