"use client";

export default function FAQ() {
  return (
    <section style={{ background: "transparent", color: "#0a0a0a", padding: "80px 24px 150px" }} id="contact-cta">
      <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 20 }}>
        <h2 style={{ font: "700 clamp(26px,2.8vw,42px)/1.24 var(--font-sans)", letterSpacing: "-.02em", margin: 0 }}>
          AI와 일하는 조직<br />똑똑하게 시작하세요
        </h2>
        <p style={{ font: "400 16px/1.7 var(--font-sans)", color: "rgba(10,10,10,.6)", margin: 0, maxWidth: 560 }}>
          우리 팀 상황에 맞는 첫걸음을 똑똑한개발자와 함께 설계해보세요.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("open-contact")); }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, font: "500 14px/1 var(--font-sans)", padding: "12px 18px", borderRadius: 10, background: "#0a0a0a", color: "#fff", cursor: "pointer", border: 0, textDecoration: "none", whiteSpace: "nowrap" }}
          >
            프로젝트 문의하기
          </a>
          <a
            href="/faq"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, font: "500 14px/1 var(--font-sans)", padding: "12px 18px", borderRadius: 10, background: "#fff", color: "#0a0a0a", cursor: "pointer", border: "1px solid rgba(10,10,10,.12)", textDecoration: "none", whiteSpace: "nowrap" }}
          >
            자주 묻는 질문 보기
          </a>
        </div>
      </div>
    </section>
  );
}
