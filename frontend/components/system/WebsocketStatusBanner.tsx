"use client";

import { useEffect, useState } from "react";

export function WebsocketStatusBanner() {
  const [status, setStatus] = useState<"ok" | "reconnecting" | "restored">("ok");

  useEffect(() => {
    let retry = 0;
    let timer: number | undefined;

    const onOffline = () => {
      setStatus("reconnecting");
      const tick = () => {
        retry += 1;
        const delay = Math.min(12000, 1000 * 2 ** retry);
        timer = window.setTimeout(() => {
          if (navigator.onLine) {
            setStatus("restored");
            window.setTimeout(() => setStatus("ok"), 1600);
          } else {
            tick();
          }
        }, delay);
      };
      tick();
    };

    const onOnline = () => {
      setStatus("restored");
      window.setTimeout(() => setStatus("ok"), 1600);
    };

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  if (status === "ok") return null;

  const isReconnect = status === "reconnecting";
  return (
    <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-[120] px-4 py-2 rounded-full text-xs font-bold ${isReconnect ? "bg-amber-500/20 text-amber-200 border border-amber-300/30" : "bg-emerald-500/20 text-emerald-200 border border-emerald-300/30"}`}>
      {isReconnect ? "Reconnecting..." : "Live sync restored"}
    </div>
  );
}
