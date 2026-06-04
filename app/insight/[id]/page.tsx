import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { dbToInsightItem } from "../../lib/db-mappers";
import InsightDetailClient from "../../components/InsightDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

/** slug 또는 숫자 ID로 인사이트 조회 */
async function fetchInsight(idOrSlug: string) {
  // 1) slug로 먼저 시도
  const { data: bySlug } = await supabase
    .from("insights")
    .select("*")
    .eq("slug", idOrSlug)
    .maybeSingle();
  if (bySlug) return bySlug;

  // 2) 숫자 ID 폴백 (기존 URL 호환)
  const numId = Number(idOrSlug);
  if (!Number.isNaN(numId)) {
    const { data: byId } = await supabase
      .from("insights")
      .select("*")
      .eq("id", numId)
      .maybeSingle();
    if (byId) return byId;
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchInsight(decodeURIComponent(id));
  if (!data) return { title: "인사이트" };

  return {
    title: data.title,
    description: data.excerpt,
    openGraph: {
      title: `${data.title} | 똑똑한개발자`,
      description: data.excerpt,
    },
  };
}

export default async function InsightDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await fetchInsight(decodeURIComponent(id));
  if (!data) notFound();

  return <InsightDetailClient item={dbToInsightItem(data)} />;
}
