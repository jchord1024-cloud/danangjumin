import { NextRequest, NextResponse } from "next/server";
import {
  createAdminProduct,
  parseProductPayload,
} from "@/lib/admin-products";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const payload = parseProductPayload(body);
    await createAdminProduct(payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "상품 등록 실패" },
      { status: 400 },
    );
  }
}
