"use client";

import { useEffect, useRef, useState, CSSProperties } from "react";

/* ── pixel colors (sindoh-style: teal, purple, blue, green, pink) ── */
const COLORS = ["#3a86ff", "#7209b7", "#06d6a0", "#4361ee", "#ff006e", "#00B7FF"];

/* ── deterministic pseudo-random from seed ── */
const rng = (s: number) => ((s * 1664525 + 1013904223) & 0x7fffffff) / 0x7fffffff;

const STYLE = `
@keyframes gw-rgb {
  0%,100% { text-shadow: none; transform: none; }
  15%      { text-shadow: -2px 0 #ff006e, 2px 0 #3a86ff; transform: translateX(-1px); }
  30%      { text-shadow:  2px 0 #ff006e,-2px 0 #3a86ff; transform: translateX(1px); }
  50%      { text-shadow: -1px 0 #3a86ff; transform: translateX(0); }
  70%      { text-shadow:  1px 0 #7209b7; transform: translateX(-1px); }
  85%      { text-shadow: -2px 0 #ff006e, 1px 0 #3a86ff; transform: translateX(1px); }
}
.gw-rgb { animation: gw-rgb 0.5s steps(1) both; }
`;

interface Pixel { x: number; y: number; w: number; h: number; color: string; opacity: number; }

const makePixels = (frame: number): Pixel[] =>
  Array.from({ length: 7 }, (_, i) => {
    const s = frame * 11 + i * 17;
    return {
      x:       rng(s)     * 88,
      y:       rng(s + 1) * 75,
      w:       3 + rng(s + 2) * 9,
      h:       2 + rng(s + 3) * 5,
      color:   COLORS[Math.floor(rng(s + 4) * COLORS.length)],
      opacity: 0.55 + rng(s + 5) * 0.45,
    };
  });

interface Props { children: string; style?: CSSProperties; delay?: number; }

export default function GlitchWord({ children, style, delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive]       = useState(false);
  const [frame,  setFrame]        = useState(0);
  const triggered                 = useRef(false);

  const trigger = () => {
    if (triggered.current) return;
    triggered.current = true;

    setActive(true);
    let f = 0;
    const iv = setInterval(() => {
      f++;
      setFrame(f);
      if (f >= 9) { setActive(false); clearInterval(iv); }
    }, 55);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(trigger, delay); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const pixels = active ? makePixels(frame) : [];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <span
        ref={ref}
        className={active ? "gw-rgb" : ""}
        style={{ position: "relative", display: "inline-block", ...style }}
      >
        {children}
        {pixels.map((p, i) => (
          <span key={i} style={{
            position:      "absolute",
            left:          `${p.x}%`,
            top:           `${p.y}%`,
            width:         p.w,
            height:        p.h,
            background:    p.color,
            opacity:       p.opacity,
            pointerEvents: "none",
            borderRadius:  1,
          }} />
        ))}
      </span>
    </>
  );
}
