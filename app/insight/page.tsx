"use client";

import { useState, useEffect, CSSProperties } from "react";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import { getInsights, type InsightItem } from "../lib/store";

const TAGS = ["전체", "기술 블로그", "링크드인"];

export default function InsightPage() {
  const [active, setActive] = useState("전체");
  const [items, setItems] = useState<InsightItem[]>([]);

  useEffect(() => {
    setItems(getInsights());
    const prev = document.body.style.background;
    document.body.style.background = "#ffffff";
    return () => { document.body.style.background = prev; };
  }, []);

  const filtered = active === "전체" ? items : items.filter((i) => i.tag === active);

  const chip = (on: boolean): CSSProperties => ({
    font: "500 14px/1 var(--font-sans)",
    padding: "10px 16px",
    borderRadius: 8,
    border: on ? "1px solid #0a0a0a" : "1px solid rgba(10,10,10,.14)",
    background: on ? "#0a0a0a" : "transparent",
    color: on ? "#fff" : "rgba(10,10,10,.7)",
    cursor: "pointer",
  });

  return (
    <div style={{ background: "#ffffff", color: "#0a0a0a", minHeight: "100dvh" }}>
      <SiteHeader forceLight current="Insight" />

      <style>{`
        .ins-card h3 { transition: color .45s cubic-bezier(.4,0,.2,1); }
        .ins-card:hover h3 { color: #00B7FF !important; }
        .ins-thumb { transition: transform .5s cubic-bezier(.4,0,.2,1); }
        .ins-card:hover .ins-thumb { transform: scale(.97); }
      `}</style>

      {/* Hero */}
      <header style={{
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
          color: "#0a0a0a",
        }}>
          Insight
        </h1>
        <p style={{
          font: "400 17px/1.6 var(--font-sans)",
          color: "rgba(10,10,10,.6)",
          maxWidth: 620,
          margin: 0,
        }}>
          AX · AI를 만들며 배운 것들과, 일하는 방식에 대한 짧은 글들.<br />
          기술 블로그와 링크드인에서 가져왔어요.
        </p>
      </header>

      {/* Archive */}
      <section style={{ padding: "0 24px 120px" }}>
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
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            columnGap: 56,
            rowGap: 56,
          }}>
            {filtered.map((it, i) => (
              <InsightCard key={i} item={it} />
            ))}
          </div>
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
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: 28,
        alignItems: "flex-start",
        cursor: item.url ? "pointer" : "default",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div className="ins-thumb" style={{
        width: 180,
        height: 180,
        borderRadius: 22,
        background: item.thumb,
        flexShrink: 0,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,.06)",
      }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
        <h3 style={{
          font: "600 18px/1.4 var(--font-sans)",
          letterSpacing: "-.01em",
          color: "#0a0a0a",
          margin: 0,
          whiteSpace: "pre-line",
        }}>
          {item.title}
        </h3>
        <p style={{
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
