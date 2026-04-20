"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";
import { Ticket, MapPin, Clock } from "lucide-react";

export function EventInfoCard() {
  const { user } = useAuthStore();

  return (
    <Card className="bg-surface border-border overflow-hidden group">
      <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Your Event Pass</h3>
            <p className="text-sm text-muted-foreground italic">Entry ID: #{user?.ticket_id || '982734'}</p>
          </div>
          <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
            <Ticket className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Seat</span>
            </div>
            <p className="text-xl font-bold text-white">{user?.seat_label || 'Section A4, Row 12, Seat 14'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Gate</span>
            </div>
            <p className="text-xl font-bold text-white">{user?.gate || 'Gate 4'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Entry Time</span>
            </div>
            <p className="text-xl font-bold text-white">{user?.entry_time || '18:45'}</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/5 font-mono text-xs font-bold text-primary">
              QR
            </div>
            <div>
              <p className="text-xs font-medium text-white">Digital Pass Active</p>
              <p className="text-[10px] text-muted-foreground">Tap to expand</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs">
            View Map
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
