import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient, productImageBucket } from "@/lib/supabase";

function getExtension(fileName: string) {
  const extension = fileName.split(".").pop();
  return extension ? extension.toLowerCase() : "jpg";
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY가 필요합니다.");
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new Error("업로드할 이미지를 선택하세요.");
    }

    if (!file.type.startsWith("image/")) {
      throw new Error("이미지 파일만 업로드할 수 있습니다.");
    }

    const extension = getExtension(file.name);
    const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const bytes = await file.arrayBuffer();

    const { error } = await supabase.storage
      .from(productImageBucket)
      .upload(path, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabase.storage
      .from(productImageBucket)
      .getPublicUrl(path);

    return NextResponse.json({ ok: true, url: data.publicUrl });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "이미지 업로드 실패",
      },
      { status: 400 },
    );
  }
}
