import { NextRequest } from "next/server";

const COOKIE_NAME = "ttk_admin_session";

export function verifyAdminSession(req: NextRequest): boolean {
  const id     = process.env.ADMIN_ID;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!id || !secret) return false;

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return false;

  return cookie === btoa(`${id}:${secret}`);
}
