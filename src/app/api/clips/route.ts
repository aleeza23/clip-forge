import { NextRequest, NextResponse } from "next/server";
import { clipsStore } from "@/lib/clips-store";

export async function GET(req: NextRequest) {
  const jobId = new URL(req.url).searchParams.get("id");

  if (!jobId) {
    return NextResponse.json({ error: "Missing job id parameter" }, { status: 400 });
  }

  const job = clipsStore.getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(job);
}