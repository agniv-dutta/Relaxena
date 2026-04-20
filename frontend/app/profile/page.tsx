"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  QrCode, 
  Settings, 
  CreditCard, 
  History, 
  MapPin, 
  Trophy, 
  Star,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row items-center gap-8 glass p-8 rounded-[3rem] border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-2xl">
          <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left space-y-2 flex-1">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <h1 className="text-4xl font-black text-white tracking-tighter">Alex Johnson</h1>
            <div className="px-3 py-1 rounded-full bg-warning/20 border border-warning/30 text-[10px] font-black text-warning uppercase tracking-widest">Premium</div>
          </div>
          <p className="text-muted-foreground font-medium">Gold Member since 2023 • Section 204, Row 12</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
              <Trophy className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">2,450 Points</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
              <Star className="w-3 h-3 text-pink-500" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Top 5% Supporter</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="absolute top-6 right-6 text-muted-foreground hover:text-white">
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Digital Ticket Card */}
        <div className="md:col-span-7 space-y-6">
          <h3 className="px-2 text-xs font-black text-white uppercase tracking-widest">Active Ticket</h3>
          <Card className="bg-white text-black rounded-[2.5rem] overflow-hidden border-none shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-40 bg-zinc-900 flex items-center justify-center">
               <div className="text-center">
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">ArenaFlow Entry</p>
                 <h4 className="text-2xl font-black text-white tracking-tighter">Relaxena FC vs. United</h4>
               </div>
            </div>
            
            <CardContent className="pt-48 pb-8 px-8 space-y-8">
               <div className="flex justify-between border-b border-zinc-100 pb-6">
                 <div>
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Section</p>
                   <p className="text-xl font-black">204</p>
                 </div>
                 <div className="text-center">
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Row</p>
                   <p className="text-xl font-black">12</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Seat</p>
                   <p className="text-xl font-black">42</p>
                 </div>
               </div>

               <div className="flex flex-col items-center gap-4">
                 <div className="p-6 rounded-3xl bg-zinc-50 border-2 border-zinc-100 shadow-inner">
                    <QrCode className="w-40 h-40 text-black" />
                 </div>
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] animate-pulse">Scan at Turnstile</p>
               </div>
               
               <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-success/5 text-success">
                 <ShieldCheck className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Verified Digital Pass</span>
               </div>
            </CardContent>
            
            {/* Ticket Cutout Effect */}
            <div className="absolute left-0 top-40 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0a0a0f]" />
            <div className="absolute right-0 top-40 translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0a0a0f]" />
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="md:col-span-5 space-y-8">
          <div className="space-y-4">
            <h3 className="px-2 text-xs font-black text-white uppercase tracking-widest">Account Info</h3>
            <div className="space-y-3">
              {[
                { label: "Payment Method", value: "Visa •••• 4242", icon: CreditCard },
                { label: "Match History", value: "12 Games Attended", icon: History },
                { label: "Loyalty Tier", value: "Gold Status", icon: Trophy },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-[2rem] bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
                      <p className="text-sm font-bold text-white leading-tight">{item.value}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-white" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Trophy className="w-20 h-20 text-primary" />
            </div>
            <div className="relative z-10">
              <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-2">Rewards Available</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium mb-4">
                You have enough points to claim a free drink at Sector B Concessions.
              </p>
              <Button className="w-full h-11 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px]">
                Redeem 500 Pts
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
