import { NextResponse } from "next/server";
import { kakaoSessionCookieName } from "@/lib/kakao-auth";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/reservation", request.url));
  response.cookies.delete(kakaoSessionCookieName);
  return response;
}
