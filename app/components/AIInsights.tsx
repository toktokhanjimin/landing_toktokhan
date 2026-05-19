"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { getInsights, type InsightItem } from "../lib/store";

export default function AIInsights() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [items, setItems] = useState<InsightItem[]>([]);

  useEffect(() => {
    const all = getInsights();
    setItems(all.filter((it) => it.featured));
  }, []);

  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => { el.removeEventListener("scroll", updateButtons); window.removeEventListener("resize", updateButtons); };
  }, [updateButtons, items]);

  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.round(el.clientWidth * 0.7);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const arrowStyle = (enabled: boolean) => ({
    width: 52, height: 52, borderRadius: 999, border: "1px solid rgba(10,10,10,.14)",
    background: "transparent", color: enabled ? "#0a0a0a" : "rgba(10,10,10,.25)",
    cursor: enabled ? "pointer" : "default", display: "inline-flex", alignItems: "center", justifyContent: "center",
    transition: "background .2s, color .2s, border-color .2s", font: "400 18px/1 var(--font-sans)",
  } as React.CSSProperties);

  if (items.length === 0) return null;

  return (
    <section style={{ background: "transparent", color: "#0a0a0a", padding: "100px 24px 60px" }}>
      <style dangerouslySetInnerHTML={{ __html: `.insights-track::-webkit-scrollbar{display:none}.insights-track a h3{transition:color .45s cubic-bezier(.4,0,.2,1)}.insights-track a:hover h3{color:#00B7FF}.insights-track .ins-thumb{transition:transform .5s cubic-bezier(.4,0,.2,1)}.insights-track a:hover .ins-thumb{transform:scale(.97)}` }} />

      <div style={{ margin: "0 auto", maxWidth: 1200 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, marginBottom: 56 }}>
          <h2 style={{ font: "700 clamp(26px,2.8vw,42px)/1.24 var(--font-sans)", letterSpacing: "-.02em", margin: 0, color: "#0a0a0a" }}>
            우리의 일과 생각을<br />더 깊이 들여다보고 싶다면,
          </h2>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            <button style={arrowStyle(canPrev)} onClick={() => canPrev && scrollBy(-1)} aria-label="이전" disabled={!canPrev}>←</button>
            <button style={arrowStyle(canNext)} onClick={() => canNext && scrollBy(1)} aria-label="다음" disabled={!canNext}>→</button>
          </div>
        </div>
      </div>

      <div style={{ width: "100vw", marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}>
        <div
          ref={trackRef}
          className="insights-track"
          style={{ display: "grid", gridAutoFlow: "column", gridTemplateRows: "1fr 1fr", gridAutoColumns: "minmax(440px, 1fr)", columnGap: 56, rowGap: 64, overflowX: "auto", paddingLeft: "max(24px, calc((100vw - 1200px) / 2))", paddingRight: 24, paddingBottom: 24, scrollbarWidth: "none" }}
        >
          {items.map((it, idx) => (
            <a
              key={idx}
              href={it.url || undefined}
              target={it.url ? "_blank" : undefined}
              rel={it.url ? "noopener noreferrer" : undefined}
              style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 28, alignItems: "flex-start", cursor: it.url ? "pointer" : "default", textDecoration: "none", color: "inherit" }}
            >
              <div className="ins-thumb" style={{ width: 180, height: 180, borderRadius: 22, background: it.thumb, flexShrink: 0, overflow: "clip", transform: "translateZ(0)", WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}>
                {it.thumbImg && (
                  <img src={it.thumbImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 4 }}>
                <h3 style={{ font: "700 20px/1.4 var(--font-sans)", letterSpacing: "-.02em", color: "#0a0a0a", margin: 0, whiteSpace: "pre-line" }}>{it.title}</h3>
                <div style={{ display: "flex", gap: 18, font: "500 13px/1 var(--font-sans)", color: "rgba(10,10,10,.45)" }}>
                  <span style={{ color: "rgba(10,10,10,.7)" }}>{it.tag}</span>
                  <span>{it.date}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
