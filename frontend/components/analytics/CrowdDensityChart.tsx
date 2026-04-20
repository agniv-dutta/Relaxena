"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { useVenueStore } from "@/stores/venueStore";

const mockData = [
  { time: '18:00', zoneA: 30, zoneB: 45, zoneC: 20 },
  { time: '18:30', zoneA: 40, zoneB: 50, zoneC: 35 },
  { time: '19:00', zoneA: 65, zoneB: 55, zoneC: 45 },
  { time: '19:30', zoneA: 80, zoneB: 70, zoneC: 60 },
  { time: '20:00', zoneA: 75, zoneB: 85, zoneC: 70 },
  { time: '20:30', zoneA: 60, zoneB: 65, zoneC: 55 },
];

export function CrowdDensityChart() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorZoneA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorZoneB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#52525b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#71717a' }}
          />
          <YAxis 
            stroke="#52525b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#71717a' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#12121a', 
              border: '1px solid #1e1e2e', 
              borderRadius: '12px',
              fontSize: '11px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: '#fff' }}
          />
          <Area 
            type="monotone" 
            dataKey="zoneA" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorZoneA)" 
            name="Zone A"
          />
          <Area 
            type="monotone" 
            dataKey="zoneB" 
            stroke="#ec4899" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorZoneB)" 
            name="Zone B"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
