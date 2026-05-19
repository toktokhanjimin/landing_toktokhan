"use client";

import { useState, useEffect } from "react";
import { getWork, type WorkItem } from "../lib/store";

const spans = [
  { gc: "span 5", gr: "span 2" }, { gc: "span 4", gr: "span 2" }, { gc: "span 3", gr: "span 2" },
  { gc: "span 4", gr: "span 2" }, { gc: "span 4", gr: "span 2" }, { gc: "span 4", gr: "span 2" },
];

export default function WorkGrid() {
  const [items, setItems] = useState<WorkItem[]>([]);

  useEffect(() => {
    const all = getWork();
    setItems(all.filter((it) => it.featured).slice(0, 6));
  }, []);

  if (items.length === 0) return null;

  return (
    <section style={{ background: "transparent", color: "#0a0a0a", padding: "50px 24px 120px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 48, flexWrap: "wrap", gap: 24 }}>
          <div>
            <h2 style={{ font: "700 clamp(26px,2.8vw,42px)/1.24 var(--font-sans)", letterSpacing: "-.02em", margin: 0, maxWidth: 680, color: "#0a0a0a" }}>
              그동안 쌓아온 프로젝트로<br />만든 우리만의 노하우
            </h2>
          </div>
          <a href="/work" style={{ font: "500 14px/1 var(--font-sans)", color: "#0a0a0a", padding: "10px 16px", borderRadius: 10, background: "#fff", border: "1px solid rgba(10,10,10,.12)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
            전체 작업 보기 →
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 16, gridAutoRows: "minmax(220px,auto)" }}>
          {items.map((it, i) => (
            <a
              key={it.id}
              href={`/work/${it.id}`}
              style={{ gridColumn: spans[i]?.gc ?? "span 4", gridRow: spans[i]?.gr ?? "span 2", background: it.bg, borderRadius: 18, overflow: "hidden", position: "relative", cursor: "pointer", textDecoration: "none" }}
              onMouseEnter={(e) => { const thumb = e.currentTarget.querySelector<HTMLElement>(".wg-thumb"); if (thumb) thumb.style.transform = "scale(.97)"; }}
              onMouseLeave={(e) => { const thumb = e.currentTarget.querySelector<HTMLElement>(".wg-thumb"); if (thumb) thumb.style.transform = "scale(1)"; }}
            >
              <div style={{ width: "100%", height: "100%", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div className="wg-thumb" style={{ alignSelf: "center", width: "60%", height: "60%", background: "rgba(255,255,255,.12)", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,.3)", border: "1px solid rgba(255,255,255,.08)", transition: "transform .5s cubic-bezier(.4,0,.2,1)" }} />
                <div>
                  <div style={{ font: "700 14px/1 var(--font-sans)", letterSpacing: ".04em", color: "#fff" }}>{it.client}</div>
                  <div style={{ font: "500 12px/1 var(--font-mono)", color: "rgba(255,255,255,.6)", marginTop: 6 }}>{it.tag}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
