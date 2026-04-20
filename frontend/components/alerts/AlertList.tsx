"use client";

import { AlertCard } from "./AlertCard";
import { useAlertStore } from "@/stores/alertStore";
import { Search, Filter, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AlertFilterBar({ onFilterChange }: { onFilterChange: (category: string) => void }) {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Alerts' },
    { id: 'urgent', label: 'Urgent' },
    { id: 'info', label: 'General' },
    { id: 'staff', label: 'Staff only' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
      <div className="flex bg-surface p-1 rounded-2xl border border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); onFilterChange(tab.id); }}
            className={cn(
              "px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === tab.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="Search alerts..."
            className="bg-surface border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all w-64"
          />
        </div>
        <Button variant="outline" className="rounded-xl border-border bg-surface text-muted-foreground">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </Button>
      </div>
    </div>
  );
}

export function AlertList() {
  const { alerts, markRead } = useAlertStore();

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <div className="p-12 text-center rounded-[2rem] bg-surface/30 border border-dashed border-border opacity-50 flex flex-col items-center">
          <CheckCircle2 className="w-12 h-12 text-success mb-4" />
          <p className="text-sm font-bold text-white">All Clear</p>
          <p className="text-xs text-muted-foreground mt-1">There are no notifications at the moment.</p>
        </div>
      ) : (
        alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} onMarkRead={markRead} />
        ))
      )}
    </div>
  );
}
