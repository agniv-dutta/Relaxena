"use client";

import { useAlertStore } from "@/stores/alertStore";
import { Bell, AlertTriangle, Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function AlertStatsRow() {
  const { alerts } = useAlertStore();
  
  const stats = [
    { label: "Total Alerts", value: alerts.length, icon: Bell, border: "border-white/5", color: "text-white" },
    { label: "Critical", value: alerts.filter(a => a.severity === 'high').length, icon: AlertTriangle, border: "border-danger/20", color: "text-danger" },
    { label: "Updates", value: alerts.filter(a => a.severity === 'medium').length, icon: Info, border: "border-warning/20", color: "text-warning" },
    { label: "Security", value: "Active", icon: ShieldCheck, border: "border-success/20", color: "text-success" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className={cn(
          "p-4 rounded-3xl bg-zinc-900 border flex flex-col gap-2 transition-all hover:translate-y-[-2px] hover:bg-zinc-800/80",
          stat.border
        )}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</span>
            <stat.icon className={cn("w-4 h-4", stat.color)} />
          </div>
          <p className={cn("text-2xl font-black tabular-nums", stat.color)}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
