"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body className="bg-black text-white min-h-screen grid place-items-center p-6">
        <div className="max-w-lg w-full rounded-3xl border border-white/10 bg-zinc-950/90 p-8 text-center space-y-4">
          <h2 className="text-2xl font-black tracking-tight">Recovering Relaxena</h2>
          <p className="text-sm text-zinc-400">A critical rendering issue occurred. Retry to restore the app shell.</p>
          <Button onClick={reset} className="rounded-xl">Reload experience</Button>
        </div>
      </body>
    </html>
  );
}
