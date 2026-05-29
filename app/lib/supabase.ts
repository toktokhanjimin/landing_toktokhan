import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** 브라우저 / 서버 공용 — 공개 읽기 (anon key) */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** API 라우트 전용 — 쓰기 권한 (service role key, 클라이언트에 노출 금지) */
export function createAdminClient() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}
