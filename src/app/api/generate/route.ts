import { NextResponse } from "next/server";
import { uploadImage, createVideo, buildPrompt } from "@/lib/magichour";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const image = form.get("image") as File | null;
    const prompt = String(form.get("prompt") || "").trim();

    if (!image || !prompt) {
      return NextResponse.json({ error: "Photo and prompt are required" }, { status: 400 });
    }
    if (image.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "Photo must be under 4 MB" }, { status: 400 });
    }

    const path = await uploadImage(image);
    const job = await createVideo(path, buildPrompt(prompt));
    return NextResponse.json({ id: job.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}