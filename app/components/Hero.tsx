"use client";

import GlitchWord from "./GlitchWord";

export default function Hero() {
  return (
    <section style={{ position: "relative", minHeight: "62vh", background: "#0a0a0a", color: "#fff", display: "flex", alignItems: "flex-start", justifyContent: "center", overflow: "hidden", padding: "120px 24px 60px" }}>
      <div style={{ position: "relative", textAlign: "center", maxWidth: 960, width: "100%" }}>
        <div style={{ height: 54 }} aria-hidden="true" />
        <h1 style={{ font: "700 clamp(32px,4.4vw,60px)/1.24 var(--font-sans)", letterSpacing: "-.03em", margin: 0 }}>
          <GlitchWord delay={400}>AI</GlitchWord>와 일하는 조직<br />똑똑한개발자와 함께
        </h1>
        <p style={{ marginTop: 22, font: "400 clamp(15px,1.1vw,17px)/1.55 var(--font-sans)", color: "rgba(255,255,255,.62)", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
          AI를 도입하는 게 아니라, 일하는 방식을 다시 짭니다.<br />
          똑똑한개발자는 사람과 AI가 함께 일하는 조직을 만들어요.
        </p>
        <div style={{ marginTop: 30, display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            style={{ font: "500 14px/1 var(--font-sans)", padding: "12px 18px", borderRadius: 10, background: "#fff", color: "#0a0a0a", border: 0, cursor: "pointer" }}
            onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
          >
            프로젝트 문의하기
          </button>
          <a href="/work" style={{ font: "500 14px/1 var(--font-sans)", padding: "12px 18px", borderRadius: 10, background: "rgba(255,255,255,.08)", color: "#fff", border: "1px solid rgba(255,255,255,.14)", cursor: "pointer", textDecoration: "none" }}>
            고객 사례 보기
          </a>
        </div>
      </div>
    </section>
  );
}
