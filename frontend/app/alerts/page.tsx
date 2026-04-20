"use client";

import { useState } from "react";
import { AlertFilterBar, AlertList } from "@/components/alerts/AlertList";
import { IncidentLiveFeed } from "@/components/alerts/IncidentLiveFeed";
import { useAlertStore } from "@/stores/alertStore";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BellRing } from "lucide-react";

export default function AlertsPage() {
  const { alerts, setAlerts } = useAlertStore();
  const [filter, setFilter] = useState('all');

  const handleClearAll = () => {
    // Logic to mark all as read or clear
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 animate-in fade-in slide-in-from-left-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <BellRing className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter">Notifications</h1>
            </div>
            <p className="text-muted-foreground text-sm font-medium">Global venue alerts, security updates, and general info</p>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={handleClearAll}
            className="rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark all as read
          </Button>
        </div>

        <AlertFilterBar onFilterChange={setFilter} />
        
        <AlertList />
      </div>

      <div className="lg:col-span-4 space-y-8">
        <IncidentLiveFeed />
        
        {/* Help/Emergency Quick Actions */}
        <div className="p-8 rounded-[2rem] bg-danger/10 border border-danger/20 space-y-6">
          <div>
            <h4 className="text-sm font-black text-danger uppercase tracking-widest mb-2">Emergency Help</h4>
            <p className="text-xs text-danger/80 leading-relaxed font-medium">
              Need immediate assistance? Report critical safety incidents directly to our security team.
            </p>
          </div>
          <Button className="w-full h-12 rounded-2xl bg-danger hover:bg-danger/90 text-white font-black uppercase tracking-widest shadow-xl shadow-danger/20">
            Request Assistance
          </Button>
        </div>
      </div>
    </div>
  );
}
