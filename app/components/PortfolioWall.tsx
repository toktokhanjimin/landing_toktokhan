"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

type Tile = { h: number; src: string };

const imgs = Array.from({ length: 15 }, (_, i) => `/assets/p-${i + 1}.png`);
const p = (n: number) => imgs[(n - 1) % 15];

const cols: { speed: number; tiles: Tile[] }[] = [
  { speed: 120, tiles: [ { h: 260, src: p(1) }, { h: 340, src: p(2) }, { h: 220, src: p(3) }, { h: 300, src: p(4) } ] },
  { speed: 180, tiles: [ { h: 380, src: p(5) }, { h: 260, src: p(6) }, { h: 300, src: p(7) }, { h: 240, src: p(8) } ] },
  { speed: 60,  tiles: [ { h: 300, src: p(9) }, { h: 260, src: p(10) }, { h: 340, src: p(11) }, { h: 220, src: p(12) } ] },
  { speed: 220, tiles: [ { h: 360, src: p(13) }, { h: 260, src: p(14) }, { h: 280, src: p(15) }, { h: 240, src: p(1) } ] },
  { speed: 100, tiles: [ { h: 280, src: p(2) }, { h: 320, src: p(9) }, { h: 240, src: p(4) }, { h: 300, src: p(5) } ] },
  { speed: 160, tiles: [ { h: 340, src: p(6) }, { h: 260, src: p(7) }, { h: 280, src: p(8) }, { h: 240, src: p(9) } ] },
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
    <section ref={ref} className="no-px" style={{ position: "relative", background: "#0a0a0a", overflow: "hidden", height: "80vh", minHeight: 560, marginBottom: 20 }} aria-hidden="true">
      <style>{`@media(max-width:767px){.pw-grid{grid-template-columns:repeat(3,1fr)!important}.pw-grid>div:nth-child(n+4){display:none}.pw-tile{height:160px!important}}`}</style>
      <div className="pw-grid" style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, padding: "60px 10px 0" }}>
        {cols.map((c, ci) => {
          const y = -c.speed * Math.max(0, p);
          return (
            <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 14, willChange: "transform", transform: `translate3d(0, ${y}px, 0)` }}>
              {c.tiles.map((t, ti) => (
                <div
                  key={ti}
                  className="pw-tile"
                  style={{
                    borderRadius: "var(--r-md)", overflow: "hidden",
                    height: t.h, background: "#1a1a1a",
                    boxShadow: "0 12px 28px rgba(0,0,0,.18)",
                    flexShrink: 0, position: "relative",
                  }}
                >
                  <Image src={t.src} alt="" fill style={{ objectFit: "cover" }} sizes="20vw" />
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 220, background: "linear-gradient(180deg,#0a0a0a 40%,rgba(10,10,10,0))", zIndex: 4, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 140, background: "linear-gradient(0deg,#0a0a0a,rgba(10,10,10,0))", zIndex: 4, pointerEvents: "none" }} />
    </section>
  );
}
