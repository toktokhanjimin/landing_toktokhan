"use client";

import { useRef, useState, useEffect } from "react";

export default function TeamReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (el) {
      el.style.setProperty("padding-top", "0px", "important");
      el.style.setProperty("padding-bottom", "0px", "important");
    }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const distance = vh * 0.5;
        const fromTop = vh - r.top;
        const p = Math.max(0, Math.min(1, fromTop / distance));
        setProgress(p);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const open = progress;
  const eased = open < 0.5
    ? 4 * open * open * open
    : 1 - Math.pow(-2 * open + 2, 3) / 2;

  const startInsetX = 35;
  const insetX = startInsetX * (1 - eased);

  return (
    <section ref={sectionRef} className="no-px" style={{ position: "relative", height: "calc(56vh + 90px)", background: "transparent" }}>
      <div style={{ position: "relative", top: 0, height: "100%", width: "100%", overflow: "hidden", background: "transparent", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 60 }}>
        <div style={{
          position: "relative", width: "100%", height: "calc(56vh - 40px)", overflow: "hidden",
          clipPath: `inset(50px ${insetX}vw 30px)`,
          WebkitClipPath: `inset(50px ${insetX}vw 30px)` as string,
          willChange: "clip-path",
        }}>
          <img
            src="/assets/team-office.png"
            alt="똑똑한개발자 팀"
            style={{ position: "absolute", top: -20, left: 0, right: 0, bottom: 0, width: "100%", height: "calc(100% + 20px)", objectFit: "cover", objectPosition: "center 22%", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.10) 50%, rgba(0,0,0,0.05) 100%)", pointerEvents: "none" }} />
          <h2 style={{
            position: "absolute", inset: 0, margin: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.35,
            color: "var(--fg-on-dark-1)", textAlign: "center", textShadow: "0 2px 24px rgba(0,0,0,0.35)",
            opacity: Math.min(1, eased * 1.4),
            transform: `translateY(${(1 - Math.min(1, eased * 1.4)) * 12}px)`,
            pointerEvents: "none",
          }}>
            사람은 문제에<br />더 가까워질 수 있도록
          </h2>
        </div>
      </div>
    </section>
  );
}
