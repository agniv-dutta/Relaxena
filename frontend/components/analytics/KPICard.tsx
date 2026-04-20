"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  trend: number;
  label: string;
  icon: React.ReactNode;
}

export function KPICard({ title, value, trend, label, icon }: KPICardProps) {
  return (
    <Card className="bg-surface border-border overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      <CardContent className="p-6">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-3xl font-black text-white tracking-tighter mb-4">{value}</h3>
        
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-tight",
            trend > 0 ? "bg-success/10 text-success" : trend < 0 ? "bg-danger/10 text-danger" : "bg-zinc-800 text-muted-foreground"
          )}>
            {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : trend < 0 ? <ArrowDownRight className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{label}</span>
        </div>
      </CardContent>
    </Card>
  );
}
