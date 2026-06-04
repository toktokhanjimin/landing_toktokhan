import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { dbToWorkItem, dbToInsightItem } from "../../lib/db-mappers";
import type { WorkItem, InsightItem } from "../../lib/store";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import WhiteBackground from "../../components/WhiteBackground";
import WorkDetailClient from "../../components/WorkDetailClient";
import WorkContactPopup from "../../components/WorkContactPopup";

// ── Metadata ──────────────────────────────────────────────────────────────────

/** slug 또는 text ID로 work 조회 */
async function fetchWork(idOrSlug: string) {
  // 1) slug로 먼저 시도
  const { data: bySlug } = await supabase
    .from("work")
    .select("*")
    .eq("slug", idOrSlug)
    .maybeSingle();
  if (bySlug) return bySlug;

  // 2) text ID 폴백 (기존 URL 호환)
  const { data: byId } = await supabase
    .from("work")
    .select("*")
    .eq("id", idOrSlug)
    .maybeSingle();
  return byId ?? null;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchWork(decodeURIComponent(id));
  if (!data) return {};

  return {
    title: data.title,
    description: data.lead || data.title,
    openGraph: {
      title: `${data.title} | 똑똑한개발자`,
      description: data.lead || data.title,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function CaseDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const raw = await fetchWork(decodeURIComponent(id));
  if (!raw) notFound();

  const c: WorkItem = dbToWorkItem(raw as Record<string, unknown>);

  // 전체 work 목록 (다음 사례 네비게이션용)
  const { data: allRaw } = await supabase
    .from("work")
    .select("id, slug, title, client")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const allIds = (allRaw ?? []).map((r) => r.id as string);
  const idx = allIds.indexOf(c.id);
  const nextRaw = allRaw?.[(idx + 1) % allIds.length];
  const next = nextRaw
    ? { href: (nextRaw.slug as string) || (nextRaw.id as string), client: nextRaw.client as string }
    : null;

  // 관련 인사이트 조회
  let related: InsightItem[] = [];
  if (c.relatedInsights && c.relatedInsights.length > 0) {
    const { data } = await supabase
      .from("insights")
      .select("*")
      .in("id", c.relatedInsights);
    related = (data ?? []).map(dbToInsightItem);
  } else {
    const { data } = await supabase
      .from("insights")
      .select("*")
      .order("sort_order", { ascending: true })
      .limit(3);
    related = (data ?? []).map(dbToInsightItem);
  }

  const mono = "var(--font-sans)";

  return (
    <div style={{ background: "var(--bg)", color: "var(--fg-1)", minHeight: "100dvh" }}>
      <WhiteBackground />
      <WorkDetailClient workId={id} />
      <SiteHeader forceLight current="Work" />

      {/* Cover */}
      <section className="work-cover" style={{ background: c.bg, padding: "168px 0 80px", color: "var(--fg-on-dark-1)", position: "relative", overflow: "hidden" }}>
        {c.thumbImg && (
          <img src={c.thumbImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35, display: "block" }} />
        )}
        <div style={{ maxWidth: 1248, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ font: "700 14px/1 var(--font-sans)", letterSpacing: ".06em", color: "var(--fg-on-dark-1)", marginBottom: 20 }}>
            {c.client}
          </div>
          <h1 style={{
            font: "700 clamp(34px,5vw,68px)/1.18 var(--font-sans)",
            letterSpacing: "-.035em", color: "var(--fg-on-dark-1)", margin: 0, maxWidth: 940,
          }}>{c.title}</h1>
          <p style={{
            font: "var(--body-lg)",
            color: "rgba(255,255,255,.8)", margin: "24px 0 0", maxWidth: 720,
          }}>{c.lead}</p>
          <div style={{
            display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap",
            font: `500 12px/1 var(--font-sans)`, letterSpacing: ".06em",
            color: "rgba(255,255,255,.7)", margin: "24px 0 0",
          }}>
            <span>{c.tag}</span>
            <span style={{ color: "rgba(255,255,255,.3)" }}>•</span>
            <Badge style={{ background: "rgba(255,255,255,.18)", color: "var(--fg-on-dark-1)", borderRadius: "var(--r-xs)", font: "500 11px/1 var(--font-sans)", letterSpacing: ".1em", padding: "5px 8px" }}>{c.category}</Badge>
            <span style={{ color: "rgba(255,255,255,.3)" }}>•</span>
            <span>{c.date}</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <main className="work-body" style={{ maxWidth: 1248, margin: "0 auto", padding: "100px 24px 0", display: "grid", gridTemplateColumns: "1fr", gap: 80 }}>
        {c.sections.map((sec, i) => (
          <section key={i} className="work-section no-px" style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 60, alignItems: "start" }}>
            <div className="work-section-label" style={{ font: `500 13px/1 ${mono}`, letterSpacing: ".16em", color: "rgba(10,10,10,.45)", paddingTop: 8 }}>
              0{i + 1} / 0{c.sections.length}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <h2 style={{ font: "var(--h3)", letterSpacing: "-.02em", color: "var(--fg-1)", margin: 0 }}>
                {sec.h}
              </h2>
              <p style={{ font: "var(--body-lg)", color: "rgba(10,10,10,.78)", margin: 0, maxWidth: 720 }}>
                {sec.p}
              </p>
              <div style={{ height: 320, borderRadius: "var(--r-md)", background: sec.grad, position: "relative", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,.08)" }}>
                {sec.img && (
                  <img src={sec.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                )}
              </div>
            </div>
          </section>
        ))}

        {/* Points */}
        <section className="work-section no-px" style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 60, alignItems: "start" }}>
          <div className="work-section-label" style={{ font: `500 13px/1 ${mono}`, letterSpacing: ".16em", color: "rgba(10,10,10,.45)", paddingTop: 8 }}>
            핵심 포인트
          </div>
          <div>
            <div className="work-points-box" style={{ background: "var(--bg-elev)", borderRadius: "var(--r-lg)", padding: "40px 48px" }}>
              <div style={{
                font: "700 18px/1 var(--font-sans)", letterSpacing: "-.01em",
                color: "var(--fg-1)", marginBottom: 24, display: "flex", alignItems: "center", gap: 10,
              }}>
                📌 이 작업의 포인트
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: 16, margin: 0, padding: 0, listStyle: "none" }}>
                {c.points.map((pt, i) => (
                  <li key={i} style={{
                    display: "grid", gridTemplateColumns: "28px 1fr", gap: 14,
                    alignItems: "baseline", font: "500 16px/1.55 var(--font-sans)", color: "var(--fg-1)",
                  }}>
                    <span style={{ font: `500 12px/1 ${mono}`, color: "rgba(10,10,10,.45)", letterSpacing: ".1em" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Nav */}
      {next && (
        <nav className="work-nav" style={{
          maxWidth: 1248, margin: "120px auto 0", padding: "60px 24px 80px",
          borderTop: "1px solid rgba(10,10,10,.08)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <Button variant="ghost" size="md" href="/work" style={{ color: "var(--grey-800)", padding: "12px 20px" }}>
            ← 목록으로
          </Button>
          <Button variant="ghost" size="md" href={`/work/${next.href}`} style={{ color: "var(--grey-800)", padding: "12px 20px" }}>
            다음 사례 →
          </Button>
        </nav>
      )}

      {/* Related insights */}
      {related.length > 0 && (
        <section id="work-related-insights" className="work-insights-section" style={{ background: "var(--bg-elev)", padding: "100px 24px 120px", marginTop: 0 }}>
          <div style={{ maxWidth: 1248, margin: "0 auto" }}>
            <div className="work-insights-header" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 36 }}>
              <h2 style={{ font: "var(--h3)", letterSpacing: "-.02em", color: "var(--fg-1)", margin: 0 }}>관련 인사이트</h2>
              <a href="/insight" className="work-insights-all-link" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 16px", borderRadius: "var(--r-sm)",
                border: "1px solid rgba(10,10,10,.14)", background: "var(--bg)",
                font: "500 13px/1 var(--font-sans)", color: "var(--fg-1)",
                textDecoration: "none",
              }}>전체 보기 →</a>
            </div>
            <div className="work-insights-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {related.map((r, i) => (
                <a key={i} href={r.id ? `/insight/${r.slug || r.id}` : "/insight"} style={{ display: "flex", flexDirection: "column", gap: 14, textDecoration: "none", color: "inherit" }}>
                  <div style={{ width: "100%", aspectRatio: "16/10", borderRadius: "var(--r-md)", overflow: "hidden" }}>
                    {r.thumbImg && <img src={r.thumbImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                  </div>
                  <div style={{ font: `500 12px/1 ${mono}`, letterSpacing: ".1em", color: "rgba(10,10,10,.5)" }}>{r.tag} · {r.date}</div>
                  <h3 style={{ font: "600 17px/1.4 var(--font-sans)", letterSpacing: "-.01em", color: "var(--fg-1)", margin: 0, whiteSpace: "pre-line" }}>{r.title}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <WorkContactPopup />
    </div>
  );
}

