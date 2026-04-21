"use client";

import { useEffect } from "react";
import { useAlertStore } from "@/stores/alertStore";
import { useEventStore } from "@/stores/eventStore";

export function AmbientBackground() {
  const alerts = useAlertStore((s) => s.alerts);
  const score = useEventStore((s) => s.score);

  useEffect(() => {
    const hasCritical = alerts.some((a) => a.severity === "critical" || a.severity === "high");
    if (hasCritical) {
      document.body.classList.add("alert-mode");
      const t = setTimeout(() => document.body.classList.remove("alert-mode"), 1200);
      return () => clearTimeout(t);
    }
    document.body.classList.remove("alert-mode");
  }, [alerts]);

  useEffect(() => {
    if (!score) return;
    document.body.classList.add("goal-mode");
    const t = setTimeout(() => document.body.classList.remove("goal-mode"), 700);
    return () => clearTimeout(t);
  }, [score?.home_score, score?.away_score]);

  return null;
}
