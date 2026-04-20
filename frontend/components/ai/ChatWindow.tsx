"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  Mic, 
  Plus, 
  MapPin, 
  Users, 
  Zap,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatWindow() {
  const { messages, sendMessage, isTyping } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-black/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" fill="white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Relaxena AI</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active • Streaming enabled</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth no-scrollbar"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4 opacity-50">
            <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-border flex items-center justify-center mb-2">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold text-white">How can I help you today?</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              I can assist with navigation, finding shorter lines, or checking match stats in real-time.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={cn(
              "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            <Avatar className="w-8 h-8 border border-white/10 shrink-0">
              <AvatarImage src={msg.role === 'assistant' ? "/ai-bot.svg" : `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.role}`} />
              <AvatarFallback>{msg.role === 'assistant' ? 'AI' : 'U'}</AvatarFallback>
            </Avatar>

            <div className={cn(
              "max-w-[80%] space-y-3",
              msg.role === 'user' ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "px-5 py-3 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10" 
                  : "bg-zinc-900 border border-border text-white rounded-tl-none"
              )}>
                {msg.content}
                {msg.role === 'assistant' && isTyping && msg === messages[messages.length-1] && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse vertical-middle" />
                )}
              </div>
              
              {/* Action Cards inside AI message */}
              {msg.actions?.map((action, idx) => (
                <ActionCard key={idx} action={action} />
              ))}

              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && messages[messages.length-1]?.role !== 'assistant' && (
          <div className="flex gap-4">
            <Avatar className="w-8 h-8 bg-zinc-900 border border-border flex items-center justify-center">
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" />
              </div>
            </Avatar>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-border bg-black/20">
        <div className="relative group">
          <textarea 
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Type your message..."
            className="w-full bg-zinc-900 border border-border rounded-2xl py-4 pl-6 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none no-scrollbar shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-white/5 transition-colors">
              <Mic className="w-4 h-4" />
            </Button>
            <Button 
              size="icon" 
              className="rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              onClick={handleSend}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-4 uppercase tracking-[0.1em] font-medium">
          Relaxena AI can clarify venue rules and provide live navigation support.
        </p>
      </div>
    </div>
  );
}

function ActionCard({ action }: { action: any }) {
  return (
    <div className="p-4 rounded-xl bg-surface border border-primary/20 shadow-xl max-w-sm animate-in zoom-in-95 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {action.type === 'queue_join' ? <Users className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
        </div>
        <div>
          <h4 className="text-xs font-bold text-white tracking-tight uppercase">{action.label}</h4>
          <p className="text-[10px] text-muted-foreground">Automatic action available</p>
        </div>
      </div>
      <Button className="w-full h-9 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold gap-2">
        {action.type === 'queue_join' ? 'Confirm Join' : 'Open in Map'} <ExternalLink className="w-3 h-3" />
      </Button>
    </div>
  );
}

import { MessageSquare } from "lucide-react";
