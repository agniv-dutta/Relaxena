"use client";

import { useState } from "react";
import { QueueCategoryTabs } from "@/components/queue/QueueCategoryTabs";
import { QueueLocationGrid } from "@/components/queue/QueueLocationGrid";
import { MyActiveQueue } from "@/components/queue/MyActiveQueue";
import { Search, SlidersHorizontal, Info } from "lucide-react";
import { useVenueData } from "@/hooks/useVenueData";
import { WaitTime } from "@/types/api";

export default function QueuePage() {
  const [activeCategory, setActiveCategory] = useState('food');
  const { waits } = useVenueData("arena-1");

  // Filter locations by category
  const filteredLocations = (waits || []).filter(loc => loc.category === activeCategory) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">Queue Manager</h1>
              <p className="text-muted-foreground mt-1 text-sm font-medium">Smart queueing for all venue services</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
              <input 
                type="text" 
                placeholder="Search locations..."
                className="w-full bg-surface border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
              />
            </div>
            <button className="p-3 rounded-2xl bg-surface border border-border text-muted-foreground hover:text-white transition-all">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          <QueueCategoryTabs 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory} 
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              Available Locations 
              <span className="text-[10px] text-muted-foreground font-medium lowercase">({filteredLocations.length} results)</span>
            </h2>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
              Sorted by <span className="text-primary">Shortest Wait</span>
            </div>
          </div>
          
          <QueueLocationGrid locations={filteredLocations.length > 0 ? filteredLocations : ([
            { location_id: '1', name: 'Cloud Coffee', category: 'food' as const, minutes: 5, trend: 'falling' as const },
            { location_id: '2', name: 'Pizza Hub Sector A', category: 'food' as const, minutes: 18, trend: 'rising' as const },
            { location_id: '3', name: 'Draft Bar West', category: 'food' as const, minutes: 12, trend: 'stable' as const },
            { location_id: '4', name: 'Burger Point', category: 'food' as const, minutes: 8, trend: 'falling' as const },
          ] as WaitTime[]).filter(l => l.category === 'food' || activeCategory !== 'food')} />
        </div>

        {/* Footer Info */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-border flex flex-col sm:flex-row items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Info className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">About Smart Queueing</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our AI-driven queue system analyzes crowd movement and density to provide live, accurate wait times. Joining a queue adds you to a virtual line, allowing you to stay in your seat until your turn.
            </p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="space-y-4 mb-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 px-2">
            Current Queue Status
          </h2>
          <MyActiveQueue />
        </div>
        
        {/* Placeholder for suggestions if no active queue */}
        <div className="p-6 rounded-3xl border border-dashed border-border bg-black/20 flex flex-col items-center justify-center text-center opacity-50">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">Pro Tip</p>
          <p className="text-xs text-muted-foreground">Queue times are expected to rise by <span className="text-warning font-bold">25%</span> in the next 10 minutes.</p>
        </div>
      </div>
    </div>
  );
}
