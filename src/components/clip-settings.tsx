"use client";

import React from "react";
import {
  Sparkles,
  Sliders,
  Clock,
  Crop,
  Type,
  Wand2,
  Check,
  Zap,
  Flame,
  CheckCircle2,
  Bot,
  Scissors,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ClipGenerationSettings,
  AspectRatioType,
  ClipLengthType,
  CaptionStyleType,
} from "@/types/clips";

interface ClipSettingsProps {
  settings: ClipGenerationSettings;
  onChangeSettings: (newSettings: ClipGenerationSettings) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasMedia: boolean;
}

export function ClipSettings({
  settings,
  onChangeSettings,
  onGenerate,
  isGenerating,
  hasMedia,
}: ClipSettingsProps) {
  const updateSetting = <K extends keyof ClipGenerationSettings>(
    key: K,
    val: ClipGenerationSettings[K]
  ) => {
    onChangeSettings({
      ...settings,
      [key]: val,
    });
  };

  const PROMPT_PRESETS = [
    "Most controversial statements & counter-intuitive advice",
    "Funniest punchlines & high-energy banter",
    "Key actionable business & startup lessons",
    "Deep philosophical revelations & quotable moments",
  ];

  return (
    <div className="w-full rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-5 sm:p-6 backdrop-blur-md shadow-2xl relative">
      {/* Decorative Red Accent */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-950/60 border border-red-800/50 text-red-500 shadow-inner">
            <Wand2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              AI Clips Engine Setup
            </h3>
            <p className="text-[11px] text-zinc-400">
              Customize clipping rules, duration, and subtitle styling
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1 rounded-full border border-red-500/30 bg-red-950/30 px-2.5 py-0.5 text-[11px] font-medium text-red-400">
          <Flame className="h-3 w-3 fill-red-500" />
          <span>v2.4 Viral Model</span>
        </span>
      </div>

      <div className="space-y-5">
        {/* 1. Target Aspect Ratio */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Crop className="h-3.5 w-3.5 text-red-500" />
              Aspect Ratio (Export Format)
            </span>
            <span className="text-[11px] text-red-400 font-mono font-normal">Recommended: 9:16</span>
          </label>

          <div className="grid grid-cols-3 gap-2">
            {[
              {
                id: "9:16" as AspectRatioType,
                name: "9:16 Vertical",
                platforms: "TikTok, Reels, Shorts",
                badge: "Most Viral",
              },
              {
                id: "1:1" as AspectRatioType,
                name: "1:1 Square",
                platforms: "Instagram, LinkedIn",
                badge: null,
              },
              {
                id: "16:9" as AspectRatioType,
                name: "16:9 Wide",
                platforms: "YouTube Highlights",
                badge: null,
              },
            ].map((ratio) => {
              const active = settings.aspectRatio === ratio.id;
              return (
                <button
                  key={ratio.id}
                  type="button"
                  onClick={() => updateSetting("aspectRatio", ratio.id)}
                  className={`group relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    active
                      ? "border-red-500 bg-red-950/20 text-white shadow-lg shadow-red-950/40 ring-1 ring-red-500"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {ratio.badge && (
                    <span className="absolute -top-2 right-2 rounded-full bg-red-600 px-1.5 py-0.2 text-[9px] font-bold text-white shadow-sm">
                      {ratio.badge}
                    </span>
                  )}
                  <span className={`text-xs font-bold ${active ? "text-red-400" : "text-zinc-200"}`}>
                    {ratio.name}
                  </span>
                  <span className="mt-0.5 text-[10px] text-zinc-400 line-clamp-1">
                    {ratio.platforms}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Target Clip Duration */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-red-500" />
            Target Clip Duration
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "auto" as ClipLengthType, label: "Auto (AI Best)", sub: "30s - 60s" },
              { id: "under30" as ClipLengthType, label: "< 30s Hook", sub: "Fast TikTok" },
              { id: "30to60" as ClipLengthType, label: "30s - 60s", sub: "Standard Shorts" },
              { id: "60to90" as ClipLengthType, label: "60s - 90s", sub: "Storytelling" },
            ].map((dur) => {
              const active = settings.clipLength === dur.id;
              return (
                <button
                  key={dur.id}
                  type="button"
                  onClick={() => updateSetting("clipLength", dur.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    active
                      ? "border-red-500 bg-red-950/20 text-white ring-1 ring-red-500"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <div className={`text-xs font-semibold ${active ? "text-red-400" : "text-zinc-200"}`}>
                    {dur.label}
                  </div>
                  <div className="text-[10px] text-zinc-400">{dur.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Subtitle / Caption Style */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5 text-red-500" />
            Animated Caption Style
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              {
                id: "red-glow" as CaptionStyleType,
                name: "Red Glow Karaoke",
                preview: "THIS IS FIRE 🔥",
                styleClass: "bg-red-600 text-white font-black px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(239,68,68,0.8)]",
              },
              {
                id: "hormozi" as CaptionStyleType,
                name: "Hormozi Punch",
                preview: "VIRAL HOOK",
                styleClass: "bg-yellow-400 text-black font-black px-1.5 py-0.5 rounded",
              },
              {
                id: "bold-strike" as CaptionStyleType,
                name: "Obsidian Stroke",
                preview: "BIG REVEAL",
                styleClass: "text-white font-extrabold border border-red-500 px-1.5 py-0.5 rounded bg-black/80",
              },
              {
                id: "minimal" as CaptionStyleType,
                name: "Clean Minimal",
                preview: "Essential Take",
                styleClass: "text-zinc-200 font-medium bg-zinc-800/80 px-1.5 py-0.5 rounded",
              },
            ].map((cap) => {
              const active = settings.captionStyle === cap.id;
              return (
                <button
                  key={cap.id}
                  type="button"
                  onClick={() => updateSetting("captionStyle", cap.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-between gap-1.5 transition-all ${
                    active
                      ? "border-red-500 bg-red-950/25 text-white ring-1 ring-red-500 shadow-md shadow-red-950/30"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <span className={`text-[11px] font-semibold ${active ? "text-red-400" : "text-zinc-300"}`}>
                    {cap.name}
                  </span>
                  <div className="my-1">
                    <span className={`text-[10px] uppercase tracking-wider ${cap.styleClass}`}>
                      {cap.preview}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. AI Topic / Focus Prompt */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-red-500" />
              AI Prompt / Highlight Focus (Optional)
            </span>
            <span className="text-[11px] text-zinc-400 font-normal">Guide the AI</span>
          </label>

          <input
            type="text"
            value={settings.prompt}
            onChange={(e) => updateSetting("prompt", e.target.value)}
            placeholder="e.g. Find high-energy moments, shocking revelations, or punchlines..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
          />

          {/* Quick preset chips */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PROMPT_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => updateSetting("prompt", preset)}
                className="rounded-lg bg-zinc-900 border border-zinc-800/80 px-2 py-1 text-[10px] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Smart AI Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 cursor-pointer hover:border-zinc-700 transition-all">
            <input
              type="checkbox"
              checked={settings.autoFaceTracking}
              onChange={(e) => updateSetting("autoFaceTracking", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-red-600 accent-red-600 focus:ring-0"
            />
            <div>
              <span className="block text-xs font-semibold text-white">
                Auto Face-Tracking Reframe
              </span>
              <span className="text-[11px] text-zinc-400">
                Keeps speakers centered in 9:16 vertical crop
              </span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 cursor-pointer hover:border-zinc-700 transition-all">
            <input
              type="checkbox"
              checked={settings.removeFillerWords}
              onChange={(e) => updateSetting("removeFillerWords", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-red-600 accent-red-600 focus:ring-0"
            />
            <div>
              <span className="block text-xs font-semibold text-white">
                Remove Filler Words & Pauses
              </span>
              <span className="text-[11px] text-zinc-400">
                Cuts &quot;um&quot;, &quot;uh&quot; and silent dead-air automatically
              </span>
            </div>
          </label>
        </div>

        {/* Big Generate Call-to-Action Button */}
        <div className="pt-2">
          <Button
            type="button"
            onClick={onGenerate}
            disabled={!hasMedia || isGenerating}
            className={`w-full h-12 text-sm sm:text-base font-bold tracking-wide rounded-xl uppercase transition-all duration-300 relative overflow-hidden group ${
              hasMedia
                ? "bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:shadow-[0_0_40px_rgba(239,68,68,0.8)] scale-[1.00] hover:scale-[1.01]"
                : "bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700"
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Processing Long-Form Video with AI...</span>
              </span>
            ) : hasMedia ? (
              <span className="flex items-center justify-center gap-2">
                <Flame className="h-5 w-5 fill-white animate-pulse" />
                <span>Generate 5 Viral Clips</span>
                <Sparkles className="h-4 w-4 text-red-200" />
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Upload a Video or Image to Generate Clips</span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
