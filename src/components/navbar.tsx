"use client";

import React from "react";
import { Flame } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-red-950 p-[1px] shadow-[0_0_15px_-2px_rgba(239,68,68,0.5)]">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-black">
              <Flame className="h-4 w-4 text-red-500 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-heading text-lg font-bold tracking-tight text-white">
              CLIP<span className="text-red-500">FORGE</span>
            </span>
            <span className="inline-flex items-center rounded-md border border-red-500/30 bg-red-950/40 px-1.5 py-0.5 text-[10px] font-semibold text-red-400">
              AI
            </span>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="flex h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <span className="hidden sm:inline">AI Clips Engine</span>
        </div>
      </div>
    </header>
  );
}
