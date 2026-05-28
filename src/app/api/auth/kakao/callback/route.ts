import { NextRequest, NextResponse } from "next/server";
import {
  createKakaoSessionCookie,
  exchangeKakaoCode,
  getKakaoUser,
  kakaoSessionCookieName,
  upsertKakaoProfile,
} from "@/lib/kakao-auth";

export async function GET(request: NextRequest) {
  const error = request.nextUrl.searchParams.get("error");
  const code = request.nextUrl.searchParams.get("code");

  if (error || !code) {
    return NextResponse.redirect(
      new URL("/reservation?login=cancelled", request.url),
    );
  }

  try {
    const accessToken = await exchangeKakaoCode(code);
    const kakaoUser = await getKakaoUser(accessToken);
    const profileId = await upsertKakaoProfile(kakaoUser);
    const response = NextResponse.redirect(
      new URL("/reservation?login=success", request.url),
    );

    response.cookies.set(
      kakaoSessionCookieName,
      createKakaoSessionCookie({ ...kakaoUser, profileId }),
      {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 14,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    );

    return response;
  } catch (callbackError) {
    console.error(callbackError);
    return NextResponse.redirect(
      new URL("/reservation?login=failed", request.url),
    );
  }
}
