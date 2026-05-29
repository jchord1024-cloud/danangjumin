"use client";

import { useMemo, useState } from "react";
import type { ReservationRow } from "@/lib/supabase";

type FormState = {
  id?: string;
  customer_name: string;
  customer_phone: string;
  product_title: string;
  travel_date: string;
  people_count: number;
  status: ReservationRow["status"];
  memo: string;
};

const emptyForm: FormState = {
  customer_name: "",
  customer_phone: "",
  product_title: "",
  travel_date: "",
  people_count: 1,
  status: "pending",
  memo: "",
};

const statusLabels: Record<ReservationRow["status"], string> = {
  pending: "문의중",
  confirmed: "확정",
  done: "완료",
  cancelled: "취소",
};

function reservationToForm(reservation: ReservationRow): FormState {
  return {
    id: reservation.id,
    customer_name: reservation.customer_name,
    customer_phone: reservation.customer_phone || "",
    product_title: reservation.product_title || "",
    travel_date: reservation.travel_date || "",
    people_count: reservation.people_count || 1,
    status: reservation.status,
    memo: reservation.memo || "",
  };
}

export function AdminReservations({
  initialReservations,
}: {
  initialReservations: ReservationRow[];
}) {
  const [reservations, setReservations] = useState(initialReservations);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const selectedTitle = useMemo(
    () => (form.id ? "예약 수정" : "새 예약 등록"),
    [form.id],
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function refreshReservations() {
    window.location.reload();
  }

  async function submitReservation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const endpoint = form.id
      ? `/api/admin/reservations/${form.id}`
      : "/api/admin/reservations";
    const method = form.id ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = (await response.json()) as { ok: boolean; message?: string };

    setIsSaving(false);

    if (!response.ok || !result.ok) {
      setMessage(result.message || "저장에 실패했습니다.");
      return;
    }

    setMessage("저장되었습니다.");
    setForm(emptyForm);
    await refreshReservations();
  }

  async function deleteReservation(reservation: ReservationRow) {
    if (!window.confirm(`${reservation.customer_name} 예약을 삭제할까요?`)) {
      return;
    }

    const response = await fetch(`/api/admin/reservations/${reservation.id}`, {
      method: "DELETE",
    });
    const result = (await response.json()) as { ok: boolean; message?: string };

    if (!response.ok || !result.ok) {
      setMessage(result.message || "삭제에 실패했습니다.");
      return;
    }

    setReservations((current) =>
      current.filter((item) => item.id !== reservation.id),
    );
    setMessage("삭제되었습니다.");
  }

  return (
    <div className="admin-layout">
      <section className="admin-list" aria-label="예약 목록">
        <div className="admin-section-head">
          <p>Reservations</p>
          <h2>예약 목록</h2>
        </div>
        <div className="admin-table">
          {reservations.map((reservation) => (
            <button
              key={reservation.id}
              type="button"
              className={form.id === reservation.id ? "admin-row active" : "admin-row"}
              onClick={() => setForm(reservationToForm(reservation))}
            >
              <span>{statusLabels[reservation.status]}</span>
              <strong>{reservation.customer_name}</strong>
              <em>{reservation.travel_date || "날짜 미정"}</em>
            </button>
          ))}
          {reservations.length === 0 ? (
            <p className="admin-muted">등록된 예약이 없습니다.</p>
          ) : null}
        </div>
      </section>

      <section className="admin-editor" aria-label={selectedTitle}>
        <div className="admin-section-head">
          <p>Booking Editor</p>
          <h2>{selectedTitle}</h2>
        </div>
        <form onSubmit={submitReservation} className="admin-form">
          <div className="admin-two-col">
            <label>
              고객명
              <input
                value={form.customer_name}
                onChange={(event) => updateField("customer_name", event.target.value)}
                required
              />
            </label>
            <label>
              연락처
              <input
                value={form.customer_phone}
                onChange={(event) =>
                  updateField("customer_phone", event.target.value)
                }
              />
            </label>
          </div>
          <label>
            상품명
            <input
              value={form.product_title}
              onChange={(event) => updateField("product_title", event.target.value)}
              placeholder="예: 오션 시그니처 풀빌라"
            />
          </label>
          <div className="admin-two-col">
            <label>
              여행 날짜
              <input
                type="date"
                value={form.travel_date}
                onChange={(event) => updateField("travel_date", event.target.value)}
              />
            </label>
            <label>
              인원
              <input
                type="number"
                min="1"
                value={form.people_count}
                onChange={(event) =>
                  updateField("people_count", Number(event.target.value))
                }
              />
            </label>
          </div>
          <label>
            상태
            <select
              value={form.status}
              onChange={(event) =>
                updateField("status", event.target.value as ReservationRow["status"])
              }
            >
              <option value="pending">문의중</option>
              <option value="confirmed">확정</option>
              <option value="done">완료</option>
              <option value="cancelled">취소</option>
            </select>
          </label>
          <label>
            메모
            <textarea
              rows={5}
              value={form.memo}
              onChange={(event) => updateField("memo", event.target.value)}
            />
          </label>
          {message ? <p className="admin-message">{message}</p> : null}
          <div className="admin-actions">
            <button type="submit" disabled={isSaving}>
              {isSaving ? "저장 중" : "저장"}
            </button>
            <button type="button" onClick={() => setForm(emptyForm)}>
              새 예약
            </button>
            {form.id ? (
              <button
                type="button"
                className="danger"
                onClick={() => {
                  const reservation = reservations.find((item) => item.id === form.id);
                  if (reservation) {
                    void deleteReservation(reservation);
                  }
                }}
              >
                삭제
              </button>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}
