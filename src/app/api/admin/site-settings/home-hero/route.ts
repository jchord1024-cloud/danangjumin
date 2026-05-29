import { NextRequest, NextResponse } from "next/server";
import {
  type HomeHeroSettings,
  updateHomeHeroSettings,
} from "@/lib/site-settings";

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<HomeHeroSettings>;
    await updateHomeHeroSettings({
      eyebrow: String(body.eyebrow || "").trim(),
      title: String(body.title || "").trim(),
      description: String(body.description || "").trim(),
      mediaItems: Array.isArray(body.mediaItems)
        ? body.mediaItems.map((item) => ({
            url: String(item?.url || "").trim(),
            type: item?.type === "video" ? "video" : "image",
          }))
        : [],
      slideDurationMs: Number(body.slideDurationMs) || 2000,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "홈 설정 저장 실패",
      },
      { status: 400 },
    );
  }
}
