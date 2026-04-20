"use client";

import { AIContextPanel } from "@/components/ai/AIContextPanel";
import { ChatWindow } from "@/components/ai/ChatWindow";
import { Sparkles, ShieldCheck, Zap, Bot, Navigation, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AssistantPage() {
  return (
    <div className="flex flex-col gap-8 pb-20">
      <div className="page-header">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Rexi Assistant</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Hyper-contextual venue support system</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-4 py-2 rounded-2xl bg-zinc-900 border border-white/5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_#22c55e]" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Neural Link Active</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-280px)] min-h-[600px]">
        {/* Left Column - Context */}
        <div className="lg:col-span-3 h-full overflow-y-auto no-scrollbar hidden xl:block">
          <AIContextPanel />
        </div>
        
        {/* Middle Column - Chat */}
        <div className="lg:col-span-12 xl:col-span-6 h-full flex flex-col glass rounded-[3rem] border-white/5 overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <ChatWindow />
        </div>

        {/* Right Column - Stats/Help */}
        <div className="lg:col-span-3 h-full flex flex-col gap-6 hidden lg:flex">
          <div className="p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                 <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">AI Capabilities</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Rexi can assist with real-time navigation, queue management, and service reporting.
            </p>
            <ul className="space-y-4">
               {[
                 { icon: Navigation, text: "Live Route Optimization", color: "text-success" },
                 { icon: Timer, text: "Queue Join & Management", color: "text-warning" },
                 { icon: ShieldCheck, text: "Security Dash Connection", color: "text-primary" }
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-[10px] font-black text-white uppercase tracking-[0.2em]">
                    <item.icon className={cn("w-4 h-4", item.color)} />
                    {item.text}
                 </li>
               ))}
            </ul>
          </div>

          <div className="flex-1 p-8 rounded-[2.5rem] bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/10 flex flex-col justify-end relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Bot className="w-32 h-32 text-pink-500" />
             </div>
             <div className="relative z-10 space-y-4">
               <h4 className="text-sm font-black text-white uppercase tracking-widest">Need help?</h4>
               <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                 Type your query in the chat or use rapid-response commands.
               </p>
               <Button className="w-full h-12 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-zinc-200">
                 Read Manual
               </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
