"use client";

import { useAuthStore } from "@/stores/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Bell, 
  Calendar,
  LogOut,
  User as UserIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 fixed top-0 left-60 right-0 border-b border-border bg-background/80 backdrop-blur-md z-40 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-md relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Search zones, queues, or staff..."
          className="w-full bg-surface border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-background" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="pl-1 pr-2 gap-2 h-10 rounded-full hover:bg-surface border border-transparent hover:border-border transition-all">
              <Avatar className="w-8 h-8 border border-white/10">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name || 'guest'}`} />
                <AvatarFallback>{user?.full_name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold leading-tight">{user?.full_name || 'Agniv Dutta'}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{user?.role || 'Spectator'}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-surface border-border">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <UserIcon className="w-4 h-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Settings className="w-4 h-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-danger cursor-pointer focus:text-danger" onClick={logout}>
              <LogOut className="w-4 h-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// Simple internal separator to avoid dependency issues if not yet installed as shadcn component
function Separator({ orientation, className }: { orientation: "vertical" | "horizontal"; className?: string }) {
  return (
    <div 
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )} 
    />
  );
}

import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
