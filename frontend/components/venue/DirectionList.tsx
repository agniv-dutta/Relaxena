"use client";

import { CornerUpRight, MapPin, Search, Users, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface DirectionListProps {
    route: string[];
    estimatedMinutes: number;
}

export function DirectionList({ route, estimatedMinutes }: DirectionListProps) {
    const nextStep = route.length > 1 ? route[1] : route[0] || "Proceed to destination";

  return (
    <div className="space-y-6">
      {/* Current Step Card */}
      <div className="glass p-8 rounded-[40px] relative overflow-hidden bg-zinc-900/60 border-white/5 shadow-2xl">
         <div className="absolute top-0 right-0 p-8">
            <div className="w-12 h-12 rounded-full glass bg-white/5 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
         </div>

         <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                    <CornerUpRight className="w-8 h-8 text-white" />
                </div>
                <div>
                    <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase">In 20 Meters</span>
                    <h3 className="text-3xl font-bold mt-0.5">{nextStep}</h3>
                </div>
            </div>
            
            <p className="text-zinc-500 font-medium">Estimated arrival in {estimatedMinutes} minutes.</p>

            <div className="glass bg-white/5 rounded-3xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Users className="w-6 h-6 text-zinc-500" />
                    <div>
                        <p className="text-[12px] font-bold">Avoid Crowds</p>
                        <p className="text-[10px] text-zinc-600">Prioritize quieter hallways</p>
                    </div>
                </div>
                <Switch 
                    id="avoid-crowds" 
                    defaultChecked 
                    className="data-[state=checked]:bg-pink-500"
                />
            </div>
         </div>
      </div>

      {/* Destination Markers */}
      <div className="grid grid-cols-3 gap-4">
        {[
            { label: "TO SEAT", val: `${estimatedMinutes}`, unit: "min", icon: MapPin },
            { label: "ROUTE STEPS", val: `${route.length}`, unit: "steps", icon: ChevronRight },
            { label: "ALT PATHS", val: "2", unit: "opt", icon: Search },
        ].map((item, i) => (
            <div key={i} className="glass p-6 rounded-[32px] flex flex-col items-center justify-center gap-1 group cursor-pointer hover:bg-white/5 transition-all">
                <item.icon className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                <span className="text-[8px] font-black tracking-widest text-zinc-600 uppercase mt-2">{item.label}</span>
                <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black">{item.val}</span>
                    <span className="text-[10px] font-bold text-zinc-500">{item.unit}</span>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
