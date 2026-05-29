import type { Metadata } from "next";
import { supabase } from "../lib/supabase";
import { dbToInsightItem } from "../lib/db-mappers";
import InsightPageClient from "../components/InsightPageClient";

export const metadata: Metadata = {
  title: "인사이트",
  description: "AX·AI를 만들며 배운 것들과, 일하는 방식에 대한 짧은 글들.",
};

export default async function InsightPage() {
  const { data, error } = await supabase
    .from("insights")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) console.error("[InsightPage] Supabase error:", error.message);

  const items = (data ?? []).map(dbToInsightItem);

  return <InsightPageClient initialItems={items} />;
}
