"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const actions = [
  { label: "Navigate: Dashboard", path: "/dashboard" },
  { label: "Navigate: Live Map", path: "/live-map" },
  { label: "Navigate: Queue", path: "/queue" },
  { label: "Navigate: Alerts", path: "/alerts" },
  { label: "Navigate: Analytics", path: "/analytics" },
  { label: "Queue: Join fastest lane", path: "/queue" },
  { label: "Ask Rexi: shortest exit route", path: "/assistant" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown") setSelected((s) => Math.min(s + 1, Math.max(results.length - 1, 0)));
      if (e.key === "ArrowUp") setSelected((s) => Math.max(0, s - 1));
      if (e.key === "Enter") {
        const item = results[selected];
        if (item) {
          router.push(item.path);
          setOpen(false);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, selected, router]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelected(0);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm p-4 md:p-10" onClick={() => setOpen(false)}>
      <div className="mx-auto max-w-2xl glass rounded-3xl p-4" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search venues, stands, gates, zones..."
          className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm outline-none"
        />
        <div className="mt-3 max-h-[50vh] overflow-auto space-y-1">
          {results.map((item, i) => (
            <button
              key={item.label}
              onClick={() => {
                router.push(item.path);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm ${i === selected ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
