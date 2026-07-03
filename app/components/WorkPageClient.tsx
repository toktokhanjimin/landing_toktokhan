"use client";

import { useState, useEffect } from "react";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import WhiteBackground from "./WhiteBackground";
import type { WorkItem } from "../lib/store";

const CATEGORIES = [
  { label: "전체",                value: "ALL",                     desc: "고객사와 함께 만든 AX · AI · Ops 프로젝트들. 각 작업은 우리의 일하는 방식이 남긴 기록이에요." },
  { label: "AI/AX",              value: "AI/AX",                   desc: "AI 전환(AX) 프로젝트들. 실제 업무 안에서 AI가 작동하도록 함께 설계했습니다." },
  { label: "Commerce",           value: "Commerce & Community",     desc: "커머스와 커뮤니티 플랫폼을 구축한 사례들입니다." },
  { label: "Entertainment & O2O",value: "Entertainment & O2O",      desc: "엔터테인먼트와 O2O 서비스를 함께 만든 사례들입니다." },
  { label: "NFT & Blockchain",   value: "NFT & Blockchain",         desc: "NFT · 블록체인 기반 서비스를 개발한 사례들입니다." },
  { label: "Finance",            value: "Finance",                  desc: "핀테크 · 금융 분야 서비스를 구축한 사례들입니다." },
  { label: "SaaS & Admin",       value: "SaaS&Admin",               desc: "SaaS 제품과 어드민 시스템을 만든 사례들입니다." },
  { label: "Brand Consulting",   value: "Brand Consulting",         desc: "브랜드 전략과 컨설팅 프로젝트들입니다." },
  { label: "ETC",                value: "ETC",                      desc: "그 외 다양한 분야의 프로젝트 사례들입니다." },
];

const INITIAL_SIZE = 9;
const PAGE_SIZE    = 6;

export default function WorkPageClient({ initialItems }: { initialItems: WorkItem[] }) {
  const [active, setActive]           = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(INITIAL_SIZE);
  const [loading, setLoading]         = useState(false);

  useEffect(() => { setVisibleCount(INITIAL_SIZE); }, [active]);

  const filtered =
    active === "ALL" ? initialItems : initialItems.filter((i) => i.category === active);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    if (!hasMore) return;
    let triggered = false;
    const onScroll = () => {
      if (triggered) return;
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 600) {
        triggered = true;
        setLoading(true);
        setTimeout(() => {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length));
          setLoading(false);
          triggered = false;
        }, 600);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, filtered.length]);

  const activeCat = CATEGORIES.find((c) => c.value === active) ?? CATEGORIES[0];

  return (
    <div style={{ background: "var(--bg)", color: "var(--fg-1)", minHeight: "100dvh" }}>
      <WhiteBackground />
      <SiteHeader forceLight current="Work" />

      <div className="ins-layout">

        {/* ── 데스크톱 사이드바 ── */}
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

        {/* ── 메인 콘텐츠 ── */}
        <main className="ins-main">

          {/* 카테고리 헤더 */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{
              font: "700 clamp(28px,3vw,42px)/1.2 var(--font-sans)",
              letterSpacing: "-.03em",
              margin: 0,
              color: "#0a0a0a",
            }}>
              {activeCat.label === "전체" ? "Work" : activeCat.label}
            </h1>
          </div>

          {filtered.length === 0 ? (
            <div style={{
              padding: "80px 24px",
              textAlign: "center",
              color: "rgba(10,10,10,.45)",
              font: "400 15px/1.6 var(--font-sans)",
            }}>
              해당 카테고리의 작업이 아직 없어요.
            </div>
          ) : (
            <div className="ins-new-grid">
              {visible.map((it) => (
                <SmallCard key={it.id} item={it} />
              ))}
            </div>
          )}

          {/* 무한스크롤 스피너 */}
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

/* ── 피처드 카드 ─────────────────────────────────────────── */
function FeaturedCard({ item }: { item: WorkItem }) {
  return (
    <div className="ins-featured-card">
      {/* 왼쪽: 텍스트 패널 */}
      <div style={{
        background: "var(--grey-100)",
        padding: "32px 40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 16,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{
            font: "600 12px/1 var(--font-sans)",
            color: "rgba(10,10,10,.45)",
            letterSpacing: ".04em",
          }}>
            {item.category ?? item.tag}
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

        {/* 하단 메타 */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ font: "400 13px/1 var(--font-sans)", color: "rgba(10,10,10,.38)" }}>
            {item.client}
          </span>
          {item.year && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(10,10,10,.25)", flexShrink: 0, display: "inline-block" }} />
              <span style={{ font: "400 13px/1 var(--font-sans)", color: "rgba(10,10,10,.38)" }}>
                {item.year}
              </span>
            </>
          )}
          {item.comingSoon && (
            <span style={{
              font: "600 11px/1 var(--font-sans)",
              letterSpacing: ".04em",
              color: "rgba(10,10,10,.45)",
              border: "1px solid rgba(10,10,10,.2)",
              padding: "3px 8px",
              borderRadius: 100,
              marginLeft: 4,
            }}>
              Coming Soon
            </span>
          )}
        </div>
      </div>

      {/* 오른쪽: 이미지 패널 */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        background: item.bg || "var(--grey-200)",
      }}>
        {item.thumbImg && (
          <img
            src={item.thumbImg}
            alt=""
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ── 작은 그리드 카드 ────────────────────────────────────── */
function SmallCard({ item }: { item: WorkItem }) {
  return (
    <a
      className="ins-small-card wk-small-card"
      href={item.id ? `/work/${item.slug || item.id}` : undefined}
      style={{ textDecoration: "none", color: "inherit", cursor: item.id ? "pointer" : "default" }}
    >
      {/* 썸네일 */}
      <div className="ins-thumb" style={{
        background: item.bg || "var(--grey-200)",
        position: "relative",
      }}>
        {item.thumbImg
          ? <img src={item.thumbImg} alt="" />
          : <div style={{ height: 200, background: item.bg || "var(--grey-200)" }} />
        }
        {item.comingSoon && (
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,.45)",
          }}>
            <span style={{
              font: "600 13px/1 var(--font-sans)",
              letterSpacing: ".04em",
              color: "#fff",
            }}>Coming Soon</span>
          </div>
        )}
      </div>

      {/* 텍스트 */}
      <div style={{
        padding: "14px 0 0",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}>
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
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          font: "400 12px/1 var(--font-sans)",
          color: "rgba(10,10,10,.35)",
        }}>
          {item.client}
          {item.year && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(10,10,10,.25)", flexShrink: 0, display: "inline-block" }} />
              {item.year}
            </>
          )}
        </span>
      </div>
    </a>
  );
}
