"use client";

import { CSSProperties } from "react";

const items = [
  {
    kind: "fullstack",
    category: "Strategy",
    stat: "8–12주",
    statLabel: "진단부터 운영 안착까지",
    en: "설계",
    d: "조직이 매일 돌아가는 방식을 다시 짜요. 업무 흐름을 진단해 AI가 끼어들 지점을 정하고, 파트가 한 맥락으로 움직이는 OS를 설계해요.",
    bullets: ["현재 워크플로우 진단", "AI가 끼어들 지점 정하기", "파트별 OS 아키텍처", "성공 기준(KPI) 맞추기"],
  },
  {
    kind: "embedded",
    category: "Enablement",
    stat: "4주~",
    statLabel: "파일럿으로 빠르게 시작",
    en: "운영",
    d: "설계만으로는 바뀌지 않아요. 실무 교육으로 역량을 옮기고, SOP·거버넌스·툴체인을 조직 안에 심어서 AX가 매일 자연스럽게 작동하게 만들어요.",
    bullets: ["사내 AI 챔피언 기르기", "SOP·운영 매뉴얼 자리잡기", "툴체인·거버넌스 구축", "주간 운영 리듬 만들기"],
  },
  {
    kind: "proven",
    category: "Measurement",
    stat: "25–45%",
    statLabel: "파트 생산성 향상 실측",
    en: "검증",
    d: "감이 아니라 숫자로 확인해요. 생산성·품질·리드타임을 실측해서 효과를 확인하고, 그 데이터를 다음 설계에 다시 넘겨 OS가 스스로 진화하게 만들어요.",
    bullets: ["파트 생산성 25–45% 실측", "성과 모니터링 대시보드", "분기별 헬스 체크", "데이터를 다음 설계에 반영"],
  },
];


function CardIcon({ kind }: { kind: string }) {
  // 설계 — 5개 타원 링 공전
  if (kind === "fullstack") {
    const blobs = [
      { cx: 18, cy: 4,  r: 5.5, begin: "0s"    },
      { cx: 31, cy: 14, r: 4.5, begin: "-1.2s" },
      { cx: 26, cy: 29, r: 5,   begin: "-2.4s" },
      { cx: 10, cy: 29, r: 4.5, begin: "-3.6s" },
      { cx: 5,  cy: 14, r: 5,   begin: "-4.8s" },
    ];
    return (
      <div style={{ width: 24, height: 24, overflow: "visible" }}>
        <svg width="24" height="24" viewBox="0 0 36 36" fill="none" overflow="visible">
          {blobs.map((b, i) => (
            <ellipse key={i} cx={b.cx} cy={b.cy} rx={b.r} ry={b.r * 0.85} fill="rgba(255,255,255,.88)">
              <animateTransform attributeName="transform" type="rotate"
                from="0 18 18" to="360 18 18"
                dur="6s" begin={b.begin} repeatCount="indefinite" />
            </ellipse>
          ))}
        </svg>
      </div>
    );
  }
  // 운영 — 유기적 blob 모핑
  if (kind === "embedded") {
    return (
      <div style={{ width: 24, height: 24, overflow: "visible", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`
          @keyframes svc-blob-morph {
            0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(0deg) scale(1); }
            25%     { border-radius: 40% 60% 55% 45% / 45% 55% 45% 55%; transform: rotate(90deg) scale(1.08); }
            50%     { border-radius: 30% 70% 60% 40% / 30% 60% 40% 70%; transform: rotate(180deg) scale(0.95); }
            75%     { border-radius: 55% 45% 40% 60% / 50% 40% 60% 50%; transform: rotate(270deg) scale(1.05); }
          }
        `}</style>
        <div style={{
          width: 19, height: 19,
          background: "rgba(255,255,255,.88)",
          animation: "svc-blob-morph 4s ease-in-out infinite",
        }} />
      </div>
    );
  }
  // 검증 — 3개 원이 삼각형 꼭짓점을 순환하며 중앙에서 교차
  const ks = ".4 0 .2 1;.4 0 .2 1;.4 0 .2 1";
  const kt = "0;0.333;0.667;1";
  return (
    <div style={{ width: 24, height: 24, overflow: "visible" }}>
      <svg width="24" height="24" viewBox="0 0 36 36" fill="none" overflow="visible">
        {/* A(18,8) → B(27,23) → C(9,23) → A */}
        <circle r="5.5" fill="rgba(255,255,255,.88)">
          <animate attributeName="cx" values="18;27;9;18" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines={ks} keyTimes={kt}/>
          <animate attributeName="cy" values="8;23;23;8"  dur="4s" repeatCount="indefinite" calcMode="spline" keySplines={ks} keyTimes={kt}/>
        </circle>
        {/* B → C → A → B */}
        <circle r="5" fill="rgba(255,255,255,.88)">
          <animate attributeName="cx" values="27;9;18;27" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines={ks} keyTimes={kt}/>
          <animate attributeName="cy" values="23;23;8;23"  dur="4s" repeatCount="indefinite" calcMode="spline" keySplines={ks} keyTimes={kt}/>
        </circle>
        {/* C → A → B → C */}
        <circle r="5" fill="rgba(255,255,255,.88)">
          <animate attributeName="cx" values="9;18;27;9"  dur="4s" repeatCount="indefinite" calcMode="spline" keySplines={ks} keyTimes={kt}/>
          <animate attributeName="cy" values="23;8;23;23"  dur="4s" repeatCount="indefinite" calcMode="spline" keySplines={ks} keyTimes={kt}/>
        </circle>
      </svg>
    </div>
  );
}

export default function Services() {
  return (
    <section style={{ background: "transparent", color: "#fff", padding: "0 24px 90px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {items.map((it) => (
            <div
              key={it.kind}
              style={{
                position: "relative",
                background: "#252528",
                borderRadius: 20,
                padding: "28px 28px 32px",
                display: "flex",
                flexDirection: "column",
                transition: "transform .4s cubic-bezier(.4,0,.2,1)",
                boxShadow: "0 1px 0 rgba(255,255,255,.03) inset",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              {/* Top: icon + category */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
                <CardIcon kind={it.kind} />
                <span style={{
                  font: "500 13px/1 var(--font-sans)",
                  color: "rgba(255,255,255,.45)",
                  letterSpacing: ".01em",
                }}>
                  {it.category}
                </span>
              </div>

              {/* Title */}
              <div style={{ marginBottom: 28 }}>
                <div style={{
                  font: "700 40px/1 var(--font-sans)",
                  letterSpacing: "-.04em",
                  color: "#fff",
                }}>
                  {it.en}
                </div>
              </div>
              <p style={{ font: "400 14px/1.65 var(--font-sans)", color: "rgba(255,255,255,.55)", margin: "0 0 24px" }}>
                {it.d}
              </p>

              {/* Bullets */}
              <ul style={{ display: "flex", flexWrap: "wrap", gap: 8, listStyle: "none", margin: 0, padding: 0, marginTop: "auto" }}>
                {it.bullets.map((b) => (
                  <li key={b} style={{
                    font: "400 12px/1 var(--font-sans)",
                    color: "rgba(255,255,255,.6)",
                    padding: "7px 12px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,.1)",
                    background: "rgba(255,255,255,.04)",
                  }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
