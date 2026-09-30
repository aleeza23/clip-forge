"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Flame,
  Crop,
  Layers,
  FileVideo,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Gauge,
  Sliders,
  Type,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaFile, ViralHook, AspectRatioType } from "@/types/clips";
import { formatTime } from "@/lib/formatters";

interface VideoPreviewPlayerProps {
  media: MediaFile;
  onRemoveMedia: () => void;
  onReplaceMedia: () => void;
  activeAspectRatio: AspectRatioType;
  onChangeAspectRatio: (ratio: AspectRatioType) => void;
  selectedHookTime?: number | null;
  onSelectHook?: (hook: ViralHook) => void;
}

export function VideoPreviewPlayer({
  media,
  onRemoveMedia,
  onReplaceMedia,
  activeAspectRatio,
  onChangeAspectRatio,
  selectedHookTime,
  onSelectHook,
}: VideoPreviewPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(media.duration || 60);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCaptionsPreview, setShowCaptionsPreview] = useState(true);
  const [hoveredHook, setHoveredHook] = useState<ViralHook | null>(null);

  // Pre-calculated viral hooks for preview simulation
  const viralHooks: ViralHook[] = React.useMemo(() => {
    const total = duration || 60;
    return [
      {
        id: "hook-1",
        startTime: Math.round(total * 0.12),
        endTime: Math.round(total * 0.12) + 28,
        title: "The Controversial Opening Hook",
        score: 98,
        reason: "High speech tempo + strong emotional trigger",
        tag: "🔥 Ultra High Hook",
      },
      {
        id: "hook-2",
        startTime: Math.round(total * 0.42),
        endTime: Math.round(total * 0.42) + 35,
        title: "The Key Breakdown & Framework",
        score: 94,
        reason: "Clear actionable insight with visual emphasis",
        tag: "💡 Key Insight",
      },
      {
        id: "hook-3",
        startTime: Math.round(total * 0.76),
        endTime: Math.round(total * 0.76) + 40,
        title: "Unexpected Punchline & Takeaway",
        score: 91,
        reason: "Audience laughter peak & conversational climax",
        tag: "⚡ Peak Retention",
      },
    ];
  }, [duration]);

  // Jump to selected hook if triggered
  useEffect(() => {
    if (selectedHookTime !== null && selectedHookTime !== undefined && videoRef.current) {
      videoRef.current.currentTime = selectedHookTime;
      setCurrentTime(selectedHookTime);
      if (!isPlaying) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  }, [selectedHookTime]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || media.duration || 60);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    videoRef.current.muted = newMuted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const newRate = rates[nextIdx];
    setPlaybackRate(newRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const jumpToHook = (hook: ViralHook) => {
    if (videoRef.current) {
      videoRef.current.currentTime = hook.startTime;
      setCurrentTime(hook.startTime);
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    if (onSelectHook) onSelectHook(hook);
  };

  const isVideo = media.type === "video";

  return (
    <div className="w-full space-y-4">
      {/* Top Media Info Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-950/40 border border-red-800/40 text-red-500 shadow-inner">
            {isVideo ? <FileVideo className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-white" title={media.name}>
                {media.name}
              </h3>
              <span className="shrink-0 rounded bg-red-950/60 px-1.5 py-0.5 text-[10px] font-mono text-red-400 border border-red-900/50">
                {isVideo ? "VIDEO STREAM" : "COVER IMAGE"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span>{media.sizeFormatted}</span>
              <span>&bull;</span>
              <span>
                {media.dimensions
                  ? `${media.dimensions.width}x${media.dimensions.height}`
                  : "1920x1080"}
              </span>
              {isVideo && (
                <>
                  <span>&bull;</span>
                  <span className="font-mono text-zinc-300">{formatTime(duration)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Media Top Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReplaceMedia}
            className="border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs h-8 gap-1.5"
          >
            <RefreshCw className="h-3 w-3" />
            <span className="hidden sm:inline">Replace File</span>
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={onRemoveMedia}
            className="border-red-900/40 bg-red-950/30 text-red-400 hover:bg-red-950/60 hover:text-red-200 text-xs h-8 gap-1.5"
          >
            <Trash2 className="h-3 w-3" />
            <span className="hidden sm:inline">Remove</span>
          </Button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div
        ref={containerRef}
        className="group relative w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-black shadow-2xl shadow-red-950/10"
      >
        {/* Glow corner accent */}
        <div className="pointer-events-none absolute -top-12 -left-12 h-36 w-36 rounded-full bg-red-600/10 blur-2xl" />

        {isVideo ? (
          /* VIDEO PREVIEW MODE */
          <div className="relative aspect-video w-full bg-zinc-950 flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              src={media.url}
              className="h-full w-full object-contain cursor-pointer"
              onClick={togglePlay}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              playsInline
            />

            {/* 9:16 Vertical Aspect Ratio Crop Overlay Guide */}
            {activeAspectRatio === "9:16" && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                {/* Darkened side masks to emphasize the 9:16 mobile frame */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

                {/* 9:16 Central Frame Window */}
                <div className="relative h-full aspect-[9/16] border-2 border-dashed border-red-500/90 shadow-[0_0_35px_rgba(239,68,68,0.4)] flex flex-col justify-between p-4 bg-transparent z-10">
                  {/* Top Badge */}
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="rounded bg-red-600 px-2 py-0.5 font-bold text-white shadow-sm flex items-center gap-1">
                      <Crop className="h-3 w-3" /> 9:16 Shorts/Reels Frame
                    </span>
                    <span className="rounded bg-black/80 px-2 py-0.5 text-zinc-300 border border-zinc-700">
                      Auto Face Tracking
                    </span>
                  </div>

                  {/* Simulated Dynamic Subtitles */}
                  {showCaptionsPreview && (
                    <div className="mx-auto my-auto max-w-[85%] text-center">
                      <div className="inline-block rounded-xl bg-black/85 px-3 py-2 border border-red-500/40 shadow-xl backdrop-blur-sm">
                        <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wide leading-tight">
                          <span className="text-white">THIS IS THE </span>
                          <span className="text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                            #1 SECRET{" "}
                          </span>
                          <span className="text-white">TO GOING VIRAL! 🔥</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bottom Guide indicator */}
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="bg-black/60 px-1.5 py-0.5 rounded">Safe Zone</span>
                    <span className="bg-black/60 px-1.5 py-0.5 rounded">1080x1920</span>
                  </div>
                </div>
              </div>
            )}

            {/* 1:1 Square Frame Overlay */}
            {activeAspectRatio === "1:1" && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative h-full aspect-square border-2 border-dashed border-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.3)] flex flex-col justify-between p-4 z-10">
                  <span className="self-start rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    1:1 Square Post
                  </span>
                  {showCaptionsPreview && (
                    <div className="text-center">
                      <span className="rounded-lg bg-black/80 px-3 py-1.5 text-xs font-bold text-red-400 border border-red-500/30">
                        Caption Preview Active
                      </span>
                    </div>
                  )}
                  <span className="self-end text-[10px] text-zinc-400 bg-black/60 px-1.5 py-0.5 rounded">
                    1080x1080
                  </span>
                </div>
              </div>
            )}

            {/* Big Center Play Button when paused */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute flex h-16 w-16 items-center justify-center rounded-full bg-red-600/90 text-white shadow-[0_0_25px_rgba(239,68,68,0.6)] backdrop-blur-md transition-all hover:scale-110 hover:bg-red-500 z-20"
                aria-label="Play Video"
              >
                <Play className="h-7 w-7 translate-x-0.5 fill-white" />
              </button>
            )}

            {/* Custom Video Control Overlay Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/80 to-transparent p-3 sm:p-4 pt-8 transition-opacity duration-200">
              {/* Scrubber Timeline with Viral Hook Markers */}
              <div className="relative mb-2.5 flex items-center group/scrubber">
                {/* Viral Hook Hotspot Markers on Timeline */}
                {viralHooks.map((hook) => {
                  const percent = (hook.startTime / (duration || 1)) * 100;
                  return (
                    <button
                      key={hook.id}
                      onClick={() => jumpToHook(hook)}
                      onMouseEnter={() => setHoveredHook(hook)}
                      onMouseLeave={() => setHoveredHook(null)}
                      style={{ left: `${percent}%` }}
                      className="absolute -top-1.5 -translate-x-1/2 z-20 h-4 w-4 rounded-full bg-red-600 border-2 border-white shadow-[0_0_10px_rgba(239,68,68,1)] flex items-center justify-center hover:scale-150 transition-transform cursor-pointer"
                      title={`${hook.title} (${hook.score}% Viral)`}
                    >
                      <Flame className="h-2 w-2 text-white" />
                    </button>
                  );
                })}

                {/* Hover Tooltip for Hook */}
                {hoveredHook && (
                  <div
                    style={{
                      left: `${(hoveredHook.startTime / (duration || 1)) * 100}%`,
                    }}
                    className="pointer-events-none absolute -top-12 -translate-x-1/2 z-30 flex flex-col items-center whitespace-nowrap rounded-lg border border-red-500/50 bg-black/95 px-2.5 py-1 text-xs text-white shadow-xl backdrop-blur-md"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-red-400">
                      <Flame className="h-3 w-3 fill-red-500" />
                      <span>{hoveredHook.score}% Viral Potential</span>
                    </div>
                    <span className="text-[10px] text-zinc-300">{hoveredHook.title}</span>
                  </div>
                )}

                {/* Custom Range Slider Track */}
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-zinc-700/80 accent-red-600 transition-all focus:outline-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                />
              </div>

              {/* Lower Controls Strip */}
              <div className="flex items-center justify-between text-xs text-white">
                {/* Left Controls: Play, Time */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900/80 text-white hover:bg-red-600 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 fill-white" />
                    ) : (
                      <Play className="h-4 w-4 fill-white" />
                    )}
                  </button>

                  <div className="flex items-center gap-1 font-mono text-xs text-zinc-300">
                    <span className="font-semibold text-white">{formatTime(currentTime)}</span>
                    <span className="text-zinc-500">/</span>
                    <span>{formatTime(duration)}</span>
                  </div>

                  {/* Volume Slider */}
                  <div className="hidden sm:flex items-center gap-1.5 ml-2">
                    <button
                      onClick={toggleMute}
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="h-4 w-4 text-red-400" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="h-1 w-16 cursor-pointer appearance-none rounded bg-zinc-700 accent-red-500"
                    />
                  </div>
                </div>

                {/* Right Controls: Framing toggle, Captions, Speed, Fullscreen */}
                <div className="flex items-center gap-2">
                  {/* Captions Preview Toggle */}
                  <button
                    onClick={() => setShowCaptionsPreview(!showCaptionsPreview)}
                    className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-all ${
                      showCaptionsPreview
                        ? "bg-red-950/80 text-red-400 border border-red-800/60"
                        : "bg-zinc-900/80 text-zinc-400 hover:text-white"
                    }`}
                    title="Toggle Simulated AI Captions"
                  >
                    <Type className="h-3 w-3" />
                    <span className="hidden md:inline">Captions</span>
                  </button>

                  {/* Playback speed */}
                  <button
                    onClick={cyclePlaybackRate}
                    className="rounded-lg bg-zinc-900/80 px-2 py-1 font-mono text-[11px] text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    {playbackRate}x
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-3.5 w-3.5" />
                    ) : (
                      <Maximize2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* IMAGE PREVIEW MODE */
          <div className="relative min-h-[380px] w-full bg-zinc-950 flex flex-col items-center justify-center p-6 overflow-hidden">
            <div className="relative max-h-[500px] max-w-full overflow-hidden rounded-xl border border-red-900/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={media.url}
                alt={media.name}
                className="max-h-[460px] w-auto object-contain rounded-xl"
              />

              {/* Aspect Ratio Guides for Image */}
              {activeAspectRatio === "9:16" && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-full aspect-[9/16] border-2 border-dashed border-red-500 shadow-xl flex items-start justify-between p-2">
                    <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                      9:16 Story Cover
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-full border border-red-900/40 bg-red-950/20 px-3 py-1 text-xs text-red-300">
              <ImageIcon className="h-3.5 w-3.5 text-red-400" />
              <span>Image loaded • Ready to use as clip thumbnail or visual overlay</span>
            </div>
          </div>
        )}
      </div>

      {/* Frame Mode Selector & Viral Hook Hotspots Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Frame Mode Quick Buttons */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <Crop className="h-4 w-4 text-red-500" />
            <span className="font-semibold">Reframe Preview:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {(
              [
                { id: "9:16", label: "9:16 Shorts/Reels" },
                { id: "1:1", label: "1:1 Square" },
                { id: "16:9", label: "16:9 Wide" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => onChangeAspectRatio(item.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  activeAspectRatio === item.id
                    ? "bg-red-600 text-white shadow-md shadow-red-900/40"
                    : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Detected Viral Moments Quick-Jump */}
        {isVideo && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <Flame className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
              <span className="font-semibold">AI Hooks Detected:</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {viralHooks.map((h, i) => (
                <button
                  key={h.id}
                  onClick={() => jumpToHook(h)}
                  className="flex items-center gap-1 rounded-lg bg-zinc-900 hover:bg-red-950/50 hover:border-red-600/50 border border-zinc-800 px-2 py-1 text-[11px] text-zinc-300 hover:text-red-200 transition-all"
                  title={h.title}
                >
                  <span className="text-red-500 font-bold">{h.score}%</span>
                  <span className="font-mono text-zinc-400">@{formatTime(h.startTime)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
