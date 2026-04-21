"use client";

import { useEffect, useState } from "react";

const tips = [
  {
    tip: "Stand 7 has the shortest queue right now. Head there before halftime peak.",
    why: "Its current queue depth is below nearby stands and footfall trend is falling.",
  },
  {
    tip: "Use North Gate N4 for fastest exit after the 85th minute.",
    why: "Crowd model predicts lower egress density in North corridor over next 20 minutes.",
  },
  {
    tip: "Restroom B2 near Section A is currently under 3 minute wait.",
    why: "Recent zone snapshots show low occupancy and stable throughput in that cluster.",
  },
];

export function RexiTipCardPro() {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = window.setInterval(() => setI((v) => (v + 1) % tips.length), 180000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="relative rounded-3xl p-[1px] bg-[conic-gradient(from_0deg,#60a5fa,#ec4899,#f59e0b,#60a5fa)] animate-[spin_6s_linear_infinite]">
      <div className="glass rounded-3xl p-5 space-y-3 bg-black/35">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-fuchsia-500 grid place-items-center font-black">RX</div>
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-primary">Rexi Tip</p>
            <p className="text-sm">{tips[i].tip}</p>
          </div>
        </div>
        <button className="text-xs text-blue-200 underline" onClick={() => setOpen((v) => !v)}>
          Why?
        </button>
        {open && <p className="text-xs text-muted-foreground">{tips[i].why}</p>}
      </div>
    </div>
  );
}
