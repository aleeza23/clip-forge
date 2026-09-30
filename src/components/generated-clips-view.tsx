"use client";

import React, { useState } from "react";
import {
  Flame,
  Download,
  Share2,
  Play,
  Pause,
  ExternalLink,
  Check,
  CheckCircle2,
  Sparkles,
  Cloud,
  Film,
  X,
  Volume2,
  VolumeX,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneratedClip } from "@/types/clips";

interface GeneratedClipsViewProps {
  clips: GeneratedClip[];
  originalVideoUrl?: string;
  onReset: () => void;
}

export function GeneratedClipsView({
  clips,
  originalVideoUrl,
  onReset,
}: GeneratedClipsViewProps) {
  const [selectedClip, setSelectedClip] = useState<GeneratedClip | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const handleCopyUrl = (clip: GeneratedClip) => {
    navigator.clipboard.writeText(clip.cloudinaryUrl);
    setCopiedId(clip.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (clip: GeneratedClip) => {
    setDownloadedId(clip.id);
    // Trigger download of Cloudinary video URL
    const a = document.createElement("a");
    a.href = clip.cloudinaryUrl;
    a.download = `${clip.title.replace(/[^a-zA-Z0-9]/g, "_")}.mp4`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloadedId(null), 2500);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white shadow-md shadow-red-950/60">
              <Flame className="h-4 w-4 fill-white animate-pulse" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Generated AI Clips ({clips.length})
            </h2>
            <span className="rounded-full border border-red-500/40 bg-red-950/50 px-2.5 py-0.5 text-xs font-semibold text-red-400">
              Inngest Workflow Completed
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Processed via Inngest and saved to Cloudinary <code className="text-red-400 font-mono">videos/</code> folder with 9:16 re-framing and dynamic captions.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={onReset}
          className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-red-500/50 text-xs sm:text-sm h-9 px-4 rounded-xl"
        >
          Upload Another Video
        </Button>
      </div>

      {/* Grid of Generated 9:16 Clips with Captions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clips.map((clip) => (
          <div
            key={clip.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-950 p-4 transition-all hover:border-red-500/60 hover:shadow-2xl hover:shadow-red-950/30"
          >
            {/* Top Bar: Viral Score & Duration */}
            <div className="flex items-center justify-between mb-3 z-10">
              <div className="flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-950/70 px-2.5 py-1 text-xs font-bold text-red-400 shadow-inner">
                <Flame className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                <span>{clip.viralScore}% Viral Hook</span>
              </div>

              <span className="rounded-md bg-zinc-900 border border-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-300">
                {clip.duration}
              </span>
            </div>

            {/* Video Player Card (9:16 vertical preview) */}
            <div
              onClick={() => setSelectedClip(clip)}
              className="relative aspect-[9/13] w-full rounded-xl overflow-hidden bg-black border border-zinc-800 cursor-pointer group/player mb-3.5 shadow-inner flex flex-col justify-between p-3"
            >
              {/* Cloudinary Streamed Video */}
              <video
                src={clip.cloudinaryUrl}
                playsInline
                loop
                muted
                onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                onMouseLeave={(e) => {
                  const el = e.target as HTMLVideoElement;
                  el.pause();
                  el.currentTime = 0;
                }}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover/player:scale-105"
              />

              {/* Dark subtle gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60" />

              {/* Top tags on player */}
              <div className="relative z-10 flex items-center justify-between text-[10px]">
                <span className="rounded bg-red-600 px-1.5 py-0.5 font-bold text-white shadow-sm">
                  9:16 HD
                </span>
                <span className="rounded bg-black/70 px-1.5 py-0.5 font-mono text-zinc-300 border border-zinc-700">
                  Cloudinary
                </span>
              </div>

              {/* Play Hover Hint */}
              <div className="relative z-10 self-center opacity-80 group-hover/player:opacity-100 group-hover/player:scale-110 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 text-white shadow-[0_0_25px_rgba(239,68,68,0.8)] backdrop-blur-md">
                  <Play className="h-5 w-5 fill-white translate-x-0.5" />
                </div>
              </div>

              {/* Live Caption Display burned onto the bottom of the clip */}
              <div className="relative z-10 text-center">
                <div className="inline-block rounded-xl bg-black/90 px-3 py-2 border border-red-500/50 shadow-xl backdrop-blur-md">
                  <p className="text-[11px] sm:text-xs font-black uppercase text-white tracking-wide leading-tight">
                    <span className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]">
                      &quot;{clip.captionText}&quot;
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Title & Metadata */}
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-red-300 transition-colors line-clamp-2 mb-2">
                {clip.title}
              </h3>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {clip.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-2 pt-3 border-t border-zinc-900">
              <Button
                type="button"
                onClick={() => handleDownload(clip)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-9 rounded-xl shadow-md shadow-red-950/50 gap-1.5"
              >
                {downloadedId === clip.id ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    <span>Export MP4</span>
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleCopyUrl(clip)}
                className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs h-9 px-3 rounded-xl gap-1"
                title="Copy Cloudinary Video URL"
              >
                {copiedId === clip.id ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedClip(clip)}
                className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs h-9 px-3 rounded-xl"
                title="Fullscreen Preview"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen 9:16 Interactive Video Player Modal */}
      {selectedClip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative flex flex-col md:flex-row w-full max-w-3xl overflow-hidden rounded-2xl border border-red-500/50 bg-zinc-950 shadow-[0_0_60px_rgba(239,68,68,0.3)] max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedClip(null)}
              className="absolute top-3 right-3 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-400 hover:bg-red-600 hover:text-white transition-all"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Left: 9:16 Video Player with Captions */}
            <div className="relative flex-1 bg-black flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-zinc-800">
              <div className="relative aspect-[9/16] h-[480px] max-h-[70vh] rounded-2xl border-4 border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col justify-between p-4">
                <video
                  src={selectedClip.cloudinaryUrl}
                  autoPlay
                  controls
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Subtitle burn-in box on player */}
                <div className="pointer-events-none relative z-10 my-auto text-center px-2">
                  <div className="inline-block rounded-xl bg-black/90 px-3.5 py-2.5 border border-red-500/60 shadow-2xl backdrop-blur-md">
                    <p className="text-xs sm:text-sm font-black uppercase text-white tracking-wide leading-tight">
                      <span className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)]">
                        &quot;{selectedClip.captionText}&quot;
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Clip Details */}
            <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full bg-red-950/80 border border-red-900/60 px-2.5 py-0.5 text-xs font-bold text-red-400">
                    🔥 {selectedClip.viralScore}% Viral Potential
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    Duration: {selectedClip.duration}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {selectedClip.title}
                </h3>

                <p className="text-xs text-zinc-400 mb-4">
                  Trimmed from long-form video timeline at {selectedClip.startTime}s - {selectedClip.endTime}s. Re-framed to 9:16 vertical shorts with Cloudinary and burned-in dynamic captions.
                </p>

                <div className="space-y-2 rounded-xl bg-zinc-900/60 p-3.5 border border-zinc-800 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Cloudinary Folder:</span>
                    <span className="text-red-400 font-mono">videos/</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Format:</span>
                    <span className="text-zinc-200">9:16 Vertical (1080x1920)</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Estimated Views:</span>
                    <span className="text-zinc-200 font-mono">{selectedClip.viewsEstimate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  onClick={() => handleDownload(selectedClip)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm h-10 rounded-xl shadow-lg shadow-red-950/50 gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Processed Clip (MP4)</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleCopyUrl(selectedClip)}
                  className="w-full border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs sm:text-sm h-10 rounded-xl gap-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Cloudinary URL</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
