import type { MetadataRoute } from "next";
import { supabase } from "./lib/supabase";

const BASE = "https://www.toktokhan.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // work 상세 + insight 상세 동적 추가
  const [{ data: works }, { data: insights }] = await Promise.all([
    supabase.from("work").select("id, created_at").order("created_at", { ascending: false }),
    supabase.from("insights").select("id, created_at").eq("featured", true).order("created_at", { ascending: false }),
  ]);

  const workDetailUrls: MetadataRoute.Sitemap = (works ?? []).map((w) => ({
    url: `${BASE}/work/${w.id}`,
    lastModified: new Date(w.created_at as string),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const insightDetailUrls: MetadataRoute.Sitemap = (insights ?? []).map((i) => ({
    url: `${BASE}/insight/${i.id}`,
    lastModified: new Date(i.created_at as string),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE}/work`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/insight`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...workDetailUrls,
    ...insightDetailUrls,
  ];
}
