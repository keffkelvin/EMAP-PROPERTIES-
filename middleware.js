import { NextResponse } from "next/server";

const COOKIE_NAME = "emap_agent_session";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/portal/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/portal")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL("/portal/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*"]
};
