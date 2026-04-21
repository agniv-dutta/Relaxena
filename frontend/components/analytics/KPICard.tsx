"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

interface KPICardProps {
  title: string;
  value: string;
  trend: number;
  label: string;
  icon: React.ReactNode;
}

function extractNumber(input: string) {
  const m = input.match(/[\d.]+/);
  return m ? Number(m[0]) : 0;
}

export function KPICard({ title, value, trend, label, icon }: KPICardProps) {
  const [count, setCount] = useState(0);
  const numeric = useMemo(() => extractNumber(value), [value]);
  const series = useMemo(() => [12, 14, 16, 15, 17, 18, 17, 19, 20, 21].map((v, i) => ({ i, v: v + trend })), [trend]);

  useEffect(() => {
    const start = performance.now();
    const duration = 800;
    const frame = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setCount(Math.round(numeric * (1 - (1 - p) ** 3)));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [numeric]);

  const displayValue = value.replace(String(numeric), String(count));

  return (
    <Card className="glass overflow-hidden relative group hover:scale-[1.01] transition-all">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">{icon}</div>
      <CardContent className="p-6 space-y-3">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</p>
        <h3 className="text-3xl font-black tracking-tighter metric-flash">{displayValue}</h3>

        <div className="h-[44px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <Line type="monotone" dataKey="v" stroke={trend >= 0 ? "#22c55e" : "#ef4444"} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between">
          <div className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-tight", trend > 0 ? "bg-success/10 text-success" : trend < 0 ? "bg-danger/10 text-danger" : "bg-zinc-800 text-muted-foreground")}>
            {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : trend < 0 ? <ArrowDownRight className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{label}</span>
        </div>
        <button className="text-xs text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity">View Detail -&gt;</button>
      </CardContent>
    </Card>
  );
}
