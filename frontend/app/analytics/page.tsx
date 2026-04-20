"use client";

import { KPICard } from "@/components/analytics/KPICard";
import { CrowdDensityChart } from "@/components/analytics/CrowdDensityChart";
import { ZoneHeatmapGrid } from "@/components/analytics/ZoneHeatmapGrid";
import { QueuePerformanceTable } from "@/components/analytics/QueuePerformanceTable";
import { AIPredictionPanel } from "@/components/analytics/AIPredictionPanel";
import { 
  Users, 
  Activity, 
  Timer, 
  ShieldAlert,
  Download,
  Calendar,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Analytics Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Administrator View</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Venue Intelligence</h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">Advanced crowd analytics and predictive infrastructure monitoring</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-border bg-surface text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4 mr-2" /> Last 3 Hours
          </Button>
          <Button className="rounded-xl bg-white text-black hover:bg-white/90 text-xs font-bold uppercase tracking-wider">
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Live Attendance" 
          value="42,518" 
          trend={+5.2} 
          label="vs last hour" 
          icon={<Users className="w-8 h-8 text-primary" />} 
        />
        <KPICard 
          title="Avg. Occupancy" 
          value="78%" 
          trend={-2.4} 
          label="vs match start" 
          icon={<Activity className="w-8 h-8 text-primary" />} 
        />
        <KPICard 
          title="Queue Throughput" 
          value="1.2k/min" 
          trend={+12.8} 
          label="efficiency up" 
          icon={<Timer className="w-8 h-8 text-primary" />} 
        />
        <KPICard 
          title="Active Alerts" 
          value="04" 
          trend={0} 
          label="managed locally" 
          icon={<ShieldAlert className="w-8 h-8 text-danger" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Charts (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-surface border border-border rounded-[2rem] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-white tracking-tight uppercase">Crowd Density Trends</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Real-time zone utilization</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">North Sector</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">South Sector</span>
                </div>
              </div>
            </div>
            <div className="h-[350px]">
              <CrowdDensityChart />
            </div>
          </div>

          <div className="bg-surface border border-border rounded-[2rem] p-8 shadow-2xl">
            <div className="mb-8">
              <h3 className="text-lg font-black text-white tracking-tight uppercase">Hourly Heatmap Grid</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Zone occupancy distribution</p>
            </div>
            <ZoneHeatmapGrid />
          </div>
        </div>

        {/* Side Panels (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface border border-border rounded-[2rem] p-8 shadow-2xl">
            <AIPredictionPanel />
          </div>

          <div className="bg-gradient-to-br from-zinc-900 to-black border border-border rounded-[2rem] p-8 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Queue Efficiency</h3>
              <Filter className="w-4 h-4 text-muted-foreground" />
            </div>
            <QueuePerformanceTable />
          </div>
        </div>
      </div>
    </div>
  );
}
