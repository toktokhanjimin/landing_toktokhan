"use client";

import { useState, useEffect, useRef } from "react";
import { getWork, type WorkItem } from "../lib/store";
import Button from "./ui/Button";

const STYLE = `
.wg-card .wg-thumb { transition: transform .55s cubic-bezier(.4,0,.2,1); }
.wg-card:hover .wg-thumb { transform: scale(1.05) !important; }
.wg-card .wg-overlay { opacity: 0; transition: opacity .35s ease; }
.wg-card:hover .wg-overlay { opacity: 1; }
.wg-card .wg-info { opacity: 0; transform: translateY(10px); transition: opacity .35s ease, transform .35s ease; }
.wg-card:hover .wg-info { opacity: 1; transform: translateY(0); }
.wg-card { opacity: 0; transform: translateY(28px); transition: opacity .6s ease, transform .6s cubic-bezier(.2,.7,.2,1); }
.wg-card.is-visible { opacity: 1; transform: translateY(0); }
`;

export default function WorkGrid() {
  const [items, setItems] = useState<WorkItem[]>([]);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const all = getWork();
    setItems(all.filter((it) => it.featured).slice(0, 6));
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          const idx = parseInt(el.dataset.idx || "0");
          setTimeout(() => el.classList.add("is-visible"), idx * 80);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -60px 0px" });
    cardRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <section style={{ background: "transparent", color: "var(--fg-1)", padding: "80px 24px 120px" }}>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 48, flexWrap: "wrap", gap: 24 }}>
          <div>
            <h2 className="section-title" style={{ maxWidth: 680, color: "var(--fg-1)" }}>
              그동안 쌓아온 프로젝트로<br />만든 우리만의 노하우
            </h2>
          </div>
          <Button variant="outline" href="/work">
            포트폴리오 보기 →
          </Button>
        </div>

        <div className="wg-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, gridAutoRows: "320px" }}>
          {items.map((it, i) => (
            <a
              key={it.id}
              href={`/work/${it.id}`}
              className="wg-card"
              ref={(el) => { cardRefs.current[i] = el; }}
              data-idx={i}
              style={{ background: it.bg, borderRadius: "var(--r-lg)", overflow: "hidden", position: "relative", cursor: "pointer", textDecoration: "none", display: "block" }}
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
                style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.72) 0%, rgba(0,0,0,.18) 50%, transparent 100%)", borderRadius: "var(--r-lg)" }}
              />

              {/* 텍스트 */}
              <div
                className="wg-info"
                style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 24px 22px" }}
              >
                <div style={{ font: "700 15px/1 var(--font-sans)", letterSpacing: ".02em", color: "var(--fg-on-dark-1)" }}>{it.client}</div>
                <div style={{ font: "500 12px/1 var(--font-sans)", color: "rgba(255,255,255,.65)", marginTop: 6 }}>{it.tag}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
