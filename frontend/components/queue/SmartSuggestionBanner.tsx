"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SmartSuggestionBanner() {
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-[2rem] border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all p-5">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles className="w-16 h-16 text-primary" />
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Rexi Recommends</span>
          </div>
          <p className="text-sm font-bold text-white leading-tight">
            West Wing Restrooms has only <span className="text-success underline">2 min wait</span> right now
          </p>
        </div>
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
