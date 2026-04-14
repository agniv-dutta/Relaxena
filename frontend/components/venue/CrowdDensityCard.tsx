"use client";

import { Navigation } from "lucide-react";

interface CrowdDensityCardProps {
  sectionLabel: string;
  seatLabel: string;
  densityScore: number;
}

export function CrowdDensityCard({ sectionLabel, seatLabel, densityScore }: CrowdDensityCardProps) {
  const densityPct = Math.max(0, Math.min(100, Math.round(densityScore * 100)));
  const level = densityPct >= 80 ? "HIGH" : densityPct >= 45 ? "MEDIUM" : "LOW";

  return (
    <div className="glass p-8 rounded-[40px] flex-1">
      <div className="flex items-start justify-between mb-8">
        <div>
          <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Your Location</span>
          <h2 className="text-5xl font-bold mt-1">{sectionLabel}</h2>
          <p className="text-zinc-500 font-medium text-lg mt-1">{seatLabel}</p>
        </div>
        <div className="w-16 h-16 rounded-3xl glass flex items-center justify-center bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
          <Navigation className="w-8 h-8 text-white fill-white" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Crowd Density</span>
          <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase">{level}</span>
        </div>
        
        <div className="relative h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)] rounded-full transition-all duration-1000"
            style={{ width: `${densityPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
