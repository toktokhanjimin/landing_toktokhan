"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWork, getInsights, getFAQs, getWorkClicks, getInsightClicks, getStickyConfig, saveStickyConfig, type StickyConfig, type StickyAction } from "../lib/store";

type RankItem = { label: string; sub: string; count: number };

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ work: 0, insights: 0, faqs: 0 });
  const [topWork, setTopWork] = useState<RankItem[]>([]);
  const [topInsights, setTopInsights] = useState<RankItem[]>([]);
  const [sticky, setSticky] = useState<StickyConfig | null>(null);
  const [stickySaved, setStickySaved] = useState(false);

  useEffect(() => {
    const workItems = getWork();
    const insightItems = getInsights();
    setCounts({
      work: workItems.length,
      insights: insightItems.length,
      faqs: getFAQs().length,
    });

    // Top work
    const wClicks = getWorkClicks();
    const ranked = workItems
      .map((w) => ({ label: w.title, sub: w.client, count: wClicks[w.id] ?? 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    setTopWork(ranked);

    // Top insights
    const iClicks = getInsightClicks();
    const rankedI = insightItems
      .map((ins) => ({ label: ins.title, sub: ins.tag + " · " + ins.date, count: iClicks[ins.title] ?? 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    setTopInsights(rankedI);

    setSticky(getStickyConfig());
  }, []);

  function saveSticky() {
    if (!sticky) return;
    saveStickyConfig(sticky);
    setStickySaved(true);
    setTimeout(() => setStickySaved(false), 1800);
  }

  function updateAction(idx: number, field: keyof StickyAction, value: string) {
    if (!sticky) return;
    const actions = sticky.actions.map((a, i) => i === idx ? { ...a, [field]: value } : a);
    setSticky({ ...sticky, actions });
  }


  const cards = [
    { label: "포트폴리오", count: counts.work, href: "/admin/work", color: "#0a0a0a" },
    { label: "인사이트", count: counts.insights, href: "/admin/insight", color: "#0a0a0a" },
    { label: "FAQ", count: counts.faqs, href: "/admin/faq", color: "#0a0a0a" },
  ];

  return (
    <div>
      <h1 style={{
        font: "700 28px/1.2 var(--font-sans, sans-serif)",
        letterSpacing: "-.02em",
        color: "#0a0a0a",
        margin: "0 0 8px",
      }}>
        대시보드
      </h1>
      <p style={{
        font: "400 14px/1.5 var(--font-sans, sans-serif)",
        color: "rgba(10,10,10,.5)",
        margin: "0 0 40px",
      }}>
        콘텐츠 현황을 한눈에 확인하세요.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{
              background: "#fff",
              border: "1px solid rgba(10,10,10,.08)",
              borderRadius: 12,
              padding: "32px 28px",
              cursor: "pointer",
              transition: "box-shadow .15s ease",
            }}>
              <div style={{
                font: "400 13px/1 var(--font-sans, sans-serif)",
                color: "rgba(10,10,10,.5)",
                letterSpacing: ".04em",
                marginBottom: 16,
              }}>
                {card.label}
              </div>
              <div style={{
                font: "700 40px/1 var(--font-sans, sans-serif)",
                color: card.color,
                letterSpacing: "-.03em",
              }}>
                {card.count}
              </div>
              <div style={{
                font: "400 12px/1 var(--font-sans, sans-serif)",
                color: "rgba(10,10,10,.4)",
                marginTop: 8,
              }}>
                개의 콘텐츠
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Top 조회 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 32 }}>
        <RankCard title="인기 포트폴리오" items={topWork} emptyMsg="아직 클릭 데이터가 없어요." />
        <RankCard title="인기 인사이트" items={topInsights} emptyMsg="아직 클릭 데이터가 없어요." />
      </div>

      {/* 스티키 버튼 관리 */}
      {sticky && (
        <div style={{ background: "#fff", border: "1px solid rgba(10,10,10,.08)", borderRadius: 12, padding: "28px 28px 24px", marginTop: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ font: "600 15px/1 var(--font-sans, sans-serif)", color: "#0a0a0a" }}>스티키 액션 버튼</div>
              <div style={{ font: "400 12px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.4)", marginTop: 5 }}>메인 페이지 하단 고정 버튼</div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <span style={{ font: "500 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.6)" }}>노출</span>
              <input
                type="checkbox"
                checked={sticky.enabled}
                style={{ width: 16, height: 16, accentColor: "var(--btn-primary)", cursor: "pointer" }}
                onChange={(e) => setSticky({ ...sticky, enabled: e.target.checked })}
              />
            </label>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* 버튼 레이블 */}
            <div>
              <label style={{ display: "block", font: "500 12px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.5)", letterSpacing: ".04em", marginBottom: 6 }}>버튼 레이블</label>
              <input
                style={{ width: "100%", font: "400 14px/1.5 var(--font-sans, sans-serif)", padding: "10px 12px", border: "1px solid rgba(10,10,10,.14)", borderRadius: 8, color: "#0a0a0a", background: "#fff", outline: "none", boxSizing: "border-box" as const }}
                value={sticky.buttonLabel}
                onChange={(e) => setSticky({ ...sticky, buttonLabel: e.target.value })}
                placeholder="똑똑한개발자 더 알아보기"
              />
            </div>

            {/* 왼쪽 설명 텍스트 */}
            <div>
              <label style={{ display: "block", font: "500 12px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.5)", letterSpacing: ".04em", marginBottom: 6 }}>왼쪽 설명 텍스트 (줄바꿈 가능)</label>
              <textarea
                style={{ width: "100%", font: "400 14px/1.5 var(--font-sans, sans-serif)", padding: "10px 12px", border: "1px solid rgba(10,10,10,.14)", borderRadius: 8, color: "#0a0a0a", background: "#fff", outline: "none", boxSizing: "border-box" as const, resize: "vertical", height: 60 }}
                value={sticky.description ?? ""}
                onChange={(e) => setSticky({ ...sticky, description: e.target.value })}
                placeholder={"AI와 일하는 조직,\n지금 똑똑한개발자와 시작하세요"}
              />
            </div>

            {/* 링크 버튼 */}
            <div>
              <label style={{ display: "block", font: "500 12px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.5)", letterSpacing: ".04em", marginBottom: 8 }}>링크 버튼</label>
              {(() => {
                const linkIdx = sticky.actions.findIndex((a) => a.type === "link");
                if (linkIdx === -1) return null;
                const action = sticky.actions[linkIdx];
                return (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
                    <input
                      style={{ font: "400 13px/1 var(--font-sans, sans-serif)", padding: "9px 10px", border: "1px solid rgba(10,10,10,.14)", borderRadius: 7, color: "#0a0a0a", outline: "none" }}
                      value={action.label}
                      onChange={(e) => updateAction(linkIdx, "label", e.target.value)}
                      placeholder="버튼 텍스트"
                    />
                    <input
                      style={{ font: "400 13px/1 var(--font-sans, sans-serif)", padding: "9px 10px", border: "1px solid rgba(10,10,10,.14)", borderRadius: 7, color: "#0a0a0a", outline: "none" }}
                      value={action.url}
                      onChange={(e) => updateAction(linkIdx, "url", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                );
              })()}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 4 }}>
              {stickySaved && <span style={{ font: "400 13px/1 var(--font-sans, sans-serif)", color: "#16a34a", alignSelf: "center" }}>저장됐어요 ✓</span>}
              <button
                onClick={saveSticky}
                style={{ padding: "10px 20px", borderRadius: 8, background: "#0a0a0a", color: "#fff", border: "none", font: "500 13px/1 var(--font-sans, sans-serif)", cursor: "pointer" }}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RankCard({ title, items, emptyMsg }: { title: string; items: RankItem[]; emptyMsg: string }) {
  const max = items[0]?.count ?? 1;
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(10,10,10,.08)", borderRadius: 12, padding: "28px 28px 24px" }}>
      <div style={{ font: "600 15px/1 var(--font-sans, sans-serif)", color: "#0a0a0a", marginBottom: 20 }}>{title}</div>
      {items.length === 0 || items[0].count === 0 ? (
        <div style={{ font: "400 13px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.35)", padding: "12px 0" }}>{emptyMsg}</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, minWidth: 0 }}>
                  <span style={{ font: "600 11px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.3)", letterSpacing: ".06em", flexShrink: 0 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ font: "500 13px/1.35 var(--font-sans, sans-serif)", color: "#0a0a0a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.label}</div>
                    <div style={{ font: "400 11px/1 var(--font-sans, sans-serif)", color: "rgba(10,10,10,.4)", marginTop: 3 }}>{it.sub}</div>
                  </div>
                </div>
                <span style={{ font: "600 13px/1 var(--font-sans, sans-serif)", color: "#0a0a0a", flexShrink: 0 }}>{it.count.toLocaleString()}</span>
              </div>
              <div style={{ height: 3, borderRadius: 99, background: "rgba(10,10,10,.06)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 99, background: "#0a0a0a", width: `${Math.round((it.count / max) * 100)}%`, transition: "width .4s ease" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
