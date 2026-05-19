"use client";

import { useRef, useState, useEffect } from "react";

type Tile = {
  h: number;
  bg: string;
  border?: boolean;
};

const cols: { speed: number; tiles: Tile[] }[] = [
  { speed: 120, tiles: [
    { h: 260, bg: "linear-gradient(135deg,#ffe4c2,#ffb873)" },
    { h: 340, bg: "#0a0a0a" },
    { h: 220, bg: "linear-gradient(135deg,#ffd6ea,#ff9fcd)" },
    { h: 300, bg: "linear-gradient(135deg,#f2b88a,#e07a3a)" },
  ]},
  { speed: 180, tiles: [
    { h: 380, bg: "#101b2c" },
    { h: 260, bg: "#f6f6f4" },
    { h: 300, bg: "linear-gradient(135deg,#fff4c9,#ffe07a)" },
    { h: 240, bg: "#1b1c1d" },
  ]},
  { speed: 60, tiles: [
    { h: 300, bg: "linear-gradient(135deg,#e3e9ff,#b9c7ff)" },
    { h: 260, bg: "#ff6b35" },
    { h: 340, bg: "linear-gradient(135deg,#aaeccb,#3fbd88)" },
    { h: 220, bg: "#2b2b2b" },
  ]},
  { speed: 220, tiles: [
    { h: 360, bg: "linear-gradient(180deg,#2b2533,#5e3e6b)" },
    { h: 260, bg: "#f2d745" },
    { h: 280, bg: "#ece3d1" },
    { h: 240, bg: "#1a1a1a" },
  ]},
  { speed: 100, tiles: [
    { h: 280, bg: "#eeeeee" },
    { h: 320, bg: "linear-gradient(135deg,#ff7a59,#b33a7a)" },
    { h: 240, bg: "#f7e8d4" },
    { h: 300, bg: "#111" },
  ]},
  { speed: 160, tiles: [
    { h: 340, bg: "linear-gradient(135deg,#5DD3FF,#00B7FF)" },
    { h: 260, bg: "#0a0a0a" },
    { h: 280, bg: "linear-gradient(135deg,#d6f0e8,#8dc8b5)" },
    { h: 240, bg: "#fff", border: true },
  ]},
];

export default function PortfolioWall() {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const docTop = rect.top + window.scrollY;
      const start = Math.max(0, docTop - vh);
      const end = docTop;
      const t = Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(1, end - start)));
      setP(t);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  return (
    <section ref={ref} style={{ position: "relative", background: "#0a0a0a", overflow: "hidden", height: "92vh", minHeight: 640, marginBottom: 20 }} aria-hidden="true">
      <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, padding: "60px 14px 0" }}>
        {cols.map((c, ci) => {
          const y = -c.speed * Math.max(0, p);
          return (
            <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 14, willChange: "transform", transform: `translate3d(0, ${y}px, 0)` }}>
              {c.tiles.map((t, ti) => (
                <div
                  key={ti}
                  style={{
                    borderRadius: 14, overflow: "hidden",
                    height: t.h, background: t.bg,
                    border: t.border ? "1px solid rgba(0,0,0,.08)" : "none",
                    boxShadow: "0 12px 28px rgba(0,0,0,.18)",
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 140, background: "linear-gradient(0deg,#0a0a0a,rgba(10,10,10,0))", zIndex: 4, pointerEvents: "none" }} />
    </section>
  );
}
