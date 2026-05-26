"use client";

import { useState, useEffect } from "react";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import FilterChip from "../components/ui/FilterChip";
import { getWork, type WorkItem } from "../lib/store";

const CATEGORIES = ["전체", "AX", "AI", "Ops"];

export default function WorkPage() {
  const [active, setActive] = useState("전체");
  const [items, setItems] = useState<WorkItem[]>([]);

  useEffect(() => {
    setItems(getWork());
    const prev = document.body.style.background;
    document.body.style.background = "#ffffff";
    return () => { document.body.style.background = prev; };
  }, []);
  const filtered = active === "전체" ? items : items.filter((i) => i.category === active);

  return (
    <div style={{ background: "var(--bg)", color: "var(--fg-1)", minHeight: "100dvh" }}>
      <style>{`
        .wk-card .wk-thumb { transition: transform .55s cubic-bezier(.4,0,.2,1); }
        .wk-card:hover .wk-thumb { transform: scale(1.05) !important; }
        .wk-card .wk-overlay { opacity: 0; transition: opacity .35s ease; }
        .wk-card:hover .wk-overlay { opacity: 1; }
        .wk-card .wk-info { opacity: 0; transform: translateY(10px); transition: opacity .35s ease, transform .35s ease; }
        .wk-card:hover .wk-info { opacity: 1; transform: translateY(0); }
      `}</style>
      <SiteHeader forceLight current="Work" />

      {/* Page hero */}
      <header className="wk-header page-hero-header" style={{
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
          Work
        </h1>
        <p style={{
          font: "var(--body-lg)",
          color: "rgba(10,10,10,.6)",
          maxWidth: 620,
          margin: 0,
        }}>
          고객사와 함께 만든 AX · AI · Ops 프로젝트들.<br />
          각 작업은 우리의 일하는 방식이 남긴 기록이에요.
        </p>
      </header>

      {/* Work grid */}
      <section style={{ padding: "0 24px 120px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 48, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => (
              <FilterChip key={c} active={active === c} onClick={() => setActive(c)}>
                {c}
              </FilterChip>
            ))}
          </div>

          {/* Grid */}
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
            <div className="wk-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}>
              {filtered.map((it) => (
                <WorkCard key={it.id} item={it} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function WorkCard({ item }: { item: WorkItem }) {
  return (
    <a
      href={`/work/${item.id}`}
      className="wk-card"
      style={{
        borderRadius: "var(--r-lg)",
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        display: "block",
        aspectRatio: "5/4",
        background: item.bg,
        textDecoration: "none",
      }}
    >
      {/* 이미지 */}
      {item.thumbImg && (
        <img
          src={item.thumbImg}
          alt=""
          className="wk-thumb"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      )}

      {/* 호버 그라디언트 */}
      <div
        className="wk-overlay"
        style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.72) 0%, rgba(0,0,0,.18) 50%, transparent 100%)" }}
      />

      {/* 텍스트 — 호버 시 등장 */}
      <div
        className="wk-info"
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 24px 22px" }}
      >
        <div style={{ font: "700 15px/1 var(--font-sans)", letterSpacing: ".02em", color: "var(--fg-on-dark-1)" }}>
          {item.client}
        </div>
        <div style={{ font: "500 12px/1 var(--font-sans)", color: "rgba(255,255,255,.65)", marginTop: 6 }}>
          {item.tag}
        </div>
      </div>
    </a>
  );
}
