import { createHmac, timingSafeEqual } from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const kakaoSessionCookieName = "danang_kakao_session";

export type KakaoSession = {
  kakaoId: string;
  nickname: string | null;
  email: string | null;
  profileId: string | null;
  issuedAt: number;
};

export type KakaoUser = {
  kakaoId: string;
  nickname: string | null;
  email: string | null;
};

type KakaoUserResponse = {
  id: number;
  kakao_account?: {
    email?: string;
    profile?: {
      nickname?: string;
    };
  };
  properties?: {
    nickname?: string;
  };
};

function getSessionSecret() {
  return (
    process.env.KAKAO_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.KAKAO_REST_API_KEY ||
    ""
  );
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function createKakaoSessionCookie(
  payload: Omit<KakaoSession, "issuedAt">,
) {
  const body = Buffer.from(
    JSON.stringify({ ...payload, issuedAt: Date.now() }),
  ).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function readKakaoSessionCookie(value?: string): KakaoSession | null {
  const secret = getSessionSecret();

  if (!value || !secret) {
    return null;
  }

  const [body, signature] = value.split(".");

  if (!body || !signature) {
    return null;
  }

  const expected = sign(body);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (
    expectedBuffer.length !== signatureBuffer.length ||
    !timingSafeEqual(expectedBuffer, signatureBuffer)
  ) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export async function exchangeKakaoCode(code: string) {
  const clientId = process.env.KAKAO_REST_API_KEY;
  const redirectUri = process.env.KAKAO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error("KAKAO_REST_API_KEY와 KAKAO_REDIRECT_URI가 필요합니다.");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    redirect_uri: redirectUri,
    code,
  });

  if (process.env.KAKAO_CLIENT_SECRET) {
    body.set("client_secret", process.env.KAKAO_CLIENT_SECRET);
  }

  const response = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body,
  });

  if (!response.ok) {
    throw new Error("카카오 토큰 발급에 실패했습니다.");
  }

  const token = (await response.json()) as { access_token?: string };

  if (!token.access_token) {
    throw new Error("카카오 access token이 응답에 없습니다.");
  }

  return token.access_token;
}

export async function getKakaoUser(accessToken: string): Promise<KakaoUser> {
  const response = await fetch("https://kapi.kakao.com/v2/user/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  if (!response.ok) {
    throw new Error("카카오 사용자 정보 조회에 실패했습니다.");
  }

  const user = (await response.json()) as KakaoUserResponse;
  const nickname =
    user.kakao_account?.profile?.nickname || user.properties?.nickname || null;

  return {
    kakaoId: String(user.id),
    nickname,
    email: user.kakao_account?.email || null,
  };
}

export async function upsertKakaoProfile(user: KakaoUser) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        kakao_id: user.kakaoId,
        name: user.nickname,
        email: user.email,
      },
      { onConflict: "kakao_id" },
    )
    .select("id")
    .single();

  if (error) {
    return null;
  }

  return data?.id ? String(data.id) : null;
}

