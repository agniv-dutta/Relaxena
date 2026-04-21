"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] grid place-items-center px-6">
      <div className="max-w-lg w-full rounded-3xl border border-white/10 bg-zinc-950/80 p-8 text-center space-y-4">
        <h2 className="text-2xl font-black tracking-tight">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">Relaxena hit an unexpected issue. You can retry safely.</p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset} className="rounded-xl">Try again</Button>
        </div>
      </div>
    </div>
  );
}
