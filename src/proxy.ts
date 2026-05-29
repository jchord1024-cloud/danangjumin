import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/local-desk", "/api/admin"];

function isProtectedPath(pathname: string) {
  return protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function proxy(request: NextRequest) {
  if (!isProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return NextResponse.next();
  }

  const username = process.env.ADMIN_USERNAME || "kimjun5027";
  const authHeader = request.headers.get("authorization");
  const expected = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

  if (authHeader === expected) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Joomin CCenter"',
    },
  });
}

export const config = {
  matcher: ["/local-desk/:path*", "/api/admin/:path*"],
};
