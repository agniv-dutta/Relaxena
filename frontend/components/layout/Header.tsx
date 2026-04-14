"use client";

import Link from "next/link";
import { Search, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md px-4 flex items-center justify-between">
      <Link href="/dashboard" className="flex items-center gap-2">
        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
          Relxena
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
          <Search className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
          <UserIcon className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
