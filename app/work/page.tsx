"use client";

import { useState, useEffect, CSSProperties } from "react";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
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
      <SiteHeader forceLight current="Work" />

      {/* Page hero */}
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
          Work
        </h1>
        <p style={{
          font: "400 17px/1.6 var(--font-sans)",
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
              <button key={c} style={chip(active === c)} onClick={() => setActive(c)}>
                {c}
              </button>
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
            <div style={{
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
      style={{
        borderRadius: 18,
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        aspectRatio: "5/4",
        background: item.bg,
        textDecoration: "none",
      }}
      onMouseEnter={(e) => { const t = e.currentTarget.querySelector<HTMLElement>(".wk-thumb"); if (t) t.style.transform = "scale(.97)"; }}
      onMouseLeave={(e) => { const t = e.currentTarget.querySelector<HTMLElement>(".wk-thumb"); if (t) t.style.transform = "scale(1)"; }}
    >
      <div style={{
        width: "100%",
        height: "100%",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}>
        <span style={{
          display: "inline-block",
          font: "500 11px/1 var(--font-mono, 'IBM Plex Mono',monospace)",
          letterSpacing: ".14em",
          padding: "5px 8px",
          borderRadius: 4,
          background: "rgba(255,255,255,.12)",
          color: "rgba(255,255,255,.85)",
          alignSelf: "flex-start",
        }}>
          {item.year}
        </span>

        <div className="wk-thumb" style={{
          alignSelf: "center",
          width: "55%",
          height: "55%",
          background: "rgba(255,255,255,.12)",
          borderRadius: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,.3)",
          border: "1px solid rgba(255,255,255,.08)",
          transition: "transform .5s cubic-bezier(.4,0,.2,1)",
        }} />

        <div>
          <div style={{ font: "700 15px/1 var(--font-sans)", letterSpacing: ".04em", color: "#fff" }}>
            {item.client}
          </div>
          <div style={{ font: "500 12px/1 var(--font-mono, 'IBM Plex Mono',monospace)", color: "rgba(255,255,255,.6)", marginTop: 6 }}>
            {item.tag}
          </div>
          <div style={{ font: "400 13px/1.5 var(--font-sans)", color: "rgba(255,255,255,.7)", marginTop: 10 }}>
            {item.desc}
          </div>
        </div>
      </div>
    </a>
  );
}
