"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({ defaultValue, onValueChange, className, children, ...props }: TabsProps) {
  const [value, setValue] = React.useState(defaultValue);

  const updateValue = (next: string) => {
    setValue(next);
    onValueChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ value, setValue: updateValue }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex items-center gap-2", className)} {...props} />;
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({ value, className, ...props }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used inside Tabs");
  }

  const active = context.value === value;

  return (
    <button
      type="button"
      data-state={active ? "active" : "inactive"}
      onClick={() => context.setValue(value)}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3 py-1 text-sm",
        active ? "bg-zinc-800 text-white" : "text-zinc-400",
        className
      )}
      {...props}
    />
  );
}
