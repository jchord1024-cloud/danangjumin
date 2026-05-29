import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type { ReservationRow } from "@/lib/supabase";

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const customerName = String(body.customer_name || "").trim();
    const customerPhone = normalizePhone(String(body.customer_phone || ""));

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { ok: false, message: "예약자명과 연락처를 입력하세요." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json(
        { ok: false, message: "예약 조회 설정이 필요합니다." },
        { status: 503 },
      );
    }

    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("customer_name", customerName)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const reservations = ((data || []) as ReservationRow[]).filter(
      (reservation) =>
        normalizePhone(reservation.customer_phone || "") === customerPhone,
    );

    return NextResponse.json({ ok: true, reservations });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "예약 조회 실패",
      },
      { status: 400 },
    );
  }
}
