import { NextRequest, NextResponse } from "next/server";
import {
  deleteAdminProduct,
  parseProductPayload,
  updateAdminProduct,
} from "@/lib/admin-products";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const payload = parseProductPayload(body);
    await updateAdminProduct(id, payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "상품 수정 실패" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteAdminProduct(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "상품 삭제 실패" },
      { status: 400 },
    );
  }
}
