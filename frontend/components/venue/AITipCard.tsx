"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AITipCard() {
  return (
    <Card className="bg-gradient-to-br from-primary/20 via-surface to-background border-primary/30 relative overflow-hidden group">
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
      
      <CardContent className="p-6 relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white tracking-tight">ArenaFlow AI Suggestion</h3>
        </div>

        <p className="text-sm text-white/90 leading-relaxed mb-6 font-medium">
          "The Food Court in Sector B is currently at 40% capacity. It's a great time to grab a snack before the halftime rush begins in 15 minutes."
        </p>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="w-6 h-6 rounded-full border-2 border-surface bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-muted-foreground"
              >
                U{i}
              </div>
            ))}
            <div className="pl-3 text-[10px] text-muted-foreground self-center">
              +142 users took this tip
            </div>
          </div>

          <Button size="sm" className="rounded-full bg-white text-black hover:bg-white/90 group/btn">
            Explore <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
