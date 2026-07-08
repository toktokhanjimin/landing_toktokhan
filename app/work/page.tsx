import type { Metadata } from "next";
import { supabase } from "../lib/supabase";
import type { WorkItem } from "../lib/store";
import { dbToWorkItem } from "../lib/db-mappers";
import WorkPageClient from "../components/WorkPageClient";

export const metadata: Metadata = {
  title: "포트폴리오",
  description: "AX·AI·Ops 분야 실제 프로젝트 사례들. 각 작업은 똑똑한개발자의 일하는 방식이 남긴 기록입니다.",
};

export default async function WorkPage() {
  // 목록 카드에 필요한 컬럼만 선택 (sections·points·lead 등 상세 전용 필드 제외)
  const { data, error } = await supabase
    .from("work")
    .select("id, slug, title, client, tag, category, year, bg, coming_soon, thumb_img, featured, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) console.error("[WorkPage] Supabase error:", error.message);

  // DB 컬럼명(snake_case) → WorkItem(camelCase) 매핑
  const items: WorkItem[] = (data ?? []).map(dbToWorkItem);

  return <WorkPageClient initialItems={items} />;
}
