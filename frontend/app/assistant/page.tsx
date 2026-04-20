"use client";

import { AIContextPanel } from "@/components/ai/AIContextPanel";
import { ChatWindow } from "@/components/ai/ChatWindow";

export default function AssistantPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-10 h-[calc(100vh-128px)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="lg:w-[35%] xl:w-1/4 h-full">
        <AIContextPanel />
      </div>
      
      <div className="flex-1 h-full min-w-0">
        <div className="mb-6 lg:hidden">
          <h1 className="text-3xl font-black text-white tracking-tighter">AI Assistant</h1>
          <p className="text-muted-foreground mt-1 text-sm">Smart venue support at your fingertips</p>
        </div>
        <ChatWindow />
      </div>
    </div>
  );
}
