"use client";

import { cn } from "@/lib/utils";
import { Utensils, Coffee, Beer, DoorOpen, Palette } from "lucide-react";
import { QueueCategory } from "@/types/api";

const categories = [
  { id: 'food', label: 'Food & Dining', icon: Utensils },
  { id: 'cafes', label: 'Coffee', icon: Coffee },
  { id: 'drinks', label: 'Refreshments', icon: Beer },
  { id: 'gates', label: 'Entry Gates', icon: DoorOpen },
  { id: 'merch', label: 'Merchandise', icon: Palette },
];

interface QueueCategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export function QueueCategoryTabs({ activeCategory, onCategoryChange }: QueueCategoryTabsProps) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-surface border border-border rounded-2xl overflow-x-auto no-scrollbar">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              "flex items-center gap-3 px-6 py-2.5 rounded-xl transition-all whitespace-nowrap group",
              isActive 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            )}
          >
            <cat.icon className={cn(
              "w-4 h-4 transition-colors",
              isActive ? "text-white" : "group-hover:text-white"
            )} />
            <span className="text-xs font-bold uppercase tracking-widest">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
