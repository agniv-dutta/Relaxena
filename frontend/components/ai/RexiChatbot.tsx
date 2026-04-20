"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  ChevronDown,
  Minimize2,
  Maximize2
} from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const quickChips = [
  "Best food near me",
  "How crowded is it?",
  "Shortest exit route",
  "Queue status",
];

export function RexiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const pathname = usePathname();
  const { messages, sendMessage, isTyping } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-greeting on first open
  const [hasGreeted, setHasGreeted] = useState(false);
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true);
      // Optional: simulate greeting if empty
    }
  }, [isOpen, hasGreeted]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input, pathname); // Pass pathname for context
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Drawer */}
      <div className={cn(
        "mb-4 w-full max-w-[400px] transition-all duration-500 ease-in-out transform origin-bottom-right",
        isOpen && !isMinimized ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-8 pointer-events-none",
        isMinimized && "scale-90 opacity-0 translate-y-12"
      )}>
        <div className="glass rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-primary/20 flex flex-col h-[500px]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-primary/10 to-pink-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center p-2">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-success border-2 border-[#12121a] rounded-full" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-tight">Rexi • Relaxena AI</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Now</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="h-8 w-8 rounded-full text-muted-foreground hover:text-white">
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full text-muted-foreground hover:text-white hover:bg-danger/20 hover:text-danger">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-4 opacity-70">
                <p className="text-sm font-medium text-white/80">Hey! I'm Rexi 👋 Your Relaxena assistant. How can I help you enjoy the game today?</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}>
                {msg.role === 'assistant' && (
                  <Avatar className="w-7 h-7 bg-primary flex items-center justify-center text-[10px] font-black border-none shrink-0 mt-1">
                    <AvatarImage src="/rexi-avatar.png" />
                    <AvatarFallback>RX</AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                  "px-4 py-2.5 rounded-2xl text-xs leading-relaxed max-w-[80%]",
                  msg.role === 'user' 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-zinc-900 border border-white/5 text-white/90 rounded-tl-none"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center gap-1 border border-white/5">
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Contextual Chips */}
          <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-white/5 bg-black/10">
            {quickChips.map((chip) => (
              <button 
                key={chip} 
                onClick={() => sendMessage(chip, pathname)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-muted-foreground hover:bg-white/10 hover:text-white transition-all"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <div className="p-4 bg-black/20 border-t border-white/5">
            <div className="relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Rexi anything..."
                className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-3 pl-5 pr-12 text-xs focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mini FAB if minimized */}
      {isMinimized && (
        <Button 
          onClick={() => setIsMinimized(false)}
          className="mb-4 h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 shadow-2xl animate-in zoom-in duration-300"
        >
          <Maximize2 className="w-5 h-5 text-white" />
        </Button>
      )}

      {/* Main FAB */}
      <Button 
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMinimized(false);
        }}
        className={cn(
          "h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 shadow-[0_8px_30px_rgba(59,130,246,0.5)] border-none transition-all duration-300 z-[101]",
          isOpen ? "rotate-90 scale-90" : "animate-pulse-green"
        )}
      >
        {isOpen ? <ChevronDown className="w-8 h-8 text-white" /> : <Sparkles className="w-8 h-8 text-white" fill="white" />}
      </Button>
    </div>
  );
}
