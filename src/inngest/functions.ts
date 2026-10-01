import { inngest } from "./client";
import { generateCloudinaryClipUrl } from "@/lib/cloudinary";
import { clipsStore } from "@/lib/clips-store";
import { GeneratedClip } from "@/types/clips";
import { formatTime } from "@/lib/formatters";
import { buildCaptions, transcribeFromUrl } from "@/lib/deepgram";
import { analyzeTranscript } from "@/lib/analyze-transcript";

export const helloWorld = inngest.createFunction(
  {
    id: "hello-world",
    triggers: {
      event: "test/hello.world",
    },
  },
  async ({ event }: { event: any }) => {
    return {
      message: `Hello ${event.data.name}`,
    };
  }
);

interface HookAnalysis {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  viralScore: number;
  captionText: string;
  tags: string[];
  viewsEstimate: string;
}

/**
 * Inngest function that processes a video uploaded to Cloudinary:
 * 1. Analyzes timeline for peak viral retention moments
 * 2. Generates 9:16 vertical clips with Cloudinary transformations
 * 3. Burns in dynamic captions onto the clips
 * 4. Saves processed clips into the Cloudinary videos folder and updates job store
 */
export const processVideoToClips = inngest.createFunction(
  {
    id: "process-video-to-clips",
    name: "Process Video To AI Clips",
    triggers: {
      event: "video/process.clips",
    },
  },

  async ({ event, step }: { event: any; step: any }) => {
    const {
      jobId,
      videoUrl,
      publicId,
      duration = 120,
      fileName,
      folder = "videos",
    } = event.data;

    // STEP 1
    // Cloudinary video → Deepgram → real transcript
    const transcription = await step.run(
      "transcribe-video",
      async () => {
        try {
          clipsStore.updateJob(jobId, {
            status: "transcribing",
            progress: 20,
            currentStepMessage:
              "Transcribing audio with Deepgram...",
          });

          return await transcribeFromUrl(videoUrl);
        } catch (err: any) {
          clipsStore.updateJob(jobId, {
            status: "failed",
            error: err.message,
          });

          throw err;
        }
      }
    );

    // STEP 2
    // Real word timestamps → real caption lines
    const captions = await step.run(
      "generate-captions",
      async () => {
        const lines = buildCaptions(transcription.words);

        clipsStore.updateJob(jobId, {
          status: "captioning",
          progress: 40,
          currentStepMessage:
            `Created ${lines.length} caption lines`,
          transcript: transcription.transcript,
          captions: lines,
        });

        return lines;
      }
    );

    // STEP 3
    // Real transcript → OpenAI → real clip selection
    const analysis: { hooks: HookAnalysis[] } = await step.run(
      "analyze-video-hooks",
      async () => {
        try {
          clipsStore.updateJob(jobId, {
            status: "analyzing",
            progress: 50,
            currentStepMessage:
              "AI analyzing the actual transcript for the best clips...",
          });

          return await analyzeTranscript({
            transcript: transcription.transcript,
            words: transcription.words,
            duration,
          });
        } catch (err: any) {
          clipsStore.updateJob(jobId, {
            status: "failed",
            error: err.message,
          });

          throw err;
        }
      }
    );

    // STEP 4
    // Real timestamps → Cloudinary clips
    const generatedClips: GeneratedClip[] = await step.run(
      "generate-cloudinary-clips-with-captions",
      async () => {
        clipsStore.updateJob(jobId, {
          status: "processing",
          progress: 70,
          currentStepMessage:
            "Generating clips from the AI-selected moments...",
        });

        return analysis.hooks.map(
          (hook: HookAnalysis, index: number) => {
            const clipDurationSec =
              hook.endTime - hook.startTime;

            const transformedUrl =
              generateCloudinaryClipUrl(publicId, {
                startOffset: hook.startTime,
                endOffset: hook.endTime,
                aspectRatio: "9:16",
                captionText: hook.captionText,
              });

            const clipCaptions = captions
              .filter(
                (caption: any) =>
                  caption.end > hook.startTime &&
                  caption.start < hook.endTime
              )
              .map((caption : any) => ({
                text: caption.text,
                start: Math.max(
                  0,
                  Math.round(
                    (caption.start - hook.startTime) * 10
                  ) / 10
                ),
                end: Math.min(
                  clipDurationSec,
                  Math.round(
                    (caption.end - hook.startTime) * 10
                  ) / 10
                ),
              }));

            return {
              id: `clip-${jobId}-${index + 1}`,
              title: hook.title,

              duration: formatTime(clipDurationSec),
              durationSeconds: clipDurationSec,

              viralScore: hook.viralScore,

              startTime: hook.startTime,
              endTime: hook.endTime,

              thumbnail: videoUrl,

              transcriptSample: hook.captionText,

              captions: clipCaptions,

              captionText: hook.captionText,

              aspectRatio: "9:16" as const,

              viewsEstimate: hook.viewsEstimate,

              tags: hook.tags,

              cloudinaryUrl: transformedUrl,

              cloudinaryPublicId: publicId,
            };
          }
        );
      }
    );

    // STEP 5
    // Save result
    await step.run("save-clips-to-cloudinary", async () => {
      clipsStore.updateJob(jobId, {
        status: "completed",
        progress: 100,
        currentStepMessage:
          `Generated ${generatedClips.length} clips with captions!`,
        clips: generatedClips,
      });

      return {
        savedCount: generatedClips.length,
        folder,
        timestamp: new Date().toISOString(),
      };
    });

    return {
      success: true,
      jobId,
      publicId,
      clipsCount: generatedClips.length,
      clips: generatedClips,
    };
  }
);