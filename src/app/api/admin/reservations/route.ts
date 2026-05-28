import { NextRequest, NextResponse } from "next/server";
import {
  createAdminReservation,
  parseReservationPayload,
} from "@/lib/admin-reservations";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const payload = parseReservationPayload(body);
    await createAdminReservation(payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "예약 등록 실패" },
      { status: 400 },
    );
  }
}
