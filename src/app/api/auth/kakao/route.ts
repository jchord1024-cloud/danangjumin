import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.KAKAO_REST_API_KEY;
  const redirectUri = process.env.KAKAO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      {
        message:
          "카카오 로그인 연동 전입니다. KAKAO_REST_API_KEY와 KAKAO_REDIRECT_URI 환경변수를 설정하세요.",
      },
      { status: 503 },
    );
  }

  const url = new URL("https://kauth.kakao.com/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");

  return NextResponse.redirect(url);
}
