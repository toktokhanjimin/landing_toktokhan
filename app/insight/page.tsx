"use client";

import { useState, useEffect, CSSProperties } from "react";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import { getInsights, recordInsightClick, type InsightItem } from "../lib/store";

const TAGS = ["전체", "기술 블로그", "링크드인"];
const INITIAL_SIZE = 10;
const PAGE_SIZE = 6;

export default function InsightPage() {
  const [active, setActive] = useState("전체");
  const [allItems, setAllItems] = useState<InsightItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_SIZE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAllItems(getInsights());
    const prev = document.body.style.background;
    document.body.style.background = "#ffffff";
    return () => { document.body.style.background = prev; };
  }, []);

  // 필터 바뀌면 표시 개수 초기화
  useEffect(() => { setVisibleCount(INITIAL_SIZE); }, [active]);

  const filtered = active === "전체" ? allItems : allItems.filter((i) => i.tag === active);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // 스크롤 기반 무한 로드
  useEffect(() => {
    if (!hasMore) return;
    let triggered = false;
    const onScroll = () => {
      if (triggered) return;
      const scrollBottom = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 600) {
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

  const chip = (on: boolean): CSSProperties => ({
    font: "500 14px/1 var(--font-sans)",
    padding: "10px 16px",
    borderRadius: "var(--r-sm)",
    border: on ? "1px solid #0a0a0a" : "1px solid rgba(10,10,10,.14)",
    background: on ? "var(--bg-dark)" : "transparent",
    color: on ? "var(--fg-on-dark-1)" : "rgba(10,10,10,.7)",
    cursor: "pointer",
  });

  return (
    <div style={{ background: "var(--bg)", color: "var(--fg-1)", minHeight: "100dvh" }}>
      <SiteHeader forceLight current="Insight" />

      <style>{`
        .ins-card h3 { transition: color .45s cubic-bezier(.4,0,.2,1); }
        .ins-card:hover h3 { color: #00B7FF !important; }
        .ins-thumb { transition: transform .5s cubic-bezier(.4,0,.2,1); }
        .ins-card:hover .ins-thumb { transform: scale(.97); }
      `}</style>

      {/* Hero */}
      <header className="ins-page-header page-hero-header" style={{
        padding: "180px 24px 80px",
        maxWidth: 1248,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}>
        <h1 style={{
          font: "700 clamp(32px,4.4vw,60px)/1.24 var(--font-sans)",
          letterSpacing: "-.03em",
          margin: 0,
          color: "var(--fg-1)",
        }}>
          Insight
        </h1>
        <p style={{
          font: "var(--body-lg)",
          color: "rgba(10,10,10,.6)",
          maxWidth: 620,
          margin: 0,
        }}>
          AX · AI를 만들며 배운 것들과, 일하는 방식에 대한 짧은 글들.<br />
          기술 블로그와 링크드인에서 가져왔어요.
        </p>
      </header>

      {/* Archive */}
      <section className="ins-page-section" style={{ padding: "0 24px 120px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 48, flexWrap: "wrap", alignItems: "center" }}>
            {TAGS.map((t) => (
              <button key={t} style={chip(active === t)} onClick={() => setActive(t)}>
                {t}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="ins-page-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            rowGap: 0,
          }}>
            {visible.map((it, i) => (
              <InsightCard key={i} item={it} />
            ))}
          </div>

          {loading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                border: "2px solid rgba(10,10,10,.12)",
                borderTopColor: "#0a0a0a",
                animation: "spin .7s linear infinite",
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function InsightCard({ item }: { item: InsightItem }) {
  return (
    <a
      className="ins-card"
      href={item.url || undefined}
      target={item.url ? "_blank" : undefined}
      rel={item.url ? "noopener noreferrer" : undefined}
      onClick={() => { if (item.url) recordInsightClick(item.title); }}
      style={{
        display: "grid",
        gridTemplateColumns: "100px 1fr",
        gap: 20,
        alignItems: "center",
        cursor: item.url ? "pointer" : "default",
        textDecoration: "none",
        color: "inherit",
        padding: "20px 0",
        borderBottom: "1px solid rgba(10,10,10,.07)",
      }}
    >
      <div className="ins-thumb" style={{
        width: 100,
        height: 100,
        borderRadius: "var(--r-md)",
        background: item.thumb,
        flexShrink: 0,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,.08)",
        position: "relative",
      }}>
        {(() => {
          const cat = item.category ?? item.tag;
          const src = item.thumbImg?.startsWith("data:") ? item.thumbImg
            : ["log", "talk", "tech"].includes(cat) ? `/assets/${cat}.png`
            : null;
          return src ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : null;
        })()}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
        <h3 style={{
          font: "var(--h6)",
          letterSpacing: "-.01em",
          color: "var(--fg-1)",
          margin: 0,
          whiteSpace: "pre-line",
        }}>
          {item.title}
        </h3>
        <p className="ins-excerpt" style={{
          font: "400 14px/1.6 var(--font-sans)",
          color: "rgba(10,10,10,.6)",
          margin: 0,
        }}>
          {item.excerpt}
        </p>
        <div style={{
          display: "flex",
          gap: 14,
          marginTop: "auto",
          font: "500 12px/1 var(--font-sans)",
          color: "rgba(10,10,10,.45)",
          paddingTop: 8,
        }}>
          <span style={{ color: "rgba(10,10,10,.7)" }}>{item.tag}</span>
          <span>·</span>
          <span>{item.date}</span>
        </div>
      </div>
    </a>
  );
}
