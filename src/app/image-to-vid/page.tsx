"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type State = "idle" | "working" | "done" | "error";

export default function page() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [state, setState] = useState<State>("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function fail(msg: string) {
    setError(msg);
    setState("error");
  }

  async function poll(id: string) {
    try {
      const res = await fetch(`/api/status?id=${id}`);
      const data = await res.json();
      if (!res.ok) return fail(data.error);
      if (data.status === "complete") {
        setVideoUrl(data.videoUrl);
        return setState("done");
      }
      if (data.status === "error" || data.status === "canceled") {
        return fail(data.error || "Generation failed");
      }
    } catch {
      // temporary network issue, keep polling
    }
    timer.current = setTimeout(() => poll(id), 5000);
  }

  async function generate() {
    if (!file || !prompt.trim()) return;
    setState("working");
    setError(null);
    setVideoUrl(null);

    const form = new FormData();
    form.append("image", file);
    form.append("prompt", prompt);

    const res = await fetch("/api/generate", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) return fail(data.error);
    poll(data.id);
  }

  const busy = state === "working";

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Photo to Video</h1>
          <p className="text-sm text-zinc-400">
            Upload your photo, describe the motion, get a short clip.
          </p>
        </div>

        <label className="block cursor-pointer rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-4 text-center text-sm text-zinc-400 hover:border-zinc-500">
          {preview ? (
            <img src={preview} alt="Your photo" className="mx-auto max-h-64 rounded-xl" />
          ) : (
            "Click to upload a photo (JPG/PNG, under 4 MB)"
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. walking slowly on a dirt path in a green field"
          rows={3}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm outline-none focus:border-zinc-600"
        />

        <button
          onClick={generate}
          disabled={!file || !prompt.trim() || busy}
          className="w-full rounded-xl bg-red-600 py-3 font-semibold transition hover:bg-red-500 disabled:opacity-40"
        >
          {busy ? "Generating... (1-3 min)" : "Generate video"}
        </button>

        {error && (
          <p className="rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {videoUrl && (
          <div className="space-y-2">
            <video src={videoUrl} controls autoPlay loop className="w-full rounded-2xl" />
            <a href={videoUrl} download className="block text-center text-sm text-zinc-400 underline">
              Download
            </a>
          </div>
        )}
      </div>
    </main>
  );
}