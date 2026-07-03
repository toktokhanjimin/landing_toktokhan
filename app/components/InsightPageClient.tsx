"use client";

import { useState, useEffect } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import WhiteBackground from "./WhiteBackground";
import { recordInsightClick, type InsightItem } from "../lib/store";

const CATEGORIES = [
  { label: "전체",      value: "전체",      desc: "AX · AI를 만들며 배운 것들과, 일하는 방식에 대한 짧은 글들." },
  { label: "AX",        value: "ax",        desc: "AI 전환(AX)에 대한 인사이트와 실전 전략들을 공유합니다." },
  { label: "팀문화",    value: "team",      desc: "함께 일하는 방식과 조직 문화에 대한 이야기입니다." },
  { label: "외주개발팁", value: "outsource", desc: "외주 개발을 더 잘 활용하는 방법을 알려드립니다." },
  { label: "런칭",      value: "launch",    desc: "새로운 제품과 서비스 런칭 소식을 전합니다." },
];

export const CATEGORY_LABEL: Record<string, string> = {
  ax: "AX", team: "팀문화", outsource: "외주개발팁", launch: "런칭",
};

export const CATEGORY_GRADIENT: Record<string, string> = {
  ax:        "linear-gradient(135deg,#38BDF8,#6366F1)",
  team:      "linear-gradient(135deg,#34D399,#059669)",
  outsource: "linear-gradient(135deg,#8B5CF6,#3B82F6)",
  launch:    "linear-gradient(135deg,#F59E0B,#EF4444)",
};

const INITIAL_SIZE = 9;
const PAGE_SIZE = 6;

export default function InsightPageClient({ initialItems }: { initialItems: InsightItem[] }) {
  const [active, setActive] = useState("전체");
  const [visibleCount, setVisibleCount] = useState(INITIAL_SIZE);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setVisibleCount(INITIAL_SIZE); }, [active]);

  const filtered = active === "전체"
    ? initialItems
    : initialItems.filter((i) => (i.category ?? "") === active);

  const [featured, ...rest] = filtered;
  const visible = rest.slice(0, visibleCount);
  const hasMore = visibleCount < rest.length;

  useEffect(() => {
    if (!hasMore) return;
    let triggered = false;
    const onScroll = () => {
      if (triggered) return;
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 600) {
        triggered = true;
        setLoading(true);
        setTimeout(() => {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, rest.length));
          setLoading(false);
          triggered = false;
        }, 600);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, rest.length]);

  const activeCat = CATEGORIES.find((c) => c.value === active) ?? CATEGORIES[0];

  return (
    <div style={{ background: "var(--bg)", color: "var(--fg-1)", minHeight: "100dvh" }}>
      <WhiteBackground />
      <SiteHeader forceLight current="Insight" />

      <div className="ins-layout">
        {/* ── 사이드바 ── */}
        <aside className="ins-sidebar">
          <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {CATEGORIES.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setActive(value)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "9px 14px",
                  borderRadius: 9,
                  border: "none",
                  background: active === value ? "rgba(10,10,10,.07)" : "transparent",
                  font: `${active === value ? "600" : "400"} 15px/1.3 var(--font-sans)`,
                  color: active === value ? "#0a0a0a" : "rgba(10,10,10,.48)",
                  cursor: "pointer",
                  transition: "background .15s, color .15s",
                }}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── 모바일 탭 ── */}
        <div className="ins-mobile-tabs">
          {CATEGORIES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActive(value)}
              style={{
                flexShrink: 0,
                padding: "7px 16px",
                borderRadius: 100,
                border: active === value ? "none" : "1px solid rgba(10,10,10,.14)",
                background: active === value ? "#0a0a0a" : "transparent",
                font: `${active === value ? "600" : "400"} 13px/1 var(--font-sans)`,
                color: active === value ? "#fff" : "rgba(10,10,10,.55)",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── 메인 ── */}
        <main className="ins-main">
          {/* 카테고리 헤더 */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{
              font: "700 clamp(28px,3vw,42px)/1.2 var(--font-sans)",
              letterSpacing: "-.03em",
              margin: "0 0 10px",
              color: "#0a0a0a",
            }}>
              {activeCat.label === "전체" ? "Insight" : activeCat.label}
            </h1>
            <p style={{
              font: "400 15px/1.65 var(--font-sans)",
              color: "rgba(10,10,10,.5)",
              margin: 0,
            }}>
              {activeCat.desc}
            </p>
          </div>

          {/* 피처드 카드 */}
          {featured && <FeaturedCard item={featured} />}

          {/* 그리드 */}
          {visible.length > 0 && (
            <div className="ins-new-grid">
              {visible.map((it, i) => (
                <SmallCard key={it.id ?? i} item={it} />
              ))}
            </div>
          )}

          {/* 더보기 스피너 */}
          {loading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                border: "2px solid rgba(10,10,10,.12)",
                borderTopColor: "#0a0a0a",
                animation: "spin .7s linear infinite",
              }} />
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

