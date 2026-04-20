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

interface AlertCardProps {
  alert: Alert;
  onMarkRead: (id: string) => void;
}

export function AlertCard({ alert, onMarkRead }: AlertCardProps) {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical': return "border-l-danger bg-danger/5 text-danger";
      case 'high': return "border-l-warning bg-warning/5 text-warning";
      case 'medium': return "border-l-primary bg-primary/5 text-primary";
      default: return "border-l-border bg-surface text-muted-foreground";
    }
  };

  const getIcon = (type: string, severity: string) => {
    if (severity === 'critical') return <ShieldAlert className="w-5 h-5" />;
    if (type === 'urgent') return <AlertTriangle className="w-5 h-5" />;
    if (type === 'info') return <Info className="w-5 h-5" />;
    return <Bell className="w-5 h-5" />;
  };

  return (
    <Card className={cn(
      "border-l-4 border-y-0 border-r-0 transition-all hover:bg-white/5 group",
      getSeverityStyles(alert.severity),
      alert.is_read && "opacity-60 bg-transparent grayscale-[0.5]"
    )}>
      <CardContent className="p-6">
        <div className="flex gap-6">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
            alert.severity === 'critical' ? "bg-danger/20 border-danger/30" : "bg-zinc-900 border-border"
          )}>
            {getIcon(alert.type, alert.severity)}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className={cn(
                "font-bold tracking-tight",
                alert.is_read ? "text-muted-foreground" : "text-white"
              )}>{alert.title}</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[10px] uppercase font-black opacity-60">
                  <Clock className="w-3 h-3" />
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <p className={cn(
              "text-sm leading-relaxed",
              alert.is_read ? "text-muted-foreground/60" : "text-muted-foreground"
            )}>
              {alert.message}
            </p>

            <div className="pt-4 flex items-center gap-4">
              {!alert.is_read && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onMarkRead(alert.id)}
                  className="h-8 px-3 text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 hover:text-primary transition-all rounded-full border border-primary/20"
                >
                  Mark as Read
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 text-muted-foreground transition-all rounded-full group/btn"
              >
                View Details <ChevronRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
