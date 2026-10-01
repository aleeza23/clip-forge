// components/clip-player.tsx
"use client";
import { Player } from "@remotion/player";
import { ClipComposition } from "@/remotion/ClipComposition";

const FPS = 30;

export default function ClipPlayer({ clip, videoUrl }: { clip: any; videoUrl: string }) {
  return (
    <Player
      component={ClipComposition}
      inputProps={{ videoUrl, startTime: clip.startTime, captions: clip.captions }}
      durationInFrames={Math.round(clip.durationSeconds * FPS)}
      fps={FPS}
      compositionWidth={1080}
      compositionHeight={1920}
      controls
      style={{ width: 270, aspectRatio: "9 / 16", borderRadius: 16 }}
    />
  );
}