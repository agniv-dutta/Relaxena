"use client";

const mockPerformance = [
  { name: 'Cloud Coffee', throughput: '120/hr', avgWait: '5m', satisfaction: '94%', load: 'optimum' },
  { name: 'Pizza Hub Sector A', throughput: '85/hr', avgWait: '18m', satisfaction: '78%', load: 'high' },
  { name: 'Draft Bar West', throughput: '210/hr', avgWait: '12m', satisfaction: '88%', load: 'optimum' },
  { name: 'Burger Point', throughput: '95/hr', avgWait: '8m', satisfaction: '91%', load: 'optimum' },
  { name: 'Main Gate South', throughput: '1500/hr', avgWait: '25m', satisfaction: '65%', load: 'critical' },
];

export function QueuePerformanceTable() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Location</th>
            <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Throughput</th>
            <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Avg Wait</th>
            <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sat.</th>
            <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Load Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {mockPerformance.map((row) => (
            <tr key={row.name} className="group hover:bg-white/5 transition-colors">
              <td className="py-4 pl-2 font-bold text-sm text-white">{row.name}</td>
              <td className="py-4 text-sm text-muted-foreground font-mono">{row.throughput}</td>
              <td className="py-4 text-sm text-white font-bold">{row.avgWait}</td>
              <td className="py-4 text-sm text-primary font-black uppercase">{row.satisfaction}</td>
              <td className="py-4">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                  row.load === 'optimum' ? "bg-success/10 text-success" : 
                  row.load === 'high' ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"
                )}>
                  {row.load}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { cn } from "@/lib/utils";
