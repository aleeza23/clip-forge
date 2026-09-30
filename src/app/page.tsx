"use client";

import React, { useState } from "react";
import { Flame, Sparkles, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { MediaUploader } from "@/components/media-uploader";
import { VideoPreviewModal } from "@/components/video-preview-modal";
import { MediaFile, GeneratedClip } from "@/types/clips";
import { useRouter } from "next/navigation";

export default function Home() {
  const [media, setMedia] = useState<MediaFile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusMessage, setUploadStatusMessage] = useState<string | null>(
    null,
  );
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(
    null,
  );
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [generatedClips, setGeneratedClips] = useState<GeneratedClip[]>([]);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const router = useRouter();
  const [isStartingAnalysis, setIsStartingAnalysis] = useState(false);

  const handleUploadConfirm = async () => {
    if (!media) return;
    setIsUploading(true);
    setUploadErrorMessage(null);
    setUploadStatusMessage("Uploading video to Cloudinary...");

    try {
      const formData = new FormData();
      if (media.rawFile) {
        formData.append("file", media.rawFile);
      } else {
        const blob = await (await fetch(media.url)).blob();
        formData.append(
          "file",
          new File([blob], media.name, { type: media.mimeType }),
        );
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "Upload failed");

      setActiveJobId(data.jobId);
      setUploadSuccess(true); // modal now shows "Start AI Analysis"
    } catch (err: any) {
      setUploadErrorMessage(
        err.message || "Upload failed. Check Cloudinary credentials.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartAnalysis = async () => {
    if (!activeJobId) return;
    setIsStartingAnalysis(true);
    setUploadErrorMessage(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: activeJobId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start analysis");

      router.push(`/analysis/${activeJobId}`);
    } catch (err: any) {
      setUploadErrorMessage(err.message);
      setIsStartingAnalysis(false);
    }
  };
  // When user drops or selects a video, immediately open the preview popup
  const handleMediaLoaded = (newMedia: MediaFile) => {
    setMedia(newMedia);
    setUploadSuccess(false);
    setIsUploading(false);
    setUploadStatusMessage(null);
    setUploadErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isUploading) {
      setIsModalOpen(false);
    }
  };

  const handleReplaceFile = () => {
    if (!isUploading) {
      setIsModalOpen(false);
      setMedia(null);
      setUploadSuccess(false);
      setUploadErrorMessage(null);
    }
  };

  const handleReset = () => {
    setGeneratedClips([]);
    setMedia(null);
    setIsModalOpen(false);
    setActiveJobId(null);
    setUploadSuccess(false);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white relative">
      {/* Background Red Glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-red-600/10 blur-[130px]" />
        <div className="absolute bottom-10 right-10 h-[300px] w-[400px] rounded-full bg-red-950/20 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
        <div className="w-full flex flex-col items-center">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3.5 py-1 text-xs font-medium text-red-400">
              <Flame className="h-3.5 w-3.5 fill-red-500 text-red-500" />
              <span>Cloudinary & Inngest AI Workflow</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Upload Long-Form Video to{" "}
              <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
                Generate AI Clips
              </span>
            </h1>

          </div>

          {/* Clean Media Uploader Zone */}
          <div className="w-full max-w-2xl">
            <MediaUploader onMediaLoaded={handleMediaLoaded} />
          </div>

          {/* Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-red-500" />
              <span>Cloudinary</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-red-500" />
              <span>Inngest Workflow Processing</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-red-500" />
              <span>Dynamic Captions on Clips</span>
            </span>
          </div>
        </div>
      </main>

      {/* Video Preview Popup Modal */}
      <VideoPreviewModal
        isOpen={isModalOpen}
        media={media}
        onClose={handleCloseModal}
        onUploadConfirm={handleUploadConfirm}
        onReplaceFile={handleReplaceFile}
        isUploading={isUploading}
        uploadStatusMessage={uploadStatusMessage}
        uploadErrorMessage={uploadErrorMessage}
        onStartAnalysis={handleStartAnalysis}
        isStartingAnalysis={isStartingAnalysis}
        uploadSuccess={uploadSuccess}
      />

      {/* Clean Footer */}
      <footer className="relative z-10 border-t border-zinc-900 bg-black/60 py-5 text-center text-xs text-zinc-400">
        <div className="mx-auto max-w-5xl px-4 flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="font-semibold text-zinc-300">CLIPFORGE AI</span>
          <span>&bull;</span>
          <span>Cloudinary + Inngest Integration</span>
        </div>
      </footer>
    </div>
  );
}
