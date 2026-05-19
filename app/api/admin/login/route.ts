import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "ttk_admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7일

export async function POST(req: NextRequest) {
  const { id, password } = await req.json();

  const validId = process.env.ADMIN_ID;
  const validPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!validId || !validPassword || !secret) {
    return NextResponse.json({ error: "서버 설정 오류" }, { status: 500 });
  }

  if (id !== validId || password !== validPassword) {
    return NextResponse.json({ error: "아이디 또는 비밀번호가 틀렸어요." }, { status: 401 });
  }

  const token = btoa(`${id}:${secret}`);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return res;
}
