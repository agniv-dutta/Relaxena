"use client";

import { Search, MapPin, History } from "lucide-react";
import { Input } from "@/components/ui/input";

export function DestinationSearch() {
  return (
    <div className="glass p-6 rounded-[32px] bg-zinc-900/40">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <Input 
          className="h-14 pl-12 rounded-2xl bg-white/5 border-white/5 focus-visible:ring-blue-500/50 placeholder:text-zinc-600 font-medium"
          placeholder="Search seat, stand, or gate..."
        />
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3 text-zinc-500">
          <History className="w-4 h-4" />
          <span className="text-[10px] font-black tracking-widest uppercase">RECENT DESTINATIONS</span>
        </div>
        
        {[
          { name: "Section 204, Row B", loc: "East Stand" },
          { name: "Starbucks Coffee", loc: "Gate 12" },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-blue-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">{item.name}</p>
                <p className="text-[10px] text-zinc-600 uppercase font-black tracking-wider">{item.loc}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-zinc-600">
                <History className="w-3 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
