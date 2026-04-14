"use client";

import { Info, AlertTriangle, Megaphone, MapPin, ChevronRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AlertCardProps {
  type: "info" | "warning" | "urgent" | "staff" | "queue";
  title: string;
  message: string;
  timestamp: string;
  actionLabel?: string;
  location?: string;
}

export function AlertCard({ type, title, message, timestamp, actionLabel, location }: AlertCardProps) {
  const getColors = () => {
    switch (type) {
      case "urgent": return "border-red-500/30 bg-red-500/5 text-red-400";
      case "warning": return "border-yellow-500/30 bg-yellow-500/5 text-yellow-400";
      case "queue": return "border-pink-500/30 bg-pink-500/5 text-pink-400";
      default: return "border-blue-500/30 bg-blue-500/5 text-blue-400";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "urgent": return <AlertTriangle className="w-6 h-6" />;
      case "warning": return <Info className="w-6 h-6" />;
      case "staff": return <Megaphone className="w-6 h-6" />;
      case "queue": return <Layers className="w-6 h-6" />;
      default: return <Info className="w-6 h-6" />;
    }
  };

  return (
    <div className={cn("glass p-8 rounded-[40px] border relative overflow-hidden group", getColors())}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
            <div className={cn("w-14 h-14 rounded-3xl glass flex items-center justify-center")}>
                {getIcon()}
            </div>
            <div>
                <span className="text-[10px] font-black tracking-widest uppercase opacity-70">
                    {type === "staff" ? "Staff Announcement" : type === "queue" ? "Queue Alert" : "Crowd Alert"}
                </span>
                <h3 className="text-2xl font-bold mt-0.5 text-white">{title}</h3>
            </div>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-[10px] font-black tracking-widest opacity-50">{timestamp}</span>
            {type === "urgent" && <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mt-2" />}
        </div>
      </div>

      <p className="text-zinc-400 leading-relaxed mb-8">
        {message}
      </p>

      {location && (
        <div className="glass bg-white/5 p-6 rounded-3xl flex items-center justify-between group-hover:bg-white/10 transition-colors cursor-pointer mb-6">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl glass flex items-center justify-center text-blue-400">
                    <MapPin className="w-5 h-5" />
                </div>
                <div>
                    <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">RECOMMENDED</span>
                    <p className="text-sm font-bold text-white">{location}</p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600" />
        </div>
      )}

      {actionLabel && (
        <Button className="w-full h-14 rounded-3xl bg-gradient-to-r from-blue-600 to-pink-500 border-0 font-bold text-white hover:opacity-90 shadow-lg">
            {actionLabel}
        </Button>
      )}
    </div>
  );
}
