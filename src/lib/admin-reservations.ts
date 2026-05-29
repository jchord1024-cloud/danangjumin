import {
  getSupabaseAdminClient,
  type ProfileRow,
  type ReservationPayload,
  type ReservationRow,
} from "@/lib/supabase";

const statuses = ["pending", "confirmed", "done", "cancelled"] as const;

export function parseReservationPayload(
  body: Record<string, unknown>,
): ReservationPayload {
  const customerName = String(body.customer_name || "").trim();
  const status = String(body.status || "pending");
  const peopleCount = Number(body.people_count || 0);

  if (!customerName) {
    throw new Error("고객명을 입력하세요.");
  }

  if (!statuses.includes(status as ReservationRow["status"])) {
    throw new Error("예약 상태를 선택하세요.");
  }

  return {
    user_id: String(body.user_id || "").trim() || null,
    customer_name: customerName,
    customer_phone: String(body.customer_phone || "").trim() || null,
    product_title: String(body.product_title || "").trim() || null,
    travel_date: String(body.travel_date || "").trim() || null,
    people_count: peopleCount > 0 ? peopleCount : null,
    status: status as ReservationRow["status"],
    memo: String(body.memo || "").trim() || null,
  };
}

export async function listAdminProfiles(): Promise<ProfileRow[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as ProfileRow[];
}

export async function listAdminReservations(): Promise<ReservationRow[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as ReservationRow[];
}

export async function createAdminReservation(payload: ReservationPayload) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY가 필요합니다.");
  }

  const { error } = await supabase.from("reservations").insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateAdminReservation(
  id: string,
  payload: ReservationPayload,
) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY가 필요합니다.");
  }

  const { error } = await supabase
    .from("reservations")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteAdminReservation(id: string) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY가 필요합니다.");
  }

  const { error } = await supabase.from("reservations").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
