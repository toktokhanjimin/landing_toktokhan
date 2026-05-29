/** Supabase DB 컬럼(snake_case) → TypeScript 타입(camelCase) 매핑 헬퍼 */
import type { WorkItem, InsightItem } from "./store";

export function dbToWorkItem(row: Record<string, unknown>): WorkItem {
  return {
    id:               String(row.id ?? ""),
    client:           String(row.client ?? ""),
    tag:              String(row.tag ?? ""),
    category:         String(row.category ?? ""),
    year:             String(row.year ?? ""),
    date:             String(row.date ?? ""),
    bg:               String(row.bg ?? ""),
    desc:             String(row.description ?? row.desc ?? ""),
    title:            String(row.title ?? ""),
    lead:             String(row.lead ?? ""),
    thumbImg:         row.thumb_img ? String(row.thumb_img) : undefined,
    sections:         (row.sections as WorkItem["sections"]) ?? [],
    points:           (row.points as string[]) ?? [],
    featured:         Boolean(row.featured),
    relatedInsights:  (row.related_insight_ids as number[]) ?? [],
    sort_order:       Number(row.sort_order ?? 0),
  };
}

export function dbToInsightItem(row: Record<string, unknown>): InsightItem {
  return {
    id:         Number(row.id ?? 0),
    mark:       String(row.mark ?? ""),
    markColor:  String(row.mark_color ?? "#0a0a0a"),
    thumb:      String(row.thumb ?? ""),
    thumbImg:   row.thumb_img ? String(row.thumb_img) : undefined,
    title:      String(row.title ?? ""),
    tag:        String(row.tag ?? ""),
    category:   row.category ? String(row.category) : undefined,
    date:       String(row.date ?? ""),
    excerpt:    String(row.excerpt ?? ""),
    url:        row.url ? String(row.url) : undefined,
    featured:   Boolean(row.featured),
    sort_order: Number(row.sort_order ?? 0),
  };
}
