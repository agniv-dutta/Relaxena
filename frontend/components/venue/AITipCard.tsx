"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tips = [
  "The Food Court in Sector B is currently at 40% capacity. It's a great time to grab a snack before the halftime rush begins in 15 minutes.",
  "Looking for a shorter queue? The merchandise stand at Gate N2 has a wait time of only 4 minutes right now.",
  "Crowd levels are peaking near the South Exit. If you're heading out, consider using Gate E4 for a 10-minute faster exit.",
];

export function AITipCard() {
  const [tip, setTip] = useState("");
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const streamTip = async () => {
      setIsStreaming(true);
      setTip("");
      const fullTip = tips[currentTipIndex % tips.length];
      
      for (let i = 0; i <= fullTip.length; i++) {
        setTip(fullTip.slice(0, i));
        await new Promise(r => setTimeout(r, 20));
      }
      setIsStreaming(false);
    };

    streamTip();

    const interval = setInterval(() => {
      setCurrentTipIndex(prev => prev + 1);
    }, 180000); // 3 minutes

    return () => clearInterval(interval);
  }, [currentTipIndex]);

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <Card className="bg-zinc-900/50 border-dashed border-primary/40 relative overflow-hidden group hover:border-primary/60 transition-all rounded-3xl">
        <CardContent className="p-6 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-0.5">Rexi Suggests:</p>
              <h3 className="font-bold text-white tracking-tight text-xs uppercase">Smart Insights</h3>
            </div>
          </div>

          <div className="min-h-[60px] mb-6">
            <p className="text-sm text-white/90 leading-relaxed font-medium">
              {tip}
              {isStreaming && <span className="inline-block w-1 h-4 bg-primary ml-1 animate-pulse" />}
            </p>
          </div>

          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-pink-500 fill-pink-500" />
                Updated Just Now
             </div>
             <Button variant="ghost" size="sm" className="h-8 rounded-full text-[10px] font-black uppercase text-primary hover:text-white hover:bg-primary/20 transition-all group/btn">
               Details <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
