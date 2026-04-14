"use client";

import { Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActiveQueueCardProps {
  resourceName: string;
  position: number;
  estimatedWaitMinutes: number;
  isActive: boolean;
}

export function ActiveQueueCard({
  resourceName,
  position,
  estimatedWaitMinutes,
  isActive,
}: ActiveQueueCardProps) {
  const minutes = Math.max(0, Math.round(estimatedWaitMinutes));
  const timeLabel = `${String(minutes).padStart(2, "0")}:00`;

  return (
    <div className="relative w-full overflow-hidden rounded-[48px] p-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-pink-500 shadow-[0_20px_50px_rgba(59,130,246,0.3)] border border-white/20">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 flex flex-col gap-10">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black tracking-widest text-blue-100 uppercase opacity-70">Currently in Queue</span>
            <h2 className="text-5xl font-black mt-2 text-white">{resourceName}</h2>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Timer className="w-8 h-8 text-white mb-2" />
            <span className="text-4xl font-black text-white">{timeLabel}</span>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-black tracking-widest text-blue-100 uppercase opacity-70">Your Position</span>
            <div className="text-8xl font-black text-white mt-2 leading-none">#{position}</div>
          </div>
          
          <Badge className="bg-black/40 backdrop-blur-md text-white border-white/20 px-6 py-2 rounded-full flex items-center gap-2 hover:bg-black/60 cursor-default">
            <div className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-400 animate-pulse" : "bg-zinc-400"}`} />
            <span className="text-[10px] font-bold tracking-widest">{isActive ? "ACTIVE" : "IDLE"}</span>
          </Badge>
        </div>
      </div>

      {/* Gloss reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  );
}
