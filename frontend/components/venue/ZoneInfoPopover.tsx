"use client";

import { X, CornerUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Zone {
  id: string;
  name: string;
  density: number;
  status: "LOW" | "MED" | "HIGH";
}

interface ZoneInfoPopoverProps {
  zone: Zone;
  onClose: () => void;
}

export function ZoneInfoPopover({ zone, onClose }: ZoneInfoPopoverProps) {
  return (
    <div className="glass p-8 rounded-[40px] w-[340px] animate-in zoom-in-95 fade-in duration-300 relative shadow-[0_40px_80px_rgba(0,0,0,0.5)] border-white/20">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 text-zinc-500 hover:text-white"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </Button>

      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold">{zone.name}</h3>
            <Badge className={cn(
                "text-[8px] font-black px-2 py-0",
                zone.status === "HIGH" ? "bg-red-500" : zone.status === "MED" ? "bg-yellow-500" : "bg-emerald-500"
            )}>
              {zone.status === "HIGH" ? "CRITICAL" : zone.status}
            </Badge>
          </div>
          <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">EXIT GATES 12-18</p>
        </div>

        <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black">{zone.density}%</span>
            <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Density</span>
        </div>

        <div>
           <p className="text-[10px] font-black tracking-widest text-zinc-500 uppercase mb-4">SUGGESTED ROUTE</p>
           <div className="glass bg-white/5 border-white/10 p-4 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl glass flex items-center justify-center text-blue-400">
                    <CornerUpRight className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold">East Tunnel Path</p>
                    <p className="text-[8px] text-zinc-500">Estimated 4m faster</p>
                 </div>
              </div>
              <CornerUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors rotate-90" />
           </div>
        </div>
      </div>

      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
        <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-zinc-900 shadow-2xl" />
      </div>
    </div>
  );
}

function cn(...inputs: Array<string | false | null | undefined>) {
    return inputs.filter(Boolean).join(" ");
}
