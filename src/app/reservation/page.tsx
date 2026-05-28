import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { KakaoContact } from "@/components/KakaoContact";
import {
  kakaoSessionCookieName,
  listReservationsForSession,
  readKakaoSessionCookie,
} from "@/lib/kakao-auth";

const statusLabels = {
  pending: "문의중",
  confirmed: "확정",
  done: "완료",
  cancelled: "취소",
};

export default async function ReservationPage() {
  const cookieStore = await cookies();
  const session = readKakaoSessionCookie(
    cookieStore.get(kakaoSessionCookieName)?.value,
  );
  const reservations = await listReservationsForSession(session);

  return (
    <>
      <Header />
      <main className="reservation-page">
        <section className="section reservation-panel">
          <div className="section-head">
            <p>My Booking</p>
            <h1>예약정보</h1>
            <span>
              카카오 로그인 후 본인 예약 내역을 확인하는 화면입니다. 예약 확정 후 관리 데스크에 등록된 내역이 표시됩니다.
            </span>
          </div>
          {session ? (
            <div className="booking-panel">
              <div className="booking-user">
                <div>
                  <span>로그인 계정</span>
                  <strong>{session.nickname || "카카오 회원"}</strong>
                  {session.email ? <p>{session.email}</p> : null}
                </div>
                <a href="/api/auth/logout">로그아웃</a>
              </div>
              {reservations.length > 0 ? (
                <div className="booking-list">
                  {reservations.map((reservation) => (
                    <article key={reservation.id} className="booking-card">
                      <div>
                        <span>{statusLabels[reservation.status]}</span>
                        <strong>
                          {reservation.product_title || "상담 예약"}
                        </strong>
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
              ) : (
                <div className="empty-booking">
                  <strong>아직 표시할 예약 내역이 없습니다.</strong>
                  <p>
                    상담을 통해 예약이 확정되면 상품명, 날짜, 인원, 픽업
                    정보가 이곳에 정리됩니다.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-booking">
              <strong>카카오 로그인 후 확인할 수 있습니다.</strong>
              <p>
                본인 예약 내역만 안전하게 보여드리기 위해 카카오 계정으로
                확인합니다.
              </p>
              <a href="/api/auth/kakao">카카오 로그인으로 확인</a>
            </div>
          )}
        </section>
      </main>
      <KakaoContact />
    </>
  );
}
