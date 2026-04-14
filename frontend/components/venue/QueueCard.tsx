"use client";

import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QueueCardProps {
  name: string;
  category: string;
  image: string;
  waitTime: number;
  section: string;
  onJoin?: () => void;
  loading?: boolean;
}

export function QueueCard({ name, category, image, waitTime, section, onJoin, loading }: QueueCardProps) {
  return (
    <div className="glass p-6 rounded-[40px] border-white/5 bg-zinc-900/40 hover:bg-zinc-800/60 transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl overflow-hidden bg-zinc-800 flex items-center justify-center">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{name}</h3>
            <p className="text-zinc-500 font-medium text-sm mt-0.5">Section {section} • {category}</p>
          </div>
        </div>
        
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-2 rounded-2xl flex items-center gap-2">
          <Zap className="w-4 h-4 fill-blue-400" />
          <span className="text-xs font-black tracking-widest">{waitTime} MIN</span>
        </Badge>
      </div>

      <Button
        onClick={onJoin}
        disabled={loading}
        className="w-full h-14 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-black tracking-[0.2em] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
      >
        {loading ? "JOINING..." : "JOIN VIRTUAL QUEUE"}
      </Button>
    </div>
  );
}
