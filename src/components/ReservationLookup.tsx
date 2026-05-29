"use client";

import { useState } from "react";
import type { ReservationRow } from "@/lib/supabase";

const statusLabels: Record<ReservationRow["status"], string> = {
  pending: "문의중",
  confirmed: "확정",
  done: "완료",
  cancelled: "취소",
};

export function ReservationLookup() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function lookupReservations(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSearching(true);
    setMessage("");
    setHasSearched(false);

    const response = await fetch("/api/reservations/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: customerName,
        customer_phone: customerPhone,
      }),
    });
    const result = (await response.json()) as {
      ok: boolean;
      message?: string;
      reservations?: ReservationRow[];
    };

    setIsSearching(false);
    setHasSearched(true);

    if (!response.ok || !result.ok) {
      setReservations([]);
      setMessage(result.message || "예약 조회에 실패했습니다.");
      return;
    }

    setReservations(result.reservations || []);
  }

  return (
    <div className="booking-panel">
      <form className="booking-lookup" onSubmit={lookupReservations}>
        <div className="booking-lookup-head">
          <span>예약 확인</span>
          <strong>상담 시 남긴 정보로 조회합니다.</strong>
          <p>오픈채팅 예약 상담 때 알려주신 예약자명과 연락처를 입력하세요.</p>
        </div>
        <div className="booking-lookup-grid">
          <label>
            예약자명
            <input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="예: 김준희"
              required
            />
          </label>
          <label>
            연락처
            <input
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
              placeholder="예: 01012345678"
              required
            />
          </label>
        </div>
        {message ? <p className="booking-message">{message}</p> : null}
        <button className="booking-submit" type="submit" disabled={isSearching}>
          {isSearching ? "조회 중" : "예약정보 조회"}
        </button>
      </form>

      {reservations.length > 0 ? (
        <div className="booking-list">
          {reservations.map((reservation) => (
            <article key={reservation.id} className="booking-card">
              <div>
                <span>{statusLabels[reservation.status]}</span>
                <strong>{reservation.product_title || "상담 예약"}</strong>
                <p>{reservation.memo || "상세 안내는 카카오톡으로 전달됩니다."}</p>
              </div>
              <dl>
                <div>
                  <dt>예약자</dt>
                  <dd>{reservation.customer_name}</dd>
                </div>
                <div>
                  <dt>날짜</dt>
                  <dd>{reservation.travel_date || "조율 중"}</dd>
                </div>
                <div>
                  <dt>인원</dt>
                  <dd>
                    {reservation.people_count
                      ? `${reservation.people_count}명`
                      : "확인 중"}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      ) : null}

      {hasSearched && reservations.length === 0 && !message ? (
        <div className="empty-booking">
          <strong>일치하는 예약 내역이 없습니다.</strong>
          <p>예약자명과 연락처가 상담 시 전달한 정보와 같은지 확인해 주세요.</p>
        </div>
      ) : null}
    </div>
  );
}
