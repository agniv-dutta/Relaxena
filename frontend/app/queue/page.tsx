"use client";

import { useState } from "react";
import { QueueCategoryTabs } from "@/components/queue/QueueCategoryTabs";
import { QueueLocationGrid } from "@/components/queue/QueueLocationGrid";
import { QueueStatusHero } from "@/components/queue/QueueStatusHero";
import { SmartSuggestionBanner } from "@/components/queue/SmartSuggestionBanner";
import { Search, SlidersHorizontal, Info, Sparkles, Layers, Timer } from "lucide-react";
import { useVenueData } from "@/hooks/useVenueData";
import { WaitTime } from "@/types/api";

export default function QueuePage() {
  const [activeCategory, setActiveCategory] = useState('food');
  const { waits } = useVenueData("arena-1");

  // Filter locations by category
  const filteredLocations = (waits || []).filter(loc => loc.category === activeCategory) || [];

  return (
    <div className="space-y-10">
      <div className="page-header">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Queue Manager</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Smart queueing for all venue services</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 rounded-2xl bg-zinc-900 border border-white/5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Sync Active</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column (8/12) */}
        <div className="lg:col-span-8 space-y-10">
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search food, gates, or restrooms..."
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
            </div>
            <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 text-muted-foreground hover:text-white transition-all">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          <QueueCategoryTabs 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory} 
          />

          <div className="space-y-8">
            <SmartSuggestionBanner />
            
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                Available Locations 
                <span className="text-[10px] text-muted-foreground lowercase">({filteredLocations.length + 4} nearby)</span>
              </h2>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-black uppercase tracking-tighter">
                Sorted by <span className="text-primary font-black">Shortest Wait</span>
              </div>
            </div>
            
            <QueueLocationGrid locations={filteredLocations} />
          </div>
        </div>

        {/* Right Column (4/12) */}
        <div className="lg:col-span-4 space-y-8">
          <QueueStatusHero />
          
          <div className="p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">How it works</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Join a virtual queue and get notified when it's your turn. Spend more time watching the game and less time standing in line.
            </p>
            <ul className="space-y-3">
              {[
                { icon: Sparkles, text: "AI-optimized wait times" },
                { icon: Layers, text: "One active queue at a time" },
                { icon: Timer, text: "Real-time updates" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[10px] font-black text-white uppercase tracking-widest">
                  <item.icon className="w-4 h-4 text-primary" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
