"use client";

import { Badge } from "@/components/ui/badge";

interface EventBannerProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  isLive?: boolean;
}

export function EventBanner({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  status,
  isLive = true,
}: EventBannerProps) {
  return (
    <div className="relative w-full h-[240px] md:h-[320px] rounded-[40px] overflow-hidden mb-8 border border-white/10 shadow-2xl">
      {/* Background Image / Placeholder */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform hover:scale-105 duration-700" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200')" }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      
      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between items-center">
        <div className="flex justify-between w-full">
          {isLive ? (
            <Badge className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-4 py-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              LIVE
            </Badge>
          ) : (
            <Badge className="bg-zinc-700 text-white rounded-full px-4 py-1">SCHEDULED</Badge>
          )}
        </div>

        <div className="flex items-center gap-12 md:gap-24">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full glass-blue flex items-center justify-center p-4 mb-4">
               <div className="w-12 h-12 rounded-full bg-blue-500/50 flex items-center justify-center">
                 <span className="text-2xl">★</span>
               </div>
            </div>
            <span className="text-xs font-bold tracking-widest text-zinc-400">{homeTeam.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-6xl md:text-8xl font-black tracking-tighter">{homeScore}</span>
            <div className="h-0.5 w-6 bg-zinc-500 rounded-full" />
            <span className="text-6xl md:text-8xl font-black tracking-tighter">{awayScore}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full glass-pink flex items-center justify-center p-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-pink-500/50 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
            <span className="text-xs font-bold tracking-widest text-zinc-400">{awayTeam.toUpperCase()}</span>
          </div>
        </div>

        <div className="glass px-6 py-2 rounded-full">
           <span className="text-[10px] md:text-xs font-bold tracking-widest text-zinc-300">
             {status}
           </span>
        </div>
      </div>
    </div>
  );
}
