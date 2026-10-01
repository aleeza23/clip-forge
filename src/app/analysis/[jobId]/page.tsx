"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Circle, Loader2, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
const ClipPlayer = dynamic(() => import("@/components/clip-player"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[9/16] rounded-2xl bg-zinc-900 animate-pulse" />
  ),
});
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

// Order matters: a step is "done" once the job status has moved past it.
const STEPS = [
  {
    status: "transcribing",
    label: "Transcribing audio",
    hint: "Deepgram is converting speech to text",
  },
  {
    status: "captioning",
    label: "Generating captions",
    hint: "Building timed caption lines",
  },
  {
    status: "analyzing",
    label: "Finding the best moments",
    hint: "Looking for high-retention segments",
  },
  {
    status: "processing",
    label: "Creating vertical clips",
    hint: "Cropping to 9:16 and adding captions",
  },
] as const;

const POLL_MS = 1500;

export default function AnalysisPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;
    let stopped = false;

    const poll = async () => {
      try {
        const res = await fetch(`/api/clips?id=${jobId}`);
        if (res.status === 404) {
          setLoadError("This job no longer exists. Upload the video again.");
          return;
        }
        if (res.ok) {
          const data = await res.json();
          if (stopped) return;
          setJob(data);
          if (data.status === "completed" || data.status === "failed") return;
        }
      } catch {
        // transient network error, try again on the next tick
      }
      if (!stopped) setTimeout(poll, POLL_MS);
    };

    poll();
    return () => {
      stopped = true;
    };
  }, [jobId]);

  const isCompleted = job?.status === "completed" && job.clips?.length > 0;
  const isFailed = job?.status === "failed" || !!loadError;
  const activeIndex = STEPS.findIndex((s) => s.status === job?.status);

  console.log(job, "jobs");

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="mx-auto max-w-xl space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Creating your clips
            </h1>
            <p className="text-sm text-zinc-400 truncate">
              {job?.fileName ?? "Loading video details..."}
            </p>
          </div>

          {/* Overall progress */}
          <div className="space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-900">
              <div
                className="h-full rounded-full bg-red-600 transition-all duration-500"
                style={{ width: `${job?.progress ?? 0}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <ol className="rounded-2xl border border-zinc-800 bg-zinc-950 divide-y divide-zinc-900">
            {STEPS.map((step, i) => {
              const isJobCompleted = job?.status === "completed";

              const done =
                isJobCompleted || (activeIndex !== -1 && activeIndex > i);

              const active = !isJobCompleted && activeIndex === i && !isFailed;

              return (
                <li key={step.status} className="flex items-center gap-3 p-4">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  ) : active ? (
                    <Loader2 className="h-5 w-5 shrink-0 animate-spin text-red-500" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-zinc-700" />
                  )}

                  <div className="min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        done || active ? "text-white" : "text-zinc-500"
                      }`}
                    >
                      {step.label}
                    </p>

                    {active && (
                      <p className="text-xs text-zinc-400">{step.hint}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Transcript preview appears as soon as transcription finishes */}
          {job?.transcript && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-medium text-zinc-200">
                  Transcript ready
                </span>
                <span>{job.captions?.length ?? 0} caption lines</span>
              </div>
              <p className="text-sm text-zinc-300 line-clamp-4">
                {job.transcript}
              </p>
            </div>
          )}

          {isFailed && (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/50 bg-red-950/40 p-4 text-sm text-red-300">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="space-y-3">
                <p>
                  {loadError ??
                    job?.error ??
                    "Something went wrong while analyzing the video."}
                </p>
                <Button variant="outline" onClick={() => router.push("/")}>
                  Back to upload
                </Button>
              </div>
            </div>
          )}
        </div>
        {isCompleted && (
          <section className="mt-12 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Your clips ({job.clips.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {job.clips.map((clip: any) => (
                <div
                  key={clip.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-3"
                >
                  <ClipPlayer clip={clip} videoUrl={job.originalVideoUrl} />
                  <h3 className="text-sm font-semibold text-white">
                    {clip.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>{clip.duration}</span>
                    <span>Score {clip.viralScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
