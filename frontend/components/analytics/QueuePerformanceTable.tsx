"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Row = {
  location: string;
  avgWait: number;
  peakWait: number;
  throughput: number;
  trend: 'up' | 'down' | 'flat';
  status: 'OPTIMAL' | 'BUSY' | 'OVERLOADED';
};

const rows: Row[] = [
  { location: 'Cloud Coffee', avgWait: 5, peakWait: 13, throughput: 120, trend: 'down', status: 'OPTIMAL' },
  { location: 'Pizza Hub Sector A', avgWait: 18, peakWait: 30, throughput: 85, trend: 'up', status: 'BUSY' },
  { location: 'Draft Bar West', avgWait: 12, peakWait: 22, throughput: 210, trend: 'flat', status: 'BUSY' },
  { location: 'Main Gate South', avgWait: 25, peakWait: 38, throughput: 1500, trend: 'up', status: 'OVERLOADED' },
];

export function QueuePerformanceTable() {
  const [sort, setSort] = useState<keyof Row>('avgWait');
  const [asc, setAsc] = useState(true);

  const sorted = useMemo(() => {
    const arr = [...rows].sort((a, b) => {
      const va = a[sort];
      const vb = b[sort];
      if (typeof va === 'number' && typeof vb === 'number') return asc ? va - vb : vb - va;
      return asc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
    return arr;
  }, [sort, asc]);

  const setSortCol = (col: keyof Row) => {
    if (sort === col) setAsc((v) => !v);
    else {
      setSort(col);
      setAsc(true);
    }
  };

  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-white/10">
            {['location', 'avgWait', 'peakWait', 'throughput', 'trend', 'status'].map((h) => (
              <th key={h} className="py-3 uppercase tracking-widest text-[10px] text-muted-foreground cursor-pointer" onClick={() => setSortCol(h as keyof Row)}>
                {h === 'avgWait' ? 'Avg Wait' : h === 'peakWait' ? 'Peak Wait' : h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.location} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="py-3 font-semibold">{row.location}</td>
              <td>{row.avgWait}m</td>
              <td>{row.peakWait}m</td>
              <td>{row.throughput}/hr</td>
              <td>{row.trend === 'up' ? 'Rising' : row.trend === 'down' ? 'Falling' : 'Stable'}</td>
              <td>
                <span className={cn('px-2 py-0.5 rounded text-[10px] font-black', row.status === 'OPTIMAL' ? 'bg-emerald-500/20 text-emerald-200' : row.status === 'BUSY' ? 'bg-amber-500/20 text-amber-200' : 'bg-rose-500/20 text-rose-200')}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
