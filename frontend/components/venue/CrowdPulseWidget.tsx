"use client";

import { Activity } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

const points = [62, 65, 64, 68, 71, 73, 74, 72, 76, 74].map((v, i) => ({ i, v }));

export function CrowdPulseWidget() {
  const score = 74;
  const color = score < 50 ? "#22c55e" : score < 76 ? "#f59e0b" : "#ef4444";
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference * (1 - score / 100);

  return (
    <div className="glass p-6 rounded-3xl border-white/10 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" /> Crowd Pulse
        </h3>
        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full live-badge">Live</span>
      </div>

      <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
        <div className="relative h-[140px] w-[140px]">
          <svg className="h-full w-full -rotate-90">
            <circle cx="70" cy="70" r="52" stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
            <circle
              cx="70"
              cy="70"
              r="52"
              stroke={color}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-3xl font-black metric-flash">{score}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Energy</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-14">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points}>
                <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300">
            Rising
          </span>
          <p className="text-xs text-muted-foreground">Peak expected at halftime in 8 min</p>
        </div>
      </div>
    </div>
  );
}
