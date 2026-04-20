"use client";

import { Alert } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  ShieldAlert,
  Clock,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface AlertCardProps {
  alert: Alert;
  onMarkRead: (id: string) => void;
}

export function AlertCard({ alert, onMarkRead }: AlertCardProps) {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical': return "border-l-danger shadow-[0_0_15px_rgba(239,68,68,0.1)]";
      case 'high': return "border-l-warning shadow-[0_0_15px_rgba(245,158,11,0.1)]";
      case 'medium': return "border-l-primary shadow-[0_0_15px_rgba(59,130,246,0.1)]";
      default: return "border-l-zinc-700";
    }
  };

  const getIcon = (type: string, severity: string) => {
    if (severity === 'critical') return <ShieldAlert className="w-5 h-5 text-danger" />;
    if (severity === 'high') return <AlertTriangle className="w-5 h-5 text-warning" />;
    return <Info className="w-5 h-5 text-primary" />;
  };

  return (
    <Card className={cn(
      "bg-zinc-900 border border-white/5 border-l-4 transition-all duration-300 group hover:translate-x-1 rounded-[2rem] overflow-hidden",
      getSeverityStyles(alert.severity),
      alert.is_read && "opacity-60 bg-transparent grayscale-[0.5] border-l-zinc-800"
    )}>
      <CardContent className="p-0">
        <div className="flex items-stretch min-h-[120px]">
          <div className="flex-1 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex gap-5">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110",
                alert.severity === 'critical' ? "bg-danger/10 border-danger/20" : 
                alert.severity === 'high' ? "bg-warning/10 border-warning/20" : 
                "bg-primary/10 border-primary/20"
              )}>
                {getIcon(alert.type, alert.severity)}
              </div>
              
              <div className="space-y-1.5 pointer-events-none">
                <div className="flex items-center gap-3">
                  <h3 className={cn(
                    "text-sm font-black uppercase tracking-tight",
                    alert.is_read ? "text-zinc-500" : "text-white"
                  )}>{alert.title}</h3>
                  {!alert.is_read && <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#3b82f6]" />}
                </div>
                <p className={cn(
                  "text-xs leading-relaxed max-w-xl font-medium",
                  alert.is_read ? "text-zinc-500" : "text-zinc-400"
                )}>
                  {alert.message}
                </p>
                <div className="flex items-center gap-3 pt-1">
                   <div className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                        {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                      </span>
                   </div>
                   <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{alert.type}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {!alert.is_read && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => { e.stopPropagation(); onMarkRead(alert.id); }}
                  className="rounded-full text-[10px] font-black uppercase tracking-widest text-primary hover:text-white hover:bg-primary/20 transition-all border border-primary/10"
                >
                  Dismiss
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:text-white hover:bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
