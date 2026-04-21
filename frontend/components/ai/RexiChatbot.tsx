"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUIStore } from "@/stores/uiStore";

const quickChips = ["Best food near me", "How crowded is it?", "Shortest exit route"];
const nudges = [
  "Need a faster route to your gate? Ask Rexi now.",
  "Crowd pulse shifted near North Concourse. Want alternatives?",
  "I can find the shortest queue near your section in one tap.",
];

export function RexiChatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [sparkleTick, setSparkleTick] = useState(0);
  const pathname = usePathname();
  const { messages, sendMessage, isTyping } = useChat();
  const proactiveTips = useUIStore((s) => s.toggles.proactiveTips);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setSparkleTick((s) => s + 1), 2600);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!proactiveTips) return;
    const timer = window.setInterval(() => {
      const message = nudges[Math.floor(Math.random() * nudges.length)];
      toast(message, { duration: 6000 });
    }, 30000);
    return () => window.clearInterval(timer);
  }, [proactiveTips]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const onSend = () => {
    const value = input.trim();
    if (!value) return;
    sendMessage(value, pathname);
    setInput("");
  };

  const particleOffsets = useMemo(
    () => [
      { x: -10, y: -22, delay: 0 },
      { x: 14, y: -28, delay: 0.2 },
      { x: 18, y: -14, delay: 0.4 },
      { x: -16, y: -8, delay: 0.6 },
    ],
    []
  );

  return (
    <div className="fixed bottom-6 right-6 z-[110] flex flex-col items-end">
      <AnimatePresence>
        {open && !minimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="mb-4 w-[400px] max-w-[calc(100vw-2rem)]"
          >
            <div className="glass rounded-[1.8rem] overflow-hidden border-white/15">
              <div className="px-5 py-4 bg-black/35 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={isTyping ? { scale: [1, 1.06, 1], rotate: [0, 4, 0] } : { scale: 1 }}
                    transition={{ duration: 1.2, repeat: isTyping ? Infinity : 0 }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-fuchsia-500 text-white font-black flex items-center justify-center"
                  >
                    RX
                  </motion.div>
                  <div>
                    <p className="text-sm font-black">Rexi - Relaxena AI</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Active now</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setMinimized(true)} className="h-8 w-8 rounded-full hover:bg-white/10 grid place-items-center">
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setOpen(false)} className="h-8 w-8 rounded-full hover:bg-white/10 grid place-items-center">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div ref={scrollRef} className="h-[340px] overflow-y-auto p-4 space-y-3 no-scrollbar bg-black/20">
                {messages.length === 0 && (
                  <div className="text-xs text-muted-foreground p-3 rounded-xl border border-white/10 bg-white/5">
                    Ask me anything about routes, restrooms, queues, and crowd flow.
                  </div>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white"
                          : "glass border-l-2 border-l-fuchsia-400"
                      )}
                    >
                      {msg.content}
                      {isTyping && msg.id === messages[messages.length - 1]?.id && msg.role === "assistant" && (
                        <span className="ml-1 inline-block w-1.5 h-4 bg-white/90 animate-pulse align-middle" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-3 py-2 border-t border-white/10 overflow-x-auto no-scrollbar bg-black/25 flex gap-2">
                {quickChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip, pathname)}
                    className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div className="p-3 border-t border-white/10 bg-black/20">
                <div className="relative">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSend()}
                    placeholder="Ask Rexi anything..."
                    className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-sm outline-none focus:border-blue-300/50"
                  />
                  <button
                    onClick={onSend}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-fuchsia-500 grid place-items-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {minimized && (
        <button
          className="mb-3 h-12 w-12 rounded-full glass border-white/20 grid place-items-center"
          onClick={() => setMinimized(false)}
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      )}

      <motion.button
        onClick={() => {
          setOpen((v) => !v);
          setMinimized(false);
        }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-16 w-16 rounded-full p-[2px] bg-[conic-gradient(from_0deg,#60a5fa,#ec4899,#f59e0b,#60a5fa)]"
      >
        <span className="absolute inset-0 animate-spin rounded-full border border-transparent" />
        <span className="relative h-full w-full rounded-full bg-gradient-to-br from-blue-500 to-fuchsia-600 grid place-items-center text-white shadow-[0_12px_30px_rgba(99,102,241,0.45)]">
          <Sparkles className="w-7 h-7" />
        </span>
        {particleOffsets.map((p, i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-white"
            animate={{
              opacity: [0, 1, 0],
              x: [0, p.x],
              y: [0, p.y],
              scale: [0.4, 1, 0.2],
            }}
            transition={{ duration: 0.9, delay: p.delay + (sparkleTick % 2) * 0.2 }}
          />
        ))}
      </motion.button>
    </div>
  );
}
