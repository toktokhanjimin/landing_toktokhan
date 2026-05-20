"use client";

import { useState, useEffect } from "react";
import { getWork, type WorkItem } from "../lib/store";

const STYLE = `
.wg-card .wg-thumb { transition: transform .55s cubic-bezier(.4,0,.2,1); }
.wg-card:hover .wg-thumb { transform: scale(1.05) !important; }
.wg-card .wg-overlay { opacity: 0; transition: opacity .35s ease; }
.wg-card:hover .wg-overlay { opacity: 1; }
.wg-card .wg-info { opacity: 0; transform: translateY(10px); transition: opacity .35s ease, transform .35s ease; }
.wg-card:hover .wg-info { opacity: 1; transform: translateY(0); }
`;

export default function WorkGrid() {
  const [items, setItems] = useState<WorkItem[]>([]);

  useEffect(() => {
    const all = getWork();
    setItems(all.filter((it) => it.featured).slice(0, 6));
  }, []);

  if (items.length === 0) return null;

  return (
    <section style={{ background: "transparent", color: "#0a0a0a", padding: "50px 24px 120px" }}>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, gridAutoRows: "320px" }}>
          {items.map((it) => (
            <a
              key={it.id}
              href={`/work/${it.id}`}
              className="wg-card"
              style={{ background: it.bg, borderRadius: 18, overflow: "hidden", position: "relative", cursor: "pointer", textDecoration: "none", display: "block" }}
            >
              {/* 이미지 */}
              {it.thumbImg && (
                <img
                  src={it.thumbImg}
                  alt=""
                  className="wg-thumb"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              )}
              {!it.thumbImg && (
                <div className="wg-thumb" style={{ position: "absolute", inset: 0 }} />
              )}

              {/* 호버 그라디언트 오버레이 */}
              <div
                className="wg-overlay"
                style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.72) 0%, rgba(0,0,0,.18) 50%, transparent 100%)", borderRadius: 18 }}
              />

              {/* 텍스트 */}
              <div
                className="wg-info"
                style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 24px 22px" }}
              >
                <div style={{ font: "700 15px/1 var(--font-sans)", letterSpacing: ".02em", color: "#fff" }}>{it.client}</div>
                <div style={{ font: "500 12px/1 var(--font-sans)", color: "rgba(255,255,255,.65)", marginTop: 6 }}>{it.tag}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
