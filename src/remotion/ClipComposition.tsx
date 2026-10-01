// remotion/ClipComposition.tsx
import { AbsoluteFill, OffthreadVideo, useCurrentFrame, useVideoConfig } from "remotion";

export type Caption = { text: string; start: number; end: number };
export type ClipProps = {
  videoUrl: string;
  startTime: number;      // seconds in the source video
  captions: Caption[];    // already RELATIVE to clip start (clip.captions)
};

export const ClipComposition: React.FC<ClipProps> = ({ videoUrl, startTime, captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const active = captions.find((c) => c.end > c.start && t >= c.start && t < c.end);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <OffthreadVideo
        src={videoUrl}
        startFrom={Math.round(startTime * fps)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {active && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 220 }}>
          <div
            style={{
              maxWidth: "85%",
              textAlign: "center",
              fontSize: 64,
              fontWeight: 800,
              color: "white",
              fontFamily: "Arial, sans-serif",
              textShadow: "0 4px 12px rgba(0,0,0,0.9)",
              background: "rgba(0,0,0,0.45)",
              padding: "16px 28px",
              borderRadius: 20,
            }}
          >
            {active.text}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};