/** body HTML에서 첫 번째 img src 추출 */
function getFirstBodyImage(body?: string): string | null {
  if (!body) return null;
  return body.match(/<img[^>]+src="([^"]+)"/i)?.[1] ?? null;
}

/* ── 피처드 카드 ──────────────────────────────────────────── */
function FeaturedCard({ item }: { item: InsightItem }) {
  const href = item.id ? `/insight/${item.slug || item.id}` : undefined;
  const imgSrc = getFirstBodyImage(item.body) ?? item.thumbImg ?? null;
  const catLabel = CATEGORY_LABEL[item.category ?? ""] ?? item.tag;
  const gradient = CATEGORY_GRADIENT[item.category ?? ""] ?? "linear-gradient(135deg,#38BDF8,#6366F1)";

  return (
    <a
      href={href}
      onClick={() => { if (item.url) recordInsightClick(item.title); }}
      className="ins-featured-card"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {/* 왼쪽: 텍스트 */}
      <div style={{
        background: "var(--grey-100)",
        padding: "32px 40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 16,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{
              font: "600 12px/1 var(--font-sans)",
              color: "rgba(10,10,10,.45)",
              letterSpacing: ".04em",
            }}>
              {catLabel}
            </span>
            <h2 style={{
              font: "700 clamp(20px,2.2vw,30px)/1.35 var(--font-sans)",
              letterSpacing: "-.025em",
              color: "#0a0a0a",
              margin: 0,
            }}>
              {item.title}
            </h2>
          </div>
          {item.excerpt && (
            <p style={{
              font: "400 14px/1.65 var(--font-sans)",
              color: "rgba(10,10,10,.55)",
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
            }}>
              {item.excerpt}
            </p>
          )}
        </div>
        <span style={{
          font: "400 13px/1 var(--font-sans)",
          color: "rgba(10,10,10,.38)",
        }}>
          {item.date}
        </span>
      </div>

      {/* 오른쪽: 이미지 — stretch로 카드 높이에 맞춤, cover로 꽉 채움 */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        background: "var(--grey-200)",
      }}>
        {imgSrc && (
          <img src={imgSrc} alt="" style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }} />
        )}
      </div>
    </a>
  );
}

/* ── 작은 그리드 카드 ──────────────────────────────────────── */
function SmallCard({ item }: { item: InsightItem }) {
  const href = item.id ? `/insight/${item.slug || item.id}` : undefined;
  const imgSrc = getFirstBodyImage(item.body) ?? item.thumbImg ?? null;
  const catLabel = CATEGORY_LABEL[item.category ?? ""] ?? item.tag;
  const gradient = CATEGORY_GRADIENT[item.category ?? ""] ?? "linear-gradient(135deg,#38BDF8,#6366F1)";

  return (
    <a
      href={href}
      onClick={() => { if (item.url) recordInsightClick(item.title); }}
      className="ins-small-card"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {/* 썸네일 — 비율 고정 없이 이미지 원본 비율 그대로 */}
      <div className="ins-thumb" style={{ background: gradient, flexShrink: 0 }}>
        {imgSrc
          ? <img src={imgSrc} alt="" />
          : <div style={{ height: 180 }} />
        }
      </div>

      {/* 텍스트 */}
      <div style={{
        padding: "14px 0 0",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}>
        {/* 제목 */}
        <h3 style={{
          font: "700 17px/1.45 var(--font-sans)",
          letterSpacing: "-.02em",
          color: "#0a0a0a",
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical" as const,
          overflow: "hidden",
        }}>
          {item.title}
        </h3>
        {/* 요약 */}
        {item.excerpt && (
          <p style={{
            font: "400 13px/1.65 var(--font-sans)",
            color: "rgba(10,10,10,.5)",
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
          }}>
            {item.excerpt}
          </p>
        )}
        {/* 날짜 · 카테고리 */}
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          font: "400 12px/1 var(--font-sans)",
          color: "rgba(10,10,10,.35)",
        }}>
          {item.date}
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(10,10,10,.25)", flexShrink: 0, display: "inline-block" }} />
          {catLabel}
        </span>
      </div>
    </a>
  );
}
