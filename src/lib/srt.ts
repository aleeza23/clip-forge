import { CaptionSegment } from "@/types/clips";

function formatSrtTime(seconds: number) {
  const ms = Math.round(seconds * 1000);

  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const secs = Math.floor((ms % 60_000) / 1000);
  const millis = ms % 1000;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")},${String(millis).padStart(3, "0")}`;
}

export function captionsToSrt(captions: CaptionSegment[]) {
  return captions
    .map(
      (caption, index) =>
        `${index + 1}
${formatSrtTime(caption.start)} --> ${formatSrtTime(caption.end)}
${caption.text}
`
    )
    .join("\n");
}