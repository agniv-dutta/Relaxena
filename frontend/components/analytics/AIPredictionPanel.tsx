"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Sparkles, BrainCircuit } from "lucide-react";

const predictionData = [
  { time: '+5m', density: 45 },
  { time: '+10m', density: 60 },
  { time: '+15m', density: 82 },
  { time: '+20m', density: 75 },
  { time: '+25m', density: 65 },
  { time: '+30m', density: 50 },
];

export function AIPredictionPanel() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-widest tracking-tighter">Predictive Analysis</h4>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Next 30 Minute Forecast</p>
        </div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={predictionData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <XAxis 
              dataKey="time" 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ 
                backgroundColor: '#12121a', 
                border: '1px solid #1e1e2e', 
                borderRadius: '8px',
                fontSize: '10px'
              }}
            />
            <Bar dataKey="density" radius={[4, 4, 0, 0]}>
              {predictionData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.density > 75 ? '#ef4444' : entry.density > 50 ? '#3b82f6' : '#22c55e'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">AI Insight</span>
        </div>
        <p className="text-[11px] text-white/80 leading-relaxed italic">
          "Mass exit predicted in West Sector at T+15m. Recommend deploying additional security personnel to Gate 12 immediately."
        </p>
      </div>
    </div>
  );
}
