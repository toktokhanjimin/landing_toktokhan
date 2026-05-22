"use client";

import { CSSProperties, useEffect, useRef } from "react";

const items = [
  {
    kind: "fullstack",
    category: "Strategy",
    stat: "8–12주",
    statLabel: "진단부터 운영 안착까지",
    en: "설계",
    h: "복잡한 업무 흐름을 다시 봅니다",
    d: "반복되는 일, 병목이 생기는 지점, AI가 개입할 수 있는 구간을 찾아 조직에 맞는 AX 구조를 설계합니다.",
    bullets: ["업무 진단", "AI 역할 정의", "기존 시스템 연계 설계"],
  },
  {
    kind: "embedded",
    category: "Enablement",
    stat: "4주~",
    statLabel: "파일럿으로 빠르게 시작",
    en: "운영",
    h: "조직 안에서 작동하게 만듭니다",
    d: "설계한 방식이 실제 업무에 녹아들 수 있도록 AI 워크플로우, SOP, 교육 콘텐츠를 함께 구축합니다.",
    bullets: ["AI 워크플로우", "SOP 구축", "팀 교육"],
  },
  {
    kind: "proven",
    category: "Measurement",
    stat: "25–45%",
    statLabel: "파트 생산성 향상 실측",
    en: "검증",
    h: "효과를 숫자로 확인합니다",
    d: "생산성, 리드타임, 품질, 반복 업무 감소율을 측정하고 데이터를 바탕으로 다시 개선합니다.",
    bullets: ["성과 측정", "운영 리포트", "개선 사이클"],
  },
];


function CardIcon({ kind }: { kind: string }) {
  // 설계 — 시계
  if (kind === "fullstack") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    );
  }
  // 운영 — 방패
  if (kind === "embedded") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l8 3.5v5c0 4.5-3.5 7.5-8 9-4.5-1.5-8-4.5-8-9v-5L12 3z" />
      </svg>
    );
  }
  // 검증 — 체크 원
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </svg>
  );
}

export default function Services() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add("svc-revealed");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -60px 0px" });
    cardRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="svc-section" style={{ background: "transparent", color: "var(--fg-on-dark-1)", padding: "20px 24px 90px" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .svc-card { opacity: 0; transform: translateY(28px); }
        .svc-card.svc-revealed { opacity: 1; transform: translateY(0); }
        .svc-card:hover { transform: translateY(-4px) !important; }
      ` }} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="svc-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {items.map((it, i) => (
            <div
              key={it.kind}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="svc-card"
              style={{
                position: "relative",
                background: "#252528",
                borderRadius: "var(--r-xl)",
                padding: "28px 28px 32px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 1px 0 rgba(255,255,255,.03) inset",
                transition: `opacity .6s ease ${i * 0.12}s, transform .6s cubic-bezier(.2,.7,.2,1) ${i * 0.12}s`,
              }}
            >
              {/* Top: icon only */}
              <div style={{ marginBottom: "auto" }}>
                <CardIcon kind={it.kind} />
              </div>

              {/* Bottom: title + description */}
              <div style={{ marginTop: 60 }}>
                <div style={{
                  font: "var(--h3)",
                  letterSpacing: "-.04em",
                  color: "var(--fg-on-dark-1)",
                  marginBottom: 16,
                }}>
                  {it.en}
                </div>
                <p style={{ font: "400 14px/1.65 var(--font-sans)", color: "rgba(255,255,255,.55)", margin: 0 }}>
                  {it.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
