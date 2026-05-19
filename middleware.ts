import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "ttk_admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /admin/login 과 /api/admin/** 은 통과
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/")) {
    return NextResponse.next();
  }

  // /admin/** 은 쿠키 검증
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const secret = process.env.ADMIN_SESSION_SECRET;
    const validId = process.env.ADMIN_ID;

    if (!token || !secret || !validId) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    const expected = btoa(`${validId}:${secret}`);
    if (token !== expected) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
