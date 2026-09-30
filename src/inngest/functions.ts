import { inngest } from "./client";
import { generateCloudinaryClipUrl, uploadSrtToCloudinary, uploadVideoFromUrl } from "@/lib/cloudinary";
import { clipsStore } from "@/lib/clips-store";
import { GeneratedClip } from "@/types/clips";
import { formatTime } from "@/lib/formatters";
import { buildCaptions, transcribeFromUrl } from "@/lib/deepgram";
import { analyzeTranscript } from "@/lib/analyze-transcript";
import { captionsToSrt } from "@/lib/srt";

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
  "generate-and-save-video-clips",
  async () => {
    clipsStore.updateJob(jobId, {
      status: "processing",
      progress: 70,
      currentStepMessage: "Creating and saving your video clips...",
    });

    const processed: GeneratedClip[] = [];

    for (let index = 0; index < analysis.hooks.length; index++) {
      const hook = analysis.hooks[index];

      const clipDurationSec = hook.endTime - hook.startTime;

      const clipCaptions = captions
        .filter(
          (caption: any) =>
            caption.end > hook.startTime &&
            caption.start < hook.endTime
        )
        .map((caption: any) => ({
          text: caption.text,
          start: Math.max(
            0,
            Math.round((caption.start - hook.startTime) * 10) / 10
          ),
          end: Math.min(
            clipDurationSec,
            Math.round((caption.end - hook.startTime) * 10) / 10
          ),
        }));

      // 1. Create SRT for this clip
      const srtContent = captionsToSrt(clipCaptions);

      const subtitlePublicId = `captions/${jobId}/clip-${index + 1}.srt`;

      await uploadSrtToCloudinary(
        srtContent,
        subtitlePublicId
      );

      // 2. Create Cloudinary transformation URL
      const transformedUrl = generateCloudinaryClipUrl(publicId, {
        startOffset: hook.startTime,
        endOffset: hook.endTime,
        aspectRatio: "9:16",
        subtitlePublicId,
      });

      // 3. Save the transformed video as a NEW Cloudinary asset
      const uploadedClip = await uploadVideoFromUrl(
        transformedUrl,
        `clip-${index + 1}`,
        `generated-clips/${jobId}`
      );

      // 4. Use the NEW Cloudinary URL
      const savedClipUrl = uploadedClip.secure_url;

      processed.push({
        id: `clip-${jobId}-${index + 1}`,
        title: hook.title ?? `Clip ${index + 1}`,
        duration: formatTime(clipDurationSec),
        durationSeconds: clipDurationSec,
        viralScore: hook.viralScore,
        startTime: hook.startTime,
        endTime: hook.endTime,

        thumbnail: videoUrl,

        transcriptSample: hook.captionText,

        captions: clipCaptions,

        captionText: hook.captionText,

        aspectRatio: "9:16",

        viewsEstimate:
          hook.viewsEstimate ?? "Moderate short-form potential",

        tags: hook.tags ?? [],

        // THIS IS NOW THE SAVED VIDEO
        cloudinaryUrl: savedClipUrl,

        // THIS IS NOW THE GENERATED CLIP'S PUBLIC ID
        cloudinaryPublicId: uploadedClip.public_id,
      });
    }

    return processed;
  }
);

    // STEP 5
    // Save result
await step.run("save-clips-to-cloudinary", async () => {
  clipsStore.updateJob(jobId, {
    status: "completed",
    progress: 100,
    currentStepMessage: `Generated ${generatedClips.length} video clips and saved them to Cloudinary.`,
    clips: generatedClips,
  });

  return {
    savedCount: generatedClips.length,
    folder: `generated-clips/${jobId}`,
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