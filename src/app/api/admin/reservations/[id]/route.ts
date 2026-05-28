import { NextRequest, NextResponse } from "next/server";
import {
  deleteAdminReservation,
  parseReservationPayload,
  updateAdminReservation,
} from "@/lib/admin-reservations";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const payload = parseReservationPayload(body);
    await updateAdminReservation(id, payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "예약 수정 실패" },
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
    await deleteAdminReservation(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "예약 삭제 실패" },
      { status: 400 },
    );
  }
}
