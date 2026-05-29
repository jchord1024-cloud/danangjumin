import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { KakaoContact } from "@/components/KakaoContact";
import { ReservationLookup } from "@/components/ReservationLookup";
import {
  kakaoSessionCookieName,
  readKakaoSessionCookie,
} from "@/lib/kakao-auth";

export default async function ReservationPage() {
  const cookieStore = await cookies();
  const session = readKakaoSessionCookie(
    cookieStore.get(kakaoSessionCookieName)?.value,
  );

  return (
    <>
      <Header />
      <main className="reservation-page">
        <section className="section reservation-panel">
          <div className="section-head">
            <p>My Booking</p>
            <h1>예약정보</h1>
            <span>
              카카오 로그인 후 오픈채팅 상담 시 남긴 예약자명과 연락처로 예약 내역을 확인합니다.
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
              <ReservationLookup />
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
