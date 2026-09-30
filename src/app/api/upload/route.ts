import { NextRequest, NextResponse } from "next/server";
import { uploadVideoToCloudinary } from "@/lib/cloudinary";
import { clipsStore } from "@/lib/clips-store";
import { ClipJob } from "@/types/clips";

export const maxDuration = 60; // Allow sufficient time for Cloudinary upload

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No video file provided" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Upload video to Cloudinary under the "videos" folder
    const cloudinaryResult = await uploadVideoToCloudinary(
      buffer,
      file.name,
      "videos",
    );

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const duration = Math.round(cloudinaryResult.duration || 60);

    // 2. Initialize the job in our clips store
    const initialJob: ClipJob = {
      id: jobId,
      progress: 10,
      status: "uploaded",

      currentStepMessage: "Video uploaded. Ready for AI analysis.",
      originalVideoUrl: cloudinaryResult.secure_url,
      originalPublicId: cloudinaryResult.public_id,
      fileName: file.name,
      duration,
      clips: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    clipsStore.createJob(initialJob);

    // 3. Trigger Inngest workflow function

    return NextResponse.json({
      success: true,
      jobId,
      videoUrl: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      duration,
      format: cloudinaryResult.format,
      bytes: cloudinaryResult.bytes,
    });
  } catch (error: any) {
    console.error("Cloudinary upload or Inngest trigger error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to upload video to Cloudinary",
        details: error.toString(),
      },
      { status: 500 },
    );
  }
}
