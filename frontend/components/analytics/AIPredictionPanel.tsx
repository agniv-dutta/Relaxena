"use client";

import { useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { BrainCircuit, Sparkles } from "lucide-react";
import api from "@/lib/api";

const initialData = [
  { time: '+5m', density: 45, confidence: 0.62 },
  { time: '+10m', density: 60, confidence: 0.7 },
  { time: '+15m', density: 82, confidence: 0.74 },
  { time: '+20m', density: 75, confidence: 0.71 },
  { time: '+25m', density: 65, confidence: 0.68 },
  { time: '+30m', density: 50, confidence: 0.65 },
];

export function AIPredictionPanel() {
  const [data, setData] = useState(initialData);
  const [insight, setInsight] = useState('Loading AI narrative...');
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const { data: payload } = await api.get('/api/ai/predict?venue_id=1&refresh=true');
      if (payload?.predictions?.length) {
        const mapped = payload.predictions.slice(0, 6).map((p: { predicted_density: number }, i: number) => ({
          time: `+${(i + 1) * 5}m`,
          density: Math.round(p.predicted_density * 100),
          confidence: 0.7,
        }));
        setData(mapped);
      }
      if (payload?.narrative) setInsight(payload.narrative);
    } catch {
      setInsight('Prediction refresh failed. Showing latest cached signal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary"><BrainCircuit className="w-5 h-5" /></div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest">Predictive Analysis</h4>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Next 30 minute forecast</p>
          </div>
        </div>
        <button onClick={refresh} className="text-xs px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/5">Refresh</button>
      </div>

      <div className="h-[210px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 0, left: -25, bottom: 0 }}>
            <XAxis dataKey="time" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
            <Bar dataKey="density" radius={[5, 5, 0, 0]}>
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.density > 75 ? '#ef4444' : entry.density > 50 ? '#f59e0b' : '#22c55e'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 min-h-20">
        <div className="flex items-center gap-2 mb-2"><Sparkles className="w-3 h-3 text-primary" /><span className="text-[10px] font-black uppercase tracking-widest text-primary">AI Insight</span></div>
        <p className="text-[11px] text-white/85 leading-relaxed">{loading ? 'Rexi is computing a fresh forecast...' : insight}</p>
      </div>
    </div>
  );
}
