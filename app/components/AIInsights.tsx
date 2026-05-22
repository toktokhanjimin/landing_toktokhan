"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { getInsights, type InsightItem } from "../lib/store";
import Badge from "./ui/Badge";

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

  useEffect(() => {
    if (items.length === 0) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          const idx = parseInt(el.dataset.idx || "0");
          setTimeout(() => el.classList.add("ins-revealed"), idx * 70);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll<HTMLElement>(".ins-card-new").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.round(el.clientWidth * 0.55);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const arrowStyle = (enabled: boolean) => ({
    width: 48, height: 48, borderRadius: "var(--r-full)",
    border: "1px solid rgba(10,10,10,.14)",
    background: "transparent",
    color: enabled ? "var(--fg-1)" : "rgba(10,10,10,.25)",
    cursor: enabled ? "pointer" : "default",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    transition: "background .2s, color .2s",
    font: "400 16px/1 var(--font-sans)",
    flexShrink: 0,
  } as React.CSSProperties);

  if (items.length === 0) return null;

  return (
    <section style={{ background: "transparent", color: "var(--fg-1)", padding: "100px 0 80px" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .insights-track { -ms-overflow-style:none; scrollbar-width:none; }
        .insights-track::-webkit-scrollbar { display:none; }
        .ins-card-new { opacity:0; transform:translateY(20px); transition:opacity .55s ease, transform .55s cubic-bezier(.2,.7,.2,1); }
        .ins-card-new.ins-revealed { opacity:1; transform:translateY(0); }
        .ins-card-new:hover .ins-card-img { transform:scale(1.03); }
        .ins-card-img { transition:transform .5s cubic-bezier(.4,0,.2,1); }
      `}} />

      {/* Header */}
      <div className="insights-header" style={{ padding: "0 max(24px, calc((100vw - 1200px) / 2))", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56 }}>
        <h2 className="section-title" style={{ color: "var(--fg-1)" }}>
          우리의 일과 생각을<br />더 깊이 들여다보고 싶다면,
        </h2>
        <div style={{ display: "flex", gap: 10, flexShrink: 0, paddingTop: 4 }}>
          <button style={arrowStyle(canPrev)} onClick={() => canPrev && scrollBy(-1)} aria-label="이전" disabled={!canPrev}>←</button>
          <button style={arrowStyle(canNext)} onClick={() => canNext && scrollBy(1)} aria-label="다음" disabled={!canNext}>→</button>
        </div>
      </div>

      {/* Track */}
      <div style={{ width: "100vw", marginLeft: "calc(50% - 50vw)", overflow: "hidden" }}>
        <div
          ref={trackRef}
          className="insights-track"
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            overflowY: "hidden",
            paddingLeft: "max(24px, calc((100vw - 1200px) / 2))",
            paddingRight: 48,
            paddingBottom: 8,
            alignItems: "stretch",
          }}
        >
          {items.map((it, idx) => {
            const cat = it.category ?? it.tag;
            const src = it.thumbImg?.startsWith("data:") ? it.thumbImg
              : ["log", "talk", "tech"].includes(cat) ? `/assets/${cat}.png`
              : null;
            return (
              <a
                key={idx}
                className="ins-card-new"
                data-idx={idx}
                href={it.url || undefined}
                target={it.url ? "_blank" : undefined}
                rel={it.url ? "noopener noreferrer" : undefined}
                style={{
                  flexShrink: 0,
                  width: 320,
                  borderRadius: "var(--r-xl)",
                  background: "#f4f4f5",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  color: "inherit",
                  cursor: it.url ? "pointer" : "default",
                }}
              >
                {/* Text area */}
                <div style={{ padding: "24px 24px 60px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                  <Badge>{it.tag}</Badge>
                  <h3 style={{
                    font: "var(--h4)",
                    letterSpacing: "-.02em",
                    color: "var(--fg-1)",
                    margin: 0,
                    whiteSpace: "pre-line",
                  }}>{it.title}</h3>
                </div>
                {/* Image area */}
                <div style={{ width: "100%", height: 220, overflow: "hidden", flexShrink: 0, background: it.thumb }}>
                  {src && (
                    <img
                      className="ins-card-img"
                      src={src}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
