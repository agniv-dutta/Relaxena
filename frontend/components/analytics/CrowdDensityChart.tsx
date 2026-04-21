"use client";

import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const mockData = [
  { time: '18:00', zoneA: 30, zoneB: 45, predicted: 38 },
  { time: '18:30', zoneA: 40, zoneB: 50, predicted: 47 },
  { time: '19:00', zoneA: 65, zoneB: 55, predicted: 61 },
  { time: '19:30', zoneA: 80, zoneB: 70, predicted: 74 },
  { time: '20:00', zoneA: 75, zoneB: 85, predicted: 79 },
  { time: '20:30', zoneA: 60, zoneB: 65, predicted: 66 },
];

export function CrowdDensityChart() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockData} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="zoneAFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="zoneBFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
          <XAxis dataKey="time" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(13, 13, 20, 0.75)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
            }}
          />
          <Area type="monotone" dataKey="zoneA" stroke="#3b82f6" strokeWidth={2.2} fill="url(#zoneAFill)" animationDuration={700} />
          <Area type="monotone" dataKey="zoneB" stroke="#ec4899" strokeWidth={2.2} fill="url(#zoneBFill)" animationDuration={700} />
          <Line type="monotone" dataKey="predicted" stroke="#a78bfa" strokeDasharray="5 5" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
