"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, Video, AlertCircle, X, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/formatters";
import { MediaFile } from "@/types/clips";

interface MediaUploaderProps {
  onMediaLoaded: (media: MediaFile) => void;
}

export function MediaUploader({ onMediaLoaded }: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMessage(null);

    const isVideo =
      file.type.startsWith("video/") || /\.(mp4|mov|webm|mkv|m4v)$/i.test(file.name);
    const isImage =
      file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);

    if (!isVideo && !isImage) {
      setErrorMessage("Please upload a valid video file (MP4, MOV, WebM) or image.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    if (isVideo) {
      const tempVideo = document.createElement("video");
      tempVideo.src = objectUrl;
      tempVideo.preload = "metadata";

      tempVideo.onloadedmetadata = () => {
        const mediaFile: MediaFile = {
          id: `media-${Date.now()}`,
          name: file.name,
          size: file.size,
          sizeFormatted: formatBytes(file.size),
          type: "video",
          mimeType: file.type || "video/mp4",
          url: objectUrl,
          duration: tempVideo.duration || 60,
          dimensions: {
            width: tempVideo.videoWidth || 1920,
            height: tempVideo.videoHeight || 1080,
          },
          uploadedAt: new Date(),
          rawFile: file,
        };
        onMediaLoaded(mediaFile);
      };

      tempVideo.onerror = () => {
        const fallbackMedia: MediaFile = {
          id: `media-${Date.now()}`,
          name: file.name,
          size: file.size,
          sizeFormatted: formatBytes(file.size),
          type: "video",
          mimeType: file.type || "video/mp4",
          url: objectUrl,
          duration: 120,
          dimensions: { width: 1920, height: 1080 },
          uploadedAt: new Date(),
          rawFile: file,
        };
        onMediaLoaded(fallbackMedia);
      };
    } else {
      const img = new Image();
      img.src = objectUrl;
      img.onload = () => {
        const mediaFile: MediaFile = {
          id: `media-${Date.now()}`,
          name: file.name,
          size: file.size,
          sizeFormatted: formatBytes(file.size),
          type: "image",
          mimeType: file.type || "image/jpeg",
          url: objectUrl,
          dimensions: {
            width: img.naturalWidth || 1280,
            height: img.naturalHeight || 720,
          },
          uploadedAt: new Date(),
          rawFile: file,
        };
        onMediaLoaded(mediaFile);
      };
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-xs sm:text-sm text-red-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Clean Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-red-500 bg-red-950/20 scale-[0.99] shadow-[0_0_40px_rgba(239,68,68,0.3)]"
            : "border-zinc-800 bg-zinc-950/80 hover:border-red-500/70 hover:bg-zinc-900/50 shadow-2xl"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,image/*"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {/* Red Glow Hub */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full bg-red-600/20 blur-xl group-hover:bg-red-600/30 transition-all" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/40 bg-zinc-900 text-red-500 shadow-xl group-hover:scale-105 group-hover:border-red-500 group-hover:bg-red-950/50 transition-all">
            <Upload className="h-7 w-7 transition-transform group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Text */}
        <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
          Drop your video here
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-sm">
          Drag and drop your long-form video or click to browse
        </p>

        {/* Action Button */}
        <div className="mt-5">
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-950/50 px-6 py-2.5 text-xs sm:text-sm rounded-xl transition-all"
          >
            Browse Video File
          </Button>
        </div>

        {/* Clean Formats Bar */}
        <div className="mt-6 flex items-center justify-center gap-2 pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-400">
          <span className="flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-1 border border-zinc-800">
            <Film className="h-3 w-3 text-red-400" /> MP4, MOV, WebM
          </span>
          <span className="rounded-md bg-zinc-900 px-2 py-1 border border-zinc-800">
            Max 4GB
          </span>
        </div>
      </div>
    </div>
  );
}
