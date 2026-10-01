import { NextResponse } from "next/server";
import { getVideo } from "@/lib/magichour";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const v = await getVideo(id);
    return NextResponse.json({
      status: v.status, // queued | rendering | complete | error | canceled
      videoUrl: v.downloads?.[0]?.url ?? null,
      error: v.error?.message ?? null,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}