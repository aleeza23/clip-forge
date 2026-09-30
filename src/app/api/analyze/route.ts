import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { clipsStore } from "@/lib/clips-store";

export async function POST(req: NextRequest) {
  try {
    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json(
        { error: "jobId is required" },
        { status: 400 }
      );
    }

    const job = clipsStore.getJob(jobId);

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    if (!job.originalVideoUrl) {
      return NextResponse.json(
        { error: "Cloudinary video URL is missing" },
        { status: 400 }
      );
    }

    if (!job.originalPublicId) {
      return NextResponse.json(
        { error: "Cloudinary public ID is missing" },
        { status: 400 }
      );
    }

    if (job.status !== "uploaded") {
      return NextResponse.json({
        success: true,
        jobId,
        alreadyStarted: true,
      });
    }

    clipsStore.updateJob(jobId, {
      status: "transcribing",
      progress: 15,
      currentStepMessage: "Analysis queued...",
    });

    await inngest.send({
      name: "video/process.clips",
      data: {
        jobId,
        videoUrl: job.originalVideoUrl,
        publicId: job.originalPublicId,
        duration: job.duration,
        fileName: job.fileName,
        folder: "videos",
      },
    });

    return NextResponse.json({
      success: true,
      jobId,
    });
  } catch (error: any) {
    console.error("Failed to start analysis:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to start analysis",
      },
      { status: 500 }
    );
  }
}