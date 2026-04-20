"use client";

import { Zone } from "@/types/api";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Sparkles, 
  Clock, 
  MapPin, 
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ZoneDetailPanelProps {
  zone: Zone | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ZoneDetailPanel({ zone, isOpen, onClose }: ZoneDetailPanelProps) {
  if (!zone) return null;

  return (
    <div className={cn(
      "fixed top-16 right-0 w-[380px] bottom-0 bg-surface border-l border-border z-30 transition-transform duration-500 ease-in-out shadow-2xl overflow-y-auto",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest">
              Sector Details
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full h-8 w-8 p-0">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter">{zone.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-medium">Upper Tier, Northwest Entrance</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-border">
            <Users className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Density</p>
            <p className="text-2xl font-black text-white">{zone.density}%</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900 border border-border">
            <TrendingUp className="w-5 h-5 text-warning mb-2" />
            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Trend</p>
            <p className="text-2xl font-black text-white">+12%</p>
          </div>
        </div>

        {/* Density Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Capacity Usage</span>
            <span className={cn(
              "text-xs font-bold",
              zone.density < 40 ? "text-success" : zone.density < 71 ? "text-warning" : "text-danger"
            )}>
              {zone.density < 40 ? "Normal" : zone.density < 71 ? "Busy" : "Critical"}
            </span>
          </div>
          <Progress value={zone.density} className="h-2 bg-zinc-800" />
          <div className="flex justify-between text-[10px] text-muted-foreground font-bold">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <Separator />

        {/* AI Recommendation */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 relative overflow-hidden">
          <Sparkles className="absolute top-4 right-4 w-5 h-5 text-primary opacity-50" />
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            AI Recommendation
          </h4>
          <p className="text-sm text-white/80 leading-relaxed mb-6 font-medium">
            Thinking of heading here? This sector is currently busy. We recommend using <span className="text-primary underline">Gate 12</span> for a 5-minute faster entry.
          </p>
          <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2">
            Show Route <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-between h-12 rounded-xl border-border bg-zinc-900 hover:bg-zinc-800 text-white group">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-sm font-bold uppercase tracking-tight">View Wait Times</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" className="w-full justify-between h-12 rounded-xl border-border bg-zinc-900 hover:bg-zinc-800 text-white group">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-danger" />
              <span className="text-sm font-bold uppercase tracking-tight">Report Incident</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
