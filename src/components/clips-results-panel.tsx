"use client";

import React, { useState } from "react";
import {
  Flame,
  Download,
  Share2,
  Play,
  Pause,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Scissors,
  Eye,
  Sliders,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneratedClip } from "@/types/clips";

interface ClipsResultsPanelProps {
  isGenerating: boolean;
  clips: GeneratedClip[];
  onClose?: () => void;
  videoUrl?: string;
}

export function ClipsResultsPanel({
  isGenerating,
  clips,
  onClose,
  videoUrl,
}: ClipsResultsPanelProps) {
  const [selectedPreviewClip, setSelectedPreviewClip] = useState<GeneratedClip | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (clipId: string) => {
    setDownloadSuccess(clipId);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 2500);
  };

  return (
    <div className="w-full space-y-6">
      {/* Generation Steps Animation while Generating */}
      {isGenerating && (
        <div className="rounded-2xl border border-red-500/40 bg-zinc-950/90 p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-red-600/20 blur-3xl animate-pulse" />

          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.7)]">
              <Sparkles className="h-5 w-5 text-white animate-spin" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                AI Engine Generating 5 Viral Clips...
              </h3>
              <p className="text-xs text-zinc-400">
                Analyzing long-form video timeline for peak retention and punchy hooks
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                step: "1. Speech Diarization",
                desc: "Transcribed 100% audio words",
                status: "done",
              },
              {
                step: "2. Viral Hook AI",
                desc: "Detected 5 retention spikes",
                status: "done",
              },
              {
                step: "3. 9:16 Face Reframe",
                desc: "Centering active speakers",
                status: "active",
              },
              {
                step: "4. Animated Captions",
                desc: "Rendering Karaoke Red text",
                status: "pending",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  item.status === "done"
                    ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300"
                    : item.status === "active"
                    ? "border-red-500 bg-red-950/30 text-red-200 shadow-md shadow-red-950/50"
                    : "border-zinc-800 bg-zinc-900/40 text-zinc-400"
                }`}
              >
                <div className="flex items-center justify-between font-semibold mb-1">
                  <span>{item.step}</span>
                  {item.status === "done" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  {item.status === "active" && (
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  )}
                </div>
                <p className="text-[11px] text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Clips Grid */}
      {clips.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white shadow-md shadow-red-900/40">
                <Flame className="h-4 w-4 fill-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Generated Viral Clips ({clips.length})
              </h3>
              <span className="rounded-full bg-red-950 px-2 py-0.5 text-xs font-semibold text-red-400 border border-red-900/50">
                Ready for TikTok & Reels
              </span>
            </div>

            <div className="text-xs text-zinc-400">
              Sorted by highest predicted engagement score
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clips.map((clip) => (
              <div
                key={clip.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-4 transition-all hover:border-red-500/60 hover:shadow-2xl hover:shadow-red-950/20"
              >
                {/* Glow accent */}
                <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-red-600/10 blur-xl group-hover:bg-red-600/20 transition-all" />

                <div>
                  {/* Top Bar: Viral Score Badge & Duration */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-950/50 px-2.5 py-1 text-xs font-bold text-red-400 shadow-inner">
                      <Flame className="h-3.5 w-3.5 fill-red-500 text-red-500 animate-pulse" />
                      <span>{clip.viralScore}/100 Viral Score</span>
                    </div>

                    <span className="rounded bg-zinc-900 px-2 py-0.5 font-mono text-xs text-zinc-300 border border-zinc-800">
                      {clip.duration}
                    </span>
                  </div>

                  {/* Thumbnail / 9:16 Mock Preview Container */}
                  <div
                    onClick={() => setSelectedPreviewClip(clip)}
                    className="relative aspect-[9/12] w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/80 cursor-pointer group/thumb mb-3 flex items-center justify-center"
                  >
                    {/* Background image / gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900 to-zinc-950" />

                    {/* Subtle video icon & play trigger */}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 text-white shadow-[0_0_20px_rgba(239,68,68,0.7)] group-hover/thumb:scale-110 group-hover/thumb:bg-red-500 transition-all">
                        <Play className="h-5 w-5 fill-white translate-x-0.5" />
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-300 group-hover/thumb:text-white">
                        Click to Preview Vertical Clip
                      </span>
                    </div>

                    {/* Animated Sample Subtitle Overlay on Thumbnail */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 text-center">
                      <div className="inline-block rounded-lg bg-black/85 px-2.5 py-1.5 border border-red-500/40 backdrop-blur-sm">
                        <p className="text-[10px] font-extrabold uppercase text-white tracking-wide">
                          &quot;{clip.transcriptSample}&quot;
                        </p>
                      </div>
                    </div>

                    {/* Format Badge */}
                    <span className="absolute top-2 left-2 z-10 rounded bg-red-600/90 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
                      9:16 HD
                    </span>

                    <span className="absolute top-2 right-2 z-10 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-mono text-zinc-300">
                      Est. {clip.viewsEstimate}
                    </span>
                  </div>

                  {/* Clip Title */}
                  <h4 className="text-sm font-semibold text-white group-hover:text-red-300 transition-colors line-clamp-2 mb-2">
                    {clip.title}
                  </h4>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {clip.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-zinc-900 px-1.5 py-0.5 text-[10px] text-zinc-400 border border-zinc-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-zinc-900">
                  <Button
                    size="sm"
                    onClick={() => handleDownload(clip.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-xl shadow-md shadow-red-950/40 gap-1.5 h-8"
                  >
                    {downloadSuccess === clip.id ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                        <span>Downloaded!</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-3.5 w-3.5" />
                        <span>Export 1080p</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPreviewClip(clip)}
                    className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs rounded-xl h-8 px-2.5"
                    title="Preview Full 9:16 Video"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full 9:16 Vertical Video Preview Modal */}
      {selectedPreviewClip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative flex flex-col md:flex-row w-full max-w-3xl rounded-2xl border border-red-500/40 bg-zinc-950 shadow-[0_0_50px_rgba(239,68,68,0.3)] overflow-hidden max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPreviewClip(null)}
              className="absolute top-3 right-3 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-400 hover:bg-red-600 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Left: 9:16 Vertical Phone Mockup Player */}
            <div className="relative flex-1 bg-black flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-zinc-800">
              <div className="relative aspect-[9/16] h-[480px] max-h-[70vh] rounded-3xl border-4 border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col justify-between p-4">
                {/* Embedded Video Clip (using source video if available) */}
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    autoPlay
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-red-950/60 via-zinc-950 to-black" />
                )}

                {/* Dark mobile gradient overlays */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />

                {/* Top Phone Info */}
                <div className="relative z-10 flex items-center justify-between text-[11px] text-white">
                  <span className="rounded-full bg-red-600 px-2 py-0.5 font-bold shadow-md">
                    🔥 {selectedPreviewClip.viralScore}% VIRAL
                  </span>
                  <span className="font-mono bg-black/60 px-1.5 py-0.5 rounded text-zinc-300">
                    {selectedPreviewClip.duration}
                  </span>
                </div>

                {/* Center Dynamic Subtitle Burn-In */}
                <div className="relative z-10 my-auto text-center px-2">
                  <div className="inline-block rounded-xl bg-black/85 px-3 py-2 border border-red-500/50 shadow-xl backdrop-blur-md">
                    <p className="text-xs sm:text-sm font-black uppercase text-white tracking-wide">
                      <span className="text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,1)]">
                        &quot;{selectedPreviewClip.transcriptSample}&quot;
                      </span>
                    </p>
                  </div>
                </div>

                {/* Bottom Sound / Title */}
                <div className="relative z-10 space-y-1">
                  <p className="text-xs font-semibold text-white drop-shadow-md line-clamp-1">
                    {selectedPreviewClip.title}
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    ♫ Original Audio • AI Enhanced 48kHz
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Clip Details & Export Actions */}
            <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-md bg-red-950 px-2 py-0.5 text-xs font-bold text-red-400 border border-red-800/40">
                    High Retention Clip
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    Duration: {selectedPreviewClip.duration}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {selectedPreviewClip.title}
                </h3>

                <p className="text-xs text-zinc-400 mb-4">
                  Extracted from long-form video timeline at {selectedPreviewClip.startTime}s -{" "}
                  {selectedPreviewClip.endTime}s. Auto-centered on the speaker with intelligent face
                  tracking and Karaoke Red dynamic captions.
                </p>

                <div className="space-y-2 rounded-xl bg-zinc-900/60 p-3 border border-zinc-800 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Algorithm Viral Score:</span>
                    <span className="text-red-400 font-bold">
                      {selectedPreviewClip.viralScore} / 100
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Estimated Impressions:</span>
                    <span className="text-zinc-200 font-mono">
                      {selectedPreviewClip.viewsEstimate}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Aspect Ratio:</span>
                    <span className="text-zinc-200">9:16 Vertical (1080x1920)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                <Button
                  onClick={() => handleDownload(selectedPreviewClip.id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-lg shadow-red-950/40 gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Clip (1080p MP4)</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setSelectedPreviewClip(null)}
                  className="w-full border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs sm:text-sm py-2 rounded-xl"
                >
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
