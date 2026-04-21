"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const hours = ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'];

const matrix = [
  [18, 25, 40, 66, 74, 71, 60, 42],
  [20, 32, 46, 70, 82, 78, 63, 44],
  [12, 28, 38, 58, 65, 63, 56, 33],
  [16, 20, 30, 48, 55, 59, 47, 29],
  [10, 18, 26, 44, 52, 55, 43, 25],
];

const avgRow = hours.map((_, col) => Math.round(matrix.reduce((sum, row) => sum + row[col], 0) / matrix.length));

function colorFor(v: number) {
  if (v < 20) return '#1a3a1a';
  if (v < 45) return '#22C55E';
  if (v < 70) return '#F59E0B';
  return '#EF4444';
}

export function ZoneHeatmapGrid() {
  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="h-2 w-8 rounded" style={{ background: '#1a3a1a' }} /> Quiet
          <span className="h-2 w-8 rounded" style={{ background: '#22C55E' }} /> Low
          <span className="h-2 w-8 rounded" style={{ background: '#F59E0B' }} /> Medium
          <span className="h-2 w-8 rounded" style={{ background: '#EF4444' }} /> High
        </div>

        <div className="grid grid-cols-[90px_1fr] gap-3">
          <div />
          <div className="grid grid-cols-8 gap-1">
            {hours.map((h) => (
              <span key={h} className="text-[10px] text-muted-foreground text-center">{h.slice(0, 2)}</span>
            ))}
          </div>

          {zones.map((zone, r) => (
            <>
              <span key={`${zone}-label`} className="text-[10px] font-bold uppercase tracking-wider text-white/85">{zone}</span>
              <div key={`${zone}-cells`} className="grid grid-cols-8 gap-1">
                {matrix[r].map((value, c) => (
                  <Tooltip key={`${zone}-${c}`}>
                    <TooltipTrigger asChild>
                      <div className="h-7 rounded-sm" style={{ background: colorFor(value) }} />
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      {zone} {hours[c]}: {value}% {value > 70 ? 'Peak' : 'Quiet'}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </>
          ))}

          <span className="text-[10px] font-black uppercase tracking-wider text-blue-200">All Zones</span>
          <div className="grid grid-cols-8 gap-1">
            {avgRow.map((v, idx) => (
              <div key={idx} className="h-7 rounded-sm border border-white/20" style={{ background: colorFor(v) }} />
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
