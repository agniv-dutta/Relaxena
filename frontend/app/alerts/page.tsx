"use client";

import { useState } from "react";
import { AlertsHero } from "@/components/alerts/AlertsHero";
import { LiveIncidentTicker } from "@/components/alerts/LiveIncidentTicker";
import { AlertStatsRow } from "@/components/alerts/AlertStatsRow";
import { AlertFilterBar, AlertList } from "@/components/alerts/AlertList";
import { useAlertStore } from "@/stores/alertStore";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";

export default function AlertsPage() {
  const { alerts, markRead } = useAlertStore();
  const [filter, setFilter] = useState('all');

  const handleClearAll = () => {
    alerts.forEach(a => !a.is_read && markRead(a.id));
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header section */}
      <div className="page-header">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter sm:text-5xl">
            Notifications
          </h1>
          <p className="text-muted-foreground font-medium">Real-time venue security and incident monitoring.</p>
        </div>
        <div className="flex items-center gap-4">
           <Button 
             variant="ghost" 
             onClick={handleClearAll}
             className="rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white"
           >
             <CheckCircle2 className="w-4 h-4 mr-2" /> Mark all as read
           </Button>
        </div>
      </div>

      <div className="space-y-8">
        <AlertsHero />
        <LiveIncidentTicker />
        <AlertStatsRow />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <AlertFilterBar onFilterChange={setFilter} />
          <AlertList />
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Security Hotline Card */}
          <div className="glass-pink p-8 rounded-[2.5rem] border-danger/20 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldAlert className="w-20 h-20 text-danger" />
            </div>
            <div className="relative z-10">
              <h4 className="text-sm font-black text-danger uppercase tracking-widest mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Security Hotline
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium mb-6">
                Need immediate assistance? Report critical safety incidents directly to our security team.
              </p>
              <Button className="w-full h-12 rounded-2xl bg-danger hover:bg-danger/90 text-white font-black uppercase tracking-widest shadow-xl shadow-danger/20 hover:scale-105 active:scale-95 transition-all">
                Request Assistance
              </Button>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                 <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">AI Insights</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Rexi is monitoring venue clusters. No unusual behavior detected in your current sector.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
