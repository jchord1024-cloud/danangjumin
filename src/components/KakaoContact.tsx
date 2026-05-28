const kakaoChannelUrl =
  process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL ||
  "https://open.kakao.com/o/sMvcmYwi";

export function KakaoContact() {
  return (
    <a
      className="kakao-float"
      href={kakaoChannelUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="카카오톡 문의 열기"
    >
      <span>Talk</span>
      <strong>카카오톡 문의</strong>
    </a>
  );
}
