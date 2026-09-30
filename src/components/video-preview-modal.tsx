"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Upload,
  CheckCircle2,
  FileVideo,
  Image as ImageIcon,
  Clock,
  HardDrive,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Cloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaFile } from "@/types/clips";
import { formatTime } from "@/lib/formatters";

interface VideoPreviewModalProps {
  isOpen: boolean;
  media: MediaFile | null;
  onClose: () => void;
  onUploadConfirm: () => void;
  onReplaceFile: () => void;
  isUploading?: boolean;
  uploadStatusMessage?: string | null;
  uploadErrorMessage?: string | null;
  uploadSuccess?: boolean;
  onStartAnalysis: () => void;
  isStartingAnalysis?: boolean;
}

export function VideoPreviewModal({
  isOpen,
  media,
  onClose,
  onUploadConfirm,
  onReplaceFile,
  isUploading = false,
  uploadStatusMessage = null,
  uploadErrorMessage = null,
  uploadSuccess = false,
  onStartAnalysis,
  isStartingAnalysis,
}: VideoPreviewModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(media?.duration || 0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isOpen && media?.type === "video") {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [isOpen, media]);

  if (!isOpen || !media) return null;

  const isVideo = media.type === "video";

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
      setDuration(videoRef.current.duration || media.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const muted = !isMuted;
    setIsMuted(muted);
    videoRef.current.muted = muted;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-red-500/40 bg-zinc-950 shadow-[0_0_60px_-10px_rgba(239,68,68,0.35)] flex flex-col max-h-[92vh]">
        {/* Decorative Top Red Glow Accent */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-36 w-80 rounded-full bg-red-600/20 blur-3xl" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/50 px-5 py-4 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-950/60 border border-red-800/50 text-red-500 shadow-inner">
              {isVideo ? (
                <FileVideo className="h-5 w-5" />
              ) : (
                <ImageIcon className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3
                  className="truncate text-sm sm:text-base font-bold text-white"
                  title={media.name}
                >
                  {media.name}
                </h3>
                <span className="shrink-0 rounded bg-red-950/80 border border-red-900/60 px-2 py-0.5 text-[10px] font-mono font-semibold text-red-400">
                  {isVideo ? "VIDEO PREVIEW" : "IMAGE PREVIEW"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <HardDrive className="h-3 w-3 text-zinc-400" />
                  {media.sizeFormatted}
                </span>
                {isVideo && (
                  <>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3 text-zinc-400" />
                      {formatTime(duration)}
                    </span>
                  </>
                )}
                {media.dimensions && (
                  <>
                    <span>&bull;</span>
                    <span>
                      {media.dimensions.width}x{media.dimensions.height}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isUploading}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 hover:bg-red-950/80 hover:text-white hover:border hover:border-red-500/50 transition-all shrink-0 ml-3 disabled:opacity-50"
            aria-label="Close Preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body: Video/Image Display */}
        <div className="relative flex-1 bg-black p-4 sm:p-5 flex flex-col items-center justify-center overflow-y-auto">
          {isVideo ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950 shadow-2xl group">
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

              {/* Big Center Play Button when paused */}
              {!isPlaying && !isUploading && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600/90 text-white shadow-[0_0_30px_rgba(239,68,68,0.7)] backdrop-blur-md transition-all hover:scale-110 hover:bg-red-500"
                  aria-label="Play video"
                >
                  <Play className="h-7 w-7 translate-x-0.5 fill-white" />
                </button>
              )}

              {/* Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-6 transition-opacity">
                {/* Red Seek Scrubber */}
                <div className="relative mb-2 flex items-center">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-red-600 transition-all focus:outline-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(239,68,68,0.9)]"
                  />
                </div>

                {/* Control buttons & time display */}
                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white hover:bg-red-600 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="h-3.5 w-3.5 fill-white" />
                      ) : (
                        <Play className="h-3.5 w-3.5 fill-white" />
                      )}
                    </button>

                    <div className="font-mono text-xs text-zinc-300">
                      <span className="font-semibold text-white">
                        {formatTime(currentTime)}
                      </span>
                      <span className="text-zinc-600 mx-1">/</span>
                      <span>{formatTime(duration)}</span>
                    </div>

                    {/* Volume */}
                    <div className="hidden sm:flex items-center gap-1.5 ml-2">
                      <button
                        onClick={toggleMute}
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="h-3.5 w-3.5 text-red-400" />
                        ) : (
                          <Volume2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="h-1 w-14 cursor-pointer appearance-none rounded bg-zinc-700 accent-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Image Preview */
            <div className="relative max-h-[420px] w-full flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={media.url}
                alt={media.name}
                className="max-h-[380px] w-auto rounded-xl object-contain border border-red-900/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
              />
            </div>
          )}

          {/* Live Inngest & Cloudinary Upload Status Banner */}
          {isUploading && (
            <div className="mt-4 w-full rounded-xl border border-red-500/40 bg-zinc-900/90 p-4 shadow-xl">
              <div className="flex items-center justify-between text-xs text-white mb-2 font-medium">
                <span className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-red-500 animate-pulse" />
                  <span>{"Uploading..."}</span>
                </span>
                <span className="text-red-400 font-mono animate-pulse">
                  Processing...
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-950 border border-zinc-800">
                <div className="h-full w-2/3 bg-gradient-to-r from-red-600 via-rose-500 to-red-500 animate-pulse rounded-full shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
              </div>
            </div>
          )}

          {/* Error Message */}
          {uploadErrorMessage && (
            <div className="mt-4 w-full rounded-xl border border-red-500/50 bg-red-950/40 p-3 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{uploadErrorMessage}</span>
            </div>
          )}

          {/* Upload Success Banner */}
          {uploadSuccess && (
            <div className="mt-4 w-full rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 text-center text-xs text-emerald-300 flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold">Video uploaded</span>
            </div>
          )}
        </div>

        {/* Modal Footer: Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80 bg-zinc-900/60 px-5 py-4 backdrop-blur-sm z-10">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={onReplaceFile}
            className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs sm:text-sm h-10 px-4 rounded-xl gap-2 disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Choose Different File</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              onClick={onClose}
              className="border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs sm:text-sm h-10 px-4 rounded-xl disabled:opacity-50"
            >
              Cancel
            </Button>

            {uploadSuccess ? (
              <Button
                type="button"
                onClick={onStartAnalysis}
                disabled={isStartingAnalysis}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm h-10 px-6 rounded-xl gap-2 disabled:opacity-70"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  {isStartingAnalysis ? "Starting..." : "Start AI Analysis"}
                </span>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={onUploadConfirm}
                disabled={isUploading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm h-10 px-6 rounded-xl gap-2 disabled:opacity-70"
              >
                {isUploading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload Video</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